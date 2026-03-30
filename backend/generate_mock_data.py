import pandas as pd
import numpy as np
import random
import json
import os

def generate_mock_profiles(processed_dir='backend\data\processed'):
    print("⏳ 가상 유저 프로필 생성을 시작합니다...")
    
    meta_path = f'{processed_dir}/movies_meta.pkl'
    if not os.path.exists(meta_path):
        print(f"❌ {meta_path} 파일을 찾을 수 없습니다.")
        return

    df_meta = pd.read_pickle(meta_path)

    def sample_movies(target_genres, exclude_genres=None, n=10):
        mask = df_meta['genres_list'].apply(lambda x: isinstance(x, list) and any(g in x for g in target_genres))
        if exclude_genres:
            mask &= df_meta['genres_list'].apply(lambda x: isinstance(x, list) and not any(g in x for g in exclude_genres))
            
        filtered = df_meta[mask]
        sample_size = min(len(filtered), n)
        return filtered.sample(sample_size, random_state=random.randint(1, 10000))['movieId'].tolist()

    def assign_ratings(movie_ids, min_score, max_score):
        ratings_dict = {}
        possible_scores = np.arange(min_score, max_score + 0.5, 0.5)
        for m_id in movie_ids:
            # JSON 직렬화를 위해 movieId를 문자열로 변환
            ratings_dict[str(m_id)] = float(random.choice(possible_scores))
        return ratings_dict

    profiles = {}

    # 1. Alex (action) - 40개: 50(코어)-30(인접)-20(랜덤 불호)
    alex_core = sample_movies(['Action', 'Sci-Fi'], n=20)
    alex_adj = sample_movies(['Thriller', 'Adventure'], exclude_genres=['Action', 'Sci-Fi'], n=12)
    alex_rnd = sample_movies(['Romance', 'Documentary'], exclude_genres=['Action', 'Sci-Fi', 'Thriller'], n=8)
    
    alex_ratings = {}
    alex_ratings.update(assign_ratings(alex_core, 4.0, 5.0))
    alex_ratings.update(assign_ratings(alex_adj, 3.0, 4.0))
    alex_ratings.update(assign_ratings(alex_rnd, 1.0, 2.5))
    profiles["action"] = {"ratings": alex_ratings, "mapped_ncf_user_idx": 10}

    # 2. Jamie (romcom) - 40개: 뜻밖의 발견(5.0) 포함
    jamie_core = sample_movies(['Romance', 'Comedy'], n=20)
    jamie_adj = sample_movies(['Drama'], exclude_genres=['Romance', 'Comedy'], n=12)
    jamie_rnd = sample_movies(['Action', 'Horror'], exclude_genres=['Romance', 'Comedy', 'Drama'], n=8)
    
    jamie_ratings = {}
    jamie_ratings.update(assign_ratings(jamie_core, 4.0, 5.0))
    jamie_ratings.update(assign_ratings(jamie_adj, 3.0, 4.0))
    jamie_rnd_ratings = assign_ratings(jamie_rnd, 1.0, 2.0)
    if len(jamie_rnd) > 0:
        jamie_rnd_ratings[str(jamie_rnd[0])] = 5.0  # 뜻밖의 발견
    jamie_ratings.update(jamie_rnd_ratings)
    profiles["romcom"] = {"ratings": jamie_ratings, "mapped_ncf_user_idx": 20}

    # 3. Morgan (scifi) - 40개
    morgan_core = sample_movies(['Sci-Fi', 'Fantasy'], n=20)
    morgan_adj = sample_movies(['Action', 'Adventure'], exclude_genres=['Sci-Fi', 'Fantasy'], n=12)
    morgan_rnd = sample_movies(['Comedy', 'Musical'], exclude_genres=['Sci-Fi', 'Fantasy', 'Action'], n=8)
    
    morgan_ratings = {}
    morgan_ratings.update(assign_ratings(morgan_core, 4.0, 5.0))
    morgan_ratings.update(assign_ratings(morgan_adj, 3.0, 4.0))
    morgan_ratings.update(assign_ratings(morgan_rnd, 1.0, 2.5))
    profiles["scifi"] = {"ratings": morgan_ratings, "mapped_ncf_user_idx": 30}

    # 4. Riley (horror) - 5개: Cold Start 대조군
    riley_core = sample_movies(['Horror'], n=5)
    riley_ratings = assign_ratings(riley_core, 4.0, 5.0)
    profiles["horror"] = {"ratings": riley_ratings, "mapped_ncf_user_idx": 40}

    # JSON 저장
    output_path = f'{processed_dir}/mock_profiles.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(profiles, f, indent=4)
    print(f"✅ 가상 유저 데이터가 {output_path}에 저장되었습니다.")

if __name__ == "__main__":
    generate_mock_profiles()