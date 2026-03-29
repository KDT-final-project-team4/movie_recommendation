import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

def get_cf_data_recommend(mock_user_id, mock_user_ratings, cf_matrix, df_meta, top_n=5):
    """
    [CF 추천] 가상 유저의 평점을 기존 행렬에 주입하여 User-Based CF를 수행합니다.
    mock_user_ratings 예시: {58559: 5.0, 2571: 4.5} (다크나이트 5점, 매트릭스 4.5점)
    """
    # 1. 원본 행렬 훼손 방지를 위해 복사 후 가상 유저 데이터 주입
    matrix = cf_matrix.copy()
    matrix.loc[mock_user_id] = np.nan
    
    for m_id, rating in mock_user_ratings.items():
        if m_id in matrix.columns:
            matrix.loc[mock_user_id, m_id] = rating
            
    # 2. 결측치를 0으로 채우고 연산 최적화를 위해 가상유저 벡터(1xN)만 분리
    matrix_filled = matrix.fillna(0)
    mock_user_vector = matrix_filled.loc[mock_user_id].values.reshape(1, -1)
    all_users_matrix = matrix_filled.values
    
    # 3. 가상 유저 vs 모든 유저 코사인 유사도 계산
    user_similarities = cosine_similarity(mock_user_vector, all_users_matrix).flatten()
    sim_series = pd.Series(user_similarities, index=matrix.index)
    
    # 4. 본인 제외, 취향이 가장 비슷한 이웃 유저 Top 10 추출
    sim_series = sim_series.drop(mock_user_id)
    similar_users = sim_series.nlargest(10)
    
    if similar_users.max() == 0:
        return [{"title": "유사한 취향의 유저를 찾지 못했습니다.", "similarity": 0.0}]
        
    # 5. 이웃 유저들의 평점을 기반으로 가상 유저가 아직 안 본 영화의 예상 평점 계산 (가중 평균)
    sim_users_ratings = matrix.loc[similar_users.index]
    seen_movies = mock_user_ratings.keys()
    sim_users_ratings = sim_users_ratings.drop(columns=seen_movies, errors='ignore') # 본 영화 제외
    
    # 분자: 평점 * 유사도 / 분모: 평가한 사람들의 유사도 합
    weighted_ratings = sim_users_ratings.multiply(similar_users, axis=0)
    sum_weighted_ratings = weighted_ratings.sum(axis=0)
    sum_similarities = sim_users_ratings.notna().multiply(similar_users, axis=0).sum(axis=0)
    
    expected_ratings = sum_weighted_ratings / sum_similarities.replace(0, np.nan)
    
    # 6. 예상 평점 Top N 추출 및 결과 포맷팅
    top_movies = expected_ratings.nlargest(top_n)
    
    results = []
    for m_id, score in top_movies.items():
        if pd.isna(score): continue
        
        movie_info = df_meta[df_meta['movieId'] == m_id]
        if not movie_info.empty:
            results.append({
                'item_id': int(m_id),
                'title': str(movie_info.iloc[0]['title']),
                # UI의 퍼센트 뱃지에 맞추기 위해 예상 평점(5점 만점)을 100% 비율로 환산
                'similarity': float(round((score / 5.0) * 100, 2))
            })
            
    return results

# [테스트 실행]
if __name__ == "__main__":
    df_meta = pd.read_pickle('backend\data\processed\movies_meta.pkl')
    cf_matrix = pd.read_pickle('backend\data\processed\cf_matrix.pkl')
    
    # 가상 유저 9999번 (SF/액션 덕후: 인셉션, 매트릭스 5점 만점)
    mock_id = 9999
    mock_ratings = {79132: 5.0, 2571: 5.0} 
    
    print("\n👽 가상 유저 9999(SF 덕후) CF 추천 결과")
    recs = get_cf_data_recommend(mock_id, mock_ratings, cf_matrix, df_meta)
    for r in recs:
        print(f"- {r['title']} (예상 일치율: {r['similarity']}%)")