import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Search, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { MOCK_USERS } from "./mock-data";

// 🚨 여기에 본인의 TMDB API 키를 입력하세요!
const TMDB_API_KEY = "e09c219ee2f65785903927c06736c057";

interface MovieResult {
  item_id: number;
  title: string;
  similarity: number;
}

// 개별 영화 카드를 렌더링하는 컴포넌트 (각각 독립적으로 TMDB에 포스터를 요청함)
function MovieCard({ movie, badgeLabel, idx }: { movie: MovieResult; badgeLabel: string; idx: number }) {
  const [posterUrl, setPosterUrl] = useState<string>("");

  useEffect(() => {
    const fetchPoster = async () => {
      const fallbackUrl = `https://placehold.co/400x600/2d2d2d/ffffff?text=${encodeURIComponent(movie.title)}`;
      
      // API 키가 없으면 글자 포스터(Fallback) 출력
      if (!TMDB_API_KEY) {
        setPosterUrl(fallbackUrl);
        return;
      }

      try {
        // 영화 제목으로 TMDB 검색 API 호출
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(movie.title)}&language=ko-KR`
        );
        const data = await res.json();
        
        // 검색 결과가 있고 포스터 이미지가 존재하면 해당 이미지 세팅
        if (data.results && data.results.length > 0 && data.results[0].poster_path) {
          setPosterUrl(`https://image.tmdb.org/t/p/w500${data.results[0].poster_path}`);
        } else {
          setPosterUrl(fallbackUrl);
        }
      } catch (error) {
        setPosterUrl(fallbackUrl);
      }
    };

    fetchPoster();
  }, [movie.title]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      className="relative flex-shrink-0 w-40 snap-start group cursor-pointer"
    >
      <div className="w-full h-60 rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-all bg-gray-200">
        {posterUrl ? (
          <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>
      
      <div className="absolute top-2 right-2 bg-violet-600/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm border border-violet-400/30">
        {movie.similarity.toFixed(1)}% {badgeLabel}
      </div>

      <div className="absolute bottom-0 left-0 w-full p-3">
        <h4 className="text-white font-medium text-sm line-clamp-2 leading-snug">{movie.title}</h4>
      </div>
    </motion.div>
  );
}

export function HomeDashboard() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const user = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];

  const [isLoading, setIsLoading] = useState(true);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [cbData, setCbData] = useState<MovieResult[]>([]);
  const [cfData, setCfData] = useState<MovieResult[]>([]);
  const [ncfData, setNcfData] = useState<MovieResult[]>([]);

  const [tfidfData, setTfidfData] = useState<MovieResult[]>([]);
  const [w2vData, setW2vData] = useState<MovieResult[]>([]);
  const [sbertData, setSbertData] = useState<MovieResult[]>([]);

  useEffect(() => {
    const fetchHomeRecommendations = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/api/recommend/home/${userId}`);
        const data = await res.json();
        setCbData(data.cb_top5);
        setCfData(data.cf_top5);
        setNcfData(data.ncf_top5);
      } catch (error) {
        console.error("추천 데이터를 불러오는데 실패했습니다:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHomeRecommendations();
  }, [userId]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setIsSearchMode(false);
      return;
    }
    
    setIsSearchMode(true);
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/recommend/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();
      setTfidfData(data.tfidf_top5);
      setW2vData(data.w2v_top5);
      setSbertData(data.sbert_top5);
    } catch (error) {
      console.error("검색 중 오류가 발생했습니다:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCarousel = (title: string, movies: MovieResult[], badgeLabel: string) => (
    <div className="mb-10">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 px-4">{title}</h3>
      <div className="flex gap-4 overflow-x-auto px-4 pb-4 snap-x hide-scrollbar">
        {movies.map((movie, idx) => (
          <MovieCard key={`${movie.item_id}-${idx}`} movie={movie} badgeLabel={badgeLabel} idx={idx} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 px-4 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${user.color} flex items-center justify-center text-sm shadow-sm`}>
                {user.emoji}
              </div>
              <span className="font-medium text-gray-800 hidden sm:block">{user.name}의 홈</span>
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-xl relative">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="예: 시간 여행을 다루는 웃긴 코미디 영화"
                className="w-full bg-gray-100/50 border border-gray-200 text-gray-800 text-sm rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all placeholder:text-gray-400"
              />
            </div>
          </form>
        </div>
      </header>

      <main className="max-w-7xl mx-auto pt-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            <p className="text-sm">AI 모델이 영화 데이터를 분석하고 있습니다...</p>
          </div>
        ) : isSearchMode ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            <div className="px-4 mb-6 flex items-center gap-2 text-violet-600">
              <Sparkles className="w-5 h-5" />
              <h2 className="text-xl font-bold">"{searchQuery}" 분석 결과</h2>
            </div>
            {renderCarousel("1. TF-IDF + Cosine (키워드 매칭)", tfidfData, "일치")}
            {renderCarousel("2. Word2Vec (단어 평균 임베딩)", w2vData, "매칭")}
            {renderCarousel("3. Sentence-BERT (문맥 임베딩 - 🏆 끝판왕)", sbertData, "적합")}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            <div className="px-4 mb-6 flex items-center gap-2 text-gray-800">
              <h2 className="text-xl font-bold">{user.label}를 위한 맞춤 추천</h2>
            </div>
            {renderCarousel("1. 콘텐츠 기반 (CB) 추천 Top 5", cbData, "유사도")}
            {renderCarousel("2. 협업 필터링 (CF) 추천 Top 5", cfData, "예상")}
            {renderCarousel("3. Neural CF (딥러닝) 추천 Top 5", ncfData, "적합")}
          </motion.div>
        )}
      </main>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}