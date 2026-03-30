import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { Header } from "./header";
import { MovieCarousel } from "./movie-carousel";
import { MOCK_USERS } from "./mock-data";

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

  const [tfidfMovies, setTfidfMovies] = useState<MovieResult[]>([]);
  const [w2vMovies, setW2vMovies] = useState<MovieResult[]>([]);
  const [sbertMovies, setSbertMovies] = useState<MovieResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="min-h-screen bg-[#0B1120]">
      <Header
        userName={user.name}
        userEmoji={user.emoji}
        searchValue={search}
        onSearchChange={setSearch}
        onSearchSubmit={handleSearch}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-4 pb-16">
        <div className="mb-10">
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">시맨틱 검색 결과</p>
          <h1 className="text-white text-xl sm:text-2xl">"{query}"</h1>
        </div>

        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-32">
            <Loader2 className="h-12 w-12 animate-spin text-cyan-400 mb-4" />
            <span className="text-slate-400">
              문맥을 분석하며 45,000개의 영화를 검색하고 있습니다...
            </span>
          </div>
        ) : (
          <>
            <MovieCarousel
              title="1. TF-IDF (키워드 빈도 매칭)"
              movies={tfidfMovies}
              scoreFormat="decimal"
            />
            <MovieCarousel
              title="2. Word2Vec (단어 벡터 평균)"
              movies={w2vMovies}
              scoreFormat="decimal"
            />
            <MovieCarousel
              title="3. Sentence-BERT (문맥 기반 의미론적 검색)"
              movies={sbertMovies}
              scoreFormat="decimal"
            />
          </>
        )}
      </main>
    </div>
  );
}
