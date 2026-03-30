import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MovieCard } from "./movie-card";

interface MovieCarouselProps {
  title: string;
  movies: any[];
  scoreFormat?: "percent" | "decimal";
}

export function MovieCarousel({ title, movies, scoreFormat = "percent" }: MovieCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = dir === "left" ? -500 : 500;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="mb-10">
      <h2 className="text-white mb-4 px-1">{title}</h2>
      
      <div className="relative group/carousel">
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white p-2 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity shadow-md backdrop-blur-sm border border-slate-700/50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div
          ref={scrollRef}
          className="flex flex-nowrap gap-4 overflow-x-auto scrollbar-hide pb-4 px-1 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {movies.map((movie, idx) => {
            const keyId = movie.id || movie.item_id || idx;
            const scoreValue = movie.score !== undefined ? movie.score : movie.similarity;
            
            return (
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
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white p-2 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity shadow-md backdrop-blur-sm border border-slate-700/50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
