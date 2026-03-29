import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pickle
import os

class TFIDFSearcher:
    def __init__(self, processed_dir='./backend/data/processed'):
        self.meta_path = f'{processed_dir}/movies_meta.pkl'
        self.model_path = f'{processed_dir}/tfidf_matrix.pkl'
        self.vectorizer_path = f'{processed_dir}/tfidf_vectorizer.pkl'
        
        # 메타데이터 로드
        try:
            self.df_meta = pd.read_pickle(self.meta_path)
            # 인덱스 초기화 (iloc 매칭을 위해 필수)
            self.df_meta = self.df_meta.reset_index(drop=True) 
        except FileNotFoundError:
            raise Exception("movies_meta.pkl 파일을 찾을 수 없습니다. 전처리를 먼저 진행하세요.")

        self._prepare_model()

    def _prepare_model(self):
        """TF-IDF 행렬을 로드하거나, 없으면 새로 생성하여 저장합니다."""
        if os.path.exists(self.model_path) and os.path.exists(self.vectorizer_path):
            with open(self.vectorizer_path, 'rb') as f:
                self.vectorizer = pickle.load(f)
            with open(self.model_path, 'rb') as f:
                self.tfidf_matrix = pickle.load(f)
        else:
            print("⏳ TF-IDF 행렬을 최초 1회 생성합니다. (약 10~20초 소요)")
            # 영어 불용어(the, a, is 등) 제거 옵션 적용
            self.vectorizer = TfidfVectorizer(stop_words='english')
            self.tfidf_matrix = self.vectorizer.fit_transform(self.df_meta['combined_text'])

            with open(self.vectorizer_path, 'wb') as f:
                pickle.dump(self.vectorizer, f)
            with open(self.model_path, 'wb') as f:
                pickle.dump(self.tfidf_matrix, f)
            print("✅ TF-IDF 모델 저장 완료!")

    def search(self, query, top_n=5):
        """검색어와 가장 유사한 영화 Top N개를 반환합니다."""
        # 검색어를 동일한 TF-IDF 공간의 벡터로 변환
        query_vec = self.vectorizer.transform([query])
        
        # 4만 5천개 영화와 코사인 유사도 계산
        sim = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
        
        # 유사도가 높은 순으로 인덱스 정렬
        top_indices = sim.argsort()[::-1][:top_n]
        
        results = []
        for idx in top_indices:
            score = sim[idx]
            if score > 0: # 매칭되는 단어가 하나라도 있는 경우만 추가
                movie = self.df_meta.iloc[idx]
                results.append({
                    'item_id': int(movie['movieId']), # MovieLens ID 사용
                    'title': str(movie['title']),
                    'similarity': float(round(score * 100, 2)) # 퍼센트로 변환
                })
        
        if not results:
            return [{"title": "일치하는 결과가 없습니다.", "similarity": 0.0}]
            
        return results

# 단독 실행 및 테스트용 코드
if __name__ == "__main__":
    searcher = TFIDFSearcher()
    
    test_query = "A movie about time travel and comedy"
    print(f"\n🔍 검색어: '{test_query}'")
    print("-" * 50)
    
    results = searcher.search(test_query)
    for i, res in enumerate(results, 1):
        if res.get('item_id'):
            print(f"{i}. {res['title']} (유사도: {res['similarity']}%)")
        else:
            print(res['title'])