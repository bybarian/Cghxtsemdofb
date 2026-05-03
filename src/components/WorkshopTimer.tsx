import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Lock, Clock, Volume2, ShieldAlert, Timer as TimerIcon, 
  StopCircle, Maximize2, Minimize2, ChevronRight, Settings2,
  Calendar, MapPin, User as UserIcon, BellRing
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';
import { motion, AnimatePresence } from 'motion/react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Stage {
  id: string;
  label: string;
  duration: number; // in minutes
  voice: string;
  type: 'lecture' | 'break' | 'workshop';
}

const WORKSHOP_STAGES: Stage[] = [
  // Session 1 Round 1 (14:20-14:55)
  { id: 's1r1pdt', label: "S1-R1：PDT 複習", duration: 7, type: 'workshop', voice: "回饋演練開始，請進行 PDT 複習。" },
  { id: 's1r1vid', label: "S1-R1：播放影片", duration: 5, type: 'workshop', voice: "現在開始播放演練影片。" },
  { id: 's1r1prep', label: "S1-R1：回饋準備", duration: 8, type: 'workshop', voice: "影片結束，請引導學員進行回饋準備與討論。" },
  { id: 's1r1exec', label: "S1-R1：進行回饋", duration: 7, type: 'workshop', voice: "標準住院醫師進入診間，開始回饋練習。" },
  { id: 's1r1summ', label: "S1-R1：回饋總結", duration: 8, type: 'workshop', voice: "回饋時間結束，請進行總結。" },
  
  { id: 'break1', label: "換場休息", duration: 5, type: 'break', voice: "現在是換場休息時間。" },
  
  // Session 1 Round 2 (15:00-15:25)
  { id: 's1r2vid', label: "S1-R2：播放影片", duration: 5, type: 'workshop', voice: "第二輪播放影片開始。" },
  { id: 's1r2prep', label: "S1-R2：回饋準備", duration: 6, type: 'workshop', voice: "請開始回饋準備討論。" },
  { id: 's1r2exec', label: "S1-R2：進行回饋", duration: 7, type: 'workshop', voice: "標準住院醫師進入診間，進行第二輪回饋。" },
  { id: 's1r2summ', label: "S1-R2：回饋總結", duration: 7, type: 'workshop', voice: "Session 1 回饋演練圓滿結束。" },
  
  { id: 'coffee', label: "咖啡茶敘", duration: 20, type: 'break', voice: "現在是咖啡茶敘時間，二十分鐘後開始 Session 2。" },
  
  // Session 2 Round 1 (15:45-16:20)
  { id: 's2r1pdt', label: "S2-R1：PDT 複習", duration: 7, type: 'workshop', voice: "Session 2 開始，請進行 PDT 複習。" },
  { id: 's2r1vid', label: "S2-R1：播放影片", duration: 5, type: 'workshop', voice: "播放演練影片。" },
  { id: 's2r1prep', label: "S2-R1：回饋準備", duration: 8, type: 'workshop', voice: "請引導回饋準備。" },
  { id: 's2r1exec', label: "S2-R1：進行回饋", duration: 7, type: 'workshop', voice: "標準住院醫師進入，開始回饋。" },
  { id: 's2r1summ', label: "S2-R1：回饋總結", duration: 8, type: 'workshop', voice: "回饋總結。" },
  
  { id: 'break2', label: "換場休息", duration: 5, type: 'break', voice: "換場休息。" },
  
  // Session 2 Round 2 (16:25-16:50)
  { id: 's2r2vid', label: "S2-R2：播放影片", duration: 5, type: 'workshop', voice: "最後一輪播放影片。" },
  { id: 's2r2prep', label: "S2-R2：回饋準備", duration: 6, type: 'workshop', voice: "回饋準備。" },
  { id: 's2r2exec', label: "S2-R2：進行回饋", duration: 7, type: 'workshop', voice: "進行回饋。" },
  { id: 's2r2summ', label: "S2-R2：回饋總結", duration: 7, type: 'workshop', voice: "所有回饋演練結束。" },
  
  { id: 'closing', label: "總結討論", duration: 20, type: 'lecture', voice: "工作坊圓滿結束，請進行總結與討論。" },
];

export function WorkshopTimer() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isImmersive, setIsImmersive] = useState(false);
  const [password, setPassword] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [showError, setShowError] = useState(false);
  const [customStartTime, setCustomStartTime] = useState("14:20");
  
  const lastAnnouncedIdRef = useRef<string | null>(null);

  // Sync clock
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate current state based on startTime
  const getTimeline = () => {
    if (!startTime) return { current: null, next: null, elapsedInStage: 0, totalInStage: 0, progress: 0, index: -1 };
    
    let accumulatedTime = startTime;
    for (let i = 0; i < WORKSHOP_STAGES.length; i++) {
      const stage = WORKSHOP_STAGES[i];
      const stageDurationMs = stage.duration * 60000;
      const stageEnd = accumulatedTime + stageDurationMs;
      
      if (now >= accumulatedTime && now < stageEnd) {
        const elapsed = now - accumulatedTime;
        return {
          current: stage,
          next: WORKSHOP_STAGES[i + 1] || null,
          elapsedInStage: elapsed,
          totalInStage: stageDurationMs,
          progress: (elapsed / stageDurationMs) * 100,
          index: i
        };
      }
      accumulatedTime = stageEnd;
    }
    
    return { current: null, next: null, elapsedInStage: 0, totalInStage: 0, progress: 0, index: WORKSHOP_STAGES.length };
  };

  const timeline = getTimeline();

  // Voice Announcement logic
  useEffect(() => {
    if (isRunning && timeline.current && timeline.current.id !== lastAnnouncedIdRef.current) {
      announce(timeline.current.voice);
      lastAnnouncedIdRef.current = timeline.current.id;
    }
  }, [timeline.current?.id, isRunning]);

  const announce = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-TW';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStart = () => {
    if (isRunning) {
      setIsRunning(false);
      setStartTime(null);
      return;
    }
    const [h, m] = customStartTime.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    setStartTime(d.getTime());
    setIsRunning(true);
  };

  const formatCountdown = (ms: number) => {
    const totalSecs = Math.max(0, Math.floor(ms / 1000));
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'cgh888') {
      setIsUnlocked(true);
      setShowError(false);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    }
  };

  // Immersive Mode UI
  if (isImmersive) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#fdfdfd] flex flex-col font-sans select-none overflow-hidden">
        {/* Header - Green/Brand Theme */}
        <div className="bg-cathay-green text-white p-6 flex items-center justify-between shadow-2xl relative z-10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-white/10 p-2 rounded-2xl ring-1 ring-white/20">
              <div className="flex items-center gap-1">
                <img src="/logo_cgh.png" alt="CGH" className="h-8 md:h-10 w-auto object-contain" onError={e => e.currentTarget.style.display='none'} />
                <div className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-black">CGH</div>
              </div>
              <div className="w-px h-6 bg-white/20" />
              <div className="flex items-center gap-1">
                <img src="/logo_tsem.png" alt="TSEM" className="h-8 md:h-10 w-auto object-contain" onError={e => e.currentTarget.style.display='none'} />
                <div className="bg-slate-800/40 px-2 py-0.5 rounded text-[10px] font-black">TSEM</div>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                臨床教練工作坊
                <span className="bg-amber-400 text-cathay-green text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-black ring-1 ring-white/50">Digital Timeline</span>
              </h1>
              <div className="flex items-center gap-4 text-white/70 text-[13px] font-bold mt-1">
                <div className="flex items-center gap-1.5"><MapPin size={14} /> 國泰人壽大樓 33 會議室 | 臨床技能中心</div>
                <div className="w-1 h-1 rounded-full bg-white/30" />
                <div className="flex items-center gap-1.5"><UserIcon size={14} /> 國泰綜合醫院教學部</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-right">
              <div className="text-white/60 text-xs font-black uppercase tracking-widest mb-1">Current Wall Clock</div>
              <div className="text-4xl font-mono font-black tabular-nums">{new Date(now).toLocaleTimeString('zh-TW', { hour12: false })}</div>
            </div>
            <button 
              onClick={() => setIsImmersive(false)}
              className="bg-white/10 hover:bg-white/20 p-4 rounded-3xl transition-all shadow-inner border border-white/20 active:scale-95"
            >
              <Minimize2 size={24} />
            </button>
          </div>
        </div>

        {/* Main Countdown Area - White/Clean Aesthetic like the screenshot */}
        <div className="flex-1 flex flex-col items-center justify-center p-12 relative">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00813c 1px, transparent 0)', backgroundSize: '40px 40px' }} />

          <AnimatePresence mode="wait">
            {timeline.current ? (
              <motion.div 
                key={timeline.current.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="w-full max-w-6xl flex flex-col items-center text-center relative z-10"
              >
                <div className="bg-white border-2 border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] rounded-[4rem] p-16 md:p-24 w-full flex flex-col items-center">
                  <div className="flex items-center gap-3 mb-8 bg-cathay-light px-6 py-2 rounded-full border border-cathay-green/20">
                    <span className={cn("w-3 h-3 rounded-full animate-pulse", 
                      timeline.current.type === 'break' ? "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]" : "bg-cathay-green shadow-[0_0_15px_rgba(0,129,60,0.5)]"
                    )} />
                    <span className="text-cathay-green font-black uppercase tracking-[0.2em] text-sm">
                      {timeline.current.type === 'break' ? "休息時段 BREAK TIME" : "現在進行項目 ACTIVE STAGE"}
                    </span>
                  </div>

                  <h2 className={cn(
                    "text-7xl md:text-9xl font-black mb-8 tracking-tighter leading-none px-4",
                    timeline.current.type === 'break' ? "text-amber-600" : "text-slate-900"
                  )}>
                    {timeline.current.label}
                  </h2>
                  
                  <div className="relative">
                    <div className="text-[14rem] md:text-[20rem] font-mono font-black leading-none text-[#ff8a00] drop-shadow-[0_20px_40px_rgba(255,138,0,0.3)] tabular-nums">
                      {formatCountdown(timeline.totalInStage - timeline.elapsedInStage)}
                    </div>
                    <div className="mt-8 text-slate-400 font-black uppercase tracking-[0.3em] text-xl">
                       剩 餘 時 間 <span className="text-slate-300 font-normal">MOVE TIME</span>
                    </div>
                  </div>

                  {/* Progress Visualization */}
                  <div className="mt-16 w-full max-w-4xl px-4">
                    <div className="flex items-center justify-between mb-4">
                       <span className="text-slate-400 font-black text-xs uppercase tracking-widest">Station Progress</span>
                       <span className="text-slate-800 font-black text-sm">{Math.round((timeline.index / WORKSHOP_STAGES.length) * 100)}% 完成</span>
                    </div>
                    <div className="flex items-center gap-2 w-full h-4 bg-slate-100 rounded-full p-1 border border-slate-200 overflow-hidden">
                      {WORKSHOP_STAGES.map((s, idx) => (
                        <div 
                          key={idx} 
                          className={cn(
                            "flex-1 h-full rounded-full transition-all duration-700",
                            idx < timeline.index ? "bg-cathay-green" : 
                            idx === timeline.index ? "bg-[#ff8a00] animate-pulse" : 
                            "bg-slate-200"
                          )} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center bg-white p-24 rounded-[4rem] shadow-xl border border-slate-100">
                 <h2 className="text-5xl font-black text-cathay-green mb-8">
                   {now < (startTime || 0) ? "活動準備中" : "今日課程已圓滿結束"}
                 </h2>
                 {now < (startTime || 0) && (
                   <div className="flex flex-col items-center">
                     <span className="text-slate-400 font-black tracking-widest uppercase mb-4">距離開始還有</span>
                     <div className="text-[12rem] font-mono font-black text-slate-800 tabular-nums">
                        {startTime ? formatCountdown(startTime - now) : "00:00"}
                     </div>
                   </div>
                 )}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8 bg-slate-50 border-t border-slate-200 shadow-[0_-20px_40px_rgba(0,0,0,0.02)]">
           {/* Current Task Detail */}
           <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-start gap-4 shadow-sm group">
              <div className="bg-cathay-green text-white p-4 rounded-3xl shadow-[0_10px_20px_-5px_rgba(0,129,60,0.3)] transition-transform group-hover:scale-110">
                 <BellRing size={28} />
              </div>
              <div className="flex-1">
                 <h3 className="text-slate-400 text-[11px] font-black uppercase tracking-widest mb-1.5 flex items-center justify-between">
                   PROMPT INFO
                   <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 </h3>
                 <div className="text-slate-700 font-black leading-snug">
                   {timeline.current?.voice || "等待定時系統啟動後，將依照排程派發語音提醒。"}
                 </div>
              </div>
           </div>

           {/* Next Item Info */}
           <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-start gap-4 shadow-sm group">
              <div className="bg-[#ff8a00] text-white p-4 rounded-3xl shadow-[0_10px_20px_-5px_rgba(255,138,0,0.3)] transition-transform group-hover:scale-110">
                 <ChevronRight size={28} />
              </div>
              <div>
                 <h3 className="text-slate-400 text-[11px] font-black uppercase tracking-widest mb-1.5">UPCOMING NEXT</h3>
                 {timeline.next ? (
                   <div>
                     <div className="text-slate-800 font-black text-2xl tracking-tight">{timeline.next.label}</div>
                     <div className="flex items-center gap-2 mt-1">
                        <span className="text-slate-100 bg-[#ff8a00] px-2 py-0.5 rounded text-[10px] font-black">{timeline.next.duration} MINS</span>
                        <div className="text-slate-500 text-xs font-bold">預備切換中</div>
                     </div>
                   </div>
                 ) : (
                   <div className="text-slate-400 italic font-black text-lg">活動結束</div>
                 )}
              </div>
           </div>

           {/* Workshop Info */}
           <div className="hidden lg:flex bg-white p-6 rounded-[2rem] border border-slate-100 items-start gap-4 shadow-sm group">
              <div className="bg-white p-1 rounded-3xl shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)] transition-transform group-hover:scale-110 overflow-hidden w-16 h-16 flex items-center justify-center border border-slate-100">
                 <img src="/logo.png" alt="Digital Center Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </div>
              <div>
                 <h3 className="text-slate-400 text-[11px] font-black uppercase tracking-widest mb-1.5">ORGANIZATION</h3>
                 <div className="text-slate-800 font-black text-2xl tracking-tight">數位科技暨網路資源中心</div>
                 <div className="text-cathay-green text-xs font-black uppercase tracking-widest flex items-center gap-1.5 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-cathay-green" />
                    Cathay General Hospital
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }


  // Admin / Collapsed View
  if (!isUnlocked) {
    return (
      <div className="bg-slate-900 rounded-3xl p-6 border-4 border-slate-800 shadow-xl overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Lock size={80} />
        </div>
        <div className="relative z-10">
          <h3 className="text-white text-lg font-black mb-4 flex items-center gap-2">
            <ShieldAlert className="text-amber-500" /> 引導控時系統
          </h3>
          <form onSubmit={handleUnlock} className="flex gap-2">
            <input 
              type="password" 
              placeholder="請輸入系統密碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                "flex-1 bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-cathay-green transition-colors",
                showError && "border-rose-500 animate-shake"
              )}
            />
            <button 
              type="submit"
              className="bg-cathay-green hover:bg-cathay-green-hover text-white font-black px-6 py-2 rounded-xl transition-all shadow-lg active:scale-95"
            >
              登入管理
            </button>
          </form>
          {showError && <p className="text-rose-500 text-[10px] font-bold mt-2">密碼錯誤</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-3xl p-6 border-4 border-slate-800 shadow-xl overflow-hidden relative">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-xl font-black flex items-center gap-2">
              <TimerIcon className="text-cathay-green" /> 引導控時儀表板
            </h3>
            <button 
              onClick={() => setIsImmersive(true)}
              className="bg-cathay-green/20 hover:bg-cathay-green/40 text-cathay-green p-2 rounded-xl transition-all flex items-center gap-2 text-xs font-black uppercase ring-1 ring-cathay-green/30 px-4"
            >
              <Maximize2 size={16} /> 進入全螢幕模式
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {/* Start Time Config */}
             <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-inner">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Settings2 size={12} className="text-cathay-green" /> 課程起始設定
                </div>
                <div className="flex flex-col gap-3">
                   <div className="flex items-center gap-3">
                     <span className="text-white text-xs font-bold">預計開始:</span>
                     <input 
                      type="time" 
                      value={customStartTime}
                      onChange={(e) => setCustomStartTime(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cathay-green/50 transition-all"
                     />
                   </div>
                   <button 
                    onClick={handleStart}
                    className="w-full bg-cathay-green hover:bg-cathay-green-hover text-white font-black rounded-xl px-4 py-3 text-sm transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                   >
                     {isRunning ? <StopCircle size={18} /> : <Play size={18} />}
                     {isRunning ? "重新重置跑程" : "啟動自動排程"}
                   </button>
                </div>
             </div>

             {/* System Controls */}
             <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-inner flex flex-col">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Clock size={12} className="text-cathay-green" /> 當前系統狀態
                </div>
                <div className="flex-1 flex flex-col justify-center items-center gap-2">
                   <div className="flex items-center gap-3">
                      <div className={cn("w-3 h-3 rounded-full shadow-[0_0_10px]", isRunning ? "bg-green-500 animate-pulse shadow-green-500" : "bg-slate-600")} />
                      <span className="text-white font-black text-xl tracking-tight">{isRunning ? "RUNNING" : "STANDBY"}</span>
                   </div>
                   <div className="flex gap-4 mt-2">
                      <button 
                        onClick={() => announce("系統語音測試成功，目前環境音量適中。")}
                        className="bg-slate-700/50 hover:bg-slate-700 p-3 rounded-xl text-slate-300 transition-all border border-slate-600"
                        title="測試語音"
                      >
                        <Volume2 size={20} />
                      </button>
                      <button 
                        onClick={() => { setIsRunning(false); setStartTime(null); }}
                        className="bg-rose-500/10 hover:bg-rose-500/20 p-3 rounded-xl text-rose-400 transition-all border border-rose-500/30"
                        title="停止所有計時"
                      >
                        <StopCircle size={20} />
                      </button>
                   </div>
                </div>
             </div>
          </div>

          {/* Current Stage Preview (Admin) */}
          {isRunning && timeline.current && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-cathay-green/10 border border-cathay-green/20 rounded-2xl"
            >
              <div className="text-[10px] font-black text-cathay-green uppercase tracking-widest mb-1">正在跑程</div>
              <div className="text-white font-black text-lg">{timeline.current.label}</div>
              <div className="text-cathay-green text-2xl font-mono font-black mt-2">
                {formatCountdown(timeline.totalInStage - timeline.elapsedInStage)}
              </div>
            </motion.div>
          )}
        </div>
        
        <div className="md:w-64 flex flex-col justify-between">
           <div className="space-y-2">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">流程預覽</div>
              <div className="h-48 overflow-y-auto pr-2 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700">
                {WORKSHOP_STAGES.map((s, idx) => (
                  <div 
                    key={s.id} 
                    className={cn(
                      "text-[11px] p-2 rounded-lg border flex justify-between items-center",
                      idx === timeline.index ? "bg-cathay-green/20 border-cathay-green/50 text-cathay-green font-bold" : 
                      idx < timeline.index ? "opacity-30 border-transparent text-slate-500" :
                      "bg-slate-800/30 border-slate-700/50 text-slate-500"
                    )}
                  >
                    <span>{s.label}</span>
                    <span className="font-mono">{s.duration}m</span>
                  </div>
                ))}
              </div>
           </div>
           <button 
              onClick={() => setIsUnlocked(false)}
              className="mt-4 text-[10px] text-slate-600 font-bold hover:text-slate-400 text-center"
            >
              鎖定管理面板
            </button>
        </div>
      </div>
    </div>
  );
}
