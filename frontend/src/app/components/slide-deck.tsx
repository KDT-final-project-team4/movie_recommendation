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
  Zap,
  FileText,
  MessageCircle,
  Eye,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

/* ════════════════ THEME CONSTANTS ════════════════ */
const BG = "bg-[#0B1120]";
const BG_CARD = "bg-[#111827]/80";
const BG_CARD_ALT = "bg-[#1E293B]/60";
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
        <span className={`text-sm tracking-wide ${ACCENT_TEXT}`}>{title}</span>
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
      <div>{label}</div>
      {sub && <div className="text-[10px] opacity-60 mt-0.5">{sub}</div>}
    </div>
  );
}

/* ════════════════ 13 SLIDES ════════════════ */

function Slide1() {
  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-center overflow-hidden ${BG}`}>
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-cyan-500/15 to-blue-600/10 blur-[120px]" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tr from-blue-500/10 to-violet-500/8 blur-[100px]" />
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 text-center px-8">
        <SlideTag><Sparkles className="w-3.5 h-3.5" />AI Portfolio Presentation</SlideTag>

        <h1 className={`${HEADING_TEXT} text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.15] mt-8 mb-6`}>
          진화하는 AI 모델,
          <br />
          <span className={`bg-gradient-to-r ${ACCENT} bg-clip-text text-transparent`}>
            레거시와의 교차점 검증
          </span>
        </h1>

        <p className={`${SUBTLE_TEXT} text-base sm:text-lg max-w-2xl mx-auto leading-relaxed`}>
          "최신 딥러닝 모델이 항상 레거시 알고리즘보다 우수한가?"
          <br />
          추천 엔진(CB, CF, NCF)과 검색 엔진(TF-IDF, Word2Vec, SBERT)의 교차 검증
        </p>
      </motion.div>

      {/* Evolution graphic */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="relative z-10 mt-10 flex items-center gap-3">
        <FlowNode label="Rule-based" sub="톱니바퀴" color="amber" />
        <FlowArrow />
        <FlowNode label="ML" sub="통계 모델" color="blue" />
        <FlowArrow />
        <FlowNode label="Deep Learning" sub="신경망" color="cyan" />
      </motion.div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="absolute bottom-8 text-slate-500 text-xs tracking-[0.3em] uppercase">
        made by team4
      </motion.p>
      <div className="absolute top-6 left-6 w-14 h-14 border-l-2 border-t-2 border-cyan-500/20 rounded-tl-lg" />
      <div className="absolute bottom-6 right-6 w-14 h-14 border-r-2 border-b-2 border-blue-500/20 rounded-br-lg" />
    </div>
  );
}

function Slide2() {
  return (
    <div className={`w-full h-full flex flex-col ${BG} p-8 sm:p-10 lg:p-14`}>
      <SectionTitle tag="Slide 2 · Data Pipeline" title="추천과 검색을 위한 데이터 구조화" />
      <div className="flex-1 grid lg:grid-cols-2 gap-6 mt-6">
        <DiagramBox>
          <p className={`text-xs uppercase tracking-wider ${ACCENT_TEXT} mb-4`}>Pipeline Flow</p>
          <div className="flex flex-col items-center gap-3 w-full">
            <FlowNode label="Raw CSV" sub="45,000+ 영화" color="amber" />
            <ArrowRight className="w-4 h-4 text-cyan-500/40 rotate-90" />
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              <FlowNode label="Sparse Matrix" sub="RecSys 전처리" color="blue" />
              <FlowNode label="Vector" sub="Search 전처리" color="violet" />
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-500/40 rotate-90" />
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              <FlowNode label="NCF 잠재 요인" sub="인덱싱" color="cyan" />
              <FlowNode label="combined_text" sub="제목+장르+줄거리" color="emerald" />
            </div>
          </div>
        </DiagramBox>
        <div className="flex flex-col gap-4">
          <InfoCard icon={<Database className="w-4 h-4 text-cyan-400" />} title="Dataset" delay={0.15}>
            45,000+ 영화 메타데이터 및 유저-아이템 상호작용 평점 데이터
          </InfoCard>
          <InfoCard icon={<Layers className="w-4 h-4 text-blue-400" />} title="RecSys 전처리" delay={0.25} accent="blue">
            희소 행렬(Sparse Matrix) 변환 및 NCF용 잠재 요인 인덱싱
          </InfoCard>
          <InfoCard icon={<FileText className="w-4 h-4 text-violet-400" />} title="Search 전처리" delay={0.35} accent="violet">
            제목, 장르, 줄거리를 하나로 묶은 combined_text 생성
          </InfoCard>
        </div>
      </div>
    </div>
  );
}

function Slide3() {
  return (
    <div className={`w-full h-full flex flex-col ${BG} p-8 sm:p-10 lg:p-14`}>
      <SectionTitle tag="Slide 3 · Content-Based Filtering" title="Algorithm 1: CB" />
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
            <div className="mt-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
              Cosine Similarity: 0.87
            </div>
          </div>
        </DiagramBox>
        <div className="flex flex-col gap-4">
          <InfoCard icon={<Lightbulb className="w-4 h-4 text-cyan-400" />} title="원리" delay={0.1}>
            영화 자체가 가진 메타데이터 속성의 유사도를 비교하여 추천
          </InfoCard>
          <InfoCard icon={<Database className="w-4 h-4 text-blue-400" />} title="필요 데이터" delay={0.2} accent="blue">
            영화별 장르, 줄거리, 키워드 특성
          </InfoCard>
          <InfoCard icon={<Eye className="w-4 h-4 text-violet-400" />} title="실제 사용 예시" delay={0.3} accent="violet">
            초기 넷플릭스, 음악 스트리밍 앱의 '비슷한 곡 추천'
          </InfoCard>
        </div>
      </div>
    </div>
  );
}

function Slide4() {
  return (
    <div className={`w-full h-full flex flex-col ${BG} p-8 sm:p-10 lg:p-14`}>
      <SectionTitle tag="Slide 4 · Collaborative Filtering" title="Algorithm 2: CF" />
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
              <div className="px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px]">교집합 발견</div>
              <div className="w-[1px] h-8 bg-cyan-500/30" />
            </div>
            <FlowNode label="A에게 추천" sub="Interstellar" color="emerald" />
          </div>
        </DiagramBox>
        <div className="flex flex-col gap-4">
          <InfoCard icon={<Users className="w-4 h-4 text-cyan-400" />} title="원리" delay={0.1}>
            "나와 비슷한 취향의 유저가 본 영화를 추천한다"는 군집화 기반의 행렬 분해
          </InfoCard>
          <InfoCard icon={<Database className="w-4 h-4 text-blue-400" />} title="필요 데이터" delay={0.2} accent="blue">
            대규모 유저-아이템 평점 행렬 (User-Item Interaction)
          </InfoCard>
          <InfoCard icon={<Eye className="w-4 h-4 text-violet-400" />} title="실제 사용 예시" delay={0.3} accent="violet">
            아마존의 "이 상품을 구매한 고객이 함께 구매한 상품"
          </InfoCard>
        </div>
      </div>
    </div>
  );
}

function Slide5() {
  return (
    <div className={`w-full h-full flex flex-col ${BG} p-8 sm:p-10 lg:p-14`}>
      <SectionTitle tag="Slide 5 · Neural CF" title="Algorithm 3: NCF" />
      <div className="flex-1 grid lg:grid-cols-2 gap-6 mt-6">
        <DiagramBox>
          <p className={`text-xs uppercase tracking-wider ${ACCENT_TEXT} mb-4`}>신경망 구조</p>
          <div className="flex flex-col items-center gap-2 w-full">
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              <FlowNode label="User Embedding" color="blue" />
              <FlowNode label="Item Embedding" color="violet" />
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-500/40 rotate-90" />
            <FlowNode label="Hidden Layer 1 (ReLU)" color="cyan" />
            <ArrowRight className="w-4 h-4 text-cyan-500/40 rotate-90" />
            <FlowNode label="Hidden Layer 2 (ReLU)" color="cyan" />
            <ArrowRight className="w-4 h-4 text-cyan-500/40 rotate-90" />
            <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
              Prediction Score: 4.7 ★
            </div>
          </div>
        </DiagramBox>
        <div className="flex flex-col gap-4">
          <InfoCard icon={<Cpu className="w-4 h-4 text-cyan-400" />} title="원리" delay={0.1}>
            선형적인 행렬 분해의 한계를 넘어, 비선형적 신경망을 통해 잠재 선호도를 깊게 학습
          </InfoCard>
          <InfoCard icon={<Database className="w-4 h-4 text-blue-400" />} title="필요 데이터" delay={0.2} accent="blue">
            신경망 학습용 임베딩 레이어 데이터
          </InfoCard>
          <InfoCard icon={<Eye className="w-4 h-4 text-violet-400" />} title="실제 사용 예시" delay={0.3} accent="violet">
            현대의 틱톡(TikTok), 유튜브 추천 알고리즘의 뼈대
          </InfoCard>
        </div>
      </div>
    </div>
  );
}

function Slide6() {
  return (
    <div className={`w-full h-full flex flex-col ${BG} p-8 sm:p-10 lg:p-14`}>
      <SectionTitle tag="Slide 6 · TF-IDF" title="Algorithm 4: TF-IDF" />
      <div className="flex-1 grid lg:grid-cols-2 gap-6 mt-6">
        <DiagramBox>
          <p className={`text-xs uppercase tracking-wider ${ACCENT_TEXT} mb-4`}>텍스트 마이닝</p>
          <div className="flex flex-col items-center gap-3 w-full">
            <FlowNode label="Document" sub="&quot;time travel adventure funny&quot;" color="amber" />
            <ArrowRight className="w-4 h-4 text-cyan-500/40 rotate-90" />
            <div className="grid grid-cols-3 gap-2 w-full max-w-sm">
              {[
                { word: "time", tf: "0.25", idf: "2.1", w: "0.53" },
                { word: "travel", tf: "0.25", idf: "1.8", w: "0.45" },
                { word: "funny", tf: "0.25", idf: "3.2", w: "0.80" },
              ].map((t) => (
                <div key={t.word} className="text-center px-2 py-2 rounded-lg border border-cyan-500/20 bg-cyan-500/5">
                  <div className="text-cyan-300 text-xs">{t.word}</div>
                  <div className="text-[10px] text-slate-500 mt-1">TF·IDF = {t.w}</div>
                </div>
              ))}
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-500/40 rotate-90" />
            <div className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs">
              희귀 단어 "funny" → 높은 가중치
            </div>
          </div>
        </DiagramBox>
        <div className="flex flex-col gap-4">
          <InfoCard icon={<BarChart3 className="w-4 h-4 text-cyan-400" />} title="원리" delay={0.1}>
            희귀하고 핵심적인 단어의 등장 빈도를 가중치로 계산하는 전통적 검색 기법
          </InfoCard>
          <InfoCard icon={<Database className="w-4 h-4 text-blue-400" />} title="필요 데이터" delay={0.2} accent="blue">
            문서 내 단어 출현 빈도 카운트 행렬
          </InfoCard>
          <InfoCard icon={<Eye className="w-4 h-4 text-violet-400" />} title="실제 사용 예시" delay={0.3} accent="violet">
            위키백과 내부 검색, 전통적인 블로그 키워드 검색
          </InfoCard>
        </div>
      </div>
    </div>
  );
}

function Slide7() {
  return (
    <div className={`w-full h-full flex flex-col ${BG} p-8 sm:p-10 lg:p-14`}>
      <SectionTitle tag="Slide 7 · Word2Vec" title="Algorithm 5: Word2Vec" />
      <div className="flex-1 grid lg:grid-cols-2 gap-6 mt-6">
        <DiagramBox>
          <p className={`text-xs uppercase tracking-wider ${ACCENT_TEXT} mb-4`}>벡터 공간 시각화</p>
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-full max-w-xs h-40">
              {/* Simulated scatter plot */}
              {[
                { x: "15%", y: "20%", label: "King", c: "text-blue-400" },
                { x: "70%", y: "18%", label: "Queen", c: "text-violet-400" },
                { x: "18%", y: "70%", label: "Man", c: "text-cyan-400" },
                { x: "72%", y: "68%", label: "Woman", c: "text-emerald-400" },
              ].map((p) => (
                <div key={p.label} className={`absolute ${p.c} text-xs`} style={{ left: p.x, top: p.y }}>
                  <div className="w-2.5 h-2.5 rounded-full bg-current mb-0.5 mx-auto" />
                  {p.label}
                </div>
              ))}
              {/* Dashed arrows */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 120">
                <line x1="35" y1="30" x2="35" y2="85" stroke="rgba(6,182,212,0.3)" strokeDasharray="4" />
                <line x1="145" y1="28" x2="145" y2="83" stroke="rgba(6,182,212,0.3)" strokeDasharray="4" />
                <line x1="35" y1="30" x2="145" y2="28" stroke="rgba(139,92,246,0.3)" strokeDasharray="4" />
                <line x1="35" y1="85" x2="145" y2="83" stroke="rgba(139,92,246,0.3)" strokeDasharray="4" />
              </svg>
            </div>
            <div className="px-4 py-2 rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs text-center">
              King - Man + Woman = Queen
            </div>
          </div>
        </DiagramBox>
        <div className="flex flex-col gap-4">
          <InfoCard icon={<Layers className="w-4 h-4 text-cyan-400" />} title="원리" delay={0.1}>
            단어를 벡터(좌표)로 변환하여, 단어 간의 수학적 거리와 의미 유사도를 측정
          </InfoCard>
          <InfoCard icon={<Database className="w-4 h-4 text-blue-400" />} title="필요 데이터" delay={0.2} accent="blue">
            방대한 말뭉치(Corpus) 기반의 주변 단어 동시 등장 확률
          </InfoCard>
          <InfoCard icon={<Eye className="w-4 h-4 text-violet-400" />} title="실제 사용 예시" delay={0.3} accent="violet">
            검색어 자동 완성, 연관 검색어 추천 시스템
          </InfoCard>
        </div>
      </div>
    </div>
  );
}

function Slide8() {
  return (
    <div className={`w-full h-full flex flex-col ${BG} p-8 sm:p-10 lg:p-14`}>
      <SectionTitle tag="Slide 8 · SBERT" title="Algorithm 6: Sentence-BERT" />
      <div className="flex-1 grid lg:grid-cols-2 gap-6 mt-6">
        <DiagramBox>
          <p className={`text-xs uppercase tracking-wider ${ACCENT_TEXT} mb-4`}>Transformer 임베딩</p>
          <div className="flex flex-col items-center gap-3 w-full">
            <FlowNode label="입력 문장" sub="&quot;A funny movie about time travel&quot;" color="amber" />
            <ArrowRight className="w-4 h-4 text-cyan-500/40 rotate-90" />
            <div className="w-full max-w-xs px-4 py-3 rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-center">
              <div className="text-cyan-300 text-xs">Transformer Encoder</div>
              <div className="flex justify-center gap-1 mt-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="w-3 h-3 rounded-sm bg-cyan-500/30 border border-cyan-500/40" />
                ))}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Multi-Head Self-Attention</div>
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-500/40 rotate-90" />
            <FlowNode label="문맥 벡터 [768-dim]" color="emerald" />
          </div>
        </DiagramBox>
        <div className="flex flex-col gap-4">
          <InfoCard icon={<Brain className="w-4 h-4 text-cyan-400" />} title="원리" delay={0.1}>
            단어 단위가 아닌 '문장과 문맥 전체'의 의미를 이해하는 딥러닝 임베딩
          </InfoCard>
          <InfoCard icon={<Database className="w-4 h-4 text-blue-400" />} title="필요 데이터" delay={0.2} accent="blue">
            사전 학습된 대규모 언어 모델(LLM)과 파인튜닝용 텍스트
          </InfoCard>
          <InfoCard icon={<Eye className="w-4 h-4 text-violet-400" />} title="실제 사용 예시" delay={0.3} accent="violet">
            구글의 시맨틱 검색, 챗봇의 사용자 의도(Intent) 파악
          </InfoCard>
        </div>
      </div>
    </div>
  );
}

function Slide9() {
  return (
    <div className={`w-full h-full flex flex-col ${BG} p-8 sm:p-10 lg:p-14`}>
      <SectionTitle tag="Slide 9 · Evaluation" title="자체 평가 환경 구축" />
      <div className="flex-1 grid lg:grid-cols-2 gap-6 mt-6">
        <DiagramBox>
          <p className={`text-xs uppercase tracking-wider ${ACCENT_TEXT} mb-4`}>평가 로직 플로우</p>
          <div className="flex flex-col items-center gap-3 w-full">
            <div className="px-3 py-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs text-center">
              <AlertTriangle className="w-3.5 h-3.5 mx-auto mb-1" />
              유저 클릭 로그 부재
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-500/40 rotate-90" />
            <FlowNode label="하드코딩 정답지 구축" sub="Ground Truth Oracle" color="cyan" />
            <ArrowRight className="w-4 h-4 text-cyan-500/40 rotate-90" />
            <div className="grid grid-cols-3 gap-2 w-full max-w-sm">
              <FlowNode label="Precision" sub="정밀도" color="emerald" />
              <FlowNode label="NDCG" sub="순위 품질" color="blue" />
              <FlowNode label="MRR" sub="최초 정답" color="violet" />
            </div>
          </div>
        </DiagramBox>
        <div className="flex flex-col gap-4">
          <InfoCard icon={<AlertTriangle className="w-4 h-4 text-amber-400" />} title="한계" delay={0.1} accent="amber">
            오프라인 환경 특성상 유저 클릭 로그 부재
          </InfoCard>
          <InfoCard icon={<Target className="w-4 h-4 text-cyan-400" />} title="해결 방법" delay={0.2}>
            타겟 장르 및 특정 검색어에 대한 '하드코딩 정답지(Ground Truth)' 구축
          </InfoCard>
          <InfoCard icon={<BarChart3 className="w-4 h-4 text-blue-400" />} title="평가 지표" delay={0.3} accent="blue">
            정밀도(Precision), NDCG(순위 기반 품질), MRR(최초 정답 순위)
          </InfoCard>
        </div>
      </div>
    </div>
  );
}

function Slide10() {
  const data = [
    { name: "CB", precision: 85, diversity: 35, speed: 12 },
    { name: "CF", precision: 72, diversity: 78, speed: 45 },
    { name: "NCF", precision: 68, diversity: 82, speed: 320 },
  ];
  return (
    <div className={`w-full h-full flex flex-col ${BG} p-8 sm:p-10 lg:p-14`}>
      <SectionTitle tag="Slide 10 · Results 1" title="추천 파이프라인 Trade-off 분석" />
      <div className="flex-1 grid lg:grid-cols-2 gap-6 mt-6">
        <DiagramBox>
          <p className={`text-xs uppercase tracking-wider ${ACCENT_TEXT} mb-4`}>비교 차트</p>
          <div className="w-full space-y-4">
            {["정밀도", "다양성", "추론 속도"].map((metric, mi) => (
              <div key={metric}>
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span>{metric}</span>
                </div>
                <div className="flex items-center gap-2">
                  {data.map((d) => {
                    const val = mi === 0 ? d.precision : mi === 1 ? d.diversity : Math.min(100, (d.speed / 320) * 100);
                    const colors = ["bg-cyan-500", "bg-blue-500", "bg-violet-500"];
                    return (
                      <div key={d.name} className="flex-1">
                        <div className="h-6 rounded-md bg-slate-800 overflow-hidden relative">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${val}%` }}
                            transition={{ delay: 0.3 + mi * 0.15, duration: 0.6 }}
                            className={`h-full ${colors[data.indexOf(d)]} rounded-md`}
                          />
                        </div>
                        <div className="text-[10px] text-slate-500 text-center mt-0.5">{d.name}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </DiagramBox>
        <div className="flex flex-col gap-4">
          <InfoCard icon={<Shield className="w-4 h-4 text-cyan-400" />} title="CB의 '필터 버블'" delay={0.1}>
            정밀도는 높으나 다양성이 부족함
          </InfoCard>
          <InfoCard icon={<AlertTriangle className="w-4 h-4 text-amber-400" />} title="NCF의 오버엔지니어링" delay={0.2} accent="amber">
            데이터 희소성 환경에서 연산 비용만 높고 품질은 하락함
          </InfoCard>
          <InfoCard icon={<Lightbulb className="w-4 h-4 text-emerald-400" />} title="인사이트" delay={0.3} accent="emerald">
            데이터 풀에 따른 적절한 모델 선택의 중요성 확인
          </InfoCard>
        </div>
      </div>
    </div>
  );
}

function Slide11() {
  return (
    <div className={`w-full h-full flex flex-col ${BG} p-8 sm:p-10 lg:p-14`}>
      <SectionTitle tag="Slide 11 · Results 2" title="시맨틱 검색 엔진 대조군 분석" />
      <div className="flex-1 grid lg:grid-cols-2 gap-6 mt-6">
        <DiagramBox className="!items-stretch">
          <div className="grid grid-cols-2 gap-4 h-full">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex flex-col">
              <div className="flex items-center gap-1.5 mb-3">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 text-xs">TF-IDF 승리</span>
              </div>
              <div className="text-slate-300 text-xs leading-relaxed flex-1">
                Query: "Inception"
                <br /><br />
                정확히 고유명사 매칭 → <span className="text-emerald-400">정답 1위</span>
              </div>
              <div className="mt-2 text-[10px] text-slate-500">키워드 직관 검색에 강함</div>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex flex-col">
              <div className="flex items-center gap-1.5 mb-3">
                <XCircle className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-400 text-xs">SBERT 편향</span>
              </div>
              <div className="text-slate-300 text-xs leading-relaxed flex-1">
                Query: "Inception"
                <br /><br />
                마이너 영화 추천 → <span className="text-amber-400">대중성 무시</span>
              </div>
              <div className="mt-2 text-[10px] text-slate-500">Obscurity Bias 발견</div>
            </div>
          </div>
        </DiagramBox>
        <div className="flex flex-col gap-4">
          <InfoCard icon={<Microscope className="w-4 h-4 text-amber-400" />} title="SBERT Obscurity Bias" delay={0.1} accent="amber">
            대중성을 배제한 채 수학적 유사도에만 집착한 결과 발견
          </InfoCard>
          <InfoCard icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />} title="레거시의 강점" delay={0.2} accent="emerald">
            고유명사 및 직관적 키워드 검색에서는 오히려 TF-IDF(레거시)가 우세함을 증명
          </InfoCard>
        </div>
      </div>
    </div>
  );
}

function Slide12() {
  return (
    <div className={`w-full h-full flex flex-col ${BG} p-8 sm:p-10 lg:p-14`}>
      <SectionTitle tag="Slide 12 · Future Work" title="정성 평가 (Qualitative UX) 도입" />
      <div className="flex-1 grid lg:grid-cols-2 gap-6 mt-6">
        <DiagramBox>
          <p className={`text-xs uppercase tracking-wider ${ACCENT_TEXT} mb-4`}>A/B 테스트 UI 목업</p>
          <div className="w-full max-w-xs mx-auto space-y-3">
            {/* Mock mobile UI */}
            <div className="rounded-xl border border-slate-600 bg-slate-800/80 p-3">
              <div className="text-xs text-slate-400 mb-2 text-center">블라인드 A/B 테스트</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-cyan-500/10 border border-cyan-500/20 p-3 text-center">
                  <div className="text-cyan-300 text-xs">Option A</div>
                  <div className="text-[10px] text-slate-500 mt-1">알고리즘 ?</div>
                  <div className="mt-2 w-full h-12 rounded bg-slate-700/50 flex items-center justify-center text-slate-500 text-[10px]">영화 포스터</div>
                </div>
                <div className="rounded-lg bg-violet-500/10 border border-violet-500/20 p-3 text-center">
                  <div className="text-violet-300 text-xs">Option B</div>
                  <div className="text-[10px] text-slate-500 mt-1">알고리즘 ?</div>
                  <div className="mt-2 w-full h-12 rounded bg-slate-700/50 flex items-center justify-center text-slate-500 text-[10px]">영화 포스터</div>
                </div>
              </div>
              <div className="mt-2 text-center text-[10px] text-slate-500">어떤 추천이 더 마음에 드시나요?</div>
            </div>
          </div>
        </DiagramBox>
        <div className="flex flex-col gap-4">
          <InfoCard icon={<Lightbulb className="w-4 h-4 text-cyan-400" />} title="발견" delay={0.1}>
            수학적 지표(MRR 1.0)가 사용자 체감 품질(UX)을 보장하지 않음을 확인
          </InfoCard>
          <InfoCard icon={<FlaskConical className="w-4 h-4 text-blue-400" />} title="블라인드 A/B 테스트" delay={0.2} accent="blue">
            알고리즘 스코어 마스킹 후 직관적 선호도 조사 계획
          </InfoCard>
          <InfoCard icon={<Users className="w-4 h-4 text-violet-400" />} title="페르소나 시나리오" delay={0.3} accent="violet">
            특정 유저 상황(Context)에 따른 추천 납득 가능성 평가
          </InfoCard>
        </div>
      </div>
    </div>
  );
}

function Slide13() {
  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-center overflow-hidden ${BG}`}>
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-600/8 blur-[150px]" />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-4xl px-8">
        <div className="text-center mb-10">
          <SlideTag><Combine className="w-3.5 h-3.5" />Slide 13 · Conclusion</SlideTag>
          <h2 className={`${HEADING_TEXT} text-3xl sm:text-4xl lg:text-5xl tracking-tight mt-4 leading-tight`}>
            차세대{" "}
            <span className={`bg-gradient-to-r ${ACCENT} bg-clip-text text-transparent`}>
              Hybrid 아키텍처
            </span>{" "}
            제안
          </h2>
        </div>

        {/* Architecture diagram */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="flex flex-col items-center gap-3">
          <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
            <FlowNode label="TF-IDF (Sparse)" sub="키워드 정밀 매칭" color="amber" />
            <FlowNode label="SBERT (Dense)" sub="문맥 의미 이해" color="violet" />
          </div>
          <ArrowRight className="w-5 h-5 text-cyan-500/40 rotate-90" />
          <div className="px-6 py-3 rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-center">
            <div className="text-cyan-300 text-sm">Hybrid Retrieval</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Sparse + Dense 결합</div>
          </div>
          <ArrowRight className="w-5 h-5 text-cyan-500/40 rotate-90" />
          <div className="px-6 py-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-center">
            <div className="text-emerald-300 text-sm">Business Ranking</div>
            <div className="text-[10px] text-slate-500 mt-0.5">평점 · 투표수 가중치</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-10 grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {[
            "하이브리드 검색 도입",
            "비즈니스 랭킹 로직",
            "레거시 + 딥러닝 결합",
          ].map((t, i) => (
            <div key={t} className="text-center px-3 py-2 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-300 text-xs">
              {t}
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="absolute bottom-8 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-cyan-400">
          <ArrowRight className="w-4 h-4" />
          <span className="text-sm tracking-wider uppercase">Thank You</span>
        </div>
        <p className="text-slate-600 text-xs tracking-[0.25em] uppercase">made by team4</p>
      </motion.div>

      <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-cyan-500/15 rounded-tr-lg" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-blue-500/15 rounded-bl-lg" />
    </div>
  );
}

/* ════════════════ SLIDE DECK CONTROLLER ════════════════ */

const SLIDES = [Slide1, Slide2, Slide3, Slide4, Slide5, Slide6, Slide7, Slide8, Slide9, Slide10, Slide11, Slide12, Slide13];

const SLIDE_LABELS = [
  "Title", "Pipeline", "CB", "CF", "NCF", "TF-IDF", "Word2Vec", "SBERT",
  "Evaluation", "Results 1", "Results 2", "Future", "Conclusion",
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
      {/* Back button */}
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

      {/* Slide container 16:9 */}
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

        {/* Nav arrows */}
        {current > 0 && (
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center shadow-md backdrop-blur-sm transition-all opacity-30 hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {current < totalSlides - 1 && (
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center shadow-md backdrop-blur-sm transition-all opacity-30 hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Counter */}
        <div className="absolute top-4 right-4 z-30 bg-slate-800/70 backdrop-blur-sm text-slate-400 text-xs px-3 py-1.5 rounded-full border border-slate-700/60">
          {current + 1} / {totalSlides}
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="mt-6 flex items-center gap-2 flex-wrap justify-center">
        {SLIDE_LABELS.map((label, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`px-3 py-1.5 rounded-full text-xs transition-all ${
              i === current
                ? `bg-gradient-to-r ${ACCENT} text-white shadow-md shadow-cyan-500/20`
                : "bg-slate-800 text-slate-500 hover:text-slate-300 border border-slate-700 hover:border-cyan-500/30"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="mt-4 text-slate-600 text-xs flex items-center gap-2">
        <Presentation className="w-3.5 h-3.5" />
        좌우 화살표 키 또는 스페이스바로 이동
      </p>
    </div>
  );
}
