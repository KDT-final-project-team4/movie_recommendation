import torch
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from models.ncf_network import NCFModel

def get_ncf_data_recommend(movie_id, df_items, ncf_data, weights_path='./data/processed/ncf_weights.pth', top_n=5):
    """
    [NCF 추론 로직]
    저장된 가중치를 불러와 아이템 임베딩을 추출하고, 유사한 영화를 추천합니다.
    """
    # 1. 모델 껍데기 준비 및 저장된 가중치 로드
    num_users = ncf_data['user_idx'].nunique()
    num_items = ncf_data['item_idx'].nunique()
    
    model = NCFModel(num_users, num_items)
    
    try:
        model.load_state_dict(torch.load(weights_path))
        model.eval() # 추론 모드로 전환 (Dropout, BatchNorm 등 비활성화)
    except FileNotFoundError:
        return ["에러: NCF 가중치 파일이 없습니다. ncf_train.py를 먼저 실행하세요."]

    # 2. 타겟 영화 ID를 NCF 모델 내부 인덱스(item_idx)로 변환
    item_mapping = ncf_data[['item_id', 'item_idx']].drop_duplicates().set_index('item_id')
    
    if movie_id not in item_mapping.index:
        return ["해당 영화는 NCF 학습 데이터에 존재하지 않습니다."]
        
    # 3. 학습된 아이템 임베딩(특징 벡터) 추출
    item_embeddings = model.item_embedding.weight.data.numpy()
    
    # 4. 임베딩 벡터 간 코사인 유사도 계산
    cosine_sim = cosine_similarity(item_embeddings, item_embeddings)
    sim_df = pd.DataFrame(cosine_sim, index=item_mapping.index, columns=item_mapping.index)
    
    # 5. 자기 자신 제외 상위 5개 추출 및 영화 제목 변환
    similar_ids = sim_df[movie_id].sort_values(ascending=False)[1:top_n+1].index
    recommendations = df_items[df_items['item_id'].isin(similar_ids)]['title'].tolist()
    
    return recommendations