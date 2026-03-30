import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MovieCard } from "./movie-card";

interface MovieCarouselProps {
  title: string;
  movies: any[]; // 백엔드 응답과 호환되도록 임시로 any[] 유지 (또는 Movie[])
  scoreFormat?: "percent" | "decimal";
}

export function MovieCarousel({ title, movies, scoreFormat = "percent" }: MovieCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    // 10개가 되면 한 번에 넘겨야 할 양이 많으므로 이동 폭을 320 -> 500 정도로 키웁니다.
    const amount = dir === "left" ? -500 : 500;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-gray-900 mb-4 px-1">{title}</h2>
      
      <div className="relative group/carousel">
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity shadow-md backdrop-blur-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* 💡 해결 포인트: 
          1. flex-nowrap을 확실히 주어 줄바꿈을 막습니다.
          2. 스크롤할 때 카드가 딱딱 맞춰서 서도록 snap-x 속성을 추가했습니다. 
        */}
        <div
          ref={scrollRef}
          className="flex flex-nowrap gap-4 overflow-x-auto scrollbar-hide pb-4 px-1 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {movies.map((movie, idx) => {
            // 기존 목업 데이터(id, score)와 백엔드 API 데이터(item_id, similarity) 모두 호환되도록 처리
            const keyId = movie.id || movie.item_id || idx;
            const scoreValue = movie.score !== undefined ? movie.score : movie.similarity;
            
            return (
              // 💡 해결 포인트: flex-none을 주어 10개가 되어도 카드가 찌그러지지 않게 강제하고 고정 너비를 줍니다.
              <div key={keyId} className="flex-none w-[160px] md:w-[200px] snap-start">
                <MovieCard
                  movie={movie}
                  badgeLabel={scoreFormat === "percent" ? `유사도 ${scoreValue}%` : `일치도 ${scoreValue}`}
                />
              </div>
            );
          })}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity shadow-md backdrop-blur-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}