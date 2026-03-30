import pandas as pd
import numpy as np
from gensim.models import Word2Vec
from gensim.utils import simple_preprocess
from sklearn.metrics.pairwise import cosine_similarity
import pickle
import os

class Word2VecSearcher:
    def __init__(self, processed_dir='data/processed'):
        self.meta_path = f'{processed_dir}/movies_meta.pkl'
        self.w2v_model_path = f'{processed_dir}/w2v_model.model'
        self.doc_vectors_path = f'{processed_dir}/w2v_doc_vectors.pkl'
        
        try:
            self.df_meta = pd.read_pickle(self.meta_path)
            self.df_meta = self.df_meta.reset_index(drop=True)
        except FileNotFoundError:
            raise Exception("movies_meta.pkl 파일을 찾을 수 없습니다. 전처리를 먼저 진행하세요.")

        self._prepare_model()

    def _get_document_vector(self, tokens, model, vector_size):
        """문서 내 단어 벡터들의 평균을 구하여 문서 전체의 벡터를 생성합니다."""
        valid_words = [word for word in tokens if word in model.wv.key_to_index]
        if not valid_words:
            return np.zeros(vector_size)
        
        # 단어 벡터들의 평균 계산
        word_vectors = np.array([model.wv[word] for word in valid_words])
        doc_vector = word_vectors.mean(axis=0)
        return doc_vector

    def _prepare_model(self):
        """Word2Vec 모델을 학습시키고 문서 벡터를 캐싱합니다."""
        if os.path.exists(self.w2v_model_path) and os.path.exists(self.doc_vectors_path):
            self.w2v_model = Word2Vec.load(self.w2v_model_path)
            with open(self.doc_vectors_path, 'rb') as f:
                self.doc_vectors = pickle.load(f)
        else:
            print("⏳ Word2Vec 임베딩을 학습합니다. (약 1~2분 소요)")
            # 텍스트 토큰화 (특수문자 제거 및 소문자화)
            corpus_tokens = self.df_meta['combined_text'].apply(simple_preprocess).tolist()

            # Word2Vec 학습 (vector_size=100차원, window=5단어, min_count=2번 이상 등장)
            self.w2v_model = Word2Vec(sentences=corpus_tokens, vector_size=100, window=5, min_count=2, workers=4)
            self.w2v_model.save(self.w2v_model_path)

            # 모든 영화에 대해 문서 벡터(Document Vector) 생성
            vector_size = self.w2v_model.vector_size
            self.doc_vectors = np.array([
                self._get_document_vector(tokens, self.w2v_model, vector_size) 
                for tokens in corpus_tokens
            ])

            with open(self.doc_vectors_path, 'wb') as f:
                pickle.dump(self.doc_vectors, f)
            print("✅ Word2Vec 임베딩 모델 및 벡터 저장 완료!")

    def search(self, query, top_n=5):
        """검색어의 임베딩 벡터와 영화 벡터들 간의 코사인 유사도를 계산합니다."""
        # 검색어 토큰화 및 임베딩
        query_tokens = simple_preprocess(query)
        query_vector = self._get_document_vector(query_tokens, self.w2v_model, self.w2v_model.vector_size)
        
        # 검색어에 유효한 단어가 없는 경우
        if np.all(query_vector == 0):
            return [{"title": "학습 사전에 없는 단어들입니다. 다른 검색어를 입력하세요.", "similarity": 0.0}]

        # 코사인 유사도 계산 (1 x 차원) vs (N x 차원)
        sim = cosine_similarity([query_vector], self.doc_vectors).flatten()
        
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
    searcher = Word2VecSearcher()
    
    test_query = "A movie about time travel and comedy"
    print(f"\n🔍 검색어: '{test_query}'")
    print("-" * 50)
    
    results = searcher.search(test_query)
    for i, res in enumerate(results, 1):
        if res.get('item_id'):
            print(f"{i}. {res['title']} (유사도: {res['similarity']}%)")
        else:
            print(res['title'])