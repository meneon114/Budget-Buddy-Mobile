import React, { useState, useEffect, useMemo } from 'react';
import {
  PlusCircle,
  History,
  Settings,
  ChevronRight,
  DollarSign,
  Trash2,
  BarChart3,
  Heart,
  Award,
  Download,
  Candy,
  Coffee,
  Ghost,
  ShieldCheck,
  Zap,
  Activity,
  Home,
  Wallet,
  Utensils,
  PartyPopper,
  Plane,
  ShoppingBag,
  Gift,
  PiggyBank,
  Target,
  Calendar,
  Clock,
  CheckCircle,
  Star,
  Share2,
  RotateCcw,
  Sparkles,
  Github,
  Monitor,
  Smartphone
} from 'lucide-react';

const CATEGORY_ICONS = {
  Meals: Utensils,
  Fun: PartyPopper,
  Travel: Plane,
  Shop: ShoppingBag,
  Health: Activity,
  Gifts: Gift,
  Snacks: Coffee, // Default fallback or extra
  Other: DollarSign
};

const STORAGE_KEY = 'budget_buddy_v18';


const PIXEL_MAPS = {
  cat: [
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1], [1, 1, 2, 0, 0, 0, 0, 0, 0, 2, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1], [1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1], [1, 1, 1, 1, 1, 5, 5, 1, 1, 1, 1, 1], [1, 1, 1, 1, 3, 3, 3, 3, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0], [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0], [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  ],
  dog: [
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0], [2, 2, 0, 1, 1, 1, 1, 1, 1, 0, 2, 2], [2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2], [2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2],
    [2, 2, 1, 0, 0, 1, 1, 0, 0, 1, 2, 2], [2, 2, 1, 0, 0, 1, 1, 0, 0, 1, 2, 2], [2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2], [2, 2, 1, 1, 3, 3, 3, 3, 1, 1, 2, 2],
    [2, 2, 1, 1, 3, 5, 5, 3, 1, 1, 2, 2], [2, 2, 0, 1, 3, 3, 3, 3, 1, 0, 2, 2], [2, 2, 0, 0, 1, 1, 1, 1, 0, 0, 2, 2],
  ],
  rabbit: [
    [0, 0, 1, 2, 0, 0, 0, 0, 1, 2, 0, 0], [0, 1, 3, 2, 0, 0, 0, 0, 1, 3, 2, 0], [0, 1, 3, 2, 0, 0, 0, 0, 1, 3, 2, 0], [0, 1, 3, 2, 0, 0, 0, 0, 1, 3, 2, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1], [1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 5, 5, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  ],
  tombstone: [
    [0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0], [0, 0, 2, 1, 1, 1, 1, 1, 1, 2, 0, 0], [0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0], [0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0],
    [0, 2, 1, 1, 4, 4, 4, 4, 1, 1, 2, 0], [0, 2, 1, 1, 4, 1, 1, 4, 1, 1, 2, 0], [0, 2, 1, 4, 4, 4, 4, 4, 4, 1, 2, 0], [0, 2, 1, 1, 4, 1, 1, 4, 1, 1, 2, 0],
    [0, 2, 1, 1, 4, 4, 4, 4, 1, 1, 2, 0], [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2], [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  ]
};

const THEME_COLORS = {
  rose: { primary: '#fb7185', glow: 'rgba(251, 113, 133, 0.4)', soft: 'rgba(251, 113, 133, 0.1)', muted: 'rgba(251, 113, 133, 0.04)' },
  amber: { primary: '#fbbf24', glow: 'rgba(251, 191, 36, 0.4)', soft: 'rgba(251, 191, 36, 0.1)', muted: 'rgba(251, 191, 36, 0.04)' },
  lime: { primary: '#a3e635', glow: 'rgba(163, 230, 53, 0.4)', soft: 'rgba(163, 230, 53, 0.1)', muted: 'rgba(163, 230, 53, 0.04)' },
  cyan: { primary: '#22d3ee', glow: 'rgba(34, 211, 238, 0.4)', soft: 'rgba(34, 211, 238, 0.1)', muted: 'rgba(34, 211, 238, 0.04)' },
  indigo: { primary: '#818cf8', glow: 'rgba(129, 140, 248, 0.4)', soft: 'rgba(129, 140, 248, 0.1)', muted: 'rgba(129, 140, 248, 0.04)' },
  purple: { primary: '#a78bfa', glow: 'rgba(167, 139, 250, 0.4)', soft: 'rgba(167, 139, 250, 0.1)', muted: 'rgba(167, 139, 250, 0.04)' },
  pink: { primary: '#F473B6', glow: 'rgba(244, 115, 182, 0.4)', soft: 'rgba(244, 115, 182, 0.1)', muted: 'rgba(244, 115, 182, 0.04)' }
};

const DIALOGUES = {
  happy: ["I feel so bouncy!", "You're the best!", "Yay for saving!", "Heart full of life!"],
  worried: ["Is the budget okay?", "I'm a bit nervous...", "Let's be careful...", "Budget is tight...", "Stay strong!"],
  critical: ["S-s-so cold...", "Need warmth...", "Must... save...", "Running... on... empty...", "Budget... f-fading..."],
  passed_out: ["Gone to pixel heaven.", "Rest in Pixels.", "Budget flatline.", "revive me..."],
  heartbroken: ["My poor heart!", "Don't buy it!", "But the savings...", "Is it worth it?", "I'm crying..."]
};

const GlobalStyles = ({ color }) => {
  const theme = THEME_COLORS[color] || THEME_COLORS.purple;
  return (
    <style>{`
      :root {
        --theme-primary: ${theme.primary};
        --theme-glow: ${theme.glow};
        --theme-soft: ${theme.soft};
        --theme-muted: ${theme.muted};
      }
      @keyframes jolly-jump {
        0%, 100% { transform: translateY(0) scale(1); }
        30% { transform: translateY(-8%) scaleX(0.95); }
        50% { transform: translateY(-10%) scaleX(1); }
        80% { transform: translateY(0) scaleX(1.05); }
      }
      @keyframes worried-slow {
        0%, 100% { transform: translateX(-1%) rotate(-2deg); }
        50% { transform: translateX(1%) rotate(2deg); }
      }
      @keyframes cold-shiver {
        0%, 100% { transform: translate(0,0); }
        25% { transform: translate(-0.5px, 0.5px); }
        75% { transform: translate(0.5px, -0.5px); }
      }
      @keyframes snow-fall {
        0% { transform: translateY(-10px) translateX(0); opacity: 0; }
        10% { opacity: 1; }
        100% { transform: translateY(100px) translateX(20px); opacity: 0; }
      }
      @keyframes tear-fall {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(40px); opacity: 0; }
      }
      @keyframes heart-float {
        0% { transform: translateY(0) scale(1); opacity: 0; }
        50% { opacity: 1; }
        100% { transform: translateY(-60px) scale(1.6); opacity: 0; }
      }
      @keyframes pulse-nav {
        0% { transform: scale(0.95); box-shadow: 0 0 0 0 var(--theme-glow); }
        70% { transform: scale(1); box-shadow: 0 0 0 20px rgba(0,0,0,0); }
        100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0,0,0,0); }
      }
      .animate-jolly { animation: jolly-jump 1.8s infinite; }
      .animate-worried { animation: worried-slow 4s ease-in-out infinite; }
      .animate-shiver-cold { animation: cold-shiver 0.2s infinite; }
      .animate-tear { animation: tear-fall 1.5s infinite; }
      .animate-heart { animation: heart-float 2.5s ease-out infinite; }
      .animate-snow { animation: snow-fall 3s linear infinite; }
      .cute-card { background: rgba(20, 18, 48, 0.6); backdrop-filter: blur(32px); border-radius: 2.5rem; border: none; }
      /* Hide scrollbar for Chrome, Safari and Opera */
      *::-webkit-scrollbar { display: none; }
      /* Hide scrollbar for IE, Edge and Firefox */
      * { -ms-overflow-style: none;  scrollbar-width: none; }
      body { 
        background-color: #080717; 
        background-image: radial-gradient(circle at top right, var(--theme-muted), #080717);
        color: #fdf2f8; 
        font-family: 'Inter', sans-serif;
        min-height: 100vh;
        width: 100%;
        overflow-x: hidden;
      }
      #root { min-height: 100vh; width: 100%; }
      .theme-bg { background-color: var(--theme-primary); }
      .theme-text { color: var(--theme-primary); }
      .neon-glow-theme { filter: drop-shadow(0 0 15px var(--theme-glow)); }
      .pulse-button { animation: pulse-nav 2s infinite; }
      svg { shape-rendering: crispEdges; }
      input { border: none !important; outline: none !important; }
      .responsive-text-huge { font-size: clamp(2rem, 10vw, 4rem); }

      /* Desktop Layout - applies at lg breakpoint (1024px+) */
      @media (min-width: 1024px) {
        .desktop-layout {
          display: grid;
          grid-template-columns: 280px 1fr 320px;
          gap: 2rem;
          max-width: 1600px;
          margin: 0 auto;
          padding: 2rem;
          min-height: 100vh;
        }
        .desktop-left-sidebar {
          position: sticky;
          top: 2rem;
          height: fit-content;
          max-height: calc(100vh - 4rem);
          overflow-y: auto;
        }
        .desktop-main-content {
          min-height: calc(100vh - 4rem);
          padding-bottom: 2rem;
        }
        .desktop-right-sidebar {
          position: sticky;
          top: 2rem;
          height: fit-content;
          max-height: calc(100vh - 4rem);
          overflow-y: auto;
        }
        .desktop-nav-sidebar {
          position: fixed;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 70px;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(24px);
          border-radius: 0 2rem 2rem 0;
          padding: 1.5rem 0.75rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          z-index: 200;
          border: 1px solid rgba(255,255,255,0.1);
          border-left: none;
        }
        .desktop-nav-sidebar button {
          width: 48px;
          height: 48px;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .desktop-nav-sidebar button:hover:not(.desktop-fab) {
          background: rgba(255,255,255,0.05);
        }
        .desktop-nav-sidebar .nav-active {
          color: var(--theme-primary);
          filter: drop-shadow(0 0 8px var(--theme-glow));
        }
        .desktop-fab {
          width: 56px !important;
          height: 56px !important;
          margin: 0.5rem 0;
          animation: pulse-nav 2s infinite;
        }
        .desktop-fab:hover {
          filter: brightness(1.1);
        }
        .mobile-only {
          display: none !important;
        }
        .desktop-only {
          display: block !important;
        }
        /* Adjust main container for desktop */
        .desktop-layout .cute-card {
          border-radius: 1.5rem;
        }
      }

      /* Mobile-first: hide desktop elements by default */
      .desktop-only {
        display: none;
      }
      /* Ensure mobile-only elements display on mobile (they use flex) */
      .mobile-only {
        display: flex;
      }
    `}</style>
  );
};



const PixelPet = ({ type, color, accessory, mood, isAdding, showHearts = false }) => {
  const baseColors = {
    rose: { 1: '#fb7185', 2: '#e11d48', 3: '#ffe4e6', 5: '#881337' },
    amber: { 1: '#fbbf24', 2: '#b45309', 3: '#fef3c7', 5: '#fb7185' },
    lime: { 1: '#a3e635', 2: '#4d7c0f', 3: '#ecfccb', 5: '#fb7185' },
    cyan: { 1: '#22d3ee', 2: '#0891b2', 3: '#cffafe', 5: '#fb7185' },
    indigo: { 1: '#818cf8', 2: '#4f46e5', 3: '#e0e7ff', 5: '#fb7185' },
    purple: { 1: '#a78bfa', 2: '#7c3aed', 3: '#ede9fe', 5: '#fb7185' },
    pink: { 1: '#F473B6', 2: '#DB2777', 3: '#FDF2F8', 5: '#fb7185' }
  };

  const palette = { ...(baseColors[color] || baseColors.purple), 4: '#1e1b4b' };
  const pixelSize = 10;
  const isDead = mood === 'passed_out';
  const isCritical = mood === 'critical';
  const isWorried = mood === 'worried';

  const eyeConfigs = {
    cat: [{ x: 20, y: 40 }, { x: 80, y: 40 }],
    dog: [{ x: 30, y: 40 }, { x: 70, y: 40 }],
    rabbit: [{ x: 20, y: 60 }, { x: 80, y: 60 }]
  };
  const currentEyes = eyeConfigs[type] || [];
  const map = isDead ? PIXEL_MAPS.tombstone : (PIXEL_MAPS[type] || PIXEL_MAPS.cat);

  const getMotionClass = () => {
    if (isDead) return "";
    if (isAdding) return "animate-worried";
    if (isCritical) return "animate-shiver-cold";
    if (isWorried) return "animate-worried";
    return "animate-jolly";
  };

  const petFilter = isDead ? 'grayscale(0.5) brightness(0.6)' : (isCritical ? 'grayscale(0.8) brightness(1.4)' : 'none');

  const currentDialogue = useMemo(() => {
    const list = isAdding ? DIALOGUES.heartbroken : (DIALOGUES[mood] || DIALOGUES.happy);
    return list[Math.floor(Math.random() * list.length)];
  }, [mood, isAdding]);

  return (
    <div className="relative flex flex-col items-center w-full max-w-[200px] mx-auto" >
      <div className={`relative flex items-center justify-center w-full aspect-square transition-all duration-1000 ${getMotionClass()}`}>


        {isCritical && (
          <div className="absolute inset-0 pointer-events-none z-20 overflow-visible text-white">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="absolute w-1 h-1 bg-white rounded-full animate-snow opacity-80"
                style={{
                  top: `${Math.random() * -20}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }} />
            ))}
          </div>
        )}

        {!isDead && showHearts && (
          <div className="absolute inset-0 pointer-events-none z-20">
            <div className="absolute -top-[10%] left-[15%] theme-text animate-heart"><Heart size={24} fill="currentColor" stroke="none" /></div>
            <div className="absolute -top-[15%] right-[20%] theme-text opacity-70 animate-heart" style={{ animationDelay: '1s' }}><Heart size={18} fill="currentColor" stroke="none" /></div>
          </div>
        )}

        <svg width="100%" height="100%" viewBox="0 0 120 120" className="overflow-visible neon-glow-theme" style={{ filter: petFilter }}>
          {map.map((row, y) => row.map((pixel, x) => {
            if (pixel === 0) return null;
            let pixelColor = palette[pixel];
            if (isDead) {
              if (pixel === 1) pixelColor = '#475569';
              if (pixel === 2) pixelColor = '#64748b';
              if (pixel === 4) pixelColor = 'var(--theme-primary)';
            }
            return <rect key={`${x}-${y}`} x={x * pixelSize} y={y * pixelSize} width={pixelSize} height={pixelSize} fill={pixelColor} stroke="none" />;
          }))}
          {!isDead && currentEyes.map((pos, i) => {
            const isStress = isCritical || isWorried;
            const tearY = pos.y + 18;

            return (
              <g key={i}>
                <g transform={`translate(${pos.x}, ${pos.y})`}>
                  <rect x="0" y="0" width="20" height="20" fill="white" stroke="none" />
                  <rect
                    x={isStress ? 6 : 2}
                    y={isStress ? 8 : 4}
                    width={isStress ? 8 : 16}
                    height={isStress ? 8 : 16}
                    fill={palette[4]}
                    stroke="none"
                    className="transition-all duration-500"
                  />
                  <rect x="12" y="4" width={isStress ? 4 : 6} height={isStress ? 4 : 6} fill="white" opacity="0.3" stroke="none" />

                  {isAdding && <rect x="5" y="12" width="10" height="4" fill="#60a5fa" opacity="0.8" stroke="none" />}
                </g>

                {isAdding && (
                  <g transform={`translate(${pos.x + 6}, ${tearY})`}>
                    <rect x="0" y="0" width="8" height="8" fill="#60a5fa" className="animate-tear" stroke="none" />
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-4 text-center w-full min-h-[1.5em] px-4">
        <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-white opacity-80">
          {currentDialogue}
        </p>
      </div>
    </div >
  );
};

const StreakGraph = ({ streakData }) => {
  const stats = useMemo(() => {
    const dates = Object.keys(streakData).sort();
    const todayStr = new Date().toISOString().split('T')[0];

    let current = 0;
    let checkDate = new Date();
    while (true) {
      const dStr = checkDate.toISOString().split('T')[0];
      if (streakData[dStr]) {
        current++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        if (dStr !== todayStr) break;
        checkDate.setDate(checkDate.getDate() - 1);
      }
      if (current > 365) break;
    }

    let longest = 0;
    let currRun = 0;
    let prevDate = null;

    if (dates.length > 0) {
      for (const dStr of dates) {
        if (!streakData[dStr]) {
          currRun = 0;
          continue;
        }

        const thisDate = new Date(dStr);
        if (prevDate) {
          const diffTime = Math.abs(thisDate - prevDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            currRun++;
          } else {
            currRun = 1;
          }
        } else {
          currRun = 1;
        }
        prevDate = thisDate;
        if (currRun > longest) longest = currRun;
      }
    }

    const total = Object.values(streakData).filter(Boolean).length;

    return { current, longest: Math.max(current, longest), total };
  }, [streakData]);

  const days = Array.from({ length: 90 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (89 - i));
    const dateStr = d.toISOString().split('T')[0];
    const status = streakData[dateStr];
    return { level: status === undefined ? 0 : status ? 2 : 1, date: dateStr };
  });

  return (
    <div className="w-full">
      {/* Stats Row */}
      <div className="flex justify-between gap-2 mb-6">
        <div className="flex-1 bg-indigo-950/30 p-3 rounded-2xl border border-indigo-500/10 flex flex-col items-center">
          <span className="text-xl mb-1 animate-pulse">🔥</span>
          <span className="text-2xl font-black text-white font-mono leading-none">{stats.current}</span>
          <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mt-1">Current</span>
        </div>
        <div className="flex-1 bg-indigo-950/30 p-3 rounded-2xl border border-indigo-500/10 flex flex-col items-center">
          <span className="text-xl mb-1 text-yellow-400">🏆</span>
          <span className="text-2xl font-black text-white font-mono leading-none">{stats.longest}</span>
          <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mt-1">Longest</span>
        </div>
        <div className="flex-1 bg-indigo-950/30 p-3 rounded-2xl border border-indigo-500/10 flex flex-col items-center">
          <span className="text-xl mb-1 text-emerald-400">⭐</span>
          <span className="text-2xl font-black text-white font-mono leading-none">{stats.total}</span>
          <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mt-1">Total Saved</span>
        </div>
      </div>

      {/* Heatmap */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(10px,1fr))] gap-1.5 overflow-hidden">
        {days.map((day, i) => (
          <div
            key={i}
            title={day.date}
            className={`aspect-square rounded-[2px] transition-all duration-500 ${day.level === 2 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] scale-100' :
              day.level === 1 ? 'bg-rose-950/50 border border-rose-500/20 scale-90' :
                'bg-indigo-950/20 scale-75'
              }`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-4 opacity-50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-[1px] bg-emerald-500 shadow-[0_0_5px_#10b981]" />
          <span className="text-[8px] font-black uppercase tracking-widest text-indigo-300">Saved</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-[1px] bg-rose-900 border border-rose-500/30" />
          <span className="text-[8px] font-black uppercase tracking-widest text-indigo-300">Missed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-[1px] bg-indigo-950/30" />
          <span className="text-[8px] font-black uppercase tracking-widest text-indigo-300">Empty</span>
        </div>
      </div>
    </div>
  );
};

const OnboardingView = ({ user, setUser, handleNumericInput, onComplete, isEditing = false }) => (
  <div className="w-full flex-1 flex flex-col pt-10 pb-32">
    <div className="flex-1 flex flex-col justify-center gap-4">
      <div className="flex justify-center scale-[0.8] mb-[-20px]">
        <PixelPet type={user.petType} color={user.petColor} accessory={user.petAccessory} mood="happy" isAdding={false} />
      </div>

      <div className="cute-card p-5 sm:p-6 shadow-2xl w-full max-w-sm mx-auto space-y-4">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">{isEditing ? "Update Profile" : "Budget Buddy"}</h1>
          <p className="text-indigo-400 text-[9px] font-bold uppercase tracking-[0.3em]">Adopt your Savings Buddy</p>
        </div>

        <div className="space-y-3">
          <div className="bg-indigo-950/30 rounded-xl p-3 border border-white/5">
            <label className="text-[9px] font-black theme-text uppercase tracking-widest mb-1 block">Your Name</label>
            <input type="text" required placeholder="ALEX" className="bg-transparent w-full text-white placeholder:text-indigo-900/50 outline-none font-bold uppercase text-sm" value={user.name} onChange={e => setUser({ ...user, name: e.target.value.toUpperCase() })} />
          </div>

          <div className="bg-indigo-950/30 rounded-xl p-3 border border-white/5">
            <label className="text-[9px] font-black theme-text uppercase tracking-widest mb-1 block">Monthly Income</label>
            <input type="text" inputMode="decimal" required placeholder="25000" className="bg-transparent w-full text-white placeholder:text-indigo-900/50 outline-none font-bold text-sm" value={user.income} onChange={e => handleNumericInput(e.target.value, setUser, 'income')} />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex bg-indigo-950/20 rounded-xl p-1 gap-1">
              {['cat', 'dog', 'rabbit'].map(t => (<button key={t} type="button" onClick={() => setUser({ ...user, petType: t })} className={`flex-1 py-2 rounded-lg font-black text-[9px] uppercase transition-all ${user.petType === t ? 'theme-bg text-white shadow-lg' : 'text-indigo-400 hover:bg-white/5'}`}>{t}</button>))}
            </div>
            <div className="flex justify-between px-2">
              {['rose', 'amber', 'lime', 'cyan', 'indigo', 'purple', 'pink'].map(c => (<button key={c} type="button" onClick={() => setUser({ ...user, petColor: c })} className={`w-6 h-6 rounded-full border-2 transition-all ${user.petColor === c ? 'border-white scale-110 shadow-[0_0_10px_var(--theme-glow)]' : 'border-transparent opacity-30 hover:opacity-100'}`} style={{ backgroundColor: THEME_COLORS[c].primary }} />))}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Button Island (Now Static) */}
    <div className="mt-8 px-4 w-full max-w-sm mx-auto z-50">
      <button
        onClick={onComplete}
        disabled={!user.name || !user.income}
        className="w-full py-4 theme-bg text-white font-black rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/10 uppercase tracking-[0.2em] text-xs hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
      >
        {isEditing ? "Save Changes" : "Start Budgeting"} <ChevronRight size={16} />
      </button>
    </div>
  </div>
);


const TutorialPopup = ({ onComplete, user }) => {
  const [step, setStep] = useState(0);
  const slides = [
    {
      mood: 'happy',
      title: `Welcome, ${user.name}!`,
      desc: "Meet your new pixel companion. It lives in your wallet and reacts to your spending habits!"
    },
    {
      mood: 'happy',
      title: "Daily Budget Power",
      desc: "You get a fixed daily allowance based on your income. Spend wisely to keep the power up!"
    },
    {
      mood: 'worried',
      title: "Keep it Happy",
      desc: "If you run out of daily budget, your buddy will pass out! Save money to keep them happy."
    },
    {
      mood: 'happy',
      title: "Build Streaks",
      desc: "Every day you stay within budget adds to your streak. How long can you keep it going?"
    }
  ];

  const nextStep = () => {
    if (step < slides.length - 1) setStep(step + 1);
    else onComplete();
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0c0a1f]/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-sm px-6 flex-1 flex flex-col justify-center">
        <div key={step} className="animate-in zoom-in-95 fade-in duration-300 text-center">
          <div className="h-28 flex items-center justify-center mb-8 relative">
            <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full scale-150 animate-pulse" />
            {step === 0 && <Star size={80} className="text-yellow-400 relative z-10 animate-jolly" />}
            {step === 1 && <Zap size={80} className="text-cyan-400 relative z-10 animate-jolly" />}
            {step === 2 && <Heart size={80} className="text-rose-400 relative z-10 animate-heart" />}
            {step === 3 && <Award size={80} className="text-emerald-400 relative z-10 animate-jolly" />}
          </div>

          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 leading-none">{slides[step].title}</h2>
          <div className="bg-indigo-950/30 rounded-2xl p-6 border border-white/5">
            <p className="text-indigo-200 text-sm font-medium leading-relaxed">{slides[step].desc}</p>
          </div>
        </div>

        <div className="flex gap-2 justify-center mt-8">
          {slides.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'bg-white w-8' : 'bg-white/20 w-2'}`} />
          ))}
        </div>
      </div>

      <div className="fixed bottom-6 left-0 right-0 px-4 z-50">
        <div className="max-w-md mx-auto flex flex-col gap-3">
          <button onClick={nextStep} className="w-full py-4 theme-bg text-white font-black rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10 active:scale-95 transition-all text-xs uppercase tracking-[0.2em] hover:brightness-110 flex items-center justify-center gap-2">
            {step === slides.length - 1 ? "Let's Start!" : "Next"} <ChevronRight size={14} />
          </button>
          <button onClick={onComplete} className="text-[10px] font-black text-indigo-400/50 uppercase tracking-widest hover:text-white transition-colors py-2">
            Skip Tutorial
          </button>
        </div>
      </div>
    </div>
  );
};



const SavingsView = ({ targets, setTargets, handleNumericInput, activeId, setActiveId }) => {
  const [addingFundsTo, setAddingFundsTo] = useState(null); // ID of target being funded

  const addFunds = (id, amount) => {
    setTargets(targets.map(t => t.id === id ? { ...t, current: t.current + parseFloat(amount) } : t));
    setAddingFundsTo(null);
  };

  // Sort targets: active first, then incomplete goals, then completed
  const sortedTargets = [...targets].sort((a, b) => {
    if (a.id === activeId) return -1;
    if (b.id === activeId) return 1;
    const aComplete = a.current >= a.target;
    const bComplete = b.current >= b.target;
    if (aComplete && !bComplete) return 1;
    if (!aComplete && bComplete) return -1;
    return 0;
  });

  return (
    <div className="w-full flex flex-col pt-0 animate-in fade-in">
      <h2 className="text-2xl sm:text-3xl font-black text-white mb-6 tracking-tighter uppercase px-2 text-center">Savings Goals</h2>

      <div className="w-full space-y-4 pb-10">
        {sortedTargets.filter(t => t.id !== 'future-fund' && t.target !== Infinity && isFinite(t.target)).map(t => {
          const isCompleted = t.current >= t.target;

          return (
            <div key={t.id} className={`cute-card p-6 shadow-lg relative overflow-hidden ${isCompleted ? 'ring-2 ring-emerald-500/30 bg-emerald-950/10' : ''}`}>
              {isCompleted && (
                <div className="absolute top-3 right-3">
                  <CheckCircle size={20} className="text-emerald-400" />
                </div>
              )}
              <div className="flex justify-between items-end mb-2">
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                    {t.name}
                    {activeId === t.id && <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1"><Target size={10} /> ACTIVE</span>}
                    {isCompleted && <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">COMPLETED</span>}
                  </h3>
                  <p className="text-[10px] font-bold theme-text uppercase tracking-widest">
                    Target: ৳{t.target.toLocaleString()} • {t.days || 30} days • ৳{Math.round((t.target - t.current) / (t.days || 30))}/day
                  </p>
                </div>
                <p className="text-xl font-black text-white font-mono">৳{t.current.toLocaleString()}</p>
              </div>
              <div className="w-full bg-black/40 h-3 rounded-full overflow-hidden shadow-inner mb-4">
                <div className={`h-full transition-all duration-1000 ${isCompleted ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'theme-bg shadow-[0_0_15px_var(--theme-glow)]'}`} style={{ width: `${Math.min((t.current / t.target) * 100, 100)}%` }} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setAddingFundsTo(t.id)} className="flex-1 py-2 bg-indigo-950/40 text-indigo-300 font-black rounded-xl text-[9px] uppercase tracking-widest hover:text-white transition-colors border-none">
                  + Add Funds
                </button>
                <button onClick={() => setActiveId(t.id)} className={`p-2 rounded-xl transition-colors ${activeId === t.id ? 'theme-bg text-white shadow-lg' : 'text-indigo-500 hover:text-white hover:bg-indigo-950/40'}`} title="Set as Active Goal">
                  <Target size={16} />
                </button>
                <button onClick={() => setTargets(targets.filter(x => x.id !== t.id))} className="p-2 text-rose-500 hover:bg-rose-950/20 rounded-xl transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}

        {targets.filter(t => t.id !== 'future-fund' && t.target !== Infinity && isFinite(t.target)).length === 0 && (
          <div className="text-center opacity-40 py-10">
            <PiggyBank size={64} className="mx-auto mb-4 animate-bounce" />
            <p className="font-black uppercase text-[10px] tracking-[0.4em]">No Goals Yet</p>
          </div>
        )}
      </div>




      {
        addingFundsTo && (
          <AddFundsPopup
            targetName={targets.find(t => t.id === addingFundsTo)?.name}
            onConfirm={(amount) => addFunds(addingFundsTo, amount)}
            onCancel={() => setAddingFundsTo(null)}
            handleNumericInput={handleNumericInput}
          />
        )
      }
    </div >
  );
};



const ResetConfirmPopup = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-[#0c0a1f]/60 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="w-full max-w-xs bg-[#0c0a1f] border border-rose-500/30 p-8 rounded-[2rem] shadow-2xl text-center relative overflow-hidden animate-in zoom-in-95 duration-200">
      <div className="flex justify-center mb-6 text-rose-500 animate-pulse">
        <Ghost size={48} />
      </div>
      <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Reset App?</h3>
      <p className="text-rose-200/70 text-[10px] font-bold leading-relaxed mb-8">
        This will delete all your data, pet, and history. There is no undo button!
      </p>
      <div className="space-y-3">
        <button onClick={onConfirm} className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-2xl shadow-lg border-none active:scale-95 transition-all text-xs uppercase tracking-widest">
          Yes, Delete Everything
        </button>
        <button onClick={onCancel} className="w-full py-4 bg-transparent text-indigo-300 font-black rounded-2xl border border-indigo-500/20 active:scale-95 transition-all text-[10px] uppercase tracking-widest hover:bg-indigo-900/20 hover:text-white">
          Cancel
        </button>
      </div>
    </div>
  </div>
);

const AddBillPopup = ({ onAdd, onCancel, handleNumericInput }) => {
  const [newDue, setNewDue] = useState({ name: '', amount: '', day: '1' });
  const [showCalendar, setShowCalendar] = useState(false);

  const handleSubmit = () => {
    if (newDue.name && newDue.amount && newDue.day) {
      onAdd({ ...newDue, amount: parseFloat(newDue.amount) });
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-[#0c0a1f]/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-xs bg-[#0c0a1f] border border-indigo-500/30 p-6 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden animate-in zoom-in-95 duration-300">
        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6 text-center">Add Monthly Bill</h3>

        <div className="space-y-3 mb-6">
          <div className="bg-indigo-950/30 rounded-xl p-3 border border-white/5">
            <label className="text-[9px] font-black theme-text uppercase tracking-widest mb-1 block">Bill Name</label>
            <input type="text" autoFocus placeholder="e.g. Rent" className="bg-transparent w-full text-white placeholder:text-indigo-900/50 outline-none font-bold text-sm" value={newDue.name} onChange={e => setNewDue({ ...newDue, name: e.target.value })} />
          </div>

          <div className="flex gap-3">
            <div className="bg-indigo-950/30 rounded-xl p-3 border border-white/5 w-1/2">
              <label className="text-[9px] font-black theme-text uppercase tracking-widest mb-1 block">Amount</label>
              <input type="text" inputMode="decimal" placeholder="0" className="bg-transparent w-full text-white placeholder:text-indigo-900/50 outline-none font-bold text-sm" value={newDue.amount} onChange={e => handleNumericInput(e.target.value, (val) => setNewDue(prev => ({ ...prev, amount: val })))} />
            </div>
            <button onClick={() => setShowCalendar(true)} className="bg-indigo-950/30 rounded-xl p-3 border border-white/5 w-1/2 text-left hover:bg-white/5 transition-colors">
              <label className="text-[9px] font-black theme-text uppercase tracking-widest mb-1 block">Due Day</label>
              <div className="flex items-center justify-between">
                <span className="font-black text-white text-sm">{newDue.day}</span>
                <Calendar size={14} className="text-indigo-400" />
              </div>
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 bg-indigo-950/30 text-indigo-400 font-black rounded-xl text-[10px] uppercase tracking-widest hover:text-white transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={!newDue.name || !newDue.amount || !newDue.day} className="flex-[2] py-3 theme-bg text-white font-black rounded-xl text-[10px] uppercase tracking-widest shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none">Add Bill</button>
        </div>

        {showCalendar && (
          <CalendarPopup
            selectedDay={newDue.day}
            onSelect={(day) => { setNewDue((prev) => ({ ...prev, day: day.toString() })); setShowCalendar(false); }}
            onClose={() => setShowCalendar(false)}
          />
        )}
      </div>
    </div>
  );
}

const AddFundsPopup = ({ targetName, onConfirm, onCancel, handleNumericInput }) => {
  const [amount, setAmount] = useState('');
  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-[#0c0a1f]/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-xs bg-[#0c0a1f] border border-emerald-500/30 p-8 rounded-[2rem] shadow-2xl text-center relative overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="flex justify-center mb-6 text-emerald-400 animate-bounce">
          <PiggyBank size={48} />
        </div>
        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Add Funds</h3>
        <p className="text-emerald-200/70 text-[10px] font-bold uppercase tracking-widest mb-6">to {targetName}</p>

        <div className="bg-emerald-950/30 rounded-2xl p-4 mb-6 ring-1 ring-emerald-500/20">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl font-black text-emerald-400 font-mono">৳</span>
            <input
              type="text"
              inputMode="decimal"
              autoFocus
              placeholder="0"
              className="bg-transparent w-full text-white placeholder:text-emerald-900/50 outline-none font-bold text-2xl font-mono text-center"
              value={amount}
              onChange={e => handleNumericInput(e.target.value, setAmount)}
            />
          </div>
        </div>

        <div className="space-y-3">
          <button onClick={() => amount && onConfirm(amount)} disabled={!amount} className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl shadow-lg border-none active:scale-95 transition-all text-xs uppercase tracking-widest disabled:opacity-50 disabled:pointer-events-none">
            Confirm Deposit
          </button>
          <button onClick={onCancel} className="w-full py-4 bg-transparent text-emerald-300 font-black rounded-2xl border border-emerald-500/20 active:scale-95 transition-all text-[10px] uppercase tracking-widest hover:bg-emerald-900/20 hover:text-white">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const RecurringExpensesView = ({ dues, setDues, onComplete, handleNumericInput }) => {
  const [isAdding, setIsAdding] = useState(false);

  const addDue = (newDetails) => {
    setDues([...dues, { id: Date.now(), ...newDetails }]);
    setIsAdding(false);
  };

  const removeDue = (id) => setDues(dues.filter(d => d.id !== id));

  return (
    <div className="w-full flex-1 flex flex-col pt-10 pb-32">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Monthly Dues</h2>
        <p className="text-indigo-400 text-[9px] font-bold uppercase tracking-widest">Rent, Internet, Subscriptions</p>
      </div>

      <div className="flex-1 w-full space-y-2 pb-10">
        <button onClick={() => setIsAdding(true)} className="w-full py-3 border-2 border-dashed border-indigo-500/30 rounded-xl text-indigo-400 font-black text-[10px] uppercase tracking-widest hover:border-indigo-400 hover:text-white transition-all flex items-center justify-center gap-2 mb-4 group animate-in fade-in zoom-in-95">
          <PlusCircle size={16} className="group-hover:scale-110 transition-transform" /> Add New Bill
        </button>

        {dues.map(d => (
          <div key={d.id} className="bg-[#1e1b4b]/40 hover:bg-[#1e1b4b]/60 transition-colors backdrop-blur-md p-3 rounded-xl flex justify-between items-center border border-indigo-500/10 group animate-in slide-in-from-bottom-2 fade-in fill-mode-both">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Calendar size={14} />
              </div>
              <div>
                <p className="font-black text-white text-xs uppercase tracking-wide">{d.name}</p>
                <p className="text-[9px] text-indigo-300 font-bold uppercase tracking-widest opacity-60">Day {d.day}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono font-black text-white text-sm">৳{d.amount.toLocaleString()}</span>
              <button onClick={() => removeDue(d.id)} className="text-indigo-500/50 hover:text-rose-500 p-2 transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {dues.length === 0 && <div className="text-center opacity-30 py-8"><Clock size={48} className="mx-auto mb-2" /><p className="text-[10px] font-black uppercase tracking-widest">No recurring bills added</p></div>}
      </div>

      <div className="fixed bottom-6 left-0 right-0 px-4 z-50">
        <div className="max-w-md mx-auto">
          <button
            onClick={onComplete}
            className="w-full py-4 theme-bg text-white font-black rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/10 uppercase tracking-[0.2em] text-xs hover:brightness-110 active:scale-95 transition-all text-center"
          >
            {dues.length > 0 ? "All Set!" : "Skip for Now"}
          </button>
        </div>
      </div>

      {isAdding && (
        <AddBillPopup onAdd={addDue} onCancel={() => setIsAdding(false)} handleNumericInput={handleNumericInput} />
      )}
    </div>
  );
};

const MealTrackerView = ({ mealTracker = { balance: 0, mealLog: [] }, setMealTracker, mealCost = 50 }) => {
  const MEAL_COST = mealCost;
  const todayStr = new Date().toISOString().split('T')[0];
  const [fundAmount, setFundAmount] = useState('');
  const [showAddFunds, setShowAddFunds] = useState(false);

  // Get today's meals
  const todayEntry = (mealTracker.mealLog || []).find(m => m.date === todayStr && (!m.type || m.type === 'meal'));
  const todayMeals = todayEntry ? todayEntry.count : 0;

  // Remaining meals calculation (can be negative)
  const remainingMeals = Math.floor(mealTracker.balance / MEAL_COST);
  const isLowBalance = mealTracker.balance < (MEAL_COST * 4);
  const isNegative = mealTracker.balance < 0;

  // Add meals for today (allow even if negative)
  const addMeals = (count) => {
    const cost = count * MEAL_COST;
    setMealTracker(prev => {
      const logs = prev.mealLog || [];
      const existingEntry = logs.find(m => m.date === todayStr && (!m.type || m.type === 'meal'));
      let newLog;
      if (existingEntry) {
        newLog = logs.map(m => (m.date === todayStr && (!m.type || m.type === 'meal')) ? { ...m, count: m.count + count } : m);
      } else {
        newLog = [...logs, { date: todayStr, count, type: 'meal' }];
      }
      return { balance: prev.balance - cost, mealLog: newLog };
    });
  };

  // Add funds
  const handleAddFunds = () => {
    const amount = parseFloat(fundAmount);
    if (isNaN(amount) || amount <= 0) return;
    setMealTracker(prev => ({
      ...prev,
      balance: prev.balance + amount,
      mealLog: [...(prev.mealLog || []), { id: Date.now(), date: new Date().toISOString(), amount, type: 'deposit' }]
    }));
    setFundAmount('');
    setShowAddFunds(false);
  };

  return (
    <div className="w-full flex flex-col pt-0 animate-in fade-in pb-20">
      <h2 className="text-2xl sm:text-3xl font-black text-white mb-6 tracking-tighter uppercase px-2 text-center">Meal Tracker</h2>

      {/* Balance Card */}
      <div className={`cute-card p-6 shadow-2xl mb-6 relative overflow-hidden ${isNegative ? 'ring-2 ring-rose-500' : isLowBalance ? 'ring-2 ring-amber-500/50' : ''}`}>
        <div className="absolute -top-10 -right-10 opacity-5 rotate-12">
          <Utensils size={160} />
        </div>

        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Prepaid Balance</p>
            <h3 className={`text-4xl font-black font-mono ${isNegative ? 'text-rose-400' : 'text-white'}`}>৳{mealTracker.balance}</h3>
          </div>
          <div className={`text-right ${isNegative ? 'text-rose-400' : isLowBalance ? 'text-amber-400' : 'text-emerald-400'}`}>
            <p className="text-[9px] font-black uppercase tracking-widest mb-1">{isNegative ? 'Due' : 'Meals Left'}</p>
            <p className="text-3xl font-black font-mono">{isNegative ? Math.abs(remainingMeals) : remainingMeals}</p>
          </div>
        </div>

        {(isLowBalance || isNegative) && (
          <div className={`${isNegative ? 'bg-rose-500/20 border-rose-500/30' : 'bg-amber-500/20 border-amber-500/30'} border rounded-xl p-3 mb-4 flex items-center gap-2`}>
            <div className={`w-2 h-2 rounded-full ${isNegative ? 'bg-rose-500' : 'bg-amber-500'} animate-pulse`} />
            <p className={`text-[10px] font-black uppercase tracking-widest ${isNegative ? 'text-rose-300' : 'text-amber-300'}`}>
              {isNegative ? 'You owe the catering service!' : 'Low Balance - Time to top up!'}
            </p>
          </div>
        )}

        {showAddFunds ? (
          <div className="flex gap-2">
            <input
              type="number"
              value={fundAmount}
              onChange={(e) => setFundAmount(e.target.value)}
              placeholder="Amount"
              className="flex-1 py-3 px-4 bg-black/40 rounded-xl text-white font-mono text-center border border-indigo-500/30 focus:border-emerald-500 outline-none"
            />
            <button
              onClick={handleAddFunds}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-xl text-[10px] uppercase tracking-widest shadow-lg transition-all active:scale-95"
            >
              Add
            </button>
            <button
              onClick={() => { setShowAddFunds(false); setFundAmount(''); }}
              className="px-4 py-3 bg-indigo-950/50 text-indigo-300 font-black rounded-xl text-[10px] uppercase tracking-widest transition-all"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAddFunds(true)}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-xl text-[10px] uppercase tracking-widest shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <PlusCircle size={16} /> Add Funds
          </button>
        )}
      </div>

      {/* Today's Meals */}
      <div className="cute-card p-6 shadow-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-[10px] font-black theme-text uppercase tracking-widest">Today's Meals</p>
          <div className="flex items-center gap-2 bg-indigo-950/40 px-3 py-1 rounded-full">
            <Utensils size={14} className="text-indigo-400" />
            <span className="text-lg font-black text-white font-mono">{todayMeals}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => addMeals(1)}
            className="py-4 bg-indigo-950/30 hover:bg-indigo-900/40 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all active:scale-95 flex flex-col items-center gap-1"
          >
            <span className="text-2xl">🍽️</span>
            +1 Meal
            <span className="text-[8px] text-indigo-400">-৳{MEAL_COST}</span>
          </button>
          <button
            onClick={() => addMeals(2)}
            className="py-4 bg-indigo-950/30 hover:bg-indigo-900/40 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all active:scale-95 flex flex-col items-center gap-1"
          >
            <span className="text-2xl">🍽️🍽️</span>
            +2 Meals
            <span className="text-[8px] text-indigo-400">-৳{MEAL_COST * 2}</span>
          </button>
        </div>
      </div>

      {/* Meal History - Full Log */}
      <div className="cute-card p-6 shadow-lg">
        <p className="text-[10px] font-black theme-text uppercase tracking-widest mb-4">Meal History</p>
        <div className="max-h-64 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-indigo-500/20">
          {mealTracker.mealLog.length === 0 ? (
            <p className="text-center text-[10px] text-indigo-500/50 font-black uppercase py-4">No meals logged yet</p>
          ) : (
            [...mealTracker.mealLog]
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((entry) => {
                const d = new Date(entry.date);
                const isToday = entry.date.startsWith(todayStr); // Adjusted for ISO string

                if (entry.type === 'deposit') {
                  return (
                    <div key={entry.id || entry.date} className={`flex justify-between items-center p-3 rounded-xl ${isToday ? 'bg-emerald-950/20 border border-emerald-500/20' : 'bg-emerald-950/10'}`}>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-emerald-400 w-10">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                        <span className="text-[9px] text-emerald-300/50 font-mono">{d.toISOString().slice(5, 10)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm">💰</span>
                        <span className="text-xs font-black text-emerald-300">+৳{entry.amount}</span>
                        <button
                          onClick={() => {
                            setMealTracker(prev => ({
                              ...prev,
                              balance: prev.balance - entry.amount,
                              mealLog: prev.mealLog.filter(m => m.id !== entry.id)
                            }));
                          }}
                          className="p-1.5 text-emerald-500/50 hover:text-rose-400 transition-colors"
                          title="Remove deposit"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={entry.date} className={`flex justify-between items-center p-3 rounded-xl ${isToday ? 'bg-indigo-950/40 border border-indigo-500/20' : 'bg-indigo-950/20'}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-indigo-400 w-10">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                      <span className="text-[9px] text-indigo-300/50 font-mono">{entry.date.slice(5)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm">{entry.count === 1 ? '🍽️' : '🍽️🍽️'}</span>
                      <span className="text-xs font-black text-white">{entry.count} meal{entry.count > 1 ? 's' : ''}</span>
                      <button
                        onClick={() => {
                          setMealTracker(prev => ({
                            ...prev,
                            balance: prev.balance + (entry.count * MEAL_COST),
                            mealLog: prev.mealLog.filter(m => m.date !== entry.date) // This works for meals as they have unique date strings (YYYY-MM-DD)
                          }));
                        }}
                        className="p-1.5 text-indigo-500/50 hover:text-rose-400 transition-colors"
                        title="Remove entry"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
};

const CalendarPopup = ({ selectedDay, onSelect, onClose }) => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  return (
    <div className="fixed inset-0 z-[250] flex items-end justify-center sm:items-center p-4 bg-[#0c0a1f]/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}>
      <div className="bg-[#0c0a1f] w-full max-w-sm rounded-[2rem] border border-indigo-500/30 p-6 shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
        <div className="text-center mb-6">
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Select Due Day</h3>
          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">When is this bill due?</p>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} className="text-center text-[10px] font-black text-indigo-500/50">{d}</div>
          ))}
          {days.map(d => (
            <button
              key={d}
              onClick={() => onSelect(d)}
              className={`aspect-square rounded-xl flex items-center justify-center text-xs font-black transition-all ${selectedDay === d.toString() ? 'theme-bg text-white shadow-lg scale-110' : 'bg-indigo-950/20 text-indigo-300 hover:bg-indigo-900/40'}`}
            >
              {d}
            </button>
          ))}
        </div>
        <button onClick={onClose} className="w-full py-3 bg-indigo-950/50 text-indigo-300 font-black rounded-xl text-[10px] uppercase tracking-widest hover:text-white transition-colors">Cancel</button>
      </div>
    </div>
  );
};

const GlobalPopup = ({ type, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0c0a1f]/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#0c0a1f] w-full max-w-xs rounded-3xl border border-white/10 p-6 shadow-2xl relative overflow-hidden animate-in zoom-in-50 duration-300">
        <div className="absolute top-0 right-0 p-4 opacity-10 theme-text"><Star size={80} /></div>
        <div className="flex flex-col items-center text-center relative z-10">
          {type === 'alert' ? (
            <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400"><Star size={32} /></div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center mb-4 text-rose-400"><Target size={32} /></div>
          )}

          <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">{type === 'alert' ? 'Notice' : 'Confirm'}</h3>
          <p className="text-xs font-bold text-indigo-200 mb-6 leading-relaxed whitespace-pre-wrap">{message}</p>

          <div className="flex gap-3 w-full">
            {type === 'confirm' && (
              <button onClick={onCancel} className="flex-1 py-3 bg-indigo-950/50 text-indigo-300 font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-indigo-900/50 transition-all">Cancel</button>
            )}
            <button onClick={onConfirm} className="flex-1 py-3 theme-bg text-white font-black rounded-xl text-[10px] uppercase tracking-widest shadow-lg hover:brightness-110 active:scale-95 transition-all">
              {type === 'alert' ? 'Got it!' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


const DownloadPopup = ({ onSelect, onCancel }) => {
  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-[#0c0a1f]/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-xs bg-[#0c0a1f] border border-indigo-500/30 p-8 rounded-[2rem] shadow-2xl text-center relative overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 animate-bounce">
            <Download size={32} />
          </div>
        </div>
        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6">Download App</h3>
        <div className="space-y-3">
          <button
            onClick={() => onSelect('windows')}
            className="w-full py-4 bg-indigo-950/30 hover:bg-indigo-900/40 text-white font-black rounded-xl text-xs uppercase tracking-widest border border-indigo-500/20 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <Monitor size={16} /> Windows (EXE)
          </button>
          <button
            onClick={() => onSelect('android')}
            className="w-full py-4 bg-indigo-950/30 hover:bg-indigo-900/40 text-white font-black rounded-xl text-xs uppercase tracking-widest border border-indigo-500/20 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <Smartphone size={16} /> Android (APK)
          </button>
          <button
            onClick={onCancel}
            className="w-full py-3 mt-2 text-[10px] font-black text-indigo-500/50 uppercase tracking-widest hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [view, setView] = useState('onboarding');
  /* Scroll to top when view changes */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const [user, setUser] = useState({ name: '', income: '', savingsGoal: '', petType: 'cat', petColor: 'purple', petAccessory: 'none', activeTargetId: null, cateringEnabled: false, cateringPricePerMeal: 50 });
  const [expenses, setExpenses] = useState([]);
  const [streakData, setStreakData] = useState({});
  const [savingsTargets, setSavingsTargets] = useState([]);
  const [monthlyDues, setMonthlyDues] = useState([]);
  const [lastRolloverDate, setLastRolloverDate] = useState(new Date().toISOString().split('T')[0]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [tutorialComplete, setTutorialComplete] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [popup, setPopup] = useState({ isOpen: false, type: 'alert', message: '', onConfirm: null, onCancel: null }); // Global Popup State
  const [mealTracker, setMealTracker] = useState({ balance: 0, mealLog: [] }); // Meal tracker
  const [showDownload, setShowDownload] = useState(false);


  const handleNumericInput = (val, setter, field = null) => {
    const clean = val.replace(/[^0-9.]/g, '');
    if ((clean.match(/\./g) || []).length > 1) return;
    if (field) setter(prev => ({ ...prev, [field]: clean }));
    else setter(clean);
  };

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const loadedUser = parsed.user || { name: '', income: '', savingsGoal: '', petType: 'cat', petColor: 'purple', petAccessory: 'none', activeTargetId: null, cateringEnabled: false, cateringPricePerMeal: 50 };
        if (loadedUser.cateringPricePerMeal === undefined) loadedUser.cateringPricePerMeal = 50;
        if (!THEME_COLORS[loadedUser.petColor]) loadedUser.petColor = 'purple';
        setUser(loadedUser);
        setExpenses(Array.isArray(parsed.expenses) ? parsed.expenses : []);
        setStreakData(parsed.streakData || {});
        setSavingsTargets(Array.isArray(parsed.savingsTargets) ? parsed.savingsTargets : []);
        setMonthlyDues(Array.isArray(parsed.monthlyDues) ? parsed.monthlyDues : []);
        setLastRolloverDate(parsed.lastRolloverDate || new Date().toISOString().split('T')[0]);
        setTutorialComplete(parsed.tutorialComplete || false);

        // Robust meal tracker loading
        const loadedMealTracker = parsed.mealTracker || { balance: 0, mealLog: [] };
        if (!loadedMealTracker.mealLog) loadedMealTracker.mealLog = [];
        if (typeof loadedMealTracker.balance !== 'number') loadedMealTracker.balance = 0;
        setMealTracker(loadedMealTracker);

        if (parsed.user?.name) {
          setView('dashboard');
        } else {
          setView('onboarding');
        }
      } catch (e) {
        console.error("Failed to parse saved data:", e);
        // Optionally clear corrupted data or alert user
        // localStorage.removeItem(STORAGE_KEY); 
      }
    }
    setIsInitialized(true);
  }, []);


  useEffect(() => {
    if (!isInitialized || !user.activeTargetId) return;

    const today = new Date().toISOString().split('T')[0];
    if (lastRolloverDate === today) return;


    let currentDate = new Date(lastRolloverDate);
    currentDate.setDate(currentDate.getDate() + 1);
    const endDate = new Date(today);

    let totalRollover = 0;
    const monthlyIncome = parseFloat(user.income) || 0;
    const monthlyGoal = parseFloat(user.savingsGoal) || 0;
    const totalDues = monthlyDues.reduce((a, b) => a + (parseFloat(b.amount) || 0), 0);
    const daysInRolloverMonth = new Date().getDate(); // Usage of current date for days in month context might be intended for "now" or "that month". 
    // Actually, getting days in current month:
    const daysInCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const cateringCost = user.cateringEnabled ? (parseFloat(user.cateringPricePerMeal) || 0) * daysInCurrentMonth : 0;
    const dailyBudget = Math.max(0, monthlyIncome - totalDues - cateringCost) / 30;
    const dailySaveTarget = monthlyGoal / 30; // Amount user should save per day

    while (currentDate < endDate) {
      const dStr = currentDate.toISOString().split('T')[0];
      // Calculate how much of the usable budget wasn't spent
      const spentOnDay = expenses.filter(e => e.date.startsWith(dStr)).reduce((a, b) => a + b.amount, 0);
      const usableBudget = dailyBudget - dailySaveTarget;

      // If spent less than usable budget, rollover the difference + the daily save target
      if (spentOnDay < usableBudget) {
        totalRollover += (usableBudget - spentOnDay) + dailySaveTarget;
      } else if (spentOnDay < dailyBudget) {
        // Spent more than usable but less than full budget - save what's left
        totalRollover += dailyBudget - spentOnDay;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (totalRollover > 0) {
      setSavingsTargets(prev => prev.map(t => t.id === user.activeTargetId ? { ...t, current: t.current + totalRollover } : t));
      setPopup({
        isOpen: true,
        type: 'alert',
        message: `🎉 Welcome Back!\nAutomatically saved ৳${totalRollover.toFixed(0)} from missed days to your active target!`,
        onConfirm: () => setPopup(prev => ({ ...prev, isOpen: false }))
      });
    }

    setLastRolloverDate(today);

  }, [isInitialized, lastRolloverDate, user.activeTargetId, user.income, expenses, monthlyDues]);

  // Auto-advance to next goal when current goal is completed
  useEffect(() => {
    if (!isInitialized || !user.activeTargetId) return;

    const activeTarget = savingsTargets.find(t => t.id === user.activeTargetId);
    if (!activeTarget) return;

    // Check if goal is completed (reached or exceeded target)
    if (activeTarget.current >= activeTarget.target) {
      // Find next incomplete goal
      const otherGoals = savingsTargets.filter(t =>
        t.id !== activeTarget.id &&
        t.current < t.target
      );

      const nextGoalId = otherGoals.length > 0 ? otherGoals[0].id : null;
      const nextGoalName = otherGoals.length > 0 ? otherGoals[0].name : 'None';

      // Show celebration and advance
      setPopup({
        isOpen: true,
        type: 'alert',
        message: `🎉 Congratulations!\n\nYou've completed "${activeTarget.name}"!${nextGoalId ? `\n\nNow saving to: ${nextGoalName}` : '\n\nSet a new savings goal to continue!'}`,
        onConfirm: () => setPopup(prev => ({ ...prev, isOpen: false }))
      });

      setUser(prev => ({ ...prev, activeTargetId: nextGoalId }));
    }
  }, [isInitialized, savingsTargets, user.activeTargetId]);


  useEffect(() => {
    if (isInitialized) localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, expenses, streakData, tutorialComplete, savingsTargets, lastRolloverDate, monthlyDues, mealTracker }));
  }, [user, expenses, streakData, tutorialComplete, savingsTargets, lastRolloverDate, monthlyDues, mealTracker, isInitialized]);

  const finishTutorial = () => {
    setTutorialComplete(true);
  };

  const stats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const daysRemaining = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate() + 1;
    const monthlyIncome = parseFloat(user.income) || 0;

    // Get monthly goal from active savings target
    const activeTarget = savingsTargets.find(t => t.id === user.activeTargetId);
    const remainingToSave = activeTarget ? Math.max(0, activeTarget.target - activeTarget.current) : 0;
    // Assume user wants to save within 30 days, or use remaining to save as the monthly goal
    const monthlyGoal = remainingToSave;

    const totalDues = monthlyDues.reduce((a, b) => a + (parseFloat(b.amount) || 0), 0);
    const daysInStatMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const cateringCost = user.cateringEnabled ? (parseFloat(user.cateringPricePerMeal) || 0) * daysInStatMonth : 0;
    // Full disposable income (NOT minus savings goal - we show that via usable budget instead)
    const totalDisp = Math.max(0, monthlyIncome - totalDues - cateringCost);
    const currMonthExp = expenses.filter(e => { const d = new Date(e.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
    const totalSpent = currMonthExp.reduce((a, b) => a + b.amount, 0);
    const spentToday = currMonthExp.filter(e => new Date(e.date).toDateString() === now.toDateString()).reduce((a, b) => a + b.amount, 0);
    const budgetAllocatedToday = Math.round(totalDisp / 30);
    const dailyRem = Math.round(budgetAllocatedToday - spentToday);
    const dailyProg = budgetAllocatedToday > 0 ? (dailyRem / budgetAllocatedToday) * 100 : 0;

    // Calculate daily savings target using goal's specific days (or default to 30)
    const goalDays = activeTarget?.days || 30;
    const dailySaveTarget = Math.round(remainingToSave / goalDays);
    // Usable budget = what user should actually spend if they want to save gradually
    const usableBudget = Math.max(0, budgetAllocatedToday - dailySaveTarget);
    const usableRemaining = Math.round(usableBudget - spentToday);

    let mood = 'happy';
    if (dailyRem <= 0) mood = 'passed_out';
    else if (dailyProg < 25) mood = 'critical';
    else if (dailyProg < 50) mood = 'worried';
    else mood = 'happy';

    const categoryTotals = currMonthExp.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

    return { dailyBudget: budgetAllocatedToday, dailyRemaining: dailyRem, dailyProgress: dailyProg, mood, spentToday, totalSpentThisMonth: totalSpent, categoryTotals, todayStr, cateringCost, dailySaveTarget, usableBudget, usableRemaining, monthlyGoal };
  }, [user, expenses, monthlyDues, savingsTargets]);

  const activeTarget = savingsTargets.find(t => t.id === user.activeTargetId);

  useEffect(() => {
    if (!isInitialized) return;
    const { dailyRemaining, todayStr } = stats;
    const success = dailyRemaining > 0;
    if (streakData[todayStr] !== success) {
      setStreakData(prev => ({ ...prev, [todayStr]: success }));
    }
  }, [stats.dailyRemaining, stats.todayStr, isInitialized]);

  const addExpense = (amount, category) => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;
    setExpenses([{ id: Date.now(), amount: num, category, date: new Date().toISOString() }, ...expenses]);
    setView('dashboard');
  };


  return (
    <div className="min-h-screen w-full bg-[#0c0a1f] text-indigo-50 font-sans relative">
      <GlobalStyles color={user.petColor} />

      {/* Desktop Navigation Sidebar - Only visible on lg+ screens */}
      {view !== 'onboarding' && view !== 'dues-setup' && view !== 'edit-profile' && (
        <div className="desktop-only desktop-nav-sidebar">
          <button
            onClick={() => setView('dashboard')}
            className={view === 'dashboard' ? 'nav-active text-white' : 'text-indigo-300 hover:text-white'}
            title="Home"
          >
            <Home size={24} />
          </button>
          <button
            onClick={() => setView('history')}
            className={view === 'history' ? 'nav-active text-white' : 'text-indigo-300 hover:text-white'}
            title="History"
          >
            <History size={24} />
          </button>

          {/* Desktop FAB */}
          <button
            onClick={() => view === 'savings' ? setView('add-savings') : setView('add')}
            className="desktop-fab theme-bg text-white rounded-full shadow-[0_0_20px_var(--theme-glow)] hover:brightness-110 transition-all"
            title="Add"
          >
            <PlusCircle size={28} strokeWidth={2.5} />
          </button>

          <button
            onClick={() => setView('savings')}
            className={view === 'savings' ? 'nav-active text-white' : 'text-indigo-300 hover:text-white'}
            title="Savings"
          >
            <PiggyBank size={24} />
          </button>
          {user.cateringEnabled && (
            <button
              onClick={() => setView('meals')}
              className={view === 'meals' ? 'nav-active text-white' : 'text-indigo-300 hover:text-white'}
              title="Meals"
            >
              <Utensils size={24} />
            </button>
          )}
          {!user.cateringEnabled && (
            <button
              onClick={() => setView('settings')}
              className={view === 'settings' ? 'nav-active text-white' : 'text-indigo-300 hover:text-white'}
              title="Settings"
            >
              <Settings size={24} />
            </button>
          )}
        </div>
      )}

      {/* Settings Button - Top Right (when catering enabled, shows on all pages except onboarding/settings) */}
      {user.cateringEnabled && view !== 'onboarding' && view !== 'edit-profile' && view !== 'dues-setup' && view !== 'settings' && (
        <button
          onClick={() => setView('settings')}
          className="fixed top-4 right-4 z-50 w-10 h-10 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center text-indigo-300 hover:text-white transition-all shadow-lg ring-1 ring-white/10"
        >
          <Settings size={18} />
        </button>
      )}

      <div className="w-full min-h-screen flex flex-col relative pb-32 lg:pb-8">
        <main className="w-full max-w-3xl mx-auto p-6 md:p-12 lg:max-w-5xl relative flex flex-col gap-8">
          {view === 'onboarding' ? (
            <div className="w-full flex flex-col justify-center">
              <OnboardingView user={user} setUser={setUser} handleNumericInput={handleNumericInput} onComplete={() => setView('dues-setup')} />
            </div>
          ) : view === 'edit-profile' ? (
            <div className="w-full flex flex-col justify-center">
              <OnboardingView user={user} setUser={setUser} handleNumericInput={handleNumericInput} onComplete={() => setView('settings')} isEditing={true} />
            </div>
          ) : view === 'dues-setup' ? (
            <div className="w-full flex flex-col justify-center pb-20">
              <RecurringExpensesView dues={monthlyDues} setDues={setMonthlyDues} handleNumericInput={handleNumericInput} onComplete={() => setView('dashboard')} />
            </div>
          ) : (
            <div className="w-full flex flex-col">
              {view === 'dashboard' && (
                <div className="w-full flex flex-col justify-start gap-6 pb-20 animate-in fade-in duration-700">
                  {/* Tutorial Popup Overlay */}
                  {!tutorialComplete && <TutorialPopup user={user} onComplete={finishTutorial} />}

                  {/* Download Button (Top Left) */}
                  <div className="absolute top-0 left-0 z-10 p-2">
                    <button
                      onClick={() => setShowDownload(true)}
                      className="p-2 bg-indigo-950/30 hover:bg-white/10 rounded-xl text-indigo-400 hover:text-white transition-all backdrop-blur-sm border border-white/5 shadow-lg group"
                      title="Download App"
                    >
                      <Download size={20} className="group-hover:scale-110 transition-transform" />
                    </button>
                  </div>

                  {showDownload && (
                    <DownloadPopup
                      onSelect={(platform) => {
                        const baseUrl = "https://github.com/meneon114/Budget-Buddy-Mobile/releases/latest/download/";
                        const fileName = platform === 'windows' ? "budget-buddy-setup.exe" : "budget-buddy.apk";
                        const link = document.createElement('a');
                        link.href = baseUrl + fileName;
                        link.click();
                        setShowDownload(false);
                      }}
                      onCancel={() => setShowDownload(false)}
                    />
                  )}

                  {/* Top Stats Corners */}


                  <div className="flex flex-col items-center gap-1">
                    <p className="theme-text text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-2 neon-glow-theme">
                      <Star size={14} className="animate-pulse theme-text" /> Welcome back, {user.name}
                    </p>

                  </div>

                  <div className="flex justify-center -my-4 sm:my-0 scale-[0.65] sm:scale-75 origin-center">
                    <PixelPet type={user.petType} color={user.petColor} accessory={user.petAccessory} mood={stats.mood} isAdding={false} showHearts={stats.mood === 'happy'} />
                  </div>

                  <div className="cute-card p-5 sm:p-6 shadow-2xl relative overflow-hidden">
                    <p className="text-[9px] font-black theme-text uppercase tracking-[0.3em] mb-2 text-center opacity-70">Daily Budget</p>

                    <div className="flex flex-col items-center justify-center gap-3 mb-6">
                      <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tighter font-mono break-all leading-tight">৳{stats.dailyRemaining.toFixed(2)}</h2>

                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-950/40 rounded-full border border-orange-500/20 shadow-lg">
                        <span className="text-sm animate-pulse">🔥</span>
                        <span className="text-[9px] font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-rose-300 uppercase tracking-widest leading-none">
                          {Object.values(streakData).filter(v => v).length} {Object.values(streakData).filter(v => v).length === 1 ? 'Day' : 'Days'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4 px-2">
                      <div className="w-full bg-black/60 h-6 sm:h-8 rounded-full p-1 sm:p-1.5 relative overflow-hidden shadow-inner">
                        {/* Progress fill */}
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${stats.mood === 'passed_out' ? 'bg-gray-700' : 'theme-bg shadow-[0_0_20px_var(--theme-glow)]'}`}
                          style={{ width: `${Math.min(Math.max(stats.dailyProgress, 0), 100)}%` }}
                        />
                        {/* Usable budget threshold line - marks where bar should stop shrinking */}
                        {stats.monthlyGoal > 0 && stats.dailyBudget > 0 && (
                          <div
                            className="absolute top-0 bottom-0 flex flex-col items-center justify-center pointer-events-none"
                            style={{ left: `${Math.min((stats.dailySaveTarget / stats.dailyBudget) * 100, 100)}%` }}
                          >
                            <div className="h-full w-0.5 border-l-2 border-dashed border-white/80" />
                            <div className="absolute -top-5 bg-emerald-500/90 px-1.5 py-0.5 rounded text-[7px] font-black text-white uppercase tracking-wider whitespace-nowrap shadow-lg">
                              Save Zone
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between w-full text-[9px] font-black uppercase tracking-widest text-indigo-300 px-1 mt-1">
                        <span>Spent: ৳{stats.spentToday.toFixed(0)}</span>
                        <span>Budget: ৳{stats.dailyBudget.toFixed(0)}</span>
                      </div>

                      {/* Usable Budget & Savings Tip */}
                      {stats.monthlyGoal > 0 && (
                        <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-3 mt-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <PiggyBank size={14} className="text-emerald-400" />
                              <span className="text-[9px] font-black text-emerald-300 uppercase tracking-widest">To Hit Your Goal</span>
                            </div>
                            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Save ৳{stats.dailySaveTarget}/day</span>
                          </div>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-emerald-500/10">
                            <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest">Usable Today</span>
                            <span className={`text-sm font-black font-mono ${stats.usableRemaining < 0 ? 'text-rose-400' : 'text-white'}`}>৳{stats.usableRemaining}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Active Savings Goal in Island */}
                    {activeTarget && (
                      <div className="mt-6 pt-4 border-t border-white/10 relative">
                        <div className="flex justify-between items-center mb-2 text-indigo-200">
                          <div className="flex items-center gap-2">
                            <PiggyBank size={14} className="text-emerald-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{activeTarget.name}</span>
                          </div>
                          <span className="text-[10px] font-black font-mono">৳{activeTarget.current.toLocaleString()} / ৳{activeTarget.target.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden shadow-inner relative">
                          <div className="absolute inset-0 bg-emerald-500/10" />
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.4)] transition-all duration-1000" style={{ width: `${Math.min((activeTarget.current / activeTarget.target) * 100, 100)}%` }} />
                        </div>
                        <div className="text-right mt-1">
                          <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">{Math.round((activeTarget.current / activeTarget.target) * 100)}% DETECTED</span>
                        </div>
                      </div>
                    )}
                  </div>


                  {/* Meal Balance Summary (when catering enabled) */}
                  {user.cateringEnabled && (
                    <button
                      onClick={() => setView('meals')}
                      className={`w-full cute-card p-4 mb-4 flex items-center justify-between shadow-md transition-all hover:bg-white/5 ${mealTracker.balance < 0 ? 'ring-1 ring-rose-500/50' : mealTracker.balance < ((user.cateringPricePerMeal || 50) * 4) ? 'ring-1 ring-amber-500/50' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${mealTracker.balance < 0 ? 'bg-rose-500/20 text-rose-400' : mealTracker.balance < ((user.cateringPricePerMeal || 50) * 4) ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          <Utensils size={18} />
                        </div>
                        <div className="text-left">
                          <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Catering Balance</p>
                          <p className={`text-lg font-black font-mono ${mealTracker.balance < 0 ? 'text-rose-400' : 'text-white'}`}>৳{mealTracker.balance}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">{mealTracker.balance < 0 ? 'Due' : 'Meals Left'}</p>
                        <p className={`text-xl font-black font-mono ${mealTracker.balance < 0 ? 'text-rose-400' : mealTracker.balance < ((user.cateringPricePerMeal || 50) * 4) ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {mealTracker.balance < 0 ? Math.abs(Math.floor(mealTracker.balance / (user.cateringPricePerMeal || 50))) : Math.floor(mealTracker.balance / (user.cateringPricePerMeal || 50))}
                        </p>
                      </div>
                    </button>
                  )}

                  {monthlyDues.length > 0 && (
                    <div className="w-full mb-2">
                      <p className="text-[9px] font-black text-indigo-300/60 uppercase tracking-[0.3em] mb-2 px-1 text-center">Monthly Dues</p>
                      <div className="w-full overflow-x-auto whitespace-nowrap scrollbar-hide px-1 py-1 flex">
                        <div className="inline-flex gap-2 mx-auto">
                          {monthlyDues
                            .map(d => {
                              const today = new Date(); today.setHours(0, 0, 0, 0);
                              let target = new Date(today.getFullYear(), today.getMonth(), parseInt(d.day));
                              if (target < today) target = new Date(today.getFullYear(), today.getMonth() + 1, parseInt(d.day));
                              const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));

                              const lastPaid = d.lastPaidDate ? new Date(d.lastPaidDate) : null;
                              const isPaidThisMonth = lastPaid && lastPaid.getMonth() === today.getMonth() && lastPaid.getFullYear() === today.getFullYear();

                              return { ...d, diff, isPaidThisMonth };
                            })
                            .sort((a, b) => {
                              if (a.isPaidThisMonth && !b.isPaidThisMonth) return 1;
                              if (!a.isPaidThisMonth && b.isPaidThisMonth) return -1;
                              return a.diff - b.diff;
                            })
                            .map(d => {
                              const isUrgent = d.diff <= 3 && !d.isPaidThisMonth;
                              const isSoon = d.diff <= 7 && !d.isPaidThisMonth;

                              return (
                                <button
                                  key={d.id}
                                  onClick={() => {
                                    const confirmMsg = d.isPaidThisMonth ? "Mark as UNPAID?" : "Mark as PAID for this month?";
                                    setPopup({
                                      isOpen: true,
                                      type: 'confirm',
                                      message: confirmMsg,
                                      onConfirm: () => {
                                        const newDate = d.isPaidThisMonth ? null : new Date().toISOString();
                                        setMonthlyDues(prev => prev.map(p => p.id === d.id ? { ...p, lastPaidDate: newDate } : p));
                                        setPopup(prev => ({ ...prev, isOpen: false }));
                                      },
                                      onCancel: () => setPopup(prev => ({ ...prev, isOpen: false }))
                                    });
                                  }}
                                  className={`p-4 w-40 shrink-0 inline-block rounded-2xl border flex flex-col relative overflow-hidden backdrop-blur-sm transition-all active:scale-95 text-center
                                     ${d.isPaidThisMonth
                                      ? 'bg-emerald-950/20 border-emerald-500/30 opacity-60 grayscale-[0.5]'
                                      : isUrgent
                                        ? 'bg-rose-950/20 border-rose-500/30'
                                        : 'bg-indigo-950/30 border-indigo-500/10'}`}
                                >
                                  <div className="flex justify-between items-center mb-2 w-full">
                                    <span className={`text-[9px] font-black uppercase tracking-wider truncate max-w-[80px] text-center mx-auto ${d.isPaidThisMonth ? 'text-emerald-400 decoration-emerald-500/50' : 'text-white'}`}>{d.name}</span>
                                    {d.isPaidThisMonth ? <CheckCircle size={12} className="text-emerald-400 absolute right-3 top-3" /> : <Calendar size={12} className={`absolute right-3 top-3 ${isUrgent ? 'text-rose-400' : 'text-indigo-400'}`} />}
                                  </div>
                                  <p className={`text-sm font-black font-mono mb-2 ${d.isPaidThisMonth ? 'text-emerald-200 line-through decoration-emerald-500/50' : 'text-white'}`}>৳{d.amount.toLocaleString()}</p>
                                  <div className={`mt-auto text-[7px] font-bold uppercase tracking-widest px-2 py-1 rounded-full w-fit mx-auto 
                                     ${d.isPaidThisMonth
                                      ? 'bg-emerald-900/50 text-emerald-300'
                                      : isUrgent
                                        ? 'bg-rose-500 text-white animate-pulse'
                                        : isSoon
                                          ? 'bg-indigo-500 text-white'
                                          : 'bg-indigo-900/50 text-indigo-300'}`}>
                                    {d.isPaidThisMonth ? 'PAID' : d.diff === 0 ? 'Due Today!' : `${d.diff} Days Left`}
                                  </div>
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  )}

                  {monthlyDues.length === 0 && (
                    <div className="mt-2 text-center opacity-30 py-4 border border-dashed border-white/10 rounded-2xl mx-1">
                      <p className="text-[8px] font-black uppercase tracking-widest">No Monthly Dues Set</p>
                    </div>
                  )}
                </div>
              )}

              {/* Global Popup */}
              {popup.isOpen && (
                <GlobalPopup
                  type={popup.type}
                  message={popup.message}
                  onConfirm={popup.onConfirm || (() => setPopup(prev => ({ ...prev, isOpen: false })))}
                  onCancel={popup.onCancel || (() => setPopup(prev => ({ ...prev, isOpen: false })))}
                />
              )}

              {view === 'add' && (
                <div className="w-full flex flex-col justify-center animate-in slide-in-from-bottom duration-500 pb-20">
                  <div className="flex flex-col items-center mb-2">
                    <div className="scale-[0.65] sm:scale-75 origin-center">
                      <PixelPet type={user.petType} color={user.petColor} accessory={user.petAccessory} mood="happy" isAdding={true} />
                    </div>
                    <div className="mt-4 bg-black/40 border border-white/10 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-indigo-300 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" /> Keep your buddy happy!
                    </div>
                  </div>
                  <div className="cute-card p-5 shadow-2xl">
                    <div className="text-center">
                      <p className="text-[9px] font-black theme-text uppercase tracking-[0.4em] mb-2 text-center">Cost Input</p>
                      <AddExpenseInput onAdd={addExpense} onCancel={() => setView('dashboard')} handleNumericInput={handleNumericInput} />
                    </div>
                  </div>
                </div>
              )}

              {view === 'history' && (
                <div className="w-full flex flex-col pt-0 animate-in fade-in pb-20">
                  <h2 className="text-2xl sm:text-3xl font-black text-white mb-6 tracking-tighter uppercase px-2 text-center">History & Stats</h2>
                  <div className="space-y-4 px-1 w-full">

                    {/* Stats Section */}
                    <div className="space-y-4">
                      <div className="cute-card p-6 shadow-2xl">
                        <p className="text-[10px] font-black theme-text uppercase tracking-[0.4em] mb-4 text-center">Streak History</p>
                        <StreakGraph streakData={streakData} />
                      </div>
                      <div className="cute-card p-6 shadow-lg">
                        <p className="text-[10px] font-black theme-text uppercase tracking-[0.4em] mb-4 text-center">Allocation Breakdown</p>
                        {Object.entries(stats.categoryTotals).map(([cat, amt]) => {
                          const Icon = CATEGORY_ICONS[cat] || DollarSign;
                          return (
                            <div key={cat} className="mb-4 last:mb-0 space-y-1">
                              <div className="flex justify-between text-[10px] font-black text-indigo-300 uppercase tracking-widest font-bold">
                                <span className="flex items-center gap-2"><Icon size={12} /> {cat}</span>
                                <span>৳{amt.toFixed(0)}</span>
                              </div>
                              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden shadow-inner"><div className="h-full theme-bg shadow-[0_0_10px_var(--theme-glow)]" style={{ width: `${(amt / Math.max(stats.totalSpentThisMonth, 1)) * 100}%` }} /></div>
                            </div>
                          );
                        })}
                        {Object.keys(stats.categoryTotals).length === 0 && <p className="text-center text-[10px] opacity-40 uppercase tracking-widest">No data this month</p>}
                      </div>
                    </div>

                    <h3 className="text-xl font-black text-white mt-8 mb-4 uppercase tracking-tight px-2">Transactions</h3>
                    <div className="space-y-3">
                      {expenses.map(exp => (
                        <div key={exp.id} className="cute-card p-4 flex justify-between items-center shadow-md shrink-0">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center theme-text font-mono">
                              {(() => { const Icon = CATEGORY_ICONS[exp.category] || DollarSign; return <Icon size={18} />; })()}
                            </div>
                            <div className="text-left"><p className="font-black text-white text-xs uppercase tracking-widest font-bold">{exp.category}</p><p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">{new Date(exp.date).toLocaleDateString()}</p></div>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="font-black text-rose-500 font-mono tracking-tighter text-sm">-৳{exp.amount.toFixed(2)}</p>
                            <button onClick={() => setExpenses(expenses.filter(e => e.id !== exp.id))} className="p-2 text-indigo-900 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                          </div>
                        </div>
                      ))}
                      {expenses.length === 0 && <div className="h-full flex flex-col items-center justify-center opacity-20 gap-4"><Ghost size={60} /><p className="font-black uppercase text-[10px] tracking-[0.5em]">No transactions</p></div>}
                    </div>
                  </div>
                </div>
              )}

              {view === 'savings' && (
                <SavingsView
                  targets={savingsTargets}
                  setTargets={setSavingsTargets}
                  handleNumericInput={handleNumericInput}
                  activeId={user.activeTargetId}
                  setActiveId={(id) => setUser({ ...user, activeTargetId: id })}
                />
              )}

              {view === 'add-savings' && (
                <AddSavingsInput
                  onAdd={(name, target, days) => {
                    setSavingsTargets([...savingsTargets, { id: Date.now(), name: name, target: parseFloat(target), current: 0, days: days }]);
                    setView('savings');
                  }}
                  onCancel={() => setView('savings')}
                  handleNumericInput={handleNumericInput}
                />
              )}

              {view === 'meals' && (
                <MealTrackerView mealTracker={mealTracker} setMealTracker={setMealTracker} mealCost={user.cateringPricePerMeal} />
              )}

              {view === 'settings' && (
                <div className="w-full flex flex-col pb-20 animate-in fade-in">
                  <h2 className="text-2xl sm:text-3xl font-black text-white mb-8 tracking-tighter uppercase px-2">Settings</h2>
                  <div className="cute-card rounded-[2.5rem] p-8 text-center mb-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 opacity-10 rotate-12 theme-text"><Wallet size={160} /></div>
                    <div className="w-20 h-20 theme-bg rounded-[2rem] mx-auto flex items-center justify-center text-white text-4xl font-black mb-6 shadow-2xl shadow-black/50">{user.name.charAt(0)}</div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-bold">{user.name}</h3>
                  </div>
                  <div className="space-y-3 px-2">
                    <button onClick={() => setView('edit-profile')} className="w-full p-5 cute-card flex items-center justify-between font-black text-white uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all shadow-md">Edit Profile <ChevronRight size={18} /></button>
                    <button onClick={() => setView('dues-setup')} className="w-full p-5 cute-card flex items-center justify-between font-black text-white uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all shadow-md">Manage Dues <Calendar size={18} /></button>

                    {/* Catering Toggle */}
                    <div className="cute-card p-5 shadow-md">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-black text-white uppercase text-[10px] tracking-widest">Catering Tracker</p>
                        </div>
                        <button
                          onClick={() => setUser(prev => ({ ...prev, cateringEnabled: !prev.cateringEnabled }))}
                          className={`w-14 h-8 rounded-full p-1 transition-all ${user.cateringEnabled ? 'bg-emerald-500' : 'bg-indigo-950/50'}`}
                        >
                          <div className={`w-6 h-6 rounded-full bg-white shadow-md transition-all ${user.cateringEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                      </div>
                      {user.cateringEnabled && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-indigo-500/20">
                          <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Price Per Meal</span>
                          <input
                            type="number"
                            value={user.cateringPricePerMeal || ''}
                            onChange={(e) => setUser(prev => ({ ...prev, cateringPricePerMeal: parseFloat(e.target.value) || 0 }))}
                            className="flex-1 py-2 px-3 bg-black/40 rounded-xl text-white font-mono text-sm text-center border border-indigo-500/30 focus:border-emerald-500 outline-none"
                            placeholder="0"
                          />
                          <span className="text-[9px] text-indigo-400 font-mono">৳</span>
                        </div>
                      )}
                    </div>

                    <button onClick={() => setShowResetConfirm(true)} className="w-full p-5 bg-rose-950/20 rounded-3xl flex items-center justify-between font-black text-rose-500 uppercase text-[10px] tracking-widest hover:bg-rose-900/40 transition-all font-bold shadow-md">Reset App <RotateCcw size={18} /></button>

                    <a href="https://github.com/meneon114" target="_blank" rel="noopener noreferrer" className="w-full p-4 mt-4 flex items-center justify-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                      <Github size={16} className="text-indigo-300" />
                      <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest">Developed by Meneon114</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Reset Confirmation Overlay */}
              {showResetConfirm && (
                <ResetConfirmPopup
                  onConfirm={() => {
                    localStorage.removeItem(STORAGE_KEY);
                    location.reload();
                  }}
                  onCancel={() => setShowResetConfirm(false)}
                />
              )}

              {/* Bottom Nav Dock - Mobile Only */}
              <div className={`mobile-only fixed bottom-6 left-0 right-0 z-[100] px-4 sm:px-6 overflow-visible transition-all duration-1000 max-w-3xl mx-auto flex justify-center items-end`}>

                {/* Floating Action Button - Independent */}
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-[5px] sm:bottom-[3px] z-[120] pointer-events-auto">
                  <button
                    onClick={() => view === 'savings' ? setView('add-savings') : setView('add')}
                    className="theme-bg w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-white shadow-[0_0_40px_var(--theme-glow)] ring-[8px] sm:ring-[12px] ring-[#0c0a1f] active:scale-95 transition-all hover:brightness-110 pulse-button"
                  >
                    <PlusCircle size={40} className="sm:w-[48px] sm:h-[48px] drop-shadow-[0_0_12px_white]" strokeWidth={2.5} />
                  </button>
                </div>

                {/* Dock Background & Icons */}
                <div className="w-full bg-black/95 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,1)] rounded-[3rem] px-4 sm:px-8 py-4 sm:py-6 flex justify-between items-center relative overflow-hidden ring-1 ring-white/10 z-[100]">

                  <button onClick={() => setView('dashboard')} className={`flex flex-col items-center gap-1 sm:gap-2 transition-all ${view === 'dashboard' ? 'theme-text scale-110 neon-glow-theme' : 'text-indigo-200/50 hover:text-indigo-100'}`}>
                    <Home size={22} className="sm:w-[26px] sm:h-[26px]" strokeWidth={view === 'dashboard' ? 3 : 2} />
                    <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-widest font-bold">Home</span>
                  </button>

                  <button onClick={() => setView('history')} className={`flex flex-col items-center gap-1 sm:gap-2 transition-all ${view === 'history' ? 'theme-text scale-110 neon-glow-theme' : 'text-indigo-200/50 hover:text-indigo-100'}`}>
                    <History size={22} className="sm:w-[26px] sm:h-[26px]" strokeWidth={view === 'history' ? 3 : 2} />
                    <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-widest font-bold">History</span>
                  </button>

                  {/* Spacer for Floating Button */}
                  <div className="w-16 sm:w-20 pointer-events-none opacity-0" />

                  <button onClick={() => setView('savings')} className={`flex flex-col items-center gap-1 sm:gap-2 transition-all ${view === 'savings' ? 'theme-text scale-110 neon-glow-theme' : 'text-indigo-200/50 hover:text-indigo-100'}`}>
                    <PiggyBank size={22} className="sm:w-[26px] sm:h-[26px]" strokeWidth={view === 'savings' ? 3 : 2} />
                    <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-widest font-bold">Savings</span>
                  </button>

                  {user.cateringEnabled ? (
                    <button onClick={() => setView('meals')} className={`flex flex-col items-center gap-1 sm:gap-2 transition-all ${view === 'meals' ? 'theme-text scale-110 neon-glow-theme' : 'text-indigo-200/50 hover:text-indigo-100'}`}>
                      <Utensils size={22} className="sm:w-[26px] sm:h-[26px]" strokeWidth={view === 'meals' ? 3 : 2} />
                      <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-widest font-bold">Meals</span>
                    </button>
                  ) : (
                    <button onClick={() => setView('settings')} className={`flex flex-col items-center gap-1 sm:gap-2 transition-all ${view === 'settings' ? 'theme-text scale-110 neon-glow-theme' : 'text-indigo-200/50 hover:text-indigo-100'}`}>
                      <Settings size={22} className="sm:w-[26px] sm:h-[26px]" strokeWidth={view === 'settings' ? 3 : 2} />
                      <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-widest font-bold">User</span>
                    </button>
                  )}

                </div>
              </div>
            </div>
          )}
        </main>
      </div >
    </div >
  );
};

const AddExpenseInput = ({ onAdd, onCancel, handleNumericInput }) => {
  const [amount, setAmount] = useState('');
  const [cat, setCat] = useState('Snacks');
  const categories = ['Meals', 'Fun', 'Travel', 'Shop', 'Health', 'Gifts'];
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-center gap-2">
        <span className="text-2xl sm:text-3xl font-black theme-text font-mono">৳</span>
        <input type="text" inputMode="decimal" autoFocus className="bg-transparent responsive-text-huge font-black text-white w-full outline-none text-center font-mono placeholder:text-indigo-950" placeholder="0.00" value={amount} onChange={e => handleNumericInput(e.target.value, setAmount)} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {categories.map(c => {
          const Icon = CATEGORY_ICONS[c] || DollarSign;
          return (
            <button key={c} type="button" onClick={() => setCat(c)} className={`py-2 sm:py-3 rounded-xl sm:rounded-2xl text-[8px] sm:text-[9px] font-black uppercase border-none transition-all tracking-widest font-bold flex flex-col items-center gap-1 ${cat === c ? 'theme-bg text-white shadow-lg' : 'bg-indigo-950/20 text-indigo-400'}`}>
              <Icon size={16} />
              {c}
            </button>
          );
        })}
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={onCancel} className="flex-1 py-3 bg-indigo-950/40 text-indigo-300 font-black rounded-xl sm:rounded-2xl text-[9px] uppercase tracking-widest transition-all hover:text-white font-bold border-none shadow-md">Abort</button>
        <button onClick={() => onAdd(amount, cat)} disabled={!amount} className="flex-[2] py-3 theme-bg text-white font-black rounded-xl sm:rounded-2xl shadow-lg shadow-indigo-500/30 text-[9px] uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all font-bold border-none disabled:opacity-50 disabled:pointer-events-none">Log Cost</button>
      </div>
    </div>
  );

};

const AddSavingsInput = ({ onAdd, onCancel, handleNumericInput }) => {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [days, setDays] = useState('30');

  return (
    <div className="w-full flex flex-col justify-center animate-in slide-in-from-bottom duration-500 pb-20">
      <div className="cute-card p-6 sm:p-10 shadow-2xl mx-4">
        <div className="text-center mb-6">
          <PiggyBank size={48} className="mx-auto text-emerald-400 mb-4 animate-bounce" />
          <p className="text-[10px] font-black theme-text uppercase tracking-[0.4em] mb-1">New Savings Goal</p>
        </div>

        <div className="space-y-4">
          <input type="text" placeholder="GOAL NAME (e.g. New Bike)" autoFocus className="w-full bg-black/20 p-4 rounded-2xl text-white font-bold text-sm outline-none focus:ring-1 ring-white/20 text-center placeholder:text-indigo-900" value={name} onChange={e => setName(e.target.value)} />

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-black">৳</span>
            <input type="text" inputMode="decimal" placeholder="TARGET AMOUNT" className="w-full bg-black/20 p-4 pl-8 rounded-2xl text-white font-bold text-sm outline-none focus:ring-1 ring-white/20 text-center placeholder:text-indigo-900" value={target} onChange={e => handleNumericInput(e.target.value, setTarget)} />
          </div>

          <div className="relative">
            <input type="text" inputMode="numeric" placeholder="DAYS TO COMPLETE" className="w-full bg-black/20 p-4 rounded-2xl text-white font-bold text-sm outline-none focus:ring-1 ring-white/20 text-center placeholder:text-indigo-900" value={days} onChange={e => handleNumericInput(e.target.value, setDays)} />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-500 font-bold text-xs uppercase">days</span>
          </div>

          {name && target && days && (
            <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-3 text-center">
              <p className="text-[9px] font-black text-emerald-300 uppercase tracking-widest">
                Save ৳{Math.round(parseFloat(target) / parseInt(days))}/day to reach your goal
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button onClick={onCancel} className="flex-1 py-4 bg-indigo-950/40 text-indigo-400 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:text-white transition-colors">Cancel</button>
            <button onClick={() => name && target && days && onAdd(name, target, parseInt(days))} disabled={!name || !target || !days} className="flex-[2] py-4 theme-bg text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none">Create Goal</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
