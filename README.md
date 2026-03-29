# 🎬 AI 기반 영화 추천 및 의미론적 검색 플랫폼

단순한 텍스트 매칭을 넘어 사용자의 취향과 검색어의 '문맥'을 이해하는 영화 추천 및 검색 웹 애플리케이션입니다. 총 6가지의 고전/최신 머신러닝·딥러닝 알고리즘을 파이프라인으로 구축하고, 그 성능과 한계를 직접 비교 분석하기 위해 개발되었습니다.

## 🌟 핵심 기능 및 알고리즘

본 프로젝트는 크게 **개인화 추천(홈 화면)**과 **의미론적 검색(검색 화면)** 두 가지 엔진으로 동작합니다.

### 1. 개인화 맞춤 추천 (Recommendation Engine)
가상 유저의 시청 기록 및 평점 데이터를 바탕으로 3가지 알고리즘이 각각 추천 결과를 반환합니다.
* **CB (Content-Based):** 영화의 장르 데이터를 TF-IDF로 벡터화하여 코사인 유사도 기반으로 추천.
* **CF (Collaborative Filtering):** 유저-아이템 평점 행렬을 기반으로 이웃 유저의 패턴을 분석하여 평점을 예측.
* **NCF (Neural Collaborative Filtering):** PyTorch를 활용한 딥러닝 모델. 유저와 아이템의 잠재 특징(Latent Feature)을 임베딩하고 MLP를 통과시켜 추천.

### 2. 의미론적 검색 (Semantic Search Engine)
사용자의 검색어(예: "시간 여행을 다루는 웃긴 코미디 영화")를 3가지 알고리즘이 다르게 해석하고 결과를 도출합니다.
* **TF-IDF:** 단어의 빈도수를 기반으로 한 고전적인 키워드 매칭 검색.
* **Word2Vec:** 문장 내 단어 임베딩의 평균을 내어 계산하는 벡터 검색.
* **SBERT (Sentence-BERT):** `all-MiniLM-L6-v2` 모델을 활용해 문장 전체의 문맥과 의도를 파악하는 트랜스포머 기반 고도화 검색.

---

## 🛠 기술 스택 (Tech Stack)

### Frontend
* React, TypeScript
* Tailwind CSS, Framer Motion, Lucide React
* TMDB API (실시간 영화 포스터 동적 렌더링)

### Backend & AI
* Python, FastAPI, Uvicorn
* PyTorch (NCF 딥러닝 모델 설계 및 학습)
* Sentence-Transformers (SBERT 임베딩)
* Scikit-learn, Pandas, Numpy

---

## 🚀 로컬 실행 방법 (Getting Started)

### 1. Backend 환경 세팅 및 실행
데이터 전처리와 모델 학습이 완료된 `.pkl`, `.pth` 파일이 `backend/data/processed/` 경로에 존재해야 합니다.

```bash
# 디렉토리 이동
cd backend

# 가상환경 생성 및 활성화 (Windows)
python -m venv venv
source venv/Scripts/activate

# 패키지 설치
pip install -r requirements.txt

# FastAPI 메인 서버 실행
python app.py
```
> 정상 실행 시 `http://localhost:8000`에서 백엔드 API가 가동됩니다.

### 2. Frontend 환경 세팅 및 실행
사전에 TMDB API Key가 필요합니다. `frontend/src/app/components/home-dashboard.tsx` 파일 상단에 본인의 API Key를 입력하세요.

```bash
# 디렉토리 이동
cd frontend

# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```
> 브라우저에서 `http://localhost:5173`으로 접속하여 테스트할 수 있습니다.
