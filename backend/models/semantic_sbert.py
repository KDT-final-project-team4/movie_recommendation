import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import pickle
import os

class SBERTSearcher:
    def __init__(self, processed_dir='data/processed'):
        self.meta_path = f'{processed_dir}/movies_meta.pkl'
        self.embeddings_path = f'{processed_dir}/sbert_embeddings.pkl'
        
        try:
            self.df_meta = pd.read_pickle(self.meta_path)
            self.df_meta = self.df_meta.reset_index(drop=True)
        except FileNotFoundError:
            raise Exception("movies_meta.pkl 파일을 찾을 수 없습니다. 전처리를 먼저 진행하세요.")

        self._prepare_model()

    def _prepare_model(self):
        """SBERT 모델을 로드하고 전체 영화 줄거리의 문장 임베딩을 생성 및 캐싱합니다."""
        # 영어 문맥에 강하고 CPU에서도 빠른 경량화 모델 사용
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        
        if os.path.exists(self.embeddings_path):
            with open(self.embeddings_path, 'rb') as f:
                self.doc_embeddings = pickle.load(f)
        else:
            print("⏳ SBERT 임베딩을 추출합니다.")
            print("⚠️ 주의: CPU 환경에서 4.5만 개의 텍스트를 변환하므로 약 5~15분 정도 소요됩니다. (최초 1회만 실행)")
            
            corpus = self.df_meta['combined_text'].tolist()
            # show_progress_bar=True로 터미널에서 진행률 확인 가능
            self.doc_embeddings = self.model.encode(corpus, show_progress_bar=True)
            
            with open(self.embeddings_path, 'wb') as f:
                pickle.dump(self.doc_embeddings, f)
            print("✅ SBERT 문장 임베딩 저장 완료!")

    def search(self, query, top_n=5):
        """검색어 문장과 영화 문서 간의 코사인 유사도를 계산합니다."""
        # 검색어 1개를 바로 벡터로 변환 (어순과 문맥이 모두 보존됨)
        query_embedding = self.model.encode([query])
        
        # 4.5만 개의 영화 벡터와 비교
        sim = cosine_similarity(query_embedding, self.doc_embeddings).flatten()
        
        top_indices = sim.argsort()[::-1][:top_n]
        
        results = []
        for idx in top_indices:
            score = sim[idx]
            movie = self.df_meta.iloc[idx]
            results.append({
                'item_id': int(movie['movieId']),
                'title': str(movie['title']),
                'similarity': float(round(score * 100, 2))
            })
            
        return results

# 단독 실행 및 테스트용 코드
if __name__ == "__main__":
    searcher = SBERTSearcher()
    
    test_query = "A movie about time travel and comedy"
    print(f"\n🔍 검색어: '{test_query}'")
    print("-" * 50)
    
    results = searcher.search(test_query)
    for i, res in enumerate(results, 1):
        if res.get('item_id'):
            print(f"{i}. {res['title']} (유사도: {res['similarity']}%)")
        else:
            print(res['title'])