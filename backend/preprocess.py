import pandas as pd
import numpy as np
import ast
import os

def preprocess_all_data(raw_dir='data/raw', save_dir='data/processed'):
    print("🚀 통합 데이터 전처리를 시작합니다... (전통적 추천 + 의미론적 검색)")

    # 1. 원본 데이터 로드 (메모리 최적화를 위해 필수 컬럼만 지정)
    print("데이터 로딩 중...")
    df_meta = pd.read_csv(f'{raw_dir}/movies_metadata.csv', 
                          usecols=['id', 'title', 'genres', 'overview'], low_memory=False)
    df_ratings = pd.read_csv(f'{raw_dir}/ratings_small.csv', 
                             usecols=['userId', 'movieId', 'rating'])
    df_links = pd.read_csv(f'{raw_dir}/links.csv', 
                           usecols=['movieId', 'tmdbId'])
    df_credits = pd.read_csv(f'{raw_dir}/credits.csv',
                             usecols=['id', 'cast', 'crew'])

    # 2. ID 타입 통일 및 쓰레기값 제거
    df_meta['id'] = pd.to_numeric(df_meta['id'], errors='coerce')
    df_meta = df_meta.dropna(subset=['id'])
    df_meta['id'] = df_meta['id'].astype(int)

    df_links = df_links.dropna(subset=['tmdbId'])
    df_links['tmdbId'] = df_links['tmdbId'].astype(int)

    df_credits['id'] = pd.to_numeric(df_credits['id'], errors='coerce')
    df_credits = df_credits.dropna(subset=['id'])
    df_credits['id'] = df_credits['id'].astype(int)

    # 3. 데이터 병합 (MovieLens ID 기준으로 통합)
    print("데이터 병합 중...")
    df_meta = pd.merge(df_meta, df_links, left_on='id', right_on='tmdbId', how='inner')
    df_meta = pd.merge(df_meta, df_credits, on='id', how='left')
    df_meta = df_meta.drop(columns=['id', 'tmdbId']) # 불필요해진 TMDB ID 제거

    # 4. JSON 텍스트 파싱 및 특성 추출
    print("텍스트 파싱 및 자연어 문장 구성 중...")
    
    # 4-1. 장르
    df_meta['genres'] = df_meta['genres'].fillna('[]').apply(ast.literal_eval)
    df_meta['genres_list'] = df_meta['genres'].apply(lambda x: [i['name'] for i in x] if isinstance(x, list) else [])
    df_meta['genres_str'] = df_meta['genres_list'].apply(lambda x: ' '.join(x)) # CB 및 TF-IDF용

    # 4-2. 배우 (노이즈 방지를 위해 Top 3만)
    def get_top_cast(x):
        try:
            cast_list = ast.literal_eval(x)
            return [i['name'] for i in cast_list][:3] if isinstance(cast_list, list) else []
        except:
            return []
    df_meta['cast_list'] = df_meta['cast'].fillna('[]').apply(get_top_cast)
    
    # 4-3. 감독
    def get_director(x):
        try:
            crew_list = ast.literal_eval(x)
            for i in crew_list:
                if i.get('job') == 'Director':
                    return [i['name']]
            return []
        except:
            return []
    df_meta['director'] = df_meta['crew'].fillna('[]').apply(get_director)

    # 5. 의미론적 임베딩용 통합 텍스트(combined_text) 생성
    df_meta['overview'] = df_meta['overview'].fillna('')
    
    def create_combined_text(row):
        text = f"Title: {row['title']}. "
        if row['genres_list']:
            text += f"Genres: {', '.join(row['genres_list'])}. "
        if row['director']:
            text += f"Directed by {row['director'][0]}. "
        if row['cast_list']:
            text += f"Starring {', '.join(row['cast_list'])}. "
        text += f"Overview: {row['overview']}"
        return text

    df_meta['combined_text'] = df_meta.apply(create_combined_text, axis=1)

    # 메모리 최적화를 위해 파싱이 끝난 원본 리스트 컬럼 제거
    df_meta = df_meta.drop(columns=['genres', 'cast', 'crew'])

    # 6. 추천 알고리즘(CF, NCF)용 서브 데이터셋 생성
    print("CF 및 NCF용 데이터셋 생성 중...")
    
    # 6-1. CF용 User-Item 평점 행렬
    cf_matrix = df_ratings.pivot(index='userId', columns='movieId', values='rating')

    # 6-2. NCF용 라벨 인코딩 (0부터 시작하는 인덱스)
    ncf_data = df_ratings.copy()
    ncf_data['user_idx'] = ncf_data['userId'].astype('category').cat.codes
    ncf_data['item_idx'] = ncf_data['movieId'].astype('category').cat.codes
    ncf_data = ncf_data[['user_idx', 'item_idx', 'rating', 'movieId']]

    # 7. 파일 저장
    print("Pickle 파일로 저장 중...")
    if not os.path.exists(save_dir):
        os.makedirs(save_dir)

    df_meta.to_pickle(f'{save_dir}/movies_meta.pkl')
    cf_matrix.to_pickle(f'{save_dir}/cf_matrix.pkl')
    ncf_data.to_pickle(f'{save_dir}/ncf_data.pkl')

    print("✅ 모든 전처리 완료!")
    print(f"- 확보된 전체 영화 수: {len(df_meta)}개")
    print(f"- CF 평점 행렬 크기: {cf_matrix.shape}")
    print(f"- NCF 학습용 데이터 수: {len(ncf_data)}개")
    print(f"- 의미론적 검색용 텍스트 샘플:\n {df_meta['combined_text'].iloc[0]}")

if __name__ == "__main__":
    preprocess_all_data()