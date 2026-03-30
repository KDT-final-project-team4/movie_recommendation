import os
import json
import math
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd

# 6개의 추천/검색 알고리즘 임포트
from models.cb_model import get_cb_data_recommend
from models.cf_model import get_cf_data_recommend
from models.ncf_inference import get_ncf_recommend
from models.semantic_tfidf import TFIDFSearcher
from models.semantic_w2v import Word2VecSearcher
from models.semantic_sbert import SBERTSearcher

app = FastAPI(title="AI Movie Recommendation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# 1. 전역 데이터 및 모델 로드
# ---------------------------------------------------------
print("⏳ 서버 초기화 중... (데이터 및 AI 모델 로드)")
df_meta = pd.read_pickle('data/processed/movies_meta.pkl')
cf_matrix = pd.read_pickle('data/processed/cf_matrix.pkl')

tfidf_searcher = TFIDFSearcher('data/processed')
w2v_searcher = Word2VecSearcher('data/processed')
sbert_searcher = SBERTSearcher('data/processed')

# ---------------------------------------------------------
# 2. 가상 유저 취향 프로필 및 정답지 설정
# ---------------------------------------------------------
# 가상 유저별 타겟 장르 (정량 평가를 위한 Ground Truth)
TARGET_GENRES = {
    "action": ["Action", "Sci-Fi"],
    "romcom": ["Romance", "Comedy"],
    "scifi": ["Sci-Fi", "Fantasy"],
    "horror": ["Horror", "Thriller"]
}

mock_profiles_path = 'data/processed/mock_profiles.json'
MOCK_USER_PROFILES = {}

if os.path.exists(mock_profiles_path):
    with open(mock_profiles_path, 'r', encoding='utf-8') as f:
        raw_profiles = json.load(f)
        for user_id, profile in raw_profiles.items():
            MOCK_USER_PROFILES[user_id] = {
                "ratings": {int(k): float(v) for k, v in profile["ratings"].items()},
                "mapped_ncf_user_idx": profile["mapped_ncf_user_idx"]
            }
    print("✅ 가상 유저 데이터 로드 완료")
else:
    print("⚠️ mock_profiles.json 파일이 없습니다. generate_mock_data.py를 먼저 실행하세요.")

# ---------------------------------------------------------
# 3. 평가 로직 (Metrics Calculation)
# ---------------------------------------------------------
def evaluate_recommendations(results, target_genres, df_meta):
    """추천 결과를 정답지와 비교하여 Precision, NDCG, Diversity를 계산합니다."""
    if not results:
        return results, {"precision_at_10": 0, "ndcg_at_10": 0, "diversity": 0}

    hits = 0
    dcg = 0.0
    idcg = 0.0
    unique_genres = set()

    for i, res in enumerate(results):
        m_id = res['item_id']
        movie_row = df_meta[df_meta['movieId'] == m_id]
        genres = movie_row.iloc[0]['genres_list'] if not movie_row.empty else []
        
        if isinstance(genres, list):
            unique_genres.update(genres)
            # 정답 판별: 타겟 장르가 포함되어 있는가?
            is_hit = any(g in genres for g in target_genres)
        else:
            is_hit = False

        res['is_hit'] = is_hit # 시각화용 태그

        if is_hit:
            hits += 1
            dcg += 1.0 / math.log2((i + 1) + 1)
        
        # 이상적인 DCG 계산 (모두 정답일 경우)
        idcg += 1.0 / math.log2((i + 1) + 1)

    metrics = {
        "precision_at_10": round(hits / len(results), 2) if results else 0,
        "ndcg_at_10": round(dcg / idcg, 2) if idcg > 0 else 0,
        "diversity": len(unique_genres)
    }
    
    return results, metrics

# ---------------------------------------------------------
# 4. API 엔드포인트: 개인화 추천 및 평가 데이터 반환
# ---------------------------------------------------------
@app.get("/api/recommend/home/{user_id}")
async def get_home_recommendations(user_id: str):
    safe_user_id = user_id.lower()
    
    if not MOCK_USER_PROFILES:
        return {"error": "User profiles data is missing."}
        
    profile = MOCK_USER_PROFILES.get(safe_user_id, MOCK_USER_PROFILES.get("action", {}))
    mock_ratings = profile.get("ratings", {})
    ncf_user_idx = profile.get("mapped_ncf_user_idx", 10)
    
    # 정답지 로드
    target_genres = TARGET_GENRES.get(safe_user_id, ["Action"])

    # 🌟 1. 알고리즘별 추론 시간 측정 및 결과 획득
    start_time = time.time()
    cb_raw = get_cb_data_recommend(mock_ratings, df_meta, top_n=10)
    cb_time_ms = int((time.time() - start_time) * 1000)

    start_time = time.time()
    cf_raw = get_cf_data_recommend(99999, mock_ratings, cf_matrix, df_meta, top_n=10) 
    cf_time_ms = int((time.time() - start_time) * 1000)

    start_time = time.time()
    ncf_raw = get_ncf_recommend(ncf_user_idx, processed_dir='data/processed', top_n=10)
    ncf_time_ms = int((time.time() - start_time) * 1000)

    # 2. 실시간 성능 평가 실시
    cb_results, cb_metrics = evaluate_recommendations(cb_raw, target_genres, df_meta)
    cf_results, cf_metrics = evaluate_recommendations(cf_raw, target_genres, df_meta)
    ncf_results, ncf_metrics = evaluate_recommendations(ncf_raw, target_genres, df_meta)

    # 🌟 3. 측정된 추론 시간을 metrics 객체에 병합
    cb_metrics["inference_ms"] = cb_time_ms
    cf_metrics["inference_ms"] = cf_time_ms
    ncf_metrics["inference_ms"] = ncf_time_ms

    return {
        "user_id": user_id,
        "target_genres": target_genres,
        "cb_data": {"results": cb_results, "metrics": cb_metrics},
        "cf_data": {"results": cf_results, "metrics": cf_metrics},
        "ncf_data": {"results": ncf_results, "metrics": ncf_metrics}
    }

# ---------------------------------------------------------
# 5. API 엔드포인트: 의미론적 검색 (기본 유지)
# ---------------------------------------------------------
class SearchRequest(BaseModel):
    query: str

@app.post("/api/recommend/search")
async def get_semantic_search(request: SearchRequest):
    query = request.query

    tfidf_results = tfidf_searcher.search(query, top_n=10)
    w2v_results = w2v_searcher.search(query, top_n=10)
    sbert_results = sbert_searcher.search(query, top_n=10)

    return {
        "query": query,
        "tfidf_results": tfidf_results,
        "w2v_results": w2v_results,
        "sbert_results": sbert_results
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)