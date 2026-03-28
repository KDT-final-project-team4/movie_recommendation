import { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router";
import { Header } from "./header";
import { MovieCarousel } from "./movie-carousel";
import { MOCK_USERS, generateMovies } from "./mock-data";

export function SearchResults() {
  const { userId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];
  const query = searchParams.get("q") || "A funny movie about time travel";
  const [search, setSearch] = useState(query);

  const tfidfMovies = generateMovies(2, 5, "decimal");
  const w2vMovies = generateMovies(6, 5, "decimal");
  const sbertMovies = generateMovies(10, 5, "decimal");

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

        <MovieCarousel title="TF-IDF + Cosine Similarity" movies={tfidfMovies} scoreFormat="decimal" />
        <MovieCarousel title="Word2Vec Embeddings" movies={w2vMovies} scoreFormat="decimal" />
        <MovieCarousel title="Sentence-BERT (SBERT)" movies={sbertMovies} scoreFormat="decimal" />
      </main>
    </div>
  );
}