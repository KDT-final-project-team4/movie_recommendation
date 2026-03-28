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
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-4 sm:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        {/* Logo */}
        <button onClick={() => navigate("/")} className="flex items-center gap-2 shrink-0">
          <Sparkles className="w-6 h-6 text-violet-500" />
          <span className="text-gray-900 text-lg hidden sm:inline">AI 추천</span>
        </button>

        {/* Search */}
        {showSearch && (
          <form
            onSubmit={(e) => { e.preventDefault(); onSearchSubmit?.(); }}
            className="flex-1 max-w-xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="자연어로 검색하세요... 예: '시간여행에 관한 재밌는 영화'"
                className="w-full bg-gray-100 border border-gray-200 rounded-full pl-10 pr-4 py-2.5 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-300 transition-all"
              />
            </div>
          </form>
        )}

        {/* User */}
        <div className="flex items-center gap-3 shrink-0">
          {userName && (
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-lg">
                {userEmoji}
              </div>
              <span className="text-gray-800 text-sm hidden md:inline">{userName}</span>
            </div>
          )}
          <button
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-gray-700 transition-colors p-2"
            title="사용자 변경"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}