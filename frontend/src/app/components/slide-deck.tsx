import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  Brain,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Database,
  Lightbulb,
  Search,
  Sparkles,
  Users,
} from "lucide-react";

const slides = [
  {
    id: 1,
    icon: Sparkles,
    title: "AI 영화 추천 알고리즘",
    subtitle: "3가지 추천 방식과 3가지 시맨틱 검색 비교",
    content: (
      <div className="space-y-6 text-center">
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600">
          Content-Based, Collaborative Filtering, Neural CF와
          <br />
          TF-IDF, Word2Vec, Sentence-BERT의 차이를 직접 체험해보세요
        </p>
        <div className="mx-auto mt-8 grid max-w-lg grid-cols-2 gap-4">
          <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
            <p className="font-semibold text-violet-700">추천 알고리즘</p>
            <p className="mt-1 text-sm text-gray-600">CB, CF, NCF</p>
          </div>
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
            <p className="font-semibold text-indigo-700">시맨틱 검색</p>
            <p className="mt-1 text-sm text-gray-600">TF-IDF, W2V, SBERT</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    icon: Database,
    title: "추천 vs 검색",
    subtitle: "두 가지 접근 방식의 차이",
    content: (
      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-8 shadow-sm">
          <h3 className="mb-4 text-xl font-bold text-violet-700">추천 알고리즘</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="mt-1 text-violet-500">•</span>
              <span>사용자 프로필 기반 맞춤형 추천</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-violet-500">•</span>
              <span>과거 시청 이력과 선호도 분석</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-violet-500">•</span>
              <span>유사한 사용자의 패턴 활용</span>
            </li>
          </ul>
        </div>
        <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-8 shadow-sm">
          <h3 className="mb-4 text-xl font-bold text-indigo-700">시맨틱 검색</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="mt-1 text-indigo-500">•</span>
              <span>자연어 쿼리로 의도 파악</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-indigo-500">•</span>
              <span>키워드 매칭부터 문맥 이해까지</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-indigo-500">•</span>
              <span>사용자가 원하는 것을 직접 찾기</span>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    icon: Lightbulb,
    title: "Content-Based (CB)",
    subtitle: "콘텐츠 유사도 기반 추천",
    content: (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-gray-800">작동 원리</h3>
          <p className="mb-6 leading-relaxed text-gray-600">
            사용자가 좋아했던 영화의 <span className="font-semibold text-violet-600">장르, 감독, 배우, 줄거리</span> 등의 속성을 분석하여
            비슷한 특징을 가진 영화를 추천합니다.
          </p>
          <div className="rounded-xl border-l-4 border-violet-500 bg-violet-50 p-4">
            <p className="font-medium text-violet-700">예시</p>
            <p className="mt-2 text-sm text-gray-600">
              "인터스텔라"를 좋아했다면 → SF, 우주, 크리스토퍼 놀란 감독 작품 추천
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-green-50 p-4">
            <p className="mb-2 font-semibold text-green-700">장점</p>
            <p className="text-sm text-gray-600">신규 사용자도 바로 사용 가능</p>
          </div>
          <div className="rounded-xl bg-red-50 p-4">
            <p className="mb-2 font-semibold text-red-700">단점</p>
            <p className="text-sm text-gray-600">새로운 장르 발견이 어려움</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    icon: Users,
    title: "Collaborative Filtering (CF)",
    subtitle: "협업 필터링, 집단 지성 활용",
    content: (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-gray-800">작동 원리</h3>
          <p className="mb-6 leading-relaxed text-gray-600">
            <span className="font-semibold text-indigo-600">비슷한 취향을 가진 다른 사용자들</span>이 좋아한 영화를 추천합니다.
            "당신과 유사한 사람들이 이것도 좋아했어요" 방식입니다.
          </p>
          <div className="rounded-xl border-l-4 border-indigo-500 bg-indigo-50 p-4">
            <p className="font-medium text-indigo-700">예시</p>
            <p className="mt-2 text-sm text-gray-600">
              A, B, C 사용자 모두 "매트릭스"를 좋아함 → A가 "인셉션"도 좋아함 → B, C에게 "인셉션" 추천
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-green-50 p-4">
            <p className="mb-2 font-semibold text-green-700">장점</p>
            <p className="text-sm text-gray-600">새로운 장르도 발견 가능</p>
          </div>
          <div className="rounded-xl bg-red-50 p-4">
            <p className="mb-2 font-semibold text-red-700">단점</p>
            <p className="text-sm text-gray-600">신규 사용자에겐 부정확</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    icon: Brain,
    title: "Neural CF (NCF)",
    subtitle: "딥러닝 기반 하이브리드 추천",
    content: (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-gray-800">작동 원리</h3>
          <p className="mb-6 leading-relaxed text-gray-600">
            딥러닝 신경망을 사용하여 <span className="font-semibold text-fuchsia-600">사용자와 영화 간의 복잡한 패턴</span>을 학습합니다.
            CB와 CF의 장점을 결합한 최신 기법입니다.
          </p>
          <div className="rounded-xl border-l-4 border-fuchsia-500 bg-fuchsia-50 p-4">
            <p className="font-medium text-fuchsia-700">특징</p>
            <p className="mt-2 text-sm text-gray-600">
              사용자 임베딩 + 영화 임베딩 → 신경망으로 비선형 관계 학습 → 정확도 향상
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-green-50 p-4">
            <p className="mb-2 font-semibold text-green-700">장점</p>
            <p className="text-sm text-gray-600">가장 높은 정확도</p>
          </div>
          <div className="rounded-xl bg-red-50 p-4">
            <p className="mb-2 font-semibold text-red-700">단점</p>
            <p className="text-sm text-gray-600">학습 데이터가 많이 필요</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 6,
    icon: Search,
    title: "TF-IDF + Cosine",
    subtitle: "키워드 기반 매칭",
    content: (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-gray-800">작동 원리</h3>
          <p className="mb-6 leading-relaxed text-gray-600">
            쿼리와 영화 줄거리를 <span className="font-semibold text-blue-600">단어 빈도(TF-IDF)</span>로 벡터화한 뒤,
            코사인 유사도로 매칭합니다. 가장 기본적인 검색 방식입니다.
          </p>
          <div className="rounded-xl border-l-4 border-blue-500 bg-blue-50 p-4">
            <p className="font-medium text-blue-700">예시</p>
            <p className="mt-2 text-sm text-gray-600">
              "시간 여행 코미디" → "time", "travel", "comedy" 키워드가 많이 등장하는 영화 검색
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-green-50 p-4">
            <p className="mb-2 font-semibold text-green-700">장점</p>
            <p className="text-sm text-gray-600">빠르고 단순함</p>
          </div>
          <div className="rounded-xl bg-red-50 p-4">
            <p className="mb-2 font-semibold text-red-700">단점</p>
            <p className="text-sm text-gray-600">동의어와 문맥 이해가 약함</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 7,
    icon: Cpu,
    title: "Word2Vec",
    subtitle: "단어 벡터 평균 임베딩",
    content: (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-gray-800">작동 원리</h3>
          <p className="mb-6 leading-relaxed text-gray-600">
            각 단어를 <span className="font-semibold text-teal-600">의미 벡터</span>로 변환한 뒤 평균을 내어 문장 벡터를 만듭니다.
            TF-IDF보다 의미를 조금 더 이해합니다.
          </p>
          <div className="rounded-xl border-l-4 border-teal-500 bg-teal-50 p-4">
            <p className="font-medium text-teal-700">예시</p>
            <p className="mt-2 text-sm text-gray-600">
              "king" - "man" + "woman" ≈ "queen"처럼 유사 단어 관계를 포착할 수 있습니다.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-green-50 p-4">
            <p className="mb-2 font-semibold text-green-700">장점</p>
            <p className="text-sm text-gray-600">동의어를 어느 정도 처리</p>
          </div>
          <div className="rounded-xl bg-red-50 p-4">
            <p className="mb-2 font-semibold text-red-700">단점</p>
            <p className="text-sm text-gray-600">문장 전체 맥락은 부족</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 8,
    icon: Brain,
    title: "Sentence-BERT (SBERT)",
    subtitle: "문맥 이해 끝판왕",
    content: (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-gray-800">작동 원리</h3>
          <p className="mb-6 leading-relaxed text-gray-600">
            BERT 기반 트랜스포머 모델로 <span className="font-semibold text-pink-600">문장 전체의 의미</span>를 임베딩합니다.
            단어 순서와 문맥을 깊게 이해하는 최신 기법입니다.
          </p>
          <div className="rounded-xl border-l-4 border-pink-500 bg-pink-50 p-4">
            <p className="font-medium text-pink-700">예시</p>
            <p className="mt-2 text-sm text-gray-600">
              "웃긴 시간 여행 영화"와 "코미디 타임 트래블 무비"를 비슷한 의미로 인식합니다.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-green-50 p-4">
            <p className="mb-2 font-semibold text-green-700">장점</p>
            <p className="text-sm text-gray-600">가장 정확한 의미 매칭</p>
          </div>
          <div className="rounded-xl bg-red-50 p-4">
            <p className="mb-2 font-semibold text-red-700">단점</p>
            <p className="text-sm text-gray-600">연산 비용이 높음</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 9,
    icon: Sparkles,
    title: "직접 체험해보세요!",
    subtitle: "각 알고리즘의 차이를 비교해보세요",
    content: (
      <div className="mx-auto max-w-2xl space-y-8 text-center">
        <div className="rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 to-indigo-50 p-8">
          <p className="text-lg leading-relaxed text-gray-700">
            이제 실제 데모에서
            <br />
            <span className="font-bold text-violet-600">3가지 추천 알고리즘</span>과
            <br />
            <span className="font-bold text-indigo-600">3가지 시맨틱 검색</span>의 차이를
            <br />
            직접 경험해보세요.
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-2xl font-bold text-violet-600">3</p>
            <p className="text-sm text-gray-600">추천 방식</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-2xl font-bold text-indigo-600">3</p>
            <p className="text-sm text-gray-600">검색 방식</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-2xl font-bold text-pink-600">∞</p>
            <p className="text-sm text-gray-600">가능성</p>
          </div>
        </div>
      </div>
    ),
  },
];

export function SlideDeck() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        nextSlide();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        prevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const CurrentIcon = slides[currentSlide].icon;

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-gray-50 via-white to-violet-50">
      <div className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-violet-200/20 blur-[150px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-indigo-200/20 blur-[120px]" />

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/")}
        className="fixed left-4 top-4 z-40 flex items-center gap-2 rounded-full border border-gray-200 bg-white/90 px-4 py-2 text-sm text-gray-700 shadow-lg backdrop-blur-sm transition-all hover:border-violet-300 hover:bg-white hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">홈으로</span>
      </motion.button>

      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-20">
        <div className="w-full max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="rounded-3xl border border-gray-200 bg-white/80 p-12 shadow-2xl backdrop-blur-sm"
            >
              <div className="mb-10 text-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 shadow-lg"
                >
                  <CurrentIcon className="h-8 w-8 text-white" />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-gray-900 sm:text-4xl"
                >
                  {slides[currentSlide].title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-3 text-gray-500"
                >
                  {slides[currentSlide].subtitle}
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {slides[currentSlide].content}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="fixed bottom-8 left-1/2 z-30 flex -translate-x-1/2 items-center gap-4 rounded-full border border-gray-200 bg-white/90 px-6 py-3 shadow-lg backdrop-blur-sm">
        <button
          type="button"
          onClick={prevSlide}
          className="rounded-full p-2 transition-colors hover:bg-gray-100 disabled:opacity-30"
          disabled={currentSlide === 0}
          aria-label="이전 슬라이드"
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </button>

        <div className="flex items-center gap-2">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 w-2 rounded-full transition-all ${
                idx === currentSlide ? "w-8 bg-violet-500" : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`${idx + 1}번 슬라이드로 이동`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          className="rounded-full p-2 transition-colors hover:bg-gray-100 disabled:opacity-30"
          disabled={currentSlide === slides.length - 1}
          aria-label="다음 슬라이드"
        >
          <ChevronRight className="h-5 w-5 text-gray-700" />
        </button>
      </div>

      <div className="fixed right-8 top-8 z-30 rounded-full border border-gray-200 bg-white/80 px-4 py-2 text-sm text-gray-500 backdrop-blur-sm">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  );
}
