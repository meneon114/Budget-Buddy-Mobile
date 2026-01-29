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
  Sparkles,
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
  CheckCircle
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
  orange: { primary: '#fb923c', glow: 'rgba(251, 146, 60, 0.4)', soft: 'rgba(251, 146, 60, 0.1)', muted: 'rgba(251, 146, 60, 0.04)' },
  grey: { primary: '#94a3b8', glow: 'rgba(148, 163, 184, 0.4)', soft: 'rgba(148, 163, 184, 0.1)', muted: 'rgba(148, 163, 184, 0.04)' },
  brown: { primary: '#a8a29e', glow: 'rgba(168, 162, 158, 0.4)', soft: 'rgba(168, 162, 158, 0.1)', muted: 'rgba(168, 162, 158, 0.04)' },
  pink: { primary: '#f472b6', glow: 'rgba(244, 114, 182, 0.4)', soft: 'rgba(244, 114, 182, 0.1)', muted: 'rgba(244, 114, 182, 0.04)' },
  blue: { primary: '#60a5fa', glow: 'rgba(96, 165, 250, 0.4)', soft: 'rgba(96, 165, 250, 0.1)', muted: 'rgba(96, 165, 250, 0.04)' },
  green: { primary: '#34d399', glow: 'rgba(52, 211, 153, 0.4)', soft: 'rgba(52, 211, 153, 0.1)', muted: 'rgba(52, 211, 153, 0.04)' },
  purple: { primary: '#a78bfa', glow: 'rgba(167, 139, 250, 0.4)', soft: 'rgba(167, 139, 250, 0.1)', muted: 'rgba(167, 139, 250, 0.04)' },
  red: { primary: '#fb7185', glow: 'rgba(251, 113, 133, 0.4)', soft: 'rgba(251, 113, 133, 0.1)', muted: 'rgba(251, 113, 133, 0.04)' }
};

const DIALOGUES = {
  happy: ["I feel so bouncy!", "You're the best!", "Yay for saving!", "Heart full of life!"],
  worried: ["Is the budget okay?", "I'm a bit nervous...", "Let's be careful...", "Budget is tight...", "Stay strong!"],
  critical: ["S-s-so cold...", "Need warmth...", "Must... save...", "Running... on... empty...", "Budget... f-fading..."],
  passed_out: ["Gone to pixel heaven.", "Rest in Pixels.", "Budget flatline.", "revive me..."],
  heartbroken: ["My poor heart!", "Don't buy it!", "But the savings...", "Is it worth it?", "I'm crying..."]
};

const GlobalStyles = ({ color }) => {
  const theme = THEME_COLORS[color] || THEME_COLORS.orange;
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
      .scrollbar-hide::-webkit-scrollbar { display: none; }
      body { 
        background-color: #080717; 
        background-image: radial-gradient(circle at top right, var(--theme-muted), #080717);
        color: #fdf2f8; 
        font-family: 'Inter', sans-serif;
        height: 100vh;
        width: 100vw;
        overflow: hidden;
        overscroll-behavior: none;
      }
      #root { height: 100%; width: 100%; overflow: hidden; }
      .theme-bg { background-color: var(--theme-primary); }
      .theme-text { color: var(--theme-primary); }
      .neon-glow-theme { filter: drop-shadow(0 0 15px var(--theme-glow)); }
      .pulse-button { animation: pulse-nav 2s infinite; }
      svg { shape-rendering: crispEdges; }
      input { border: none !important; outline: none !important; }
      .responsive-text-huge { font-size: clamp(2rem, 10vw, 4rem); }
      .responsive-text-huge { font-size: clamp(2rem, 10vw, 4rem); }
    `}</style>
  );
};



const PixelPet = ({ type, color, accessory, mood, isAdding, showHearts = false }) => {
  const baseColors = {
    orange: { 1: '#fb923c', 2: '#ea580c', 3: '#ffedd5', 5: '#fb7185' },
    grey: { 1: '#94a3b8', 2: '#475569', 3: '#f1f5f9', 5: '#fb7185' },
    brown: { 1: '#a8a29e', 2: '#57534e', 3: '#fafaf9', 5: '#fb7185' },
    pink: { 1: '#f472b6', 2: '#db2777', 3: '#fdf2f8', 5: '#be185d' },
    blue: { 1: '#60a5fa', 2: '#2563eb', 3: '#dbeafe', 5: '#fb7185' },
    green: { 1: '#34d399', 2: '#059669', 3: '#d1fae5', 5: '#fb7185' },
    purple: { 1: '#a78bfa', 2: '#7c3aed', 3: '#ede9fe', 5: '#fb7185' },
    red: { 1: '#fb7185', 2: '#e11d48', 3: '#ffe4e6', 5: '#881337' }
  };

  const palette = { ...baseColors[color], 4: '#1e1b4b' };
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
    <div className="relative flex flex-col items-center w-full max-w-[200px] mx-auto">
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
    </div>
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
  <div className="h-full flex flex-col justify-center animate-in fade-in duration-1000 bg-[#0c0a1f]">
    <div className="cute-card p-6 sm:p-10 shadow-2xl relative overflow-hidden w-full max-w-md mx-auto">
      <div className="flex justify-center mb-8 scale-[0.8]">
        <PixelPet type={user.petType} color={user.petColor} accessory={user.petAccessory} mood="happy" isAdding={false} />
      </div>
      <h1 className="text-2xl sm:text-3xl font-black text-white text-center mb-2 tracking-tight uppercase">{isEditing ? "Update Profile" : "Budget Buddy"}</h1>
      <p className="text-indigo-400 text-center text-[10px] font-bold uppercase tracking-[0.4em] mb-8">Adopt your Savings Buddy</p>
      <form onSubmit={e => { e.preventDefault(); onComplete(); }} className="space-y-4 sm:space-y-6">
        <div className="bg-indigo-950/30 rounded-2xl p-4">
          <label className="text-[10px] font-black theme-text uppercase tracking-widest mb-1 block">Your Name</label>
          <input type="text" required placeholder="ALEX" className="bg-transparent w-full text-white placeholder:text-indigo-900 outline-none font-bold uppercase text-sm" value={user.name} onChange={e => setUser({ ...user, name: e.target.value.toUpperCase() })} />
        </div>
        <div className="flex gap-3">
          <div className="bg-indigo-950/30 rounded-2xl p-4 w-1/2">
            <label className="text-[10px] font-black theme-text uppercase tracking-widest mb-1 block">Monthly Income</label>
            <input type="text" inputMode="decimal" required placeholder="25000" className="bg-transparent w-full text-white placeholder:text-indigo-900 outline-none font-bold text-sm" value={user.income} onChange={e => handleNumericInput(e.target.value, setUser, 'income')} />
          </div>
          <div className="bg-indigo-950/30 rounded-2xl p-4 w-1/2">
            <label className="text-[10px] font-black theme-text uppercase tracking-widest mb-1 block">Savings Goal</label>
            <input type="text" inputMode="decimal" required placeholder="5000" className="bg-transparent w-full text-white placeholder:text-indigo-900 outline-none font-bold text-sm" value={user.savingsGoal} onChange={e => handleNumericInput(e.target.value, setUser, 'savingsGoal')} />
          </div>
        </div>
        <div className="space-y-4 pt-4 text-center">
          <div className="flex gap-2">
            {['cat', 'dog', 'rabbit'].map(t => (<button key={t} type="button" onClick={() => setUser({ ...user, petType: t })} className={`flex-1 py-3 rounded-xl border-none font-black text-[10px] uppercase transition-all ${user.petType === t ? 'theme-bg text-white shadow-lg shadow-[var(--theme-glow)]' : 'bg-indigo-950/20 text-indigo-400'}`}>{t}</button>))}
          </div>
          <div className="grid grid-cols-4 gap-4 px-6 pt-2 justify-items-center">
            {['orange', 'grey', 'brown', 'pink', 'blue', 'green', 'purple', 'red'].map(c => (<button key={c} type="button" onClick={() => setUser({ ...user, petColor: c })} className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-4 transition-all ${user.petColor === c ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-40'}`} style={{ backgroundColor: THEME_COLORS[c].primary }} />))}
          </div>
        </div>
        <button type="submit" disabled={!user.name || !user.income || !user.savingsGoal} className="w-full py-4 sm:py-5 theme-bg text-white font-black rounded-[2rem] shadow-2xl uppercase tracking-[0.2em] text-[10px] sm:text-xs hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none">{isEditing ? "Save Changes" : "Start Budgeting"}</button>
      </form>
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#0c0a1f]/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-[#0c0a1f] border border-white/10 p-8 rounded-[2rem] shadow-2xl text-center relative overflow-hidden animate-in zoom-in-95 duration-300">

        <div className="relative z-10">
          <div key={step} className="animate-in slide-in-from-right-8 fade-in duration-300 fill-mode-both">
            <div className="h-24 flex items-center justify-center mb-6">
              {/* Reverting to icons since pet is removed from popup */}
              {step === 0 && <Sparkles size={60} className="text-yellow-400 animate-pulse" />}
              {step === 1 && <Zap size={60} className="text-cyan-400 animate-pulse" />}
              {step === 2 && <Heart size={60} className="text-rose-400 animate-pulse" />}
              {step === 3 && <Award size={60} className="text-emerald-400 animate-pulse" />}
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">{slides[step].title}</h2>
            <p className="text-indigo-200 text-xs font-bold leading-relaxed mb-8 h-16">{slides[step].desc}</p>
          </div>

          <div className="flex gap-2 justify-center mb-8">
            {slides.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-white w-6' : 'bg-white/20'}`} />
            ))}
          </div>

          <div className="space-y-4">
            <button onClick={nextStep} className="w-full py-4 theme-bg text-white font-black rounded-2xl shadow-lg border-none active:scale-95 transition-all text-xs uppercase tracking-widest hover:brightness-110">
              {step === slides.length - 1 ? "Let's Start!" : "Next"}
            </button>
            <button onClick={onComplete} className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">
              Skip Tutorial
            </button>
          </div>
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

  return (
    <div className="h-full flex flex-col pt-0 animate-in fade-in">
      <h2 className="text-2xl sm:text-3xl font-black text-white mb-6 tracking-tighter uppercase px-2 text-center">Savings Goals</h2>

      <div className="flex-1 overflow-y-auto px-1 space-y-4 scrollbar-hide">
        {targets.map(t => (
          <div key={t.id} className="cute-card p-6 shadow-lg relative overflow-hidden">
            <div className="flex justify-between items-end mb-2">
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                  {t.name}
                  {activeId === t.id && <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1"><Target size={10} /> ACTIVE</span>}
                </h3>
                <p className="text-[10px] font-bold theme-text uppercase tracking-widest">Target: ৳{t.target.toLocaleString()}</p>
              </div>
              <p className="text-xl font-black text-white font-mono">৳{t.current.toLocaleString()}</p>
            </div>
            <div className="w-full bg-black/40 h-3 rounded-full overflow-hidden shadow-inner mb-4">
              <div className="h-full theme-bg shadow-[0_0_15px_var(--theme-glow)] transition-all duration-1000" style={{ width: `${Math.min((t.current / t.target) * 100, 100)}%` }} />
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
        ))}

        {targets.length === 0 && (
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
  const [newDue, setNewDue] = useState({ name: '', amount: '', day: '1' });
  const [showCalendar, setShowCalendar] = useState(false);

  const addDue = () => {
    if (!newDue.name || !newDue.amount || !newDue.day) return;
    setDues([...dues, { id: Date.now(), ...newDue, amount: parseFloat(newDue.amount) }]);
    setNewDue({ name: '', amount: '', day: '1' });
  };

  const removeDue = (id) => setDues(dues.filter(d => d.id !== id));

  return (
    <div className="h-full flex flex-col pt-0 animate-in fade-in duration-500">
      <h2 className="text-2xl font-black text-white mb-2 text-center uppercase tracking-tighter">Monthly Dues</h2>
      <p className="text-indigo-400 text-center text-[10px] font-bold uppercase tracking-widest mb-8">Rent, Internet, Subscriptions</p>

      <div className="flex-1 overflow-y-auto space-y-3 px-1 scrollbar-hide">
        {dues.map(d => (
          <div key={d.id} className="bg-[#1e1b4b]/60 backdrop-blur-md p-4 rounded-2xl flex justify-between items-center border border-indigo-500/20">
            <div>
              <p className="font-black text-white text-sm uppercase tracking-wide flex items-center gap-2"><Calendar size={12} className="text-indigo-400" /> {d.name}</p>
              <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mt-1">Due Day: {d.day}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono font-black text-white">৳{d.amount.toLocaleString()}</span>
              <button onClick={() => removeDue(d.id)} className="text-rose-500 p-2"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {dues.length === 0 && <div className="text-center opacity-30 py-8"><Clock size={48} className="mx-auto mb-2" /><p className="text-[10px] font-black uppercase tracking-widest">No recurring bills added</p></div>}
      </div>

      <div className="mt-4 bg-[#0c0a1f]/80 p-5 rounded-3xl border border-indigo-500/30">
        <div className="flex gap-2 mb-3">
          <input type="text" placeholder="Bill Name" className="flex-[2] min-w-0 bg-indigo-950/40 p-3 rounded-xl text-white font-bold text-xs outline-none focus:bg-indigo-950/60 transition-colors" value={newDue.name} onChange={e => setNewDue({ ...newDue, name: e.target.value })} />
          <input type="text" inputMode="decimal" placeholder="Amount" className="flex-1 min-w-0 bg-indigo-950/40 p-3 rounded-xl text-white font-bold text-xs outline-none focus:bg-indigo-950/60 transition-colors" value={newDue.amount} onChange={e => handleNumericInput(e.target.value, (val) => setNewDue(prev => ({ ...prev, amount: val })))} />
        </div>

        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setShowCalendar(true)} className="flex-1 flex justify-between items-center bg-indigo-950/40 p-3 rounded-xl hover:bg-indigo-950/60 transition-colors group">
            <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest group-hover:text-white transition-colors">Due Day: <span className="text-white text-xs ml-2">{newDue.day}</span></span>
            <Calendar size={16} className="text-indigo-400 group-hover:text-white transition-colors" />
          </button>
        </div>

        <button onClick={addDue} disabled={!newDue.name || !newDue.amount || !newDue.day} className="w-full py-3 bg-indigo-600 text-white font-black rounded-xl text-[10px] uppercase tracking-widest shadow-lg mb-4 disabled:opacity-50 disabled:pointer-events-none">Add Bill</button>
      </div>

      <button onClick={onComplete} className="w-full py-4 theme-bg text-white font-black rounded-[2rem] shadow-xl uppercase tracking-[0.2em] text-xs mt-4 hover:brightness-110 active:scale-95 transition-all">
        {dues.length > 0 ? "All Set!" : "Skip for Now"}
      </button>

      {showCalendar && (
        <CalendarPopup
          selectedDay={newDue.day}
          onSelect={(day) => { setNewDue({ ...newDue, day: day.toString() }); setShowCalendar(false); }}
          onClose={() => setShowCalendar(false)}
        />
      )}
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
        <div className="absolute top-0 right-0 p-4 opacity-10 theme-text"><Sparkles size={80} /></div>
        <div className="flex flex-col items-center text-center relative z-10">
          {type === 'alert' ? (
            <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400"><Sparkles size={32} /></div>
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

const App = () => {
  const [view, setView] = useState('onboarding');
  const [user, setUser] = useState({ name: '', income: '', savingsGoal: '', petType: 'cat', petColor: 'orange', petAccessory: 'none', activeTargetId: null });
  const [expenses, setExpenses] = useState([]);
  const [streakData, setStreakData] = useState({});
  const [savingsTargets, setSavingsTargets] = useState([]);
  const [monthlyDues, setMonthlyDues] = useState([]);
  const [lastRolloverDate, setLastRolloverDate] = useState(new Date().toISOString().split('T')[0]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [tutorialComplete, setTutorialComplete] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [popup, setPopup] = useState({ isOpen: false, type: 'alert', message: '', onConfirm: null, onCancel: null }); // Global Popup State


  const handleNumericInput = (val, setter, field = null) => {
    const clean = val.replace(/[^0-9.]/g, '');
    if ((clean.match(/\./g) || []).length > 1) return;
    if (field) setter(prev => ({ ...prev, [field]: clean }));
    else setter(clean);
  };

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed.user || { name: '', income: '', savingsGoal: '', petType: 'cat', petColor: 'orange', petAccessory: 'none', activeTargetId: null });
      setExpenses(parsed.expenses || []);
      setStreakData(parsed.streakData || {});
      setSavingsTargets(parsed.savingsTargets || []);
      setMonthlyDues(parsed.monthlyDues || []);
      setLastRolloverDate(parsed.lastRolloverDate || new Date().toISOString().split('T')[0]);
      setTutorialComplete(parsed.tutorialComplete || false);

      if (parsed.user?.name) {
        setView('dashboard');
      } else {
        setView('onboarding');
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
    const dailyBudget = Math.max(0, monthlyIncome - monthlyGoal - totalDues) / 30;

    while (currentDate < endDate) {
      const dStr = currentDate.toISOString().split('T')[0];
      // If no expenses for this day, rollover full daily budget
      const spentOnDay = expenses.filter(e => e.date.startsWith(dStr)).reduce((a, b) => a + b.amount, 0);

      if (spentOnDay === 0) {
        totalRollover += dailyBudget;
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

  }, [isInitialized, lastRolloverDate, user.activeTargetId, user.income, user.savingsGoal, expenses, monthlyDues]);






  useEffect(() => {
    if (isInitialized) localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, expenses, streakData, tutorialComplete, savingsTargets, lastRolloverDate, monthlyDues }));
  }, [user, expenses, streakData, tutorialComplete, savingsTargets, lastRolloverDate, monthlyDues, isInitialized]);

  const finishTutorial = () => {
    setTutorialComplete(true);
  };

  const stats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const daysRemaining = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate() + 1;
    const monthlyIncome = parseFloat(user.income) || 0;
    const monthlyGoal = parseFloat(user.savingsGoal) || 0;
    const totalDues = monthlyDues.reduce((a, b) => a + (parseFloat(b.amount) || 0), 0);
    const totalDisp = Math.max(0, monthlyIncome - monthlyGoal - totalDues);
    const currMonthExp = expenses.filter(e => { const d = new Date(e.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
    const totalSpent = currMonthExp.reduce((a, b) => a + b.amount, 0);
    const spentToday = currMonthExp.filter(e => new Date(e.date).toDateString() === now.toDateString()).reduce((a, b) => a + b.amount, 0);
    const budgetAllocatedToday = totalDisp / 30;
    const dailyRem = budgetAllocatedToday - spentToday;
    const dailyProg = budgetAllocatedToday > 0 ? (dailyRem / budgetAllocatedToday) * 100 : 0;

    let mood = 'happy';
    if (dailyRem <= 0) mood = 'passed_out';
    else if (dailyProg < 25) mood = 'critical';
    else if (dailyProg < 50) mood = 'worried';
    else mood = 'happy';

    const categoryTotals = currMonthExp.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

    return { dailyBudget: budgetAllocatedToday, dailyRemaining: dailyRem, dailyProgress: dailyProg, mood, spentToday, totalSpentThisMonth: totalSpent, categoryTotals, todayStr };
  }, [user, expenses, monthlyDues]);

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

  const exportData = () => {
    const data = { user, expenses, streakData, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `budget_buddy_data.json`; a.click();
  };

  return (
    <div className="h-screen w-screen bg-[#0c0a1f] text-indigo-50 font-sans relative overflow-hidden">
      <GlobalStyles color={user.petColor} />
      <div className="w-full h-full flex flex-col relative">
        <main className="w-full max-w-md h-full flex flex-col relative p-6 pb-32 text-center mx-auto overflow-y-auto scrollbar-hide">
          {view === 'onboarding' ? (
            <div className="flex-1 flex flex-col justify-center">
              <OnboardingView user={user} setUser={setUser} handleNumericInput={handleNumericInput} onComplete={() => setView('dues-setup')} />
            </div>
          ) : view === 'edit-profile' ? (
            <div className="flex-1 flex flex-col justify-center">
              <OnboardingView user={user} setUser={setUser} handleNumericInput={handleNumericInput} onComplete={() => setView('settings')} isEditing={true} />
            </div>
          ) : view === 'dues-setup' ? (
            <div className="flex-1 flex flex-col justify-center">
              <RecurringExpensesView dues={monthlyDues} setDues={setMonthlyDues} handleNumericInput={handleNumericInput} onComplete={() => setView('dashboard')} />
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {view === 'dashboard' && (
                <div className="flex-1 flex flex-col justify-evenly animate-in fade-in duration-700">
                  {/* Tutorial Popup Overlay */}
                  {!tutorialComplete && <TutorialPopup user={user} onComplete={finishTutorial} />}

                  {/* Top Stats Corners */}


                  <div className="flex flex-col items-center gap-1">
                    <p className="theme-text text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-2 neon-glow-theme">
                      <Sparkles size={14} className="animate-pulse theme-text" /> Welcome back, {user.name}
                    </p>
                    <div className="mt-1 flex items-center gap-2 bg-indigo-950/60 px-4 py-1.5 rounded-full shadow-lg transition-colors duration-500" style={{
                      borderColor: stats.mood === 'happy' ? '#34d399' : stats.mood === 'worried' ? '#fb923c' : stats.mood === 'critical' ? '#fb7185' : '#94a3b8',
                      borderWidth: '1px'
                    }}>
                      <ShieldCheck size={14} className="transition-colors duration-500" style={{ color: stats.mood === 'happy' ? '#34d399' : stats.mood === 'worried' ? '#fb923c' : stats.mood === 'critical' ? '#fb7185' : '#94a3b8' }} />
                      <p className="text-[9px] font-black uppercase tracking-widest font-bold transition-colors duration-500" style={{ color: stats.mood === 'happy' ? '#34d399' : stats.mood === 'worried' ? '#fb923c' : stats.mood === 'critical' ? '#fb7185' : '#94a3b8' }}>
                        Status: {stats.mood === 'happy' ? 'Happy' : stats.mood === 'worried' ? 'Worried' : stats.mood === 'critical' ? 'Critical' : 'Passed Out'}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center -my-4 sm:my-0 scale-[0.65] sm:scale-75 origin-center">
                    <PixelPet type={user.petType} color={user.petColor} accessory={user.petAccessory} mood={stats.mood} isAdding={false} showHearts={stats.mood === 'happy'} />
                  </div>

                  <div className="cute-card p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                    {/* Fire Streak */}
                    <div className="absolute top-0 right-6 p-4 flex items-center gap-2 z-10">
                      <span className="text-lg animate-pulse">🔥</span>
                      <span className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-rose-300 uppercase tracking-widest leading-none drop-shadow-[0_0_8px_rgba(251,146,60,0.3)]">
                        {Object.values(streakData).filter(v => v).length} {Object.values(streakData).filter(v => v).length === 1 ? 'Day' : 'Days'}
                      </span>
                    </div>
                    <p className="text-[10px] font-black theme-text uppercase tracking-[0.4em] mb-4 text-center">Daily Budget</p>
                    <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter mb-8 font-mono break-all leading-tight">৳{stats.dailyRemaining.toFixed(2)}</h2>
                    <div className="space-y-4 px-2">
                      <div className="w-full bg-black/60 h-6 sm:h-8 rounded-full p-1 sm:p-1.5 relative overflow-hidden shadow-inner">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${stats.mood === 'passed_out' ? 'bg-gray-700' : 'theme-bg shadow-[0_0_20px_var(--theme-glow)]'}`}
                          style={{ width: `${Math.min(Math.max(stats.dailyProgress, 0), 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between w-full text-[9px] font-black uppercase tracking-widest text-indigo-300 px-1 mt-1">
                        <span>Spent: ৳{stats.spentToday.toFixed(0)}</span>
                        <span>Budget: ৳{stats.dailyBudget.toFixed(0)}</span>
                      </div>
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



                  {monthlyDues.length > 0 && (
                    <div className="w-full mb-2">
                      <p className="text-[9px] font-black text-indigo-300/60 uppercase tracking-[0.3em] mb-2 px-1 text-left">Monthly Dues</p>
                      <div className="w-full overflow-x-auto whitespace-nowrap scrollbar-hide px-1 py-1">
                        <div className="inline-flex gap-2">
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
                                  className={`p-4 w-40 shrink-0 inline-block rounded-2xl border flex flex-col relative overflow-hidden backdrop-blur-sm transition-all active:scale-95 text-left
                                     ${d.isPaidThisMonth
                                      ? 'bg-emerald-950/20 border-emerald-500/30 opacity-60 grayscale-[0.5]'
                                      : isUrgent
                                        ? 'bg-rose-950/20 border-rose-500/30'
                                        : 'bg-indigo-950/30 border-indigo-500/10'}`}
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[9px] font-black uppercase tracking-wider truncate max-w-[80px] ${d.isPaidThisMonth ? 'text-emerald-400 decoration-emerald-500/50' : 'text-white'}`}>{d.name}</span>
                                    {d.isPaidThisMonth ? <CheckCircle size={12} className="text-emerald-400" /> : <Calendar size={12} className={isUrgent ? 'text-rose-400' : 'text-indigo-400'} />}
                                  </div>
                                  <p className={`text-sm font-black font-mono mb-2 ${d.isPaidThisMonth ? 'text-emerald-200 line-through decoration-emerald-500/50' : 'text-white'}`}>৳{d.amount.toLocaleString()}</p>
                                  <div className={`mt-auto text-[7px] font-bold uppercase tracking-widest px-2 py-1 rounded-full w-fit 
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
                  onConfirm={popup.onConfirm}
                  onCancel={popup.onCancel || (() => setPopup(prev => ({ ...prev, isOpen: false })))}
                />
              )}

              {view === 'add' && (
                <div className="h-full flex flex-col justify-center animate-in slide-in-from-bottom duration-500">
                  <div className="flex flex-col items-center mb-8">
                    <PixelPet type={user.petType} color={user.petColor} accessory={user.petAccessory} mood="happy" isAdding={true} />
                    <div className="mt-8 bg-rose-500/20 px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest animate-shiver shadow-[0_0_20px_rgba(244,63,94,0.3)]">Heartbreak Warning...</div>
                  </div>
                  <div className="cute-card p-6 sm:p-10 shadow-2xl">
                    <div className="text-center">
                      <p className="text-[10px] font-black theme-text uppercase tracking-[0.4em] mb-4 text-center">Cost Input</p>
                      <AddExpenseInput onAdd={addExpense} onCancel={() => setView('dashboard')} handleNumericInput={handleNumericInput} />
                    </div>
                  </div>
                </div>
              )}

              {view === 'history' && (
                <div className="h-full flex flex-col pt-0 animate-in fade-in">
                  <h2 className="text-2xl sm:text-3xl font-black text-white mb-6 tracking-tighter uppercase px-2 text-center">History & Stats</h2>
                  <div className="space-y-4 px-1 overflow-y-auto flex-1 scrollbar-hide pb-20">

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
                  onAdd={(name, target) => {
                    setSavingsTargets([...savingsTargets, { id: Date.now(), name: name, target: parseFloat(target), current: 0 }]);
                    setView('savings');
                  }}
                  onCancel={() => setView('savings')}
                  handleNumericInput={handleNumericInput}
                />
              )}

              {view === 'settings' && (
                <div className="h-full flex flex-col justify-center animate-in fade-in">
                  <h2 className="text-2xl sm:text-3xl font-black text-white mb-8 tracking-tighter uppercase px-2">Settings</h2>
                  <div className="cute-card rounded-[2.5rem] p-8 text-center mb-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 opacity-10 rotate-12 theme-text"><Wallet size={160} /></div>
                    <div className="w-20 h-20 theme-bg rounded-[2rem] mx-auto flex items-center justify-center text-white text-4xl font-black mb-6 shadow-2xl shadow-black/50">{user.name.charAt(0)}</div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-bold">{user.name}</h3>
                  </div>
                  <div className="space-y-3 px-2">
                    <button onClick={() => setView('edit-profile')} className="w-full p-5 cute-card flex items-center justify-between font-black text-white uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all shadow-md">Edit Profile <ChevronRight size={18} /></button>
                    <button onClick={() => setView('dues-setup')} className="w-full p-5 cute-card flex items-center justify-between font-black text-white uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all shadow-md">Manage Dues <Calendar size={18} /></button>
                    <button onClick={exportData} className="w-full p-5 cute-card flex items-center justify-between font-black text-emerald-400 uppercase text-[10px] tracking-widest hover:bg-emerald-500/10 transition-all font-bold shadow-md">Export Data <Download size={18} /></button>
                    <button onClick={() => setShowResetConfirm(true)} className="w-full p-5 bg-rose-950/20 rounded-3xl flex items-center justify-between font-black text-rose-500 uppercase text-[10px] tracking-widest hover:bg-rose-900/40 transition-all font-bold shadow-md">Reset App</button>
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


              {/* Bottom Nav Dock */}
              <div className={`fixed bottom-6 left-0 right-0 z-[100] px-4 sm:px-6 overflow-visible transition-all duration-1000`}>
                <div className="mx-auto max-w-md bg-black/95 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,1)] rounded-[3rem] px-4 sm:px-8 py-4 sm:py-6 flex justify-between items-center relative overflow-visible ring-1 ring-white/10">

                  <button onClick={() => setView('dashboard')} className={`flex flex-col items-center gap-1 sm:gap-2 transition-all ${view === 'dashboard' ? 'theme-text scale-110 neon-glow-theme' : 'text-indigo-200/50 hover:text-indigo-100'}`}>
                    <Home size={22} className="sm:w-[26px] sm:h-[26px]" strokeWidth={view === 'dashboard' ? 3 : 2} />
                    <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-widest font-bold">Home</span>
                  </button>

                  <button onClick={() => setView('history')} className={`flex flex-col items-center gap-1 sm:gap-2 transition-all ${view === 'history' ? 'theme-text scale-110 neon-glow-theme' : 'text-indigo-200/50 hover:text-indigo-100'}`}>
                    <History size={22} className="sm:w-[26px] sm:h-[26px]" strokeWidth={view === 'history' ? 3 : 2} />
                    <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-widest font-bold">History</span>
                  </button>

                  <div className="relative -mt-20 sm:-mt-24 overflow-visible">
                    <button
                      onClick={() => view === 'savings' ? setView('add-savings') : setView('add')}
                      className="theme-bg w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white shadow-[0_0_40px_var(--theme-glow)] ring-[12px] sm:ring-[16px] ring-[#0c0a1f] active:scale-90 transition-all hover:brightness-110 z-[110] pulse-button"
                    >
                      <PlusCircle size={32} className="sm:w-[40px] sm:h-[40px] drop-shadow-[0_0_12px_white]" strokeWidth={2.5} />
                    </button>
                  </div>

                  <button onClick={() => setView('savings')} className={`flex flex-col items-center gap-1 sm:gap-2 transition-all ${view === 'savings' ? 'theme-text scale-110 neon-glow-theme' : 'text-indigo-200/50 hover:text-indigo-100'}`}>
                    <PiggyBank size={22} className="sm:w-[26px] sm:h-[26px]" strokeWidth={view === 'savings' ? 3 : 2} />
                    <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-widest font-bold">Savings</span>
                  </button>

                  <button onClick={() => setView('settings')} className={`flex flex-col items-center gap-1 sm:gap-2 transition-all ${view === 'settings' ? 'theme-text scale-110 neon-glow-theme' : 'text-indigo-200/50 hover:text-indigo-100'}`}>
                    <Settings size={22} className="sm:w-[26px] sm:h-[26px]" strokeWidth={view === 'settings' ? 3 : 2} />
                    <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-widest font-bold">User</span>
                  </button>

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
    <div className="w-full space-y-8 sm:space-y-10">
      <div className="flex items-center justify-center gap-2">
        <span className="text-2xl sm:text-4xl font-black theme-text font-mono">৳</span>
        <input type="text" inputMode="decimal" autoFocus className="bg-transparent responsive-text-huge font-black text-white w-full outline-none text-center font-mono placeholder:text-indigo-950" placeholder="0.00" value={amount} onChange={e => handleNumericInput(e.target.value, setAmount)} />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {categories.map(c => {
          const Icon = CATEGORY_ICONS[c] || DollarSign;
          return (
            <button key={c} type="button" onClick={() => setCat(c)} className={`py-3 sm:py-4 rounded-2xl sm:rounded-3xl text-[9px] sm:text-[10px] font-black uppercase border-none transition-all tracking-widest font-bold flex flex-col items-center gap-2 ${cat === c ? 'theme-bg text-white shadow-2xl' : 'bg-indigo-950/20 text-indigo-400'}`}>
              <Icon size={20} />
              {c}
            </button>
          );
        })}
      </div>
      <div className="flex gap-4 pt-4 sm:pt-6">
        <button onClick={onCancel} className="flex-1 py-4 sm:py-5 bg-indigo-950/40 text-indigo-300 font-black rounded-2xl sm:rounded-3xl text-[9px] sm:text-[11px] uppercase tracking-widest transition-all hover:text-white font-bold border-none shadow-md">Abort</button>
        <button onClick={() => onAdd(amount, cat)} disabled={!amount} className="flex-[2] py-4 sm:py-5 theme-bg text-white font-black rounded-2xl sm:rounded-3xl shadow-xl shadow-indigo-500/30 text-[9px] sm:text-[11px] uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all font-bold border-none disabled:opacity-50 disabled:pointer-events-none">Log Cost</button>
      </div>
    </div>
  );

};

const AddSavingsInput = ({ onAdd, onCancel, handleNumericInput }) => {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');

  return (
    <div className="h-full flex flex-col justify-center animate-in slide-in-from-bottom duration-500">
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

          <div className="flex gap-3 pt-4">
            <button onClick={onCancel} className="flex-1 py-4 bg-indigo-950/40 text-indigo-400 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:text-white transition-colors">Cancel</button>
            <button onClick={() => name && target && onAdd(name, target)} disabled={!name || !target} className="flex-[2] py-4 theme-bg text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none">Create Goal</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
