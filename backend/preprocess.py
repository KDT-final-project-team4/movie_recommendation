import pandas as pd
import numpy as np
import os

# 1. 원본 데이터 로드
def load_data(data_dir='./data'):
    # u.data 로드 (탭 구분자)
    data_cols = ['user_id', 'item_id', 'rating', 'timestamp']
    df_ratings = pd.read_csv(f'{data_dir}/u.data', sep='\t', names=data_cols, encoding='latin-1')
    
    # u.item 로드 (파이프 구분자)
    item_cols = ['item_id', 'title', 'release_date', 'video_release_date', 'imdb_url'] + \
                [f'genre_{i}' for i in range(19)]
    df_items = pd.read_csv(f'{data_dir}/u.item', sep='|', names=item_cols, encoding='latin-1')
    
    return df_ratings, df_items

# 2. 모델별 전처리 함수들
def get_cb_data(df_items):
    """
    [콘텐츠 기반(CB) 전처리]
    영화별로 19개의 장르 데이터(0 또는 1)만 추출하여 벡터로 만듭니다.
    나중에 이 벡터들 간의 코사인 유사도를 구해서 추천합니다.
    """
    genre_cols = [col for col in df_items.columns if col.startswith('genre_')]
    
    # item_id를 인덱스로 하고 장르 정보만 남긴 DataFrame 반환
    cb_features = df_items.set_index('item_id')[genre_cols]
    return cb_features

def get_cf_data(df_ratings):
    """
    [협업 필터링(CF) 전처리]
    유저-아이템 평점 행렬(User-Item Matrix)을 만듭니다.
    가로축은 영화, 세로축은 유저이며, 평점을 안 남긴 곳은 NaN이 됩니다.
    """
    cf_matrix = df_ratings.pivot(index='user_id', columns='item_id', values='rating')
    return cf_matrix

def get_ncf_data(df_ratings):
    """
    [딥러닝(NCF) 전처리]
    PyTorch 등의 Embedding 레이어에 넣기 위해서는 ID가 중간에 비어있지 않고
    0부터 순차적으로 이어지는 정수(Index)여야 합니다. (Label Encoding)
    """
    df_ncf = df_ratings.copy()
    
    # 범주형(category)으로 변환 후 codes를 가져오면 0부터 시작하는 정수로 매핑됨
    df_ncf['user_idx'] = df_ncf['user_id'].astype('category').cat.codes
    df_ncf['item_idx'] = df_ncf['item_id'].astype('category').cat.codes
    
    # 학습에 필요한 '유저 인덱스, 아이템 인덱스, 평점'만 반환
    return df_ncf[['user_idx', 'item_idx', 'rating']]

def get_hybrid_data(df_ratings, df_items):
    """
    [하이브리드 전처리]
    NCF 모델에 장르 정보(CB 피처)를 태워서 성능을 높이기 위해
    평점 데이터에 아이템의 메타데이터를 병합(Merge)합니다.
    """
    df_hybrid = pd.merge(df_ratings, df_items, on='item_id', how='left')
    return df_hybrid

if __name__ == "__main__":
    # 원본 데이터 불러오기
    df_ratings, df_items = load_data()
    
    # 전처리 수행
    cb_data = get_cb_data(df_items)
    cf_matrix = get_cf_data(df_ratings)
    ncf_data = get_ncf_data(df_ratings)
    hybrid_data = get_hybrid_data(df_ratings, df_items)
    
    # --- [추가된 부분: 파일로 저장하기] ---
    # 저장할 폴더 만들기
    save_dir = './data/processed'
    if not os.path.exists(save_dir):
        os.makedirs(save_dir)
    
    # Pickle(.pkl) 파일로 내보내기
    cb_data.to_pickle(f'{save_dir}/cb_data.pkl')
    cf_matrix.to_pickle(f'{save_dir}/cf_matrix.pkl')
    ncf_data.to_pickle(f'{save_dir}/ncf_data.pkl')
    hybrid_data.to_pickle(f'{save_dir}/hybrid_data.pkl')
    
    print(f"✅ 전처리 완료! 가공된 데이터가 '{save_dir}' 폴더에 저장되었습니다.")
    print("CB 데이터 형태 (Item x Genres):", cb_data.shape)
    print("CF 행렬 형태 (User x Item):", cf_matrix.shape)
    print("NCF 데이터 샘플:\n", ncf_data.head(3))