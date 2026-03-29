import pandas as pd
import torch
import os

# 단독 실행(테스트)과 메인 서버(app.py) 호출을 모두 지원하기 위한 임포트 분기 처리
try:
    from models.ncf_network import NCFModel
except ModuleNotFoundError:
    from ncf_network import NCFModel

def get_ncf_recommend(mapped_user_idx, processed_dir='./backend/data/processed', top_n=5):
    """
    [NCF 추천] 가상 유저와 매핑된 실제 user_idx를 받아 딥러닝 예측 평점이 가장 높은 영화를 반환합니다.
    """
    # 1. 데이터 및 모델 로드
    df_meta = pd.read_pickle(f'{processed_dir}/movies_meta.pkl')
    ncf_data = pd.read_pickle(f'{processed_dir}/ncf_data.pkl')
    
    checkpoint = torch.load(f'{processed_dir}/ncf_model.pth', map_location=torch.device('cpu'))
    model = NCFModel(checkpoint['num_users'], checkpoint['num_items'])
    model.load_state_dict(checkpoint['model_state_dict'])
    model.eval()
    
    # 2. 유저가 이미 본 영화 파악 (추천에서 제외하기 위함)
    seen_items = ncf_data[ncf_data['user_idx'] == mapped_user_idx]['item_idx'].unique()
    
    # 3. 전체 아이템 풀에서 안 본 영화 필터링
    all_items = ncf_data['item_idx'].unique()
    unseen_items = [i for i in all_items if i not in seen_items]
    
    if not unseen_items:
        return [{"title": "추천할 새로운 영화가 없습니다.", "similarity": 0.0}]
        
    # 4. 파이토치 텐서 변환 및 NCF 추론
    user_tensor = torch.tensor([mapped_user_idx] * len(unseen_items), dtype=torch.long)
    item_tensor = torch.tensor(unseen_items, dtype=torch.long)
    
    with torch.no_grad():
        predictions = model(user_tensor, item_tensor).numpy()
        
    # 5. 예상 평점 높은 순으로 정렬
    top_indices = predictions.argsort()[::-1][:top_n]
    
    results = []
    for idx in top_indices:
        item_idx = unseen_items[idx]
        pred_score = predictions[idx]
        
        # item_idx를 원래의 movieId로 역변환하여 메타데이터 찾기
        movie_id = ncf_data[ncf_data['item_idx'] == item_idx]['movieId'].iloc[0]
        movie_info = df_meta[df_meta['movieId'] == movie_id]
        
        if not movie_info.empty:
            results.append({
                'item_id': int(movie_id),
                'title': str(movie_info.iloc[0]['title']),
                # 최고 평점 5점을 기준으로 100% 환산 (최대 100% 제한)
                'similarity': float(min(round((pred_score / 5.0) * 100, 2), 100.0))
            })
            
    return results

if __name__ == "__main__":
    # 테스트: 42번 유저(가상 유저 Alex와 매핑되었다고 가정) 추천
    print("🧠 NCF 추론 결과 (user_idx: 42)")
    recs = get_ncf_recommend(mapped_user_idx=42, processed_dir='./backend/data/processed')
    for r in recs:
        print(f"- {r['title']} (AI 예측 적합도: {r['similarity']}%)")