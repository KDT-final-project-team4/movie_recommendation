import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router";
import { Header } from "./header";
import { MovieCarousel } from "./movie-carousel";
import { MOCK_USERS } from "./mock-data";

// 🌟 추가: 백엔드 검색 결과 타입 정의
interface MovieResult {
  item_id?: number;
  title: string;
  similarity: number;
}

export function SearchResults() {
  const { userId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];
  const query = searchParams.get("q") || "A hacker discovers that the world is a simulated reality";
  const [search, setSearch] = useState(query);

  // 🌟 변경: 하드코딩된 mock 데이터를 제거하고 상태(State)로 관리
  const [tfidfMovies, setTfidfMovies] = useState<MovieResult[]>([]);
  const [w2vMovies, setW2vMovies] = useState<MovieResult[]>([]);
  const [sbertMovies, setSbertMovies] = useState<MovieResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 🌟 추가: 검색어가 바뀔 때마다 백엔드 API 호출
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:8000/api/recommend/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: query }),
        });

        const data = await response.json();

        // 백엔드의 응답 키(Key)값에 맞춰서 데이터 저장
        setTfidfMovies(data.tfidf_results || []);
        setW2vMovies(data.w2v_results || []);
        setSbertMovies(data.sbert_results || []);
      } catch (error) {
        console.error("검색 결과를 가져오는 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const handleSearch = () => {
    if (search.trim()) {
      navigate(`/search/${userId}?q=${encodeURIComponent(search)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
      <Header
        userName={user.name}
        userEmoji={user.emoji}
        searchValue={search}
        onSearchChange={setSearch}
        onSearchSubmit={handleSearch}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-4 pb-16">
        <div className="mb-10">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">시맨틱 검색 결과</p>
          <h1 className="text-gray-900 text-xl sm:text-2xl">"{query}"</h1>
        </div>

        {/* 🌟 로딩 중일 때 표시할 UI 추가 */}
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mb-4"></div>
            <span className="text-gray-600 font-medium">
              SBERT가 문맥을 분석하며 영화를 검색하고 있습니다...
            </span>
          </div>
        ) : (
          /* 🌟 로딩이 완료되면 실제 데이터 렌더링 */
          <>
            <MovieCarousel
              title="1. TF-IDF (키워드 빈도 기반 검색)"
              movies={tfidfMovies}
              scoreFormat="decimal"
            />
            <MovieCarousel
              title="2. Word2Vec (단어 벡터 평균 검색)"
              movies={w2vMovies}
              scoreFormat="decimal"
            />
            <MovieCarousel
              title="3. Sentence-BERT (SBERT 문맥 이해 검색)"
              movies={sbertMovies}
              scoreFormat="decimal"
            />
          </>
        )}
      </main>
    </div>
  );
}