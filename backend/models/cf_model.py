import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

def get_cf_data_recommend(movie_id, cf_matrix, df_items, top_n=5):
    """
    [협업 필터링(CF) 추천 로직]
    타겟 영화를 본 유저들이 공통적으로 좋게 평가한 상위 N개 영화 반환
    """
    # 1. 결측치(NaN)를 0으로 처리 (베이스라인 모델의 수학적 한계점)
    cf_matrix_filled = cf_matrix.fillna(0)
    
    # 2. 아이템 간 유사도 계산 (전치 행렬 사용)
    cosine_sim_cf = cosine_similarity(cf_matrix_filled.T, cf_matrix_filled.T)
    sim_cf_df = pd.DataFrame(cosine_sim_cf, index=cf_matrix.columns, columns=cf_matrix.columns)
    
    # 3. 타겟 영화와 유사도 정렬 (자기 자신 제외)
    similar_ids_cf = sim_cf_df[movie_id].sort_values(ascending=False)[1:top_n+1].index
    
    # 4. ID를 영화 제목으로 변환하여 반환
    recommendations = df_items[df_items['item_id'].isin(similar_ids_cf)]['title'].tolist()
    
    return recommendations