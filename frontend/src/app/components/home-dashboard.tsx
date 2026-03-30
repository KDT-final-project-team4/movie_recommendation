import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Loader2,
  Search,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { MOCK_USERS } from "./mock-data";

const API_BASE_URL = "http://localhost:8000";
const TMDB_API_KEY = "e09c219ee2f65785903927c06736c057";

interface MovieResult {
  item_id?: number;
  title: string;
  similarity: number;
  is_hit?: boolean; // 백엔드에서 주는 정답 여부 추가
}

interface Metrics {
  precision_at_10: number;
  ndcg_at_10: number;
  diversity: number;
  inference_ms: number;
}

interface HomeRecommendationResponse {
  target_genres?: string[];
  cb_data?: { results: MovieResult[]; metrics: Metrics };
  cf_data?: { results: MovieResult[]; metrics: Metrics };
  ncf_data?: { results: MovieResult[]; metrics: Metrics };
}

interface SearchRecommendationResponse {
  tfidf_results?: MovieResult[];
  w2v_results?: MovieResult[];
  sbert_results?: MovieResult[];
}

function MovieCard({
  movie,
  badgeLabel,
  idx,
}: {
  movie: MovieResult;
  badgeLabel: string;
  idx: number;
}) {
  const [posterUrl, setPosterUrl] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchPoster = async () => {
      const fallbackUrl = `https://placehold.co/400x600/2d2d2d/ffffff?text=${encodeURIComponent(movie.title)}`;

      if (!TMDB_API_KEY) {
        setPosterUrl(fallbackUrl);
        return;
      }

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(movie.title)}&language=ko-KR`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Failed to load TMDB poster");
        }

        const data = await response.json();

        if (data.results?.[0]?.poster_path) {
          setPosterUrl(`https://image.tmdb.org/t/p/w500${data.results[0].poster_path}`);
          return;
        }

        setPosterUrl(fallbackUrl);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setPosterUrl(fallbackUrl);
      }
    };

    fetchPoster();

    return () => {
      controller.abort();
    };
  }, [movie.title]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.08 }}
      className="relative w-40 flex-shrink-0 snap-start"
    >
      <div className={`group relative h-60 overflow-hidden rounded-xl shadow-md transition-all hover:-translate-y-1 hover:shadow-xl ${movie.is_hit ? 'ring-4 ring-green-400 bg-green-50' : 'bg-gray-200'}`}>
        {/* 정답 뱃지 추가 */}
        {movie.is_hit && (
          <div className="absolute left-2 top-2 z-10 rounded-md bg-green-500/90 px-2 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-sm">
            HIT!
          </div>
        )}
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        <div className="absolute right-2 top-2 rounded-md border border-violet-300/40 bg-violet-600/90 px-2 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-sm">
          {movie.similarity.toFixed(1)}% {badgeLabel}
        </div>
        <div className="absolute bottom-0 left-0 w-full p-3">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-white">
            {movie.title}
          </h3>
        </div>
      </div>
    </motion.article>
  );
}

// 💡 새롭게 추가된 스크롤 로직 (좌우 버튼 포함)
function MovieRow({
  movies,
  badgeLabel,
}: {
  movies: MovieResult[];
  badgeLabel: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = dir === "left" ? -400 : 400; // 한 번에 넘어가는 너비
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="relative group/carousel">
      {/* 왼쪽 화살표 */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 text-gray-700 opacity-0 shadow-md backdrop-blur-sm transition-opacity hover:bg-white group-hover/carousel:opacity-100"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* 10개가 담기는 스크롤 영역 */}
      <div
        ref={scrollRef}
        className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {movies.map((movie, idx) => (
          <MovieCard
            key={`${movie.item_id ?? movie.title}-${idx}`}
            movie={movie}
            badgeLabel={badgeLabel}
            idx={idx}
          />
        ))}
      </div>

      {/* 오른쪽 화살표 */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 text-gray-700 opacity-0 shadow-md backdrop-blur-sm transition-opacity hover:bg-white group-hover/carousel:opacity-100"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
}

function EmptyCarouselState({ title }: { title: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-violet-200 bg-white/70 px-6 py-10 text-center text-sm text-gray-500 shadow-sm">
      {title} 결과가 아직 없습니다.
    </div>
  );
}

export function HomeDashboard() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const user = MOCK_USERS.find((candidate) => candidate.id === userId) ?? MOCK_USERS[0];

  const [isLoading, setIsLoading] = useState(true);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [cbData, setCbData] = useState<MovieResult[]>([]);
  const [cfData, setCfData] = useState<MovieResult[]>([]);
  const [ncfData, setNcfData] = useState<MovieResult[]>([]);

  const [cbMetrics, setCbMetrics] = useState<Metrics | null>(null);
  const [cfMetrics, setCfMetrics] = useState<Metrics | null>(null);
  const [ncfMetrics, setNcfMetrics] = useState<Metrics | null>(null);

  const [tfidfData, setTfidfData] = useState<MovieResult[]>([]);
  const [w2vData, setW2vData] = useState<MovieResult[]>([]);
  const [sbertData, setSbertData] = useState<MovieResult[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchHomeRecommendations = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/recommend/home/${userId}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Failed to load home recommendations");
        }

        const data: HomeRecommendationResponse = await response.json();
        setCbData(data.cb_data?.results ?? []);
        setCbMetrics(data.cb_data?.metrics ?? null);

        setCfData(data.cf_data?.results ?? []);
        setCfMetrics(data.cf_data?.metrics ?? null);

        setNcfData(data.ncf_data?.results ?? []);
        setNcfMetrics(data.ncf_data?.metrics ?? null);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setErrorMessage("추천 데이터를 불러오지 못했습니다. 백엔드 서버 연결을 확인해주세요.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchHomeRecommendations();

    return () => {
      controller.abort();
    };
  }, [userId]);

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!searchQuery.trim()) {
      setIsSearchMode(false);
      setErrorMessage("");
      return;
    }

    setIsSearchMode(true);
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/recommend/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to run semantic search");
      }

      const data: SearchRecommendationResponse = await response.json();
      setTfidfData(data.tfidf_results ?? []);
      setW2vData(data.w2v_results ?? []);
      setSbertData(data.sbert_results ?? []);
    } catch (error) {
      setErrorMessage("검색 결과를 불러오지 못했습니다. 백엔드 서버 상태를 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearchMode(false);
    setErrorMessage("");
  };

  const renderCarousel = (
    title: string,
    caption: string,
    movies: MovieResult[],
    badgeLabel: string,
    metrics?: Metrics | null // 추가된 파라미터
  ) => (
    <section className="mb-10">
      <div className="mb-4 flex flex-col gap-3 px-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{caption}</p>
        </div>

        {/* 지표(Metrics)가 있을 경우 뱃지로 렌더링 */}
        {metrics && (
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-green-200 bg-green-50 px-2.5 py-1 font-medium text-green-700 shadow-sm">
              🎯 정밀도: {metrics.precision_at_10}
            </span>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 font-medium text-blue-700 shadow-sm">
              📊 NDCG: {metrics.ndcg_at_10}
            </span>
            <span className="rounded-full border border-purple-200 bg-purple-50 px-2.5 py-1 font-medium text-purple-700 shadow-sm">
              🌈 장르 다양성: {metrics.diversity}
            </span>
            <span className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 font-medium text-orange-700 shadow-sm">
              ⏱️ 추론 시간: {metrics.inference_ms}ms
            </span>
          </div>
        )}
      </div>
      {movies.length > 0 ? (
        <MovieRow movies={movies} badgeLabel={badgeLabel} />
      ) : (
        <div className="px-4">
          <EmptyCarouselState title={title} />
        </div>
      )}
    </section>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50 pb-20">
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 px-4 py-4 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-full p-2 transition-colors hover:bg-gray-100"
              aria-label="홈으로 돌아가기"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>

            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${user.color} text-lg shadow-sm`}>
                {user.emoji}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{user.name}의 홈</p>
                <p className="text-xs text-gray-500">{user.label} 취향으로 추천을 불러왔어요</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex w-full max-w-2xl items-center gap-3">
            <div className="group relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-violet-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="ex: comedy movie about time travel"
                className="w-full rounded-full border border-gray-200 bg-gray-100/60 py-2.5 pl-10 pr-4 text-sm text-gray-800 transition-all placeholder:text-gray-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-shadow hover:shadow-xl"
            >
              검색
            </motion.button>

            {isSearchMode ? (
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearSearch}
                className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 shadow-sm transition-colors hover:border-violet-200 hover:text-violet-600"
              >
                <X className="h-4 w-4" />
                초기화
              </motion.button>
            ) : null}
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-8">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 grid gap-4 md:grid-cols-3"
        >
          <div className="rounded-2xl border border-violet-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-500">추천 알고리즘</p>
            <h2 className="mt-2 text-lg font-bold text-gray-900">CB, CF, NCF 비교</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              사용자 프로필, 협업 필터링, 딥러닝 추천을 한 화면에서 비교할 수 있어요.
            </p>
          </div>
          <div className="rounded-2xl border border-indigo-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">시맨틱 검색</p>
            <h2 className="mt-2 text-lg font-bold text-gray-900">TF-IDF, W2V, SBERT</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              자연어 쿼리 하나로 키워드 중심부터 문맥 기반 검색까지 바로 체험합니다.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">현재 모드</p>
            <h2 className="mt-2 text-lg font-bold text-gray-900">
              {isSearchMode ? "검색 결과 탐색 중" : `${user.name} 맞춤 추천`}
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              {isSearchMode
                ? `"${searchQuery}"에 대한 알고리즘별 결과를 비교하고 있어요.`
                : `${user.label} 취향을 기준으로 홈 추천을 불러왔어요.`}
            </p>
          </div>
        </motion.section>

        {isLoading ? (
          <div className="flex h-72 flex-col items-center justify-center gap-4 text-gray-400">
            <Loader2 className="h-9 w-9 animate-spin text-violet-500" />
            <p className="text-sm">AI 모델이 영화 데이터를 분석하고 있습니다...</p>
          </div>
        ) : (
          <>
            {errorMessage ? (
              <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600 shadow-sm">
                {errorMessage}
              </div>
            ) : null}

            {isSearchMode ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                <div className="mb-6 flex items-center gap-2 px-1 text-violet-600">
                  <Sparkles className="h-5 w-5" />
                  <h2 className="text-xl font-bold">"{searchQuery}" 분석 결과</h2>
                </div>

                {renderCarousel("1. TF-IDF (키워드 빈도 매칭)", "키워드 중심의 가장 직관적인 매칭 방식", tfidfData, "일치")}
                {renderCarousel("2. Word2Vec (단어 의미 벡터 평균)", "단어 의미 벡터 평균으로 유사 작품 탐색", w2vData, "매칭")}
                {renderCarousel("3. Sentence-BERT (문맥 이해 검색)", "문장 전체 문맥을 이해하는 고성능 검색", sbertData, "적합")}
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                <div className="mb-6 px-1">
                  <h2 className="text-xl font-bold text-gray-900">{user.label}를 위한 맞춤 추천</h2>
                  <p className="mt-1 text-sm text-gray-500">세 가지 추천 알고리즘 결과를 나란히 비교해보세요.</p>
                </div>

                {renderCarousel("1. 콘텐츠 기반 (CB) 추천 Top 10", "좋아했던 영화의 속성과 닮은 작품을 찾아요", cbData, "유사도", cbMetrics)}
                {renderCarousel("2. 협업 필터링 (CF) 추천 Top 10", "비슷한 취향의 다른 사용자 패턴을 반영해요", cfData, "예상", cfMetrics)}
                {renderCarousel("3. Neural CF (딥러닝) 추천 Top 10", "신경망이 학습한 잠재 선호도를 기반으로 추천해요", ncfData, "적합", ncfMetrics)}
              </motion.div>
            )}
          </>
        )}
      </main>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}