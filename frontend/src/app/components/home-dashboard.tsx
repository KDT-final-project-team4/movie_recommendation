import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Header } from "./header";
import { MovieCarousel } from "./movie-carousel";
import { MOCK_USERS, generateMovies } from "./mock-data";

export function HomeDashboard() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const user = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];
  const [search, setSearch] = useState("");

  const cbMovies = generateMovies(1, 5, "percent");
  const cfMovies = generateMovies(4, 5, "percent");
  const ncfMovies = generateMovies(8, 5, "percent");

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
        {/* Hero greeting */}
        <div className="mb-10">
          <h1 className="text-gray-900 text-2xl sm:text-3xl mb-1">
            안녕하세요, {user.name}님 <span>{user.emoji}</span>
          </h1>
          <p className="text-gray-500 text-sm">
            "{user.label}" 프로필 기반으로 추천된 맞춤 영화입니다.
          </p>
        </div>

        <MovieCarousel title="Content-Based (CB) Top 5" movies={cbMovies} scoreFormat="percent" />
        <MovieCarousel title="Collaborative Filtering (CF) Top 5" movies={cfMovies} scoreFormat="percent" />
        <MovieCarousel title="Neural CF (NCF) Top 5" movies={ncfMovies} scoreFormat="percent" />
      </main>
    </div>
  );
}