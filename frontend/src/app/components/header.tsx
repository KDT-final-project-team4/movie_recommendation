import { Search, Sparkles, LogOut } from "lucide-react";
import { useNavigate } from "react-router";

interface HeaderProps {
  userName?: string;
  userEmoji?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  onSearchSubmit?: () => void;
  showSearch?: boolean;
}

export function Header({ userName, userEmoji, searchValue = "", onSearchChange, onSearchSubmit, showSearch = true }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-[#0B1120]/80 backdrop-blur-md border-b border-slate-700/50 px-4 sm:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        {/* Logo */}
        <button onClick={() => navigate("/")} className="flex items-center gap-2 shrink-0">
          <Sparkles className="w-6 h-6 text-cyan-400" />
          <span className="text-white text-lg hidden sm:inline">AI 추천</span>
        </button>

        {/* Search */}
        {showSearch && (
          <form
            onSubmit={(e) => { e.preventDefault(); onSearchSubmit?.(); }}
            className="flex-1 max-w-xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="자연어로 검색하세요... 예: '시간여행에 관한 재밌는 영화'"
                className="w-full bg-slate-800/60 border border-slate-700 rounded-full pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
              />
            </div>
          </form>
        )}

        {/* User */}
        <div className="flex items-center gap-3 shrink-0">
          {userName && (
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-lg">
                {userEmoji}
              </div>
              <span className="text-slate-300 text-sm hidden md:inline">{userName}</span>
            </div>
          )}
          <button
            onClick={() => navigate("/")}
            className="text-slate-500 hover:text-white transition-colors p-2"
            title="사용자 변경"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
