import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Sparkles, Play, Film, Star, TrendingUp, Presentation } from "lucide-react";
import { MOCK_USERS, POSTERS } from "./mock-data";

const FEATURED_POSTERS = POSTERS.slice(0, 8);

export function UserSelect() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-8 pb-16 px-4 sm:px-8">
        {/* Background glow */}
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-violet-200/30 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-200/20 rounded-full blur-[120px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Top nav bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-12"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-violet-500" />
              <span className="text-gray-900 text-xl tracking-tight">AI 추천</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><Film className="w-4 h-4" /> 데모 버전</span>
              <span className="flex items-center gap-1.5"><Star className="w-4 h-4" /> v1.0</span>
            </div>
          </motion.div>

          {/* Hero Content + Poster Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-3 py-1.5 rounded-full text-xs mb-6">
                <TrendingUp className="w-3.5 h-3.5" />
                맞춤형 AI 알고리즘 추천 체험
              </div>
              <h1 className="text-gray-900 text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight mb-6">
                당신만을 위한<br />
                <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  AI 영화 추천
                </span>
              </h1>
              <p className="text-gray-500 text-base sm:text-lg max-w-lg mb-8 leading-relaxed">
                Content-Based, Collaborative Filtering, Neural CF 등 다양한 추천 알고리즘이 어떻게 작동하는지 직접 비교해 보세요.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  3가지 추천 알고리즘
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  3가지 시맨틱 검색
                </div>
              </div>
            </motion.div>

            {/* Right: Poster Collage */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="grid grid-cols-4 gap-3 -rotate-3">
                {FEATURED_POSTERS.map((poster, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i + 0.3, duration: 0.5 }}
                    className={`rounded-xl overflow-hidden shadow-lg shadow-black/10 ${i % 3 === 0 ? "row-span-2" : ""}`}
                  >
                    <img
                      src={poster}
                      alt=""
                      className={`w-full object-cover ${i % 3 === 0 ? "h-52" : "h-24"}`}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* User Selection Section */}
      <section className="relative px-4 sm:px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-gray-900 text-2xl sm:text-3xl mb-3">
              프로필을 선택하세요
            </h2>
            <p className="text-gray-400 text-sm">
              각 사용자는 고유한 영화 취향을 가지고 있어요
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {MOCK_USERS.map((user, i) => (
              <motion.button
                key={user.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + 0.1 * i, duration: 0.5 }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/home/${user.id}`)}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 hover:border-violet-200 transition-all duration-300 flex flex-col items-center gap-4"
              >
                <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br ${user.color} flex items-center justify-center text-3xl sm:text-4xl shadow-md group-hover:shadow-lg transition-shadow duration-300`}>
                  {user.emoji}
                </div>
                <div className="text-center">
                  <p className="text-gray-800">{user.name}</p>
                  <p className="text-gray-400 text-xs mt-1">{user.label}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-violet-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-3 h-3 fill-violet-500" />
                  시작하기
                </div>
              </motion.button>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mt-10 flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/slides")}
              className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-500 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-shadow text-sm"
            >
              <Presentation className="w-4 h-4" />
              알고리즘 소개 보기
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Bottom Marquee of Posters */}
      <section className="border-t border-gray-100 bg-gray-50/50 py-8 overflow-hidden">
        <p className="text-center text-xs text-gray-400 mb-4 tracking-wider uppercase">추천 가능한 영화 미리보기</p>
        <div className="relative">
          <div className="flex gap-4 animate-marquee">
            {[...POSTERS, ...POSTERS].map((poster, i) => (
              <img
                key={i}
                src={poster}
                alt=""
                className="w-28 h-40 object-cover rounded-lg flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Marquee animation style */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          width: max-content;
        }
      `}</style>
    </div>
  );
}
