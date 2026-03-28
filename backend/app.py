import pandas as pd
from models.cb_model import get_cb_data_recommend
from models.cf_model import get_cf_data_recommend

def load_processed_data(save_dir='./data/processed', data_dir='./data'):
    """저장된 전처리 파일(Pickle)과 메타데이터 로드"""
    cb_data = pd.read_pickle(f'{save_dir}/cb_data.pkl')
    cf_matrix = pd.read_pickle(f'{save_dir}/cf_matrix.pkl')
    
    item_cols = ['item_id', 'title', 'release_date', 'video_release_date', 'imdb_url'] + \
                [f'genre_{i}' for i in range(19)]
    df_items = pd.read_csv(f'{data_dir}/u.item', sep='|', names=item_cols, encoding='latin-1')
    
    return cb_data, cf_matrix, df_items

if __name__ == "__main__":
    # 1. 서버 구동 시 데이터를 한 번만 메모리에 올림
    cb_data, cf_matrix, df_items = load_processed_data()
    
    # 2. 사용자 입력 가이드 (예: 1번 영화 Toy Story)
    target_movie_id = 1
    target_title = df_items[df_items['item_id'] == target_movie_id]['title'].values[0]
    
    print(f"\n[ 타겟 영화: {target_title} ]\n")
    
    # 3. 각 모듈 실행 및 결과 반환
    cb_rec = get_cb_data_recommend(target_movie_id, cb_data, df_items)
    print("=== 1. 콘텐츠 기반(CB) 추천 결과 ===")
    for i, title in enumerate(cb_rec, 1):
        print(f"{i}. {title}")
        
    print("\n--------------------------------------------------\n")
    
    cf_rec = get_cf_data_recommend(target_movie_id, cf_matrix, df_items)
    print("=== 2. 협업 필터링(CF) 추천 결과 ===")
    for i, title in enumerate(cf_rec, 1):
        print(f"{i}. {title}")