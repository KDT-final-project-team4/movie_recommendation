import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def get_cb_data_recommend(mock_user_ratings, df_meta, top_n=5):
    """
    [보강된 CB 추천] 
    가상 유저가 평가한 '여러 영화'의 장르 벡터를 평점 기반으로 가중 평균 내어 
    '유저 프로필 벡터'를 생성한 뒤 유사한 영화를 추천합니다.
    """
    # 1. 장르 텍스트 기반 TF-IDF 벡터화
    tfidf = TfidfVectorizer()
    tfidf_matrix = tfidf.fit_transform(df_meta['genres_str'])
    
    # 2. 유저 프로필 벡터 초기화 (1 x 장르 단어 수)
    user_profile_vector = np.zeros((1, tfidf_matrix.shape[1]))
    total_weight = 0
    
    # 이미 본 영화 ID (추천 결과에서 배제하기 위함)
    seen_movie_ids = list(mock_user_ratings.keys())
    
    # 3. 평점을 가중치로 삼아 유저 취향 벡터 합성
    for m_id, rating in mock_user_ratings.items():
        idx_series = df_meta.index[df_meta['movieId'] == m_id]
        if len(idx_series) > 0:
            idx = idx_series[0]
            # TF-IDF 희소 행렬의 해당 영화 벡터를 가져와 평점만큼 곱해서 누적
            user_profile_vector += tfidf_matrix[idx].toarray() * rating
            total_weight += rating
            
    if total_weight == 0:
        return [{"title": "평가한 영화 메타데이터가 부족합니다.", "similarity": 0.0}]
        
    # 가중 평균 처리
    user_profile_vector = user_profile_vector / total_weight
    
    # 4. 유저 프로필 벡터 1개 vs 전체 영화의 코사인 유사도 계산
    sim_scores = cosine_similarity(user_profile_vector, tfidf_matrix).flatten()
    
    # 5. 이미 본 영화는 유사도를 0으로 만들어 추천에서 완벽히 제외
    for m_id in seen_movie_ids:
        idx_series = df_meta.index[df_meta['movieId'] == m_id]
        if len(idx_series) > 0:
            sim_scores[idx_series[0]] = 0.0 
            
    # 6. 유사도 높은 순 정렬 및 추출
    top_indices = sim_scores.argsort()[::-1][:top_n]
    
    results = []
    for i in top_indices:
        score = sim_scores[i]
        if score > 0:
            movie = df_meta.iloc[i]
            results.append({
                'item_id': int(movie['movieId']),
                'title': str(movie['title']),
                'similarity': float(round(score * 100, 2))
            })
            
    return results

# [테스트 실행]
if __name__ == "__main__":
    df_meta = pd.read_pickle('backend\data\processed\movies_meta.pkl')
    
    # 가상 유저: 다크나이트(58559) 5점 만점, 매트릭스(2571) 4점
    mock_ratings = {58559: 5.0, 2571: 4.0}
    
    print("🎬 가상 유저 CB 멀티 시드 추천 결과")
    recs = get_cb_data_recommend(mock_ratings, df_meta)
    for r in recs:
        print(f"- {r['title']} (유사도: {r['similarity']}%)")