from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd

# 우리가 만든 6개의 추천/검색 알고리즘 임포트
from models.cb_model import get_cb_data_recommend
from models.cf_model import get_cf_data_recommend
from models.ncf_inference import get_ncf_recommend
from models.semantic_tfidf import TFIDFSearcher
from models.semantic_w2v import Word2VecSearcher
from models.semantic_sbert import SBERTSearcher

app = FastAPI(title="AI Movie Recommendation API")

# 프론트엔드(React)에서 API를 호출할 수 있도록 CORS 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], # 명시적으로 프론트엔드 주소 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# 1. 전역 데이터 및 모델 로드 (서버 켤 때 딱 1번만 실행하여 속도 최적화)
# ---------------------------------------------------------
print("⏳ 서버 초기화 중... (데이터 및 AI 모델 로드)")
df_meta = pd.read_pickle('data/processed/movies_meta.pkl')
cf_matrix = pd.read_pickle('data/processed/cf_matrix.pkl')

# NLP 검색 모델 3대장 장전
tfidf_searcher = TFIDFSearcher('data/processed')
w2v_searcher = Word2VecSearcher('data/processed')
sbert_searcher = SBERTSearcher('data/processed')
print("✅ 서버 초기화 완료!")

# ---------------------------------------------------------
# 2. 프론트엔드 가상 유저(Mock User) 취향 프로필 매핑
# ---------------------------------------------------------
# 프론트엔드에서 'alex', 'Alex', 'action' 등 어떤 형태로 넘어와도 방어할 수 있도록 키값을 넉넉하게 세팅합니다.
MOCK_USER_PROFILES = {
    # 1. Alex (액션 매니아) - ID: action
    "action": {"ratings": {58559: 5.0, 122886: 4.5, 2571: 5.0, 1198: 4.5, 110: 4.0}, "mapped_ncf_user_idx": 10},
    
    # 2. Jamie (로코 팬) - ID: romcom
    "romcom": {"ratings": {104374: 5.0, 2671: 5.0, 356: 4.5, 1721: 4.5, 339: 4.0}, "mapped_ncf_user_idx": 20},
    
    # 3. Morgan (SF 덕후) - ID: scifi
    "scifi": {"ratings": {109487: 5.0, 2571: 5.0, 260: 4.5, 1270: 5.0, 1240: 4.5}, "mapped_ncf_user_idx": 30},
    
    # 4. Riley (호러 팬) - ID: horror
    "horror": {"ratings": {103141: 5.0, 8665: 4.0, 2762: 4.5, 593: 5.0, 1258: 4.5}, "mapped_ncf_user_idx": 40}
}

# ---------------------------------------------------------
# 3. API 엔드포인트: 홈 화면 개인화 추천 (CB, CF, NCF)
# ---------------------------------------------------------
@app.get("/api/recommend/home/{user_id}")
async def get_home_recommendations(user_id: str):
    # 프론트에서 넘어온 user_id가 소문자인지 확실히 하고, 없으면 "action"을 기본값으로 사용
    safe_user_id = user_id.lower()
    profile = MOCK_USER_PROFILES.get(safe_user_id, MOCK_USER_PROFILES["action"])
    
    mock_ratings = profile["ratings"]
    ncf_user_idx = profile["mapped_ncf_user_idx"]

    # 3대장 알고리즘 동시 가동 (top_n 10개 유지)
    cb_results = get_cb_data_recommend(mock_ratings, df_meta, top_n=10)
    cf_results = get_cf_data_recommend(99999, mock_ratings, cf_matrix, df_meta, top_n=10) 
    ncf_results = get_ncf_recommend(ncf_user_idx, processed_dir='data/processed', top_n=10)

    return {
        "user_id": user_id,
        "cb_top5": cb_results,
        "cf_top5": cf_results,
        "ncf_top5": ncf_results
    }

# ---------------------------------------------------------
# 4. API 엔드포인트: 의미론적 검색 (TF-IDF, W2V, SBERT)
# ---------------------------------------------------------
class SearchRequest(BaseModel):
    query: str

@app.post("/api/recommend/search")
async def get_semantic_search(request: SearchRequest):
    query = request.query

    # NLP 3대장 알고리즘 동시 가동 (top_n을 10으로 상향 조정)
    tfidf_results = tfidf_searcher.search(query, top_n=10)
    w2v_results = w2v_searcher.search(query, top_n=10)
    sbert_results = sbert_searcher.search(query, top_n=10)

    return {
        "query": query,
        "tfidf_top5": tfidf_results,
        "w2v_top5": w2v_results,
        "sbert_top5": sbert_results
    }

if __name__ == "__main__":
    import uvicorn
    # 터미널에서 python app.py 로 바로 실행할 수 있도록 세팅
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)