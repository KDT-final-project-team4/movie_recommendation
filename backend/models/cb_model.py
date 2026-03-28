import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

def get_cb_data_recommend(movie_id, cb_data, df_items, top_n=5):
    """
    [콘텐츠 기반(CB) 추천 로직]
    타겟 영화와 장르 벡터 유사도가 가장 높은 상위 N개 영화 반환
    """
    # 1. 전체 아이템 간 유사도 계산
    cosine_sim = cosine_similarity(cb_data, cb_data)
    sim_df = pd.DataFrame(cosine_sim, index=cb_data.index, columns=cb_data.index)
    
    # 2. 타겟 영화와 유사도 정렬 (자기 자신 제외)
    similar_ids = sim_df[movie_id].sort_values(ascending=False)[1:top_n+1].index
    
    # 3. ID를 영화 제목으로 변환하여 반환
    recommendations = df_items[df_items['item_id'].isin(similar_ids)]['title'].tolist()
    
    return recommendations