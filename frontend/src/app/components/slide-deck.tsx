import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Presentation,
  Sparkles,
  Cpu,
  Users,
  Brain,
  Search,
  BarChart3,
  Layers,
  Database,
  Lightbulb,
  Target,
  TrendingUp,
  FlaskConical,
  Microscope,
  Combine,
  ArrowRight,
  FileText,
  Eye,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  GitBranch,
  Table,
  Zap,            // <-- 추가됨
  MessageCircle,
} from "lucide-react";

/* ════════════════ THEME CONSTANTS ════════════════ */
const BG = "bg-[#0B1120]";
const BG_CARD = "bg-[#111827]/80";
const ACCENT = "from-cyan-400 to-blue-500";
const ACCENT_TEXT = "text-cyan-400";
const NEON_BORDER = "border-cyan-500/30";
const NEON_GLOW = "shadow-[0_0_30px_rgba(6,182,212,0.15)]";
const SUBTLE_TEXT = "text-slate-400";
const BODY_TEXT = "text-slate-300";
const HEADING_TEXT = "text-white";

/* ════════════════ REUSABLE COMPONENTS ════════════════ */

function SlideTag({ children }: { children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs tracking-wider uppercase ${ACCENT_TEXT} bg-cyan-500/10 border border-cyan-500/20`}>
      {children}
    </span>
  );
}

function SectionTitle({ tag, title }: { tag: string; title: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
      <SlideTag>{tag}</SlideTag>
      <h2 className={`${HEADING_TEXT} text-2xl sm:text-3xl lg:text-4xl tracking-tight mt-3 leading-tight`}>
        {title}
      </h2>
    </motion.div>
  );
}

// 🌟 누락되었던 SlideLayout 컴포넌트 추가
function SlideLayout({ icon, title, subtitle, children }: { icon: React.ReactNode, title: string, subtitle?: string, children: React.ReactNode }) {
  return (
    <div className={`w-full h-full flex flex-col ${BG} p-8 sm:p-10 lg:p-14`}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          {subtitle && <span className={`text-xs uppercase tracking-wider ${ACCENT_TEXT}`}>{subtitle}</span>}
        </div>
        <h2 className={`${HEADING_TEXT} text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-tight`}>
          {title}
        </h2>
      </motion.div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  children,
  delay = 0,
  accent = "cyan",
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  delay?: number;
  accent?: "cyan" | "blue" | "violet" | "emerald" | "amber";
}) {
  const colors: Record<string, string> = {
    cyan: "border-cyan-500/20 bg-cyan-500/5",
    blue: "border-blue-500/20 bg-blue-500/5",
    violet: "border-violet-500/20 bg-violet-500/5",
    emerald: "border-emerald-500/20 bg-emerald-500/5",
    amber: "border-amber-500/20 bg-amber-500/5",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`rounded-xl p-4 lg:p-5 border ${colors[accent]} backdrop-blur-sm`}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className={`text-sm font-bold tracking-wide ${ACCENT_TEXT}`}>{title}</span>
      </div>
      <div className={`text-sm leading-relaxed ${BODY_TEXT}`}>{children}</div>
    </motion.div>
  );
}

function DiagramBox({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className={`rounded-2xl border ${NEON_BORDER} ${BG_CARD} ${NEON_GLOW} p-6 lg:p-8 flex flex-col items-center justify-center ${className}`}
    >
      {children}
    </motion.div>
  );
}

function FlowArrow() {
  return <ArrowRight className="w-5 h-5 text-cyan-500/60 flex-shrink-0" />;
}

function FlowNode({ label, sub, color = "cyan" }: { label: string; sub?: string; color?: string }) {
  const cls: Record<string, string> = {
    cyan: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
    blue: "border-blue-500/40 bg-blue-500/10 text-blue-300",
    violet: "border-violet-500/40 bg-violet-500/10 text-violet-300",
    emerald: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    amber: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  };
  return (
    <div className={`px-3 py-2 rounded-lg border text-xs text-center ${cls[color]}`}>
      <div className="font-bold">{label}</div>
      {sub && <div className="text-[10px] opacity-70 mt-0.5">{sub}</div>}
    </div>
  );
}

// 🌟 누락되었던 MetricCard 컴포넌트 추가
function MetricCard({ label, precision, ndcg, diversity, time, color = "cyan" }: any) {
  const colors: Record<string, string> = {
    cyan: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
    amber: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    violet: "border-violet-500/30 bg-violet-500/10 text-violet-300",
  };
  return (
    <div className={`p-4 rounded-xl border ${colors[color]} backdrop-blur-sm`}>
      <div className="text-sm font-bold mb-3">{label}</div>
      <div className="space-y-2 text-xs text-slate-300">
        <div className="flex justify-between items-center"><span>정밀도</span> <span className="font-mono bg-black/30 px-1.5 rounded">{precision}</span></div>
        <div className="flex justify-between items-center"><span>NDCG</span> <span className="font-mono bg-black/30 px-1.5 rounded">{ndcg}</span></div>
        <div className="flex justify-between items-center"><span>다양성</span> <span className="font-mono bg-black/30 px-1.5 rounded">{diversity}</span></div>
        <div className="flex justify-between items-center pt-2 border-t border-slate-700/50 mt-1 text-slate-400">
          <span>추론 시간</span> <span className="font-mono">{time}</span>
        </div>
      </div>
    </div>
  );
}

/* ════════════════ 15 SLIDES ════════════════ */

function Slide1() {
  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-center overflow-hidden ${BG}`}>
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-cyan-500/15 to-blue-600/10 blur-[120px]" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tr from-blue-500/10 to-violet-500/8 blur-[100px]" />
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 text-center px-8">
        <SlideTag><Sparkles className="w-3.5 h-3.5" />AI Portfolio Presentation</SlideTag>
        <h1 className={`${HEADING_TEXT} text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.15] mt-8 mb-6`}>
          진화하는 추천 시스템,
          <br />
          <span className={`bg-gradient-to-r ${ACCENT} bg-clip-text text-transparent`}>
            레거시와 AI의 교차점 검증
          </span>
        </h1>
        <p className={`${SUBTLE_TEXT} text-base sm:text-lg max-w-2xl mx-auto leading-relaxed`}>
          "최신 딥러닝 모델이 항상 최선의 결과(UX)를 보장하는가?"
          <br />
          추천 알고리즘(CB, CF, NCF)과 검색 알고리즘(TF-IDF, Word2Vec, SBERT)의 정량적 대조군 분석
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="relative z-10 mt-10 flex items-center gap-3">
        <FlowNode label="Rule-based" sub="초기 매칭" color="amber" />
        <FlowArrow />
        <FlowNode label="Machine Learning" sub="통계/군집화" color="blue" />
        <FlowArrow />
        <FlowNode label="Deep Learning" sub="신경망/문맥이해" color="cyan" />
      </motion.div>
    </div>
  );
}

function Slide2() {
  return (
    <div className={`w-full h-full flex flex-col ${BG} p-8 sm:p-10 lg:p-14`}>
      <SectionTitle tag="Slide 2 · Taxonomy" title="세대별 대표 알고리즘의 선정" />
      <div className="flex-1 grid lg:grid-cols-2 gap-6 mt-6">
        <DiagramBox>
          <p className={`text-xs uppercase tracking-wider ${ACCENT_TEXT} mb-5`}>세대별 발전 계보</p>
          <div className="w-full space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="px-2 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] uppercase tracking-wider font-bold">1세대 (Metadata)</div>
              <div className="px-2 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[10px] uppercase tracking-wider font-bold">2세대 (Interaction)</div>
              <div className="px-2 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] uppercase tracking-wider font-bold">3세대 (Deep Learning)</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5 pl-1 font-bold">추천 (Recommendation)</div>
              <div className="grid grid-cols-3 gap-3">
                <FlowNode label="CB" sub="아이템 메타데이터" color="amber" />
                <FlowNode label="CF" sub="집단지성 행렬분해" color="blue" />
                <FlowNode label="NCF" sub="비선형 신경망" color="cyan" />
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5 pl-1 font-bold mt-2">검색 (Search)</div>
              <div className="grid grid-cols-3 gap-3">
                <FlowNode label="TF-IDF" sub="키워드 빈도" color="amber" />
                <FlowNode label="Word2Vec" sub="단어 좌표화" color="blue" />
                <FlowNode label="SBERT" sub="문맥 전체 이해" color="cyan" />
              </div>
            </div>
          </div>
        </DiagramBox>
        <div className="flex flex-col gap-4">
          <InfoCard icon={<GitBranch className="w-4 h-4 text-cyan-400" />} title="프로젝트 목적" delay={0.1}>
            추천과 검색 기술의 세대별 한계를 교차 검증하기 위해 각 계보의 대표 알고리즘 6가지를 선정
          </InfoCard>
          <InfoCard icon={<Layers className="w-4 h-4 text-amber-400" />} title="추천의 진화" delay={0.2} accent="amber">
            아이템 속성(CB) → 유저 집단지성(CF) → 비선형 패턴(NCF)으로의 발전 흐름 비교
          </InfoCard>
          <InfoCard icon={<Search className="w-4 h-4 text-blue-400" />} title="검색의 진화" delay={0.3} accent="blue">
            단어 빈도(TF-IDF) → 단어 의미(Word2Vec) → 문맥 이해(SBERT)로의 진화 한계 측정
          </InfoCard>
        </div>
      </div>
    </div>
  );
}

// 🌟 새로 추가된 '데이터셋 소개' 전용 슬라이드
function Slide3() {
  return (
    <SlideLayout
      icon={<Database className={`w-6 h-6 ${ACCENT_TEXT}`} />}
      title="사용 데이터셋 (Dataset Overview)"
      subtitle="Slide 3 · Data Source"
    >
      <div className="grid lg:grid-cols-2 gap-6 h-full items-center mt-4">
        <DiagramBox className="!p-5">
          <p className={`text-xs font-bold uppercase tracking-wider ${ACCENT_TEXT} mb-4 text-center`}>TMDB Movie Metadata</p>
          <div className="w-full text-xs text-slate-300 bg-slate-900/50 rounded-lg overflow-hidden border border-slate-700">
            <div className="grid grid-cols-4 bg-slate-800 p-2 font-bold text-slate-400">
              <div>movieId</div><div>title</div><div>genres</div><div>overview</div>
            </div>
            <div className="grid grid-cols-4 p-2 border-t border-slate-800 items-center">
              <div className="text-cyan-400">862</div><div className="truncate pr-2">Toy Story</div><div className="truncate pr-2">Animation, Family</div><div className="truncate text-[10px] text-slate-500">Led by Woody...</div>
            </div>
            <div className="grid grid-cols-4 p-2 border-t border-slate-800 items-center">
              <div className="text-cyan-400">278</div><div className="truncate pr-2">The Shawshank...</div><div className="truncate pr-2">Drama, Crime</div><div className="truncate text-[10px] text-slate-500">Framed in the...</div>
            </div>
          </div>
          <div className="mt-4 flex gap-2 w-full">
             <div className="flex-1 bg-amber-500/10 border border-amber-500/30 p-2 rounded text-center">
                <div className="text-[10px] text-slate-400 mb-1">총 영화 수 (Metadata)</div>
                <div className="text-sm font-bold text-amber-400">45,466 개</div>
             </div>
             <div className="flex-1 bg-violet-500/10 border border-violet-500/30 p-2 rounded text-center">
                <div className="text-[10px] text-slate-400 mb-1">유저 평점 수 (Small Subset)</div>
                <div className="text-sm font-bold text-violet-400">100,004 개</div>
             </div>
          </div>
        </DiagramBox>
        <div className="flex flex-col gap-4">
          <InfoCard icon={<Table className="w-4 h-4 text-cyan-400" />} title="데이터 출처: Kaggle TMDB Dataset" delay={0.1}>
            전 세계 영화 메타데이터 4.5만 건을 베이스로 활용
          </InfoCard>
          <InfoCard icon={<Cpu className="w-4 h-4 text-blue-400" />} title="엔지니어링 결정: Small Subset 활용" delay={0.2} accent="blue">
            <ul className="list-disc list-inside mt-1 space-y-1 text-xs text-slate-400">
              <li>원본 2,600만 개의 평점 데이터를 로컬 환경에서 Sparse Matrix로 연산 시 <span className="text-slate-200">Out of Memory (OOM)</span> 발생 및 학습 지연</li>
              <li>효율적인 알고리즘 대조군 실험 및 파이프라인 검증을 위해 약 10만 개로 샘플링된 <span className="text-slate-200">ratings_small.csv</span> 채택</li>
            </ul>
          </InfoCard>
          <InfoCard icon={<FileText className="w-4 h-4 text-emerald-400" />} title="데이터 분리 역할" delay={0.3} accent="emerald">
             <ul className="list-disc list-inside mt-1 space-y-1 text-xs text-slate-400">
              <li><span className="text-slate-200">메타데이터(overview 등):</span> SBERT 및 TF-IDF 검색용 임베딩</li>
              <li><span className="text-slate-200">평점 데이터(rating):</span> CF 및 NCF 모델의 잠재 취향 학습</li>
            </ul>
          </InfoCard>
        </div>
      </div>
    </SlideLayout>
  );
}

function Slide4() {
  return (
    <SlideLayout
      icon={<Database className={`w-6 h-6 ${ACCENT_TEXT}`} />}
      title="데이터 전처리 (Data Pre-processing)"
      subtitle="Slide 4 · Pipeline"
    >
      <div className="grid grid-cols-5 gap-4 h-full items-center">
        <div className="col-span-2 space-y-4">
          <div className="p-4 rounded-xl border border-slate-700 bg-slate-800/40">
            <div className="text-xs text-slate-500 mb-1">Raw Dataset</div>
            <div className="text-xl font-bold text-white">45,000+ Movies</div>
            <div className="text-[10px] text-slate-400 mt-2 leading-relaxed">
              노이즈(줄거리 부재, 중복) 데이터 다수 포함.
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-700 mx-auto rotate-90" />
          <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <div className="text-xs text-cyan-500/60 mb-1 font-bold">Preprocessed (Denoised)</div>
            <div className="text-xl font-bold text-cyan-400">약 9,000+ Movies</div>
            <div className="text-[10px] text-slate-300 mt-2 leading-relaxed">
              • Vote Count 하위 80% 제거 (대중성/신뢰도 확보) <br/>
              • 줄거리/장르 미기입 데이터 전수 필터링
            </div>
          </div>
        </div>
        <div className="col-span-3 h-full flex flex-col justify-center pl-6 border-l border-slate-800">
          <h4 className="text-sm font-bold text-slate-200 mb-5">알고리즘별 맞춤형 데이터 가공</h4>
          <ul className="space-y-5">
            <li className="flex gap-4 items-start">
              <div className="w-6 h-6 rounded border border-blue-500/40 bg-blue-500/10 flex items-center justify-center text-blue-400 mt-0.5"><Layers className="w-3.5 h-3.5" /></div>
              <div>
                <p className="text-sm font-bold text-slate-200">Sparse Matrix 변환 (RecSys)</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">CF와 NCF 모델 학습을 위해 유저와 아이템 간의 Interaction을 행렬(Matrix)로 정규화 및 인덱싱 처리.</p>
              </div>
            </li>
            <li className="flex gap-4 items-start">
              <div className="w-6 h-6 rounded border border-violet-500/40 bg-violet-500/10 flex items-center justify-center text-violet-400 mt-0.5"><FileText className="w-3.5 h-3.5" /></div>
              <div>
                <p className="text-sm font-bold text-slate-200">통합 텍스트 구축 (Search)</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">SBERT 등 자연어 처리 모델이 문맥을 온전히 이해할 수 있도록 <span className="text-cyan-300 font-mono text-[10px]">Title + Overview + Genres</span> 를 하나의 텍스트(`combined_text`)로 결합.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </SlideLayout>
  );
}

function Slide5() {
  return (
    <div className={`w-full h-full flex flex-col ${BG} p-8 sm:p-10 lg:p-14`}>
      <SectionTitle tag="Slide 5 · Content-Based Filtering" title="Algorithm 1: CB" />
      <div className="flex-1 grid lg:grid-cols-2 gap-6 mt-6">
        <DiagramBox>
          <p className={`text-xs uppercase tracking-wider ${ACCENT_TEXT} mb-4`}>아이템 속성 매칭</p>
          <div className="flex flex-col items-center gap-3">
            <FlowNode label="영화 A" sub="Action, Sci-Fi" color="cyan" />
            <div className="flex items-center gap-2">
              <div className="w-16 h-[1px] bg-cyan-500/30" />
              <span className="text-xs text-cyan-400">유사도 비교</span>
              <div className="w-16 h-[1px] bg-cyan-500/30" />
            </div>
            <FlowNode label="영화 B" sub="Action, Thriller" color="cyan" />
            <div className="mt-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              Cosine Similarity: 0.87
            </div>
          </div>
        </DiagramBox>
        <div className="flex flex-col gap-4">
          <InfoCard icon={<Lightbulb className="w-4 h-4 text-cyan-400" />} title="원리" delay={0.1}>
            유저가 과거에 좋아했던 영화가 가진 장르, 키워드 등의 메타데이터 유사도를 비교하여 추천
          </InfoCard>
          <InfoCard icon={<Database className="w-4 h-4 text-blue-400" />} title="필요 데이터" delay={0.2} accent="blue">
            아이템(영화) 자체의 속성 정보 (장르 배열, 줄거리 벡터 등)
          </InfoCard>
          <InfoCard icon={<AlertTriangle className="w-4 h-4 text-amber-400" />} title="고질적 한계" delay={0.3} accent="amber">
            사용자가 이미 아는 장르만 계속 추천하는 '필터 버블(Filter Bubble)' 현상 발생
          </InfoCard>
        </div>
      </div>
    </div>
  );
}

function Slide6() {
  return (
    <div className={`w-full h-full flex flex-col ${BG} p-8 sm:p-10 lg:p-14`}>
      <SectionTitle tag="Slide 6 · Collaborative Filtering" title="Algorithm 2: CF" />
      <div className="flex-1 grid lg:grid-cols-2 gap-6 mt-6">
        <DiagramBox>
          <p className={`text-xs uppercase tracking-wider ${ACCENT_TEXT} mb-4`}>유저 네트워크</p>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <FlowNode label="User A" sub="★ Inception, ★ Matrix" color="blue" />
              <FlowNode label="User B" sub="★ Inception, ★ Interstellar" color="blue" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-[1px] h-8 bg-cyan-500/30" />
              <div className="px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold">취향 교집합</div>
              <div className="w-[1px] h-8 bg-cyan-500/30" />
            </div>
            <FlowNode label="A에게 추천" sub="Interstellar" color="emerald" />
          </div>
        </DiagramBox>
        <div className="flex flex-col gap-4">
          <InfoCard icon={<Users className="w-4 h-4 text-cyan-400" />} title="원리" delay={0.1}>
            "나와 비슷한 패턴을 보인 타 유저가 본 영화를 추천한다"는 군집화 기반의 행렬 연산
          </InfoCard>
          <InfoCard icon={<Database className="w-4 h-4 text-blue-400" />} title="필요 데이터" delay={0.2} accent="blue">
            대규모 유저-아이템 상호작용 행렬 (User-Item Interaction Matrix)
          </InfoCard>
          <InfoCard icon={<Target className="w-4 h-4 text-emerald-400" />} title="강점" delay={0.3} accent="emerald">
            사용자가 전혀 예상치 못한 새로운 장르를 발견하게 돕는 우연성(Serendipity) 제공
          </InfoCard>
        </div>
      </div>
    </div>
  );
}

function Slide7() {
  return (
    <div className={`w-full h-full flex flex-col ${BG} p-8 sm:p-10 lg:p-14`}>
      <SectionTitle tag="Slide 7 · Neural CF" title="Algorithm 3: NCF" />
      <div className="flex-1 grid lg:grid-cols-2 gap-6 mt-6">
        <DiagramBox>
          <p className={`text-xs uppercase tracking-wider ${ACCENT_TEXT} mb-4`}>신경망 구조 (Neural Network)</p>
          <div className="flex flex-col items-center gap-2 w-full">
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              <FlowNode label="User Embedding" color="blue" />
              <FlowNode label="Item Embedding" color="violet" />
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-500/40 rotate-90" />
            <FlowNode label="Hidden Layer (MLP)" sub="비선형 특성 학습" color="cyan" />
            <ArrowRight className="w-4 h-4 text-cyan-500/40 rotate-90" />
            <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              예측 평점: 4.7 ★
            </div>
          </div>
        </DiagramBox>
        <div className="flex flex-col gap-4">
          <InfoCard icon={<Cpu className="w-4 h-4 text-cyan-400" />} title="원리" delay={0.1}>
            전통적 CF의 단순 내적 연산을 넘어, 다층 퍼셉트론(MLP)을 통해 유저와 아이템 간의 복잡하고 비선형적인 관계를 학습
          </InfoCard>
          <InfoCard icon={<Database className="w-4 h-4 text-blue-400" />} title="특징" delay={0.2} accent="blue">
            충분한 데이터가 제공되었을 때 고차원적인 패턴을 포착하여 추천 품질 극대화
          </InfoCard>
          <InfoCard icon={<AlertTriangle className="w-4 h-4 text-amber-400" />} title="리스크" delay={0.3} accent="amber">
            데이터가 부족한 희소성(Sparsity) 환경에서는 가중치가 수렴하지 못해 성능이 급락할 수 있음
          </InfoCard>
        </div>
      </div>
    </div>
  );
}

function Slide8() {
  return (
    <div className={`w-full h-full flex flex-col ${BG} p-8 sm:p-10 lg:p-14`}>
      <SectionTitle tag="Slide 8 · TF-IDF" title="Algorithm 4: TF-IDF" />
      <div className="flex-1 grid lg:grid-cols-2 gap-6 mt-6">
        <DiagramBox>
          <p className={`text-xs uppercase tracking-wider ${ACCENT_TEXT} mb-4`}>단어 빈도 가중치 계산</p>
          <div className="flex flex-col items-center gap-3 w-full">
            <FlowNode label="검색어" sub="&quot;time travel adventure funny&quot;" color="amber" />
            <ArrowRight className="w-4 h-4 text-cyan-500/40 rotate-90" />
            <div className="grid grid-cols-3 gap-2 w-full max-w-sm">
              {[
                { word: "time", tf: "0.25", idf: "2.1", w: "0.53" },
                { word: "travel", tf: "0.25", idf: "1.8", w: "0.45" },
                { word: "funny", tf: "0.25", idf: "3.2", w: "0.80" },
              ].map((t) => (
                <div key={t.word} className="text-center px-2 py-2 rounded-lg border border-cyan-500/20 bg-cyan-500/5">
                  <div className="text-cyan-300 text-xs font-bold">{t.word}</div>
                  <div className="text-[10px] text-slate-500 mt-1">Score: {t.w}</div>
                </div>
              ))}
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-500/40 rotate-90" />
            <div className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs">
              희귀 키워드 "funny" 우선 매칭
            </div>
          </div>
        </DiagramBox>
        <div className="flex flex-col gap-4">
          <InfoCard icon={<BarChart3 className="w-4 h-4 text-cyan-400" />} title="원리" delay={0.1}>
            문서 내 특정 단어의 등장 횟수(TF)와 전체 문서군에서의 희소성(IDF)을 곱하여 단어의 중요도를 평가
          </InfoCard>
          <InfoCard icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />} title="강점" delay={0.2} accent="emerald">
            사람 이름, 특정 고유명사 등 직관적인 키워드가 포함된 문서를 찾는 데 압도적으로 빠르고 정확함
          </InfoCard>
          <InfoCard icon={<XCircle className="w-4 h-4 text-amber-400" />} title="한계" delay={0.3} accent="amber">
            동의어나 문장 전체의 '문맥'을 전혀 이해하지 못함 (Lexical Independence)
          </InfoCard>
        </div>
      </div>
    </div>
  );
}

function Slide9() {
  return (
    <div className={`w-full h-full flex flex-col ${BG} p-8 sm:p-10 lg:p-14`}>
      <SectionTitle tag="Slide 9 · Word2Vec" title="Algorithm 5: Word2Vec" />
      <div className="flex-1 grid lg:grid-cols-2 gap-6 mt-6">
        <DiagramBox>
          <p className={`text-xs uppercase tracking-wider ${ACCENT_TEXT} mb-4`}>임베딩 벡터 공간 시각화</p>
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-full max-w-xs h-40">
              {[
                { x: "15%", y: "20%", label: "King", c: "text-blue-400" },
                { x: "70%", y: "18%", label: "Queen", c: "text-violet-400" },
                { x: "18%", y: "70%", label: "Man", c: "text-cyan-400" },
                { x: "72%", y: "68%", label: "Woman", c: "text-emerald-400" },
              ].map((p) => (
                <div key={p.label} className={`absolute ${p.c} text-xs font-bold`} style={{ left: p.x, top: p.y }}>
                  <div className="w-2.5 h-2.5 rounded-full bg-current mb-0.5 mx-auto shadow-sm" />
                  {p.label}
                </div>
              ))}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 120">
                <line x1="35" y1="30" x2="35" y2="85" stroke="rgba(6,182,212,0.4)" strokeDasharray="4" />
                <line x1="145" y1="28" x2="145" y2="83" stroke="rgba(6,182,212,0.4)" strokeDasharray="4" />
                <line x1="35" y1="30" x2="145" y2="28" stroke="rgba(139,92,246,0.4)" strokeDasharray="4" />
                <line x1="35" y1="85" x2="145" y2="83" stroke="rgba(139,92,246,0.4)" strokeDasharray="4" />
              </svg>
            </div>
            <div className="px-4 py-2 rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-mono">
              Vector(King) - Vector(Man) + Vector(Woman) ≈ Vector(Queen)
            </div>
          </div>
        </DiagramBox>
        <div className="flex flex-col gap-4">
          <InfoCard icon={<Layers className="w-4 h-4 text-cyan-400" />} title="원리" delay={0.1}>
            대규모 텍스트에서 단어들의 동시 등장 패턴을 학습해 각 단어를 다차원 공간의 좌표(벡터)로 변환
          </InfoCard>
          <InfoCard icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />} title="강점" delay={0.2} accent="emerald">
            단어 간의 유의어 관계와 수학적 거리를 계산할 수 있어 키워드 확장에 유리함
          </InfoCard>
          <InfoCard icon={<XCircle className="w-4 h-4 text-amber-400" />} title="한계" delay={0.3} accent="amber">
            문장 검색 시 단어 벡터들을 '평균' 내버리므로 복합적인 정보가 뭉개짐 (Information Loss)
          </InfoCard>
        </div>
      </div>
    </div>
  );
}

function Slide10() {
  return (
    <div className={`w-full h-full flex flex-col ${BG} p-8 sm:p-10 lg:p-14`}>
      <SectionTitle tag="Slide 10 · SBERT" title="Algorithm 6: Sentence-BERT" />
      <div className="flex-1 grid lg:grid-cols-2 gap-6 mt-6">
        <DiagramBox>
          <p className={`text-xs uppercase tracking-wider ${ACCENT_TEXT} mb-4`}>문맥 임베딩 (Dense Retrieval)</p>
          <div className="flex flex-col items-center gap-3 w-full">
            <FlowNode label="입력 문장" sub="&quot;A funny movie about time travel&quot;" color="amber" />
            <ArrowRight className="w-4 h-4 text-cyan-500/40 rotate-90" />
            <div className="w-full max-w-xs px-4 py-3 rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-center">
              <div className="text-cyan-300 text-xs font-bold">Transformer Self-Attention</div>
              <div className="flex justify-center gap-1.5 mt-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="w-4 h-4 rounded-sm bg-cyan-500/30 border border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.3)]" />
                ))}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-500/40 rotate-90" />
            <FlowNode label="고차원 문맥 벡터 [Dense Vector]" color="emerald" />
          </div>
        </DiagramBox>
        <div className="flex flex-col gap-4">
          <InfoCard icon={<Brain className="w-4 h-4 text-cyan-400" />} title="원리" delay={0.1}>
            단어를 쪼개지 않고 트랜스포머 아키텍처를 통해 문장 전체의 '구조와 뉘앙스(Context)'를 하나의 벡터 공간으로 압축
          </InfoCard>
          <InfoCard icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />} title="강점" delay={0.2} accent="emerald">
            사용자의 검색 의도(Intent)를 파악하여 줄거리 내용과 일치하는 영화를 찾아내는 현대 시맨틱 검색의 핵심
          </InfoCard>
          <InfoCard icon={<XCircle className="w-4 h-4 text-amber-400" />} title="한계" delay={0.3} accent="amber">
            텍스트 유사도에만 의존하여 영화의 대중성(Popularity)을 인지하지 못함
          </InfoCard>
        </div>
      </div>
    </div>
  );
}

function Slide11() {
  return (
    <SlideLayout
      icon={<Microscope className={`w-6 h-6 ${ACCENT_TEXT}`} />}
      title="오프라인 환경의 자체 평가 (Oracle)"
      subtitle="Slide 11 · Evaluation"
    >
      <div className="grid lg:grid-cols-2 gap-6 h-full mt-2">
        <DiagramBox>
          <p className={`text-xs uppercase tracking-wider ${ACCENT_TEXT} mb-4`}>평가 프레임워크 설계</p>
          <div className="flex flex-col items-center gap-3 w-full">
            <div className="px-3 py-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs text-center font-bold">
              <AlertTriangle className="w-3.5 h-3.5 mx-auto mb-1" />
              유저의 실제 클릭/구매 로그 부재
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-500/40 rotate-90" />
            <div className="px-4 py-3 rounded-lg border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 text-sm text-center font-bold">
              하드코딩 정답지 (Ground Truth Oracle) 구축
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-500/40 rotate-90" />
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm text-center mt-2">
               <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Recommendation</div>
                  <FlowNode label="NDCG & Precision" sub="특정 장르 타겟율 측정" color="blue" />
               </div>
               <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Search Engine</div>
                  <FlowNode label="MRR & Hit@10" sub="지정 명작 노출 순위 측정" color="violet" />
               </div>
            </div>
          </div>
        </DiagramBox>
        <div className="flex flex-col gap-4">
          <InfoCard icon={<AlertTriangle className="w-4 h-4 text-amber-400" />} title="오프라인 평가의 한계" delay={0.1} accent="amber">
            실제 유저가 검색 결과를 클릭했는지(Click-through) 알 수 없는 환경적 제약 극복 필요
          </InfoCard>
          <InfoCard icon={<Target className="w-4 h-4 text-cyan-400" />} title="자체 채점기 도입" delay={0.2}>
            "로맨스와 시간여행" 검색 시 &lt;어바웃 타임&gt;이 1위로 나와야 한다는 식의 절대적인 대중성을 가진 조합을 정답지로 규정
          </InfoCard>
          <InfoCard icon={<BarChart3 className="w-4 h-4 text-emerald-400" />} title="평가 지표 (Metrics)" delay={0.3} accent="emerald">
            <ul className="list-disc list-inside mt-1 space-y-1 text-[11px] text-slate-300">
               <li><span className="font-bold text-slate-200">NDCG:</span> 정답이 상위권에 배치되었는가?</li>
               <li><span className="font-bold text-slate-200">Diversity:</span> 추천 장르가 얼마나 다양한가?</li>
               <li><span className="font-bold text-slate-200">MRR:</span> 첫 번째 정답이 몇 위에 노출되는가?</li>
            </ul>
          </InfoCard>
        </div>
      </div>
    </SlideLayout>
  );
}

function Slide12() {
  return (
    <SlideLayout
      icon={<BarChart3 className={`w-6 h-6 ${ACCENT_TEXT}`} />}
      title="추천 시스템 (Recommendation) 성능 분석"
      subtitle="Slide 12 · Results 1"
    >
      <div className="space-y-6 h-full flex flex-col justify-center mt-4">
        <div className="grid grid-cols-3 gap-5">
          <MetricCard label="CB (콘텐츠 기반)" precision="1.0" ndcg="1.0" diversity="3" time="144ms" color="cyan" />
          <MetricCard label="CF (협업 필터링)" precision="0.2" ndcg="0.33" diversity="8" time="89ms" color="amber" />
          <MetricCard label="NCF (신경망 기반)" precision="0.11" ndcg="0.15" diversity="11" time="400ms" color="violet" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
           <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
              <h4 className="text-xs font-bold text-cyan-400 mb-2 flex items-center gap-1.5"><Shield className="w-3.5 h-3.5"/> CB 모델의 필터 버블 증명</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                정밀도는 1.0으로 완벽해 보이나 다양성이 3으로 극단적으로 낮습니다. 사용자가 이미 소비한 액션 장르만 기계적으로 반복 추천하는 우물 안 개구리 현상을 데이터를 통해 증명했습니다.
              </p>
           </div>
           <div className="p-4 rounded-xl border border-violet-500/20 bg-violet-500/5">
              <h4 className="text-xs font-bold text-violet-400 mb-2 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5"/> 딥러닝(NCF)의 오버엔지니어링</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                가장 기대했던 NCF가 최악의 성능과 느린 속도(400ms)를 보였습니다. 이는 <span className="text-white font-bold">데이터 희소성(Sparsity)</span>이 높은 환경에서는 무작정 딥러닝을 도입하는 것이 자원 낭비임을 시사합니다.
              </p>
           </div>
        </div>
      </div>
    </SlideLayout>
  );
}

function Slide13() {
  return (
    <div className={`w-full h-full flex flex-col ${BG} p-8 sm:p-10 lg:p-14`}>
      <SectionTitle tag="Slide 13 · Results 2" title="검색 엔진 (Search Engine) 분석" />
      <div className="flex-1 grid lg:grid-cols-2 gap-6 mt-6">
        <DiagramBox className="!items-stretch !p-5">
          <div className="grid grid-cols-2 gap-4 h-full">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex flex-col">
              <div className="flex items-center gap-1.5 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-sm font-bold">TF-IDF의 역습</span>
              </div>
              <div className="text-slate-300 text-[11px] leading-relaxed flex-1">
                <span className="block mb-2 text-cyan-300 font-mono text-xs">Q: "animation with emotions"</span>
                SBERT가 단어의 추상적 뉘앙스에 빠져 무명 영화를 띄울 때, 단순 키워드 빈도를 측정한 레거시 모델이 오히려 <span className="text-emerald-400 font-bold text-xs">'인사이드 아웃'</span>을 1위(MRR 1.0)로 타격함.
              </div>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex flex-col">
              <div className="flex items-center gap-1.5 mb-3">
                <XCircle className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 text-sm font-bold">SBERT의 편향성</span>
              </div>
              <div className="text-slate-300 text-[11px] leading-relaxed flex-1">
                <span className="block mb-2 text-cyan-300 font-mono text-xs">Q: "adventure with dinosaurs"</span>
                문맥 파악은 완벽했으나, 대중적인 명작 '쥬라기 공원'을 제쳐두고 줄거리 유사도가 근소하게 높은 B급 영화 <span className="text-amber-400 font-bold text-xs">'Dinosaur Island'</span>를 상단에 배치하는 마이너 편향(Obscurity Bias) 발견.
              </div>
            </div>
          </div>
        </DiagramBox>
        <div className="flex flex-col gap-4">
          <InfoCard icon={<Zap className="w-4 h-4 text-cyan-400" />} title="Word2Vec의 완벽한 실패" delay={0.1}>
            벡터 평균화 과정에서 "시간여행"과 "로맨스"라는 뾰족한 특성이 뭉개져 정보 손실이 발생하는 치명적 약점 증명
          </InfoCard>
          <InfoCard icon={<Microscope className="w-4 h-4 text-amber-400" />} title="의미론적 모델의 한계점" delay={0.2} accent="amber">
            SBERT는 언어의 수학적 거리는 이해하지만, 영화 도메인 특유의 '인지도(대중성)' 가치를 이해하지 못함
          </InfoCard>
          <InfoCard icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />} title="레거시 알고리즘의 방어선" delay={0.3} accent="emerald">
            고유명사나 특정 키워드에 대한 사용자의 직관적 기대를 충족시키는 데는 여전히 TF-IDF 방식이 유효함
          </InfoCard>
        </div>
      </div>
    </div>
  );
}

function Slide14() {
  return (
    <div className={`w-full h-full flex flex-col ${BG} p-8 sm:p-10 lg:p-14`}>
      <SectionTitle tag="Slide 14 · Future Work" title="정성 평가 (UX) 도입 계획" />
      <div className="flex-1 grid lg:grid-cols-2 gap-6 mt-6">
        <DiagramBox>
          <p className={`text-xs uppercase tracking-wider ${ACCENT_TEXT} mb-4`}>A/B 테스트 UI 목업</p>
          <div className="w-full max-w-xs mx-auto space-y-3">
            <div className="rounded-xl border border-slate-600 bg-slate-800/80 p-3 shadow-lg">
              <div className="text-xs text-slate-400 mb-2 text-center font-bold">블라인드 결과 선호도 테스트</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-cyan-500/10 border border-cyan-500/20 p-3 text-center transition hover:bg-cyan-500/20">
                  <div className="text-cyan-300 text-xs font-bold">Option A</div>
                  <div className="text-[10px] text-slate-500 mt-1">알고리즘 마스킹</div>
                  <div className="mt-2 w-full h-12 rounded bg-slate-700/80 flex items-center justify-center text-slate-400 text-[10px]">결과 리스트</div>
                </div>
                <div className="rounded-lg bg-violet-500/10 border border-violet-500/20 p-3 text-center transition hover:bg-violet-500/20">
                  <div className="text-violet-300 text-xs font-bold">Option B</div>
                  <div className="text-[10px] text-slate-500 mt-1">알고리즘 마스킹</div>
                  <div className="mt-2 w-full h-12 rounded bg-slate-700/80 flex items-center justify-center text-slate-400 text-[10px]">결과 리스트</div>
                </div>
              </div>
              <div className="mt-3 text-center text-[10px] text-slate-400 bg-slate-900/50 py-1 rounded">어떤 결과가 더 납득되시나요?</div>
            </div>
          </div>
        </DiagramBox>
        <div className="flex flex-col gap-4 justify-center">
          <InfoCard icon={<Lightbulb className="w-4 h-4 text-cyan-400" />} title="도입 배경" delay={0.1}>
            정량적 지표(MRR 1.0)의 수학적 점수가 낯선 영화 추천으로 인한 유저의 '불쾌한 경험'을 모두 대변하지 못함
          </InfoCard>
          <InfoCard icon={<FlaskConical className="w-4 h-4 text-blue-400" />} title="블라인드 A/B 테스트" delay={0.2} accent="blue">
            알고리즘 명칭과 유사도 점수를 가린 채 유저의 직관적인 선호도 데이터 수집
          </InfoCard>
          <InfoCard icon={<MessageCircle className="w-4 h-4 text-violet-400" />} title="Explainability (설명 가능성)" delay={0.3} accent="violet">
            모델이 제시하는 태그(예: 80% 일치)가 사용자에게 납득 가능한 근거로 작용하는지 정성적 체감 인터뷰 진행
          </InfoCard>
        </div>
      </div>
    </div>
  );
}

function Slide15() {
  return (
    <SlideLayout
      icon={<Sparkles className={`w-6 h-6 ${ACCENT_TEXT}`} />}
      title="최종 결론 (Conclusion)"
      subtitle="Slide 15 · Hybrid Architecture"
    >
      <div className="flex flex-col h-full justify-between py-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
            <div className="text-cyan-300 text-xs font-bold mb-2 flex items-center gap-1.5">
              <Combine className="w-3.5 h-3.5" /> 하이브리드 검색 (Sparse + Dense)
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              SBERT의 깊은 문맥 이해력과 TF-IDF의 고유명사 타격률을 결합(Ensemble)하여 단일 모델이 가진 고질적인 맹점을 상호 보완합니다.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
            <div className="text-emerald-300 text-xs font-bold mb-2 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> 비즈니스 랭킹 로직 결합
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              단순 수학적 유사도를 넘어, 평점 및 투표수 가중치를 부여함으로써 마이너 취향 편향을 억제하고 실서비스 수준의 품질을 확보합니다.
            </p>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center space-y-4 my-8"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-2 tracking-wide">
            Final Insight
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
            "중요한 것은 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">어떤 알고리즘</span>이냐가 아니라,<br/>
            어떻게 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">데이터를 엮어 가치를 전달</span>하느냐입니다."
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed mt-4">
            알고리즘은 도구일 뿐입니다. 도메인에 대한 깊은 이해를 바탕으로 <br/>
            모델의 한계를 시스템으로 보완하는 설계 능력이 엔지니어링의 본질입니다.
          </p>
        </motion.div>

        <div className="text-center pt-4 border-t border-slate-800/50 mt-auto">
          <p className="text-lg font-bold text-slate-200 mb-1">감사합니다</p>
          <p className="text-xs text-slate-500">Q&A 및 피드백 부탁드립니다.</p>
        </div>
      </div>
    </SlideLayout>
  );
}

/* ════════════════ SLIDE DECK CONTROLLER ════════════════ */

const SLIDES = [Slide1, Slide2, Slide3, Slide4, Slide5, Slide6, Slide7, Slide8, Slide9, Slide10, Slide11, Slide12, Slide13, Slide14, Slide15];

const SLIDE_LABELS = [
  "Title", "Taxonomy", "Dataset", "Pipeline", "CB", "CF", "NCF", "TF-IDF", "Word2Vec", "SBERT",
  "Evaluation", "Result: RecSys", "Result: Search", "Future Work", "Conclusion",
];

export function SlideDeck() {
  const totalSlides = SLIDES.length;
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const next = useCallback(() => setCurrent((c) => Math.min(c + 1, totalSlides - 1)), [totalSlides]);
  const prev = useCallback(() => setCurrent((c) => Math.max(c - 1, 0)), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const SlideComponent = SLIDES[current];

  return (
    <div className="min-h-screen bg-[#060B18] flex flex-col items-center justify-center p-4 sm:p-8 select-none">
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/")}
        className="fixed top-4 left-4 z-40 flex items-center gap-2 bg-slate-800/90 backdrop-blur-sm hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-full text-sm border border-slate-700 hover:border-cyan-500/40 transition-all shadow-lg"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">홈으로</span>
      </motion.button>

      <div className={`w-full max-w-6xl aspect-video relative rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border border-slate-700/50 ${BG}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
          >
            <SlideComponent />
          </motion.div>
        </AnimatePresence>

        {current > 0 && (
          <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center shadow-md backdrop-blur-sm transition-all opacity-30 hover:opacity-100">
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {current < totalSlides - 1 && (
          <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center shadow-md backdrop-blur-sm transition-all opacity-30 hover:opacity-100">
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        <div className="absolute top-4 right-4 z-30 bg-slate-800/70 backdrop-blur-sm text-slate-400 text-xs px-3 py-1.5 rounded-full border border-slate-700/60 font-mono">
          {current + 1} / {totalSlides}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-1.5 flex-wrap justify-center max-w-5xl">
        {SLIDE_LABELS.map((label, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`px-2.5 py-1.5 rounded-full text-[10px] sm:text-xs transition-all ${
              i === current
                ? `bg-gradient-to-r ${ACCENT} text-white shadow-md shadow-cyan-500/20 font-bold`
                : "bg-slate-800 text-slate-500 hover:text-slate-300 border border-slate-700 hover:border-cyan-500/30"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="mt-4 text-slate-600 text-[10px] sm:text-xs flex items-center gap-2">
        <Presentation className="w-3.5 h-3.5" />
        좌우 화살표 키 또는 스페이스바로 이동
      </p>
    </div>
  );
}