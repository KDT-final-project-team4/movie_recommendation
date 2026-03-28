import { motion } from "motion/react";
import type { Movie } from "./mock-data";

interface MovieCardProps {
  movie: Movie;
  badgeLabel: string;
}

export function MovieCard({ movie, badgeLabel }: MovieCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="flex-shrink-0 w-44 sm:w-52 cursor-pointer group"
    >
      <div className="relative rounded-xl overflow-hidden shadow-md shadow-black/10 border border-gray-200/60">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-64 sm:h-72 object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Score badge */}
        <div className="absolute top-2.5 right-2.5">
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-2.5 py-1 rounded-full text-xs backdrop-blur-sm border border-white/20 shadow-lg">
            {badgeLabel}
          </div>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-white text-sm truncate">{movie.title}</p>
        </div>
      </div>
    </motion.div>
  );
}