import React, { useState, useEffect, useMemo } from 'react';
import { auth, db } from './lib/firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import { generateAiSuggestions, analyzeMilestoneTranscript, analyzeFeedbackTranscript, hasGeminiApiKey, setGeminiApiKeyOverride } from './lib/gemini';
import { 
  PieChart, Pie, Cell, 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as ReChartsTooltip, Legend,
  RadialBarChart, RadialBar
} from 'recharts';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  UserCircle, 
  BookOpen, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  ClipboardCheck,
  Award,
  BarChart3,
  Search,
  Lightbulb,
  Clipboard,
  HelpCircle,
  CheckCircle,
  Settings, 
  Users,
  Coffee,
  Info,
  Layers,
  Zap,
  RefreshCcw,
  PlayCircle,
  ClipboardList,
  Mic2,
  Flag,
  Stethoscope,
  MessageSquare,
  MessageSquareText,
  Target,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  BrainCircuit,
  LayoutDashboard,
  TrendingUp,
  Download,
  History,
  Route as RouteIcon,
  ShieldAlert,
  GraduationCap,
  Trash2,
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { WORKSHOP_SCHEDULE, SCENARIOS, ROTATION_DATA, FACILITATOR_GUIDE, SR_PROGRESSION } from './constants';
import { Scenario } from './types';
import { WorkshopTimer } from './components/WorkshopTimer';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const iconMap: Record<string, any> = {
  RefreshCcw,
  PlayCircle,
  ClipboardList,
  Mic2,
  Flag,
  Stethoscope,
  MessageSquare,
  MessageSquareText,
  CheckCircle2,
  Target,
  AlertTriangle
};

function Navigation() {
  const location = useLocation();
  const isTimerPage = location.pathname === '/timer';
  const isAssessmentPage = location.pathname === '/assessment';
  const isHomePage = location.pathname === '/';

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-1 bg-white/80 backdrop-blur-xl p-1.5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 ring-1 ring-black/5 max-w-[95vw] overflow-x-auto no-scrollbar whitespace-nowrap">
      <Link 
        to="/" 
        className={cn(
          "px-5 py-2.5 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all shrink-0",
          isHomePage ? "bg-cathay-green text-white shadow-lg shadow-green-500/20" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
        )}
      >
        手冊首頁
      </Link>
      <Link 
        to="/assessment" 
        className={cn(
          "px-5 py-2.5 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all shrink-0",
          isAssessmentPage ? "bg-cathay-green text-white shadow-lg shadow-green-500/20" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
        )}
      >
        評核評分
      </Link>
      <Link 
        to="/timer" 
        className={cn(
          "px-5 py-2.5 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all shrink-0",
          isTimerPage ? "bg-cathay-green text-white shadow-lg shadow-green-500/20" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
        )}
      >
        引導計時
      </Link>
    </nav>
  );
}

const ProtectedSection = ({ 
  children, 
  isPasswordVerified, 
  password, 
  setPassword, 
  showPasswordError, 
  handlePasswordSubmit 
}: { 
  children: React.ReactNode, 
  isPasswordVerified: boolean,
  password: string,
  setPassword: (val: string) => void,
  showPasswordError: boolean,
  handlePasswordSubmit: (e: React.FormEvent) => void
}) => {
  if (isPasswordVerified) return <>{children}</>;
  
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
      <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center mb-6 text-cathay-green">
        <Lock size={32} />
      </div>
      <h3 className="text-xl font-black text-slate-800 mb-2">專業指引內容已鎖定</h3>
      <p className="text-sm text-slate-500 mb-8 max-w-xs">此部分包含引導師指引與演繹技巧，請輸入授權密碼以查看內容。</p>
      
      <form onSubmit={handlePasswordSubmit} className="w-full max-w-sm space-y-4">
        <div className="relative group">
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="請輸入 5 位數密碼"
            className="w-full bg-white border-2 border-slate-200 focus:border-cathay-green focus:ring-4 focus:ring-cathay-light/30 rounded-2xl px-6 py-4 outline-none transition-all text-center text-lg font-mono tracking-[0.5em]"
          />
          {showPasswordError && (
            <p className="text-rose-500 text-xs font-bold mt-2 animate-bounce">密碼錯誤，請重新輸入</p>
          )}
        </div>
        <button 
          type="submit"
          className="w-full bg-cathay-green text-white font-black py-4 rounded-2xl shadow-lg shadow-cathay-green/20 hover:bg-cathay-green-dark transition-all active:scale-[0.98]"
        >
          解鎖指引內容
        </button>
      </form>
    </div>
  );
};

const MILESTONE_CRITERIA = [
  {
    category: "評估技巧 (Educational Theory and Practice 3: Learner Assessment)",
    icon: <Target className="text-blue-500" size={18} />,
    levels: [
      "討論形成性與總結性評量的目標與原則",
      "根據各個場域採用適當的評量方法和工具",
      "透過評量資料找出有助於學員提升自身表現的優點以及機會",
      "教育他人如何選擇、使用適當的評量方法和工具，必要時給予建議",
      "設計並執行實證導向之評量方法與工具"
    ]
  },
  {
    category: "回饋技巧 (Educational Theory and Practice 4: Feedback)",
    icon: <MessageSquare className="text-emerald-500" size={18} />,
    levels: [
      "說明進行回饋討論的時機、內容與方法",
      "引導學生建立目標，並著重於提供可強化該目標的回饋",
      "找出可強化、改善目標之學習表現資料，並依此提供回饋，促進行為改變",
      "持續進行具有挑戰性的回饋討論，促進良好的行為改變",
      "引導他人進行有效的回饋討論"
    ]
  },
  {
    category: "矯正技巧 (Educational Theory and Practice 5: Performance Improvement and Remediation)",
    icon: <ShieldAlert className="text-amber-500" size={18} />,
    levels: [
      "發現表現需要改進的學員",
      "和學員一同找出造成表現低落的原因、尋找有助益的資源、建立個人的學習計畫",
      "在沒有正式進行補救措施的情況下，執行學習計畫與追蹤策略，成功引導在短期目標中面臨困難的學員",
      "建立、執行正式補救計畫，並採用成效測量",
      "引導他人進行所有補救面向（辨識、釐清、介入、評量）的辨識與管理"
    ]
  },
  {
    category: "專業特質培育 (Educational Theory and Practice 7: Learner Professional Development)",
    icon: <GraduationCap className="text-rose-500" size={18} />,
    levels: [
      "說明在學員的持續專業發展中，輔導、贊助、提供建議及指導的重點",
      "針對個別學員，找出輔導、贊助、提供建議及指導的方法或策略（如：學習計畫）",
      "運用多元的方法或策略進行輔導、贊助、建議及指導",
      "執行最佳的方法或策略進行輔導、贊助、建議及指導",
      "具有輔導、贊助、提供建議及指導的能力（如：教學、研究）"
    ]
  }
];

function AiKeySetupIndicator() {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [hasKey, setHasKey] = useState(hasGeminiApiKey());

  if (hasKey && !isOpen) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 animate-in fade-in slide-in-from-top-2 relative z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-800 font-black text-[10px] uppercase tracking-wider">
          <AlertTriangle size={14} className="text-amber-500" />
          <span>{hasKey ? "AI API 已設定 (可更新)" : "AI 功能尚未就緒 (需設定 API Key)"}</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-[10px] font-black text-amber-600 hover:text-amber-700 underline flex items-center gap-1"
        >
          <Settings size={12} />
          {isOpen ? "關閉設定板" : "手動設定 API Key (供 GitHub 使用)"}
        </button>
      </div>
      {isOpen && (
        <div className="space-y-3 mt-4 pt-4 border-t border-amber-200/50">
          <p className="text-[10px] text-amber-700 font-bold leading-relaxed">
            在 GitHub Pages 運行時，AI 功能需要 API Key。您可以前往 <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline font-black">Google AI Studio</a> 獲取免費的 Key。
            <br />設定後將儲存於您的瀏覽器快取，無需重新編譯。
          </p>
          <div className="flex gap-2">
            <input 
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="在此貼上您的 Gemini API Key (AI Studio 提供)..."
              className="flex-1 bg-white border border-amber-200 rounded-lg px-3 py-2 text-[10px] font-mono outline-none focus:ring-2 focus:ring-amber-500/20 shadow-inner"
            />
            <button 
              onClick={() => {
                if (apiKey.length < 10) return alert('Key 格式不正確，請重新檢查');
                setGeminiApiKeyOverride(apiKey);
                setHasKey(true);
                setIsOpen(false);
                // We don't necessarily need a hard reload if we export a reset method, 
                // but for simplicity, let's just alert.
                alert('API Key 已儲存，請重新執行 AI 分析。');
              }}
              className="bg-amber-600 text-white px-4 py-2 rounded-lg text-[10px] font-black shadow-md hover:bg-amber-700 transition-all active:scale-95"
            >
              確認設定
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MilestoneAssessment({ user }: { user: any }) {
  const [facilitator, setFacilitator] = useState('');
  const [trainee, setTrainee] = useState('');
  const [selectedLevels, setSelectedLevels] = useState<Record<number, number>>({});
  const [transcript, setTranscript] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<Record<number, number> | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string | null>(null);

  const facilitators = useMemo(() => {
    const names = new Set<string>();
    ROTATION_DATA.forEach(round => {
      round.assignments.forEach(assign => {
        if (assign.facilitator) names.add(assign.facilitator);
      });
    });
    return Array.from(names).sort();
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLevelSelect = (categoryIdx: number, level: number) => {
    setSelectedLevels(prev => ({ ...prev, [categoryIdx]: level }));
  };

  const handleAiAnalysis = async () => {
    if (!transcript) return alert('請先輸入逐字稿內容');
    setAiLoading(true);
    try {
      const analysis = await analyzeMilestoneTranscript(transcript, MILESTONE_CRITERIA);
      
      const levels: Record<number, number> = {};
      [0, 1, 2, 3].forEach(idx => {
        if (analysis.levels && analysis.levels[idx]) {
          levels[idx] = Number(analysis.levels[idx]) - 1; // Convert to 0-indexed
        }
      });
      setAiAnalysis(levels);
      setAiSuggestions(analysis.suggestions || null);
    } catch (err) {
      console.error(err);
      alert('AI 分析失敗，請稍後再試。');
    } finally {
      setAiLoading(false);
    }
  };

  const handleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const handleSubmit = async () => {
    if (!user) return alert('請登入後再提交');
    if (!facilitator || !trainee) return alert('請填寫完整引導師與受評者姓名');
    if (Object.keys(selectedLevels).length === 0) return alert('請至少完成一項評核');
    
    const milestoneTotal = Object.values(selectedLevels).reduce((acc: number, lv: any) => acc + (lv as number) + 1, 0);
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'milestoneResults'), {
        facilitator,
        trainee,
        selectedLevels,
        totalScore: milestoneTotal,
        maxScore: 20,
        aiAnalysis,
        aiSuggestions,
        evaluatorId: user.uid,
        evaluatorEmail: user.email,
        createdAt: serverTimestamp()
      });
      alert('里程碑評核已成功存檔！');
      setSelectedLevels({});
      setAiAnalysis(null);
      setAiSuggestions(null);
      setTrainee('');
      setTranscript('');
    } catch (error) {
      alert('存檔失敗，請檢查網路連線或權限設定：' + (error instanceof Error ? error.message : '未知錯誤'));
      handleFirestoreError(error, OperationType.WRITE, 'milestoneResults');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm mt-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Header Area */}
      <div className="p-6 bg-slate-900 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-cathay-green p-2 rounded-xl text-white shadow-lg shadow-green-500/20">
            <ClipboardList size={20} />
          </div>
          <div>
            <h3 className="text-white text-base font-black tracking-tight">臨床教練里程碑評核表</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">MILESTONE-BASED PERFORMANCE ASSESSMENT TOOL</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-white/5">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20">
                <img src={user.photoURL || ''} alt="avatar" className="w-full h-full object-cover" />
              </div>
              <span className="text-[10px] text-white font-black truncate max-w-[100px]">{user.displayName}</span>
              <button 
                onClick={() => signOut(auth)} 
                className="text-[10px] text-slate-400 hover:text-rose-400 transition-colors ml-2"
              >
                登出
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="flex items-center gap-2 bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-black shadow-lg hover:bg-slate-50 transition-all active:scale-95"
            >
              <UserCircle size={14} /> Google 登入
            </button>
          )}
        </div>
      </div>

      {/* Input Fields */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 border-b border-slate-100">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-1">
            <Users size={10} /> 引導師姓名 (Facilitator)
          </label>
          <select 
            value={facilitator}
            onChange={(e) => setFacilitator(e.target.value)}
            className="w-full bg-white border-2 border-slate-100 focus:border-cathay-green focus:ring-4 focus:ring-cathay-light/20 rounded-xl px-4 py-3 text-sm font-bold outline-none appearance-none cursor-pointer"
          >
            <option value="">請選擇引導師</option>
            {facilitators.map(name => <option key={name} value={name}>{name}</option>)}
            <option value="custom">-- 手動輸入 --</option>
          </select>
          {facilitator === 'custom' && (
            <input 
              type="text"
              id="milestone-facilitator-custom"
              placeholder="請輸入引導師姓名"
              className="w-full bg-white border-2 border-slate-100 focus:border-cathay-green focus:ring-4 focus:ring-cathay-light/20 rounded-xl px-4 py-3 text-sm font-bold outline-none mt-2"
              onChange={(e) => setFacilitator(e.target.value)}
            />
          )}
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-1">
            <UserCircle size={10} /> 受評者姓名 (Trainee)
          </label>
          <input 
            type="text" 
            value={trainee}
            onChange={(e) => setTrainee(e.target.value)}
            placeholder="請輸入受評者姓名"
            className="w-full bg-white border-2 border-slate-100 focus:border-cathay-green focus:ring-4 focus:ring-cathay-light/20 rounded-xl px-4 py-3 text-sm font-bold outline-none transition-all"
          />
        </div>
      </div>

      {/* AI Analysis Integration */}
      <div className="p-6 bg-cathay-light/5 border-b border-cathay-light/20 space-y-4">
        <AiKeySetupIndicator />
        <div className="flex items-start gap-4">
          <div className="bg-cathay-green text-white p-2.5 rounded-xl shadow-lg shadow-cathay-green/20">
            <Mic2 size={20} />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-black text-slate-800">回饋紀錄與逐字稿分析</h4>
            <p className="text-[10px] text-cathay-green/70 font-bold uppercase tracking-wider">AI Powered Milestone Analysis</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <textarea 
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="在此處貼上教學錄音轉錄之逐字稿內容..."
            className="w-full h-32 bg-white border border-slate-100 focus:border-cathay-green focus:ring-4 focus:ring-cathay-green/10 rounded-2xl p-4 text-xs font-bold outline-none shadow-inner transition-all leading-relaxed"
          />
          
          <button
            onClick={handleAiAnalysis}
            disabled={aiLoading}
            className={cn(
              "w-full py-3.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg",
              aiLoading ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-cathay-green text-white hover:bg-cathay-green-dark active:scale-95 shadow-cathay-green/20"
            )}
          >
            {aiLoading ? <RefreshCcw className="animate-spin" size={16} /> : <Sparkles size={16} />}
            {aiLoading ? "AI 深度分析中..." : "啟動 AI 智能里程碑分析"}
          </button>
        </div>
      </div>

      {/* Assessment Table */}
      <div className="p-6 space-y-10">
        {MILESTONE_CRITERIA.map((criteria, cidx) => (
          <div key={cidx} className="space-y-4">
            <div className="flex items-center gap-3 pl-1">
               <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-cathay-green">
                  {criteria.icon}
               </div>
               <h4 className="text-sm font-black text-slate-800">{criteria.category}</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pb-6">
                  {criteria.levels.map((desc, lidx) => {
                    const isFacilitatorSelected = selectedLevels[cidx] === lidx;
                    const isAiSelected = aiAnalysis && aiAnalysis[cidx] === lidx;
                    
                    return (
                      <div key={lidx} className="relative flex flex-col h-full group">
                        <button
                          onClick={() => handleLevelSelect(cidx, lidx)}
                          className={cn(
                            "flex-1 p-4 transition-all flex flex-col gap-2 relative z-10 text-left",
                            isAiSelected ? "rounded-t-2xl border-x-2 border-t-2" : "rounded-2xl border-2",
                            isFacilitatorSelected 
                              ? "bg-slate-900 border-slate-900 text-white shadow-xl ring-4 ring-slate-900/10" 
                              : "bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50/50"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className={cn(
                              "text-[9px] font-black px-2 py-0.5 rounded-md tracking-wider",
                              isFacilitatorSelected ? "bg-cathay-green text-white" : "bg-slate-100 text-slate-500"
                            )}>
                              LEVEL {lidx + 1}
                            </span>
                            {isFacilitatorSelected && (
                              <CheckCircle2 size={12} className="text-cathay-green animate-in zoom-in duration-300" />
                            )}
                          </div>
                          <p className={cn(
                            "text-[10px] leading-relaxed font-bold",
                            isFacilitatorSelected ? "text-white/90" : "text-slate-500"
                          )}>
                            {desc}
                          </p>
                        </button>
                        
                        {/* AI Match Indicator Bottom Bar */}
                        {isAiSelected && (
                          <div className={cn(
                            "h-8 rounded-b-2xl border-x-2 border-b-2 -mt-1 flex items-center justify-center gap-1.5 transition-all animate-in slide-in-from-top-1 shadow-sm relative z-0",
                            isFacilitatorSelected 
                              ? "bg-emerald-500 border-emerald-500 text-white" 
                              : "bg-amber-50 border-amber-200 text-amber-700"
                          )}>
                            <Sparkles size={10} className={isFacilitatorSelected ? "text-white" : "text-amber-500"} />
                            <span className="text-[8px] font-black uppercase tracking-tighter">
                              {isFacilitatorSelected ? "AI 預測一致 (MATCH)" : "AI 推薦此等級"}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Progress Chart */}
      {Object.keys(selectedLevels).length > 0 && (
        <div className="mx-6 mb-6 p-8 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-cathay-green p-1.5 rounded-lg shadow-lg ring-4 ring-cathay-green/10">
                   <TrendingUp className="text-white" size={18} />
                </div>
                <h4 className="text-base font-black tracking-tight">評核里程碑等級分佈圖</h4>
              </div>
              <div className="flex items-center gap-4 text-[9px] font-black uppercase text-slate-500 bg-white/5 py-1.5 px-3 rounded-full">
                <span>L1</span>
                <div className="flex gap-1 opacity-50 px-2 border-x border-white/10">
                  {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1 h-1 rounded-full bg-slate-400" />)}
                </div>
                <span>L5</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {MILESTONE_CRITERIA.map((criteria, cidx) => {
                const level = selectedLevels[cidx];
                const progress = level !== undefined ? (level + 1) * 20 : 0;
                return (
                  <div key={cidx} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-white/5 rounded-lg border border-white/5">
                          {React.cloneElement(criteria.icon as React.ReactElement, { size: 12 })}
                        </div>
                        <span className="text-[10px] font-black text-white/80">{criteria.category.split(' (')[0]}</span>
                      </div>
                      <span className={cn(
                        "text-[10px] font-black",
                        level !== undefined ? "text-cathay-green" : "text-slate-600"
                      )}>
                        {level !== undefined ? `Level ${level + 1}` : '未評核'}
                      </span>
                    </div>
                    <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          level === 4 ? "bg-gradient-to-r from-emerald-600 to-cathay-green shadow-[0_0_10px_rgba(34,197,94,0.3)]" : 
                          level !== undefined ? "bg-cathay-green/60" : "bg-transparent"
                        )}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-5 translate-x-1/4 -translate-y-1/4">
            <GraduationCap size={150} className="text-white" />
          </div>
        </div>
      )}
      
      {aiSuggestions && (
        <div className="mx-6 p-6 bg-emerald-50 border border-emerald-100 rounded-3xl relative overflow-hidden group mb-6 shadow-sm">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <BrainCircuit size={80} className="text-emerald-600" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-emerald-600 text-white p-2 rounded-xl shadow-lg shadow-emerald-200">
                <Sparkles size={18} />
              </div>
              <h4 className="text-sm font-black text-emerald-900 italic tracking-tight">AI 專屬里程碑晉級建議</h4>
            </div>
            <div className="text-xs text-emerald-950 font-bold leading-relaxed whitespace-pre-wrap pl-1 border-l-2 border-emerald-200 ml-1">
              {aiSuggestions}
            </div>
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="p-8 bg-slate-900 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
           <div className="text-white text-center md:text-left">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">評核進度</p>
             <p className="text-xl font-black text-white">
               {Math.round((Object.keys(selectedLevels).length / MILESTONE_CRITERIA.length) * 100)}% 
               <span className="text-[10px] text-slate-500 ml-2">Complete</span>
             </p>
           </div>
           <div className="h-10 w-px bg-slate-800" />
        </div>

          <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={handleSubmit}
            className={cn(
              "flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 font-black rounded-2xl transition-all shadow-xl active:scale-95",
              isSubmitting 
                ? "bg-slate-700 text-white cursor-wait" 
                : (!user || !facilitator || !trainee || Object.keys(selectedLevels).length === 0)
                  ? "bg-cathay-green/50 text-white cursor-pointer" // Keep it green but semi-transparent if invalid
                  : "bg-cathay-green hover:bg-cathay-green-dark text-white shadow-green-900/40"
            )}
          >
             {isSubmitting ? <RefreshCcw size={18} className="animate-spin" /> : <Download size={18} />}
             <span>{isSubmitting ? "正在送出..." : "送出里程碑結果"}</span>
          </button>
          {(!user || !facilitator || !trainee || Object.keys(selectedLevels).length === 0) && !isSubmitting && (
            <p className="text-[10px] text-slate-500 font-bold mt-2 md:hidden text-center bg-slate-100 p-2 rounded-lg">
              {!user ? "請先登入帳號" : (!facilitator || !trainee) ? "請輸入姓名" : "請至少選擇一項等級"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const FEEDBACK_EVAL_DATA = [
  {
    category: "Promote Relationship 建立關係 (前置)",
    color: "slate",
    icon: "🤝",
    items: [
      { id: "pre1", label: "建立支持性與信任關係", behavior: "教師以尊重、開放、支持性的態度開始互動，讓學生感受到回饋是為了促進學習。" },
      { id: "pre2", label: "設定清楚回饋目標", behavior: "教師明確說明本次回饋聚焦的能力與學習重點，並納入學生希望改善的目標。" },
      { id: "pre3", label: "選擇合適時間與地點", behavior: "教師選擇適當時間與具隱私、不易被打斷的地點，讓雙方能專注回饋。" },
      { id: "pre4", label: "清楚標示回饋流程", behavior: "教師在回饋開始前說明接下來的流程、討論順序與後續改善計畫預期。" }
    ]
  },
  {
    category: "Experience",
    icon: "E",
    color: "blue",
    items: [
      { id: "e1", label: "邀請學生描述事件", behavior: "先問學生：「你可以描述一下剛剛發生了什麼嗎？」" },
      { id: "e2", label: "聚焦具體行為", behavior: "引導學生描述具體行為、處置、溝通或決策點。" },
      { id: "e3", label: "還原情境脈絡", behavior: "引導學生說明當時病人狀態、團隊互動、時間壓力與資源限制。" },
      { id: "e4", label: "鼓勵學生先自評", behavior: "詢問學生覺得哪裡做得好、哪裡有困難。" },
      { id: "e5", label: "避免過早下結論", behavior: "在此階段避免立即糾正、批判或直接給答案。" }
    ]
  },
  {
    category: "Reflection",
    icon: "R",
    color: "amber",
    items: [
      { id: "r1", label: "引導學生反思表現", behavior: "問學生：「你覺得剛剛哪裡做得好？哪裡可以更好？」" },
      { id: "r2", label: "探索臨床推理", behavior: "詢問學生當時為何做出該判斷或處置。" },
      { id: "r3", label: "探索困難點", behavior: "協助學生說出當時最不確定、最猶豫或最困難的部分。" },
      { id: "r4", label: "比較預期與實際表現", behavior: "引導學生比較「原本想做什麼」與「實際做了什麼」。" },
      { id: "r5", label: "教師提供具體觀察", behavior: "教師用客觀語言描述觀察到的行為，而非人格化評論。" },
      { id: "r6", label: "回應學生自評", behavior: "教師的回饋有接續學生剛剛提出的自我反思。" },
      { id: "r7", label: "肯定具體優點", behavior: "指出學生具體做得好的地方，而非只說「很好」。" },
      { id: "r8", label: "指出具體改善點", behavior: "清楚描述需要改善的行為，而非只說「要加強」。" },
      { id: "r9", label: "控制回饋量", behavior: "聚焦 1–2 個最重要的改善重點，避免一次給太多意見。" }
    ]
  },
  {
    category: "Conceptualization",
    icon: "C",
    color: "emerald",
    items: [
      { id: "c1", label: "確認學生理解", behavior: "詢問學生是否理解剛剛討論的重點。" },
      { id: "c2", label: "連結標準流程與指引", behavior: "將回饋連結到臨床流程、病人安全、處置指引或標準作業。" },
      { id: "c3", label: "區分個案與通則", behavior: "協助學生理解哪些是本案例特殊情境，哪些是未來可通用原則。" },
      { id: "c4", label: "補足關鍵知識缺口", behavior: "針對學生反思不足處補充必要知識，但不完全主導討論。" }
    ]
  },
  {
    category: "Plan",
    icon: "P",
    color: "cathay",
    items: [
      { id: "p1", label: "邀請學生提出計畫", behavior: "優先問學生：「下次你會怎麼做？」" },
      { id: "p2", label: "制定具體行動策略", behavior: "例如下次交班使用 ISBAR、操作前 verbalize plan、先確認 ABC 等。" },
      { id: "p3", label: "聚焦優先事項", behavior: "改善計畫聚焦 1–2 個最重要問題。" },
      { id: "p4", label: "目標符合學生程度", behavior: "改善目標符合學生目前訓練階段與能力。" },
      { id: "p5", label: "設定追蹤方式", behavior: "約定下次如何觀察，例如 mini-CEX、DOPS、EPA 等。" }
    ]
  }
];

// Removed ImageUploader as per user request to use static public asset

interface GaugeChartProps {
  key?: string | number;
  value: number;
  max: number;
  label: string;
  color: string;
  size?: 'sm' | 'lg';
  icon?: React.ReactNode;
}

function GaugeChart({ value, max, label, color, size = 'sm', icon }: GaugeChartProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const rotation = (percentage / 100) * 180 - 90; // -90 to 90 degrees for semi-circle
  
  const dim = size === 'lg' ? { w: 240, h: 140, r: 100, innerR: 70 } : { w: 140, h: 85, r: 60, innerR: 45 };
  const needleY2 = dim.h + 15 - dim.r;

  return (
    <div className="flex flex-col items-center">
      <div 
        className="relative" 
        style={{ width: dim.w, height: dim.h }}
      >
        <svg width={dim.w} height={dim.h} viewBox={`0 0 ${dim.w} ${dim.h}`}>
          {/* Background Track - Always Visible */}
          <path
            d={`M ${dim.w/2 - dim.r} ${dim.h - 5} A ${dim.r} ${dim.r} 0 0 1 ${dim.w/2 + dim.r} ${dim.h - 5}`}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={size === 'lg' ? 20 : 12}
            strokeLinecap="round"
          />
          {/* Active Track - Animates */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: percentage / 100 }}
            transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }}
            d={`M ${dim.w/2 - dim.r} ${dim.h - 5} A ${dim.r} ${dim.r} 0 0 1 ${dim.w/2 + dim.r} ${dim.h - 5}`}
            fill="none"
            stroke={color}
            strokeWidth={size === 'lg' ? 20 : 12}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Value Display and Icon */}
        <div className={cn(
          "absolute left-0 right-0 flex flex-col items-center justify-center",
          size === 'lg' ? "top-14" : "top-8"
        )}>
          {icon && <div className={cn(
            "opacity-80 text-slate-400 mb-0.5",
            size === 'lg' ? "scale-100" : "scale-75"
          )}>{icon}</div>}
          <span className={cn("font-black text-slate-800 leading-none", size === 'lg' ? "text-4xl" : "text-xl")}>
            {value}
          </span>
          <span className={cn("text-slate-400 font-bold uppercase", size === 'lg' ? "text-xs mt-1" : "text-[8px]")}>
            / {max}
          </span>
        </div>
      </div>
      <span className={cn(
        "mt-2 font-black tracking-widest text-center whitespace-pre-wrap uppercase px-2",
        size === 'lg' ? "text-[10px] text-slate-400" : "text-[10px] text-slate-500"
      )}>
        {label}
      </span>
    </div>
  );
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

function FeedbackScoringTable() {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [facilitator, setFacilitator] = useState('');
  const [trainee, setTrainee] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [transcript, setTranscript] = useState('');
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);
  const [aiScores, setAiScores] = useState<Record<string, number>>({});

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  // Extract unique facilitators from ROTATION_DATA
  const facilitators = useMemo(() => {
    const names = new Set<string>();
    ROTATION_DATA.forEach(round => {
      round.assignments.forEach(assign => {
        if (assign.facilitator) names.add(assign.facilitator);
      });
    });
    return Array.from(names).sort();
  }, []);

  const handleScore = (id: string, score: number) => {
    setScores(prev => ({ ...prev, [id]: score }));
  };

  const calculateTotal = () => {
    const total = Object.values(scores).reduce((a: number, b: number) => a + b, 0);
    const max = FEEDBACK_EVAL_DATA.reduce((acc, cat) => acc + cat.items.length * 2, 0);
    return { total, max };
  };

  const handleAiAdvice = async () => {
    if (!trainee) return alert('請先填寫受評者姓名');
    setAiLoading(true);
    try {
      const advice = await generateAiSuggestions(scores, trainee);
      setAiResult(advice);
    } catch (err) {
      console.error(err);
      alert('AI 生成失敗，請檢查網路連線。');
    } finally {
      setAiLoading(false);
    }
  };

  const handleFeedbackAiAnalysis = async () => {
    if (!transcript) return alert('請先輸入逐字稿內容');
    setAiAnalysisLoading(true);
    try {
      const analysis = await analyzeFeedbackTranscript(transcript, FEEDBACK_EVAL_DATA);
      
      if (analysis.scores) {
        setAiScores(analysis.scores);
      }
      if (analysis.suggestions) {
        setAiResult(analysis.suggestions);
      }
    } catch (err) {
      console.error(err);
      alert('AI 評核失敗，請稍後再試。');
    } finally {
      setAiAnalysisLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) return alert('請登入後再提交');
    if (!facilitator || !trainee) return alert('請填寫完整引導師與受評者姓名');
    
    setIsSubmitting(true);
    const { total, max } = calculateTotal();
    
    // Calculate category breakdowns
    const categoryScores: Record<string, { current: number, max: number }> = {};
    FEEDBACK_EVAL_DATA.forEach(cat => {
      let catSum = 0;
      cat.items.forEach(item => {
        catSum += (scores[item.id] || 0);
      });
      categoryScores[cat.category] = { current: catSum, max: cat.items.length * 2 };
    });

    try {
      await addDoc(collection(db, 'feedbackResults'), {
        facilitator,
        trainee,
        scores,
        totalScore: total,
        maxScore: max,
        categoryScores,
        aiScores,
        aiSuggestions: aiResult,
        evaluatorId: user.uid,
        evaluatorEmail: user.email,
        createdAt: serverTimestamp()
      });
      alert('評核結果已送出！');
      setScores({});
      setTrainee('');
      setAiResult('');
    } catch (error) {
      alert('評核送出失敗，請檢查網路連線或權限設定：' + (error instanceof Error ? error.message : '未知錯誤'));
      handleFirestoreError(error, OperationType.WRITE, 'feedbackResults');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm mt-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="p-6 bg-slate-900 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-cathay-green p-2 rounded-xl text-white shadow-lg shadow-green-500/20">
            <ClipboardCheck size={20} />
          </div>
          <div>
            <h3 className="text-white text-base font-black tracking-tight">臨床教練回饋評核表</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">ERCP-based Feedback Assessment Tool</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-white/5">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20">
                <img src={user.photoURL || ''} alt="avatar" className="w-full h-full object-cover" />
              </div>
              <span className="text-[10px] text-white font-black truncate max-w-[100px]">{user.displayName}</span>
              <button 
                onClick={() => signOut(auth)} 
                className="text-[10px] text-slate-400 hover:text-rose-400 transition-colors ml-2"
              >
                登出
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="flex items-center gap-2 bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-black shadow-lg hover:bg-slate-50 transition-all active:scale-95"
            >
              <UserCircle size={14} /> Google 登入
            </button>
          )}
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 border-b border-slate-100">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-1">
            <Users size={10} /> 引導師姓名 (Facilitator)
          </label>
          <select 
            value={facilitator}
            onChange={(e) => setFacilitator(e.target.value)}
            className="w-full bg-white border-2 border-slate-100 focus:border-cathay-green focus:ring-4 focus:ring-cathay-light/20 rounded-xl px-4 py-3 text-sm font-bold outline-none appearance-none cursor-pointer"
          >
            <option value="">請選擇引導師</option>
            {facilitators.map(name => <option key={name} value={name}>{name}</option>)}
            <option value="custom">-- 手動輸入 --</option>
          </select>
          {facilitator === 'custom' && (
            <input 
              type="text"
              id="feedback-facilitator-custom"
              placeholder="請輸入引導師姓名"
              className="w-full bg-white border-2 border-slate-100 focus:border-cathay-green focus:ring-4 focus:ring-cathay-light/20 rounded-xl px-4 py-3 text-sm font-bold outline-none mt-2"
              onChange={(e) => setFacilitator(e.target.value)}
            />
          )}
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-1">
            <UserCircle size={10} /> 受評者姓名 (Trainee)
          </label>
          <input 
            type="text" 
            value={trainee}
            onChange={(e) => setTrainee(e.target.value)}
            placeholder="請輸入受評者姓名"
            className="w-full bg-white border-2 border-slate-100 focus:border-cathay-green focus:ring-4 focus:ring-cathay-light/20 rounded-xl px-4 py-3 text-sm font-bold outline-none transition-all"
          />
        </div>
      </div>

      {/* AI Analysis Integration for Feedback */}
      <div className="p-6 bg-cathay-light/5 border-b border-cathay-light/20 space-y-4">
        <AiKeySetupIndicator />
        <div className="flex items-start gap-4">
          <div className="bg-cathay-green text-white p-2.5 rounded-xl shadow-lg shadow-cathay-green/20">
            <Mic2 size={20} />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-black text-slate-800">回饋逐字稿 AI 智慧評核</h4>
            <p className="text-[10px] text-cathay-green/70 font-bold uppercase tracking-wider">AI Powered Feedback Evaluation</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <textarea 
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="在此處貼上回饋教學之逐字稿內容..."
            className="w-full h-32 bg-white border border-slate-100 focus:border-cathay-green focus:ring-4 focus:ring-cathay-green/10 rounded-2xl p-4 text-xs font-bold outline-none shadow-inner transition-all leading-relaxed"
          />
          
          <button
            onClick={handleFeedbackAiAnalysis}
            disabled={aiAnalysisLoading}
            className={cn(
              "w-full py-3.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg",
              aiAnalysisLoading ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-cathay-green text-white hover:bg-cathay-green-dark active:scale-95 shadow-cathay-green/20"
            )}
          >
            {aiAnalysisLoading ? <RefreshCcw className="animate-spin" size={16} /> : <Sparkles size={16} />}
            {aiAnalysisLoading ? "AI 深度評核中..." : "啟動 AI 智能回饋評核"}
          </button>
        </div>
      </div>

      <div className="p-4 space-y-12">
        {FEEDBACK_EVAL_DATA.map((section, sidx) => (
          <div key={sidx} className="relative">
            <div className="flex items-center gap-3 mb-4 pl-2">
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm border",
                section.color === 'slate' ? "bg-slate-100 text-slate-500 border-slate-200" :
                section.color === 'blue' ? "bg-blue-50 text-blue-500 border-blue-200" :
                section.color === 'amber' ? "bg-amber-50 text-amber-500 border-amber-200" :
                section.color === 'emerald' ? "bg-emerald-50 text-emerald-500 border-emerald-200" :
                "bg-green-50 text-cathay-green border-cathay-green/20"
              )}>
                {section.icon}
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-800 tracking-tight">{section.category}</h4>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest w-1/4">評核重點</th>
                    <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">具體觀察行為</th>
                    <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-24">評分</th>
                  </tr>
                </thead>
                <tbody>
                  {section.items.map((item) => {
                    const aiScore = aiScores[item.id];
                    return (
                      <tr key={item.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/30 transition-colors">
                        <td className="px-4 py-4 align-top">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-slate-800 leading-tight">{item.label}</span>
                            {aiScore !== undefined && (
                              <div className="flex items-center gap-1 text-[8px] font-black uppercase text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 w-fit">
                                <Sparkles size={8} />
                                AI 建議: {aiScore}分
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 align-top">
                          <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{item.behavior}</p>
                        </td>
                      <td className="px-4 py-4 align-top">
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-center gap-1 p-1 bg-slate-50 rounded-xl w-fit mx-auto border border-slate-100">
                            {[0, 1, 2].map((s) => (
                              <button
                                key={s}
                                onClick={() => handleScore(item.id, s)}
                                className={cn(
                                  "w-8 h-8 rounded-lg text-[10px] font-black transition-all flex items-center justify-center",
                                  scores[item.id] === s 
                                    ? (s === 0 ? "bg-rose-500 text-white shadow-md shadow-rose-200" : 
                                       s === 1 ? "bg-amber-500 text-white shadow-md shadow-amber-200" : 
                                       "bg-cathay-green text-white shadow-md shadow-cathay-green/30")
                                    : "bg-transparent text-slate-400 hover:bg-white hover:text-slate-600"
                                )}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                          
                          {aiScore !== undefined && (
                            <div className={cn(
                              "flex items-center justify-center gap-1 text-[8px] font-black uppercase px-2 py-1 rounded-lg border w-fit mx-auto animate-in fade-in slide-in-from-top-1",
                              scores[item.id] === aiScore 
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                : "bg-amber-50 text-amber-600 border-amber-100"
                            )}>
                              <Sparkles size={8} />
                              AI 預測: {aiScore}分
                              {scores[item.id] === aiScore && <span className="ml-1 text-[7px] bg-emerald-600 text-white px-1 rounded">MATCH</span>}
                            </div>
                          )}
                        </div>
                      </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* AI Suggestion Display */}
      {aiResult && (
        <div className="mx-6 mb-6 p-6 bg-indigo-50 border border-indigo-100 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <Sparkles size={80} className="text-indigo-600" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-indigo-200">
                <BrainCircuit size={18} />
              </div>
              <h4 className="text-sm font-black text-indigo-900 italic">AI 智慧教學建議</h4>
            </div>
            <div className="text-xs text-indigo-950 font-bold leading-relaxed whitespace-pre-wrap">
              {aiResult}
            </div>
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="p-8 bg-slate-900 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
           <div className="text-white text-center md:text-left">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">評核進度</p>
             <p className="text-xl font-black text-white">{Math.round((Object.keys(scores).length / FEEDBACK_EVAL_DATA.reduce((a,c)=>a+c.items.length,0)) * 100)}% <span className="text-[10px] text-slate-500">Complete</span></p>
           </div>
           <div className="h-10 w-px bg-slate-800" />
           <div className="text-white text-center md:text-left">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">總評分</p>
             <div className="flex items-end gap-1">
               <span className="text-3xl font-black text-cathay-green leading-none">{calculateTotal().total}</span>
               <span className="text-[10px] text-slate-500 font-bold mb-1">/ {calculateTotal().max}</span>
             </div>
           </div>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={handleAiAdvice}
            disabled={aiLoading || !trainee}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-black rounded-2xl transition-all active:scale-95 disabled:opacity-30 border border-white/10"
          >
            {aiLoading ? <RefreshCcw size={18} className="animate-spin" /> : <Sparkles size={18} className="text-amber-400" />}
            AI 生成改良建議
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting || !user}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-10 py-4 bg-cathay-green hover:bg-cathay-green-dark text-white font-black rounded-2xl transition-all shadow-xl shadow-green-900/40 active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? <RefreshCcw size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
            送出評核結果
          </button>
        </div>
      </div>
    </div>
  );
}

function AssessmentDashboard({ initialTab }: { initialTab?: 'feedback' | 'milestone' }) {
  const [feedbackResults, setFeedbackResults] = useState<any[]>([]);
  const [milestoneResults, setMilestoneResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeHistoryTab, setActiveHistoryTab] = useState<'feedback' | 'milestone'>(initialTab || 'feedback');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveHistoryTab(initialTab);
    }
  }, [initialTab]);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  const fetchData = async (currentUser: User | null) => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      // Fetch Feedback Results
      let feedbackQ;
      if (currentUser?.email === 'bybarian@gmail.com') {
        feedbackQ = query(collection(db, 'feedbackResults'), orderBy('createdAt', 'desc'));
      } else {
        feedbackQ = query(collection(db, 'feedbackResults'), where('evaluatorId', '==', currentUser?.uid), orderBy('createdAt', 'desc'));
      }
      const feedbackSnapshot = await getDocs(feedbackQ);
      const feedbackData = feedbackSnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as object) }));
      setFeedbackResults(feedbackData);

      // Fetch Milestone Results
      let milestoneQ;
      if (currentUser?.email === 'bybarian@gmail.com') {
        milestoneQ = query(collection(db, 'milestoneResults'), orderBy('createdAt', 'desc'));
      } else {
        milestoneQ = query(collection(db, 'milestoneResults'), where('evaluatorId', '==', currentUser?.uid), orderBy('createdAt', 'desc'));
      }
      const milestoneSnapshot = await getDocs(milestoneQ);
      const milestoneData = milestoneSnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as object) }));
      setMilestoneResults(milestoneData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
      fetchData(u);
    });
    return () => unsubscribe();
  }, []);

  if (authLoading) return (
    <div className="p-20 text-center flex flex-col items-center gap-4">
      <RefreshCcw className="animate-spin text-slate-300" size={40} />
      <p className="text-slate-400 font-bold">正在準備中...</p>
    </div>
  );

  const handleDelete = async (id: string, type: 'feedback' | 'milestone') => {
    try {
      const collectionName = type === 'feedback' ? 'feedbackResults' : 'milestoneResults';
      if (!id) {
        alert('錯誤：紀錄 ID 為空');
        return;
      }
      
      setDeletingId(id);
      console.log(`Starting delete: ${collectionName}/${id}`);
      
      await deleteDoc(doc(db, collectionName, id));
      
      console.log('Delete succeeded in Firestore');

      if (type === 'feedback') {
        setFeedbackResults(prev => prev.filter(r => r.id !== id));
      } else {
        setMilestoneResults(prev => prev.filter(r => r.id !== id));
      }
      
      setConfirmDeleteId(null);
      alert('紀錄已完成刪除');
    } catch (err: any) {
      console.error("Delete Error Detail:", err);
      let msg = '刪除失敗';
      if (err.code) msg += ` (代碼: ${err.code})`;
      if (err.message) msg += `\n訊息: ${err.message}`;
      alert(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportExcel = () => {
    if (currentResults.length === 0) return alert('目前沒有紀錄可以匯出');
    
    try {
      const exportData = currentResults.map(r => {
        const base = {
          '受評者': r.trainee,
          '引導師': r.facilitator,
          '總分': r.totalScore,
          '最高分': r.maxScore,
          '日期': r.createdAt?.toDate?.() ? r.createdAt.toDate().toLocaleDateString('zh-TW') : 'N/A'
        };
        
        if (activeHistoryTab === 'feedback') {
          return {
            ...base,
            'Experience': r.categoryScores?.Experience?.current,
            'Reflection': r.categoryScores?.Reflection?.current,
            'Conceptualization': r.categoryScores?.Conceptualization?.current,
            'Plan': r.categoryScores?.Plan?.current,
            'AI建議': r.aiSuggestions
          };
        } else {
          const levels = MILESTONE_CRITERIA.reduce((acc, crit, idx) => {
            acc[crit.category] = (r.selectedLevels?.[idx] + 1) || '未評核';
            return acc;
          }, {} as any);
          return { ...base, ...levels, 'AI建議': r.aiSuggestions };
        }
      });

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, activeHistoryTab === 'feedback' ? "回饋技術評核" : "里程碑評核");
      
      const fileName = `${activeHistoryTab === 'feedback' ? 'Feedback' : 'Milestone'}_Report_${new Date().toLocaleDateString()}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (err) {
      console.error("Export Error:", err);
      alert('匯出失敗：' + (err instanceof Error ? err.message : '未知錯誤'));
    }
  };

  const handleClearAll = async () => {
    try {
      if (currentResults.length === 0) return alert('目前沒有紀錄可以清空');

      setIsSubmitting(true);
      const collectionName = activeHistoryTab === 'feedback' ? 'feedbackResults' : 'milestoneResults';
      
      // Delete in batches of 50
      const deletePromises = currentResults.map(r => deleteDoc(doc(db, collectionName, r.id)));
      await Promise.all(deletePromises);
      
      if (activeHistoryTab === 'feedback') {
        setFeedbackResults([]);
      } else {
        setMilestoneResults([]);
      }
      setConfirmClearAll(false);
      alert('所有紀錄已清空');
    } catch (err) {
      console.error("Clear All Error:", err);
      alert('清空失敗：' + (err instanceof Error ? err.message : '未知錯誤'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentResults = activeHistoryTab === 'feedback' ? feedbackResults : milestoneResults;

  const latest = currentResults.length > 0 ? currentResults[0] : {
    trainee: "新受評者",
    facilitator: "臨床引導師",
    totalScore: 0,
    maxScore: activeHistoryTab === 'feedback' ? 66 : 20,
    categoryScores: {},
    selectedLevels: {},
    aiSuggestions: "登入後查看您的真實數據。目前的圖表為操作範例。"
  };
  const maxScore = latest.maxScore || 1;

  return (
    <div className="mt-12 space-y-10 animate-in fade-in zoom-in duration-700 relative">
       {!user && (
         <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-[2px] rounded-[3rem]">
           <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-2xl text-center max-w-sm">
             <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
               <UserCircle size={32} />
             </div>
             <h3 className="text-lg font-black text-slate-800 mb-2">登入以啟動數據同步</h3>
             <p className="text-xs text-slate-500 font-bold mb-6">您需要登入 Google 帳號才能查看到您參與的實際評核紀錄與 AI 分析。</p>
             <button 
               onClick={async () => {
                 try {
                   const provider = new GoogleAuthProvider();
                   await signInWithPopup(auth, provider);
                 } catch (error) {
                   console.error("Login Error:", error);
                   alert("登入失敗，請確認是否允許彈出視窗。");
                 }
               }}
               className="bg-slate-900 text-white px-8 py-3 rounded-xl text-sm font-black shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2 mx-auto"
             >
               <UserCircle size={16} /> Google 快速登入
             </button>
           </div>
         </div>
       )}

       {loading && user && (
         <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-[3rem]">
            <RefreshCcw className="animate-spin text-cathay-green" size={32} />
         </div>
       )}

       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="bg-slate-900 p-2 rounded-xl text-white shadow-xl">
               <TrendingUp size={24} />
             </div>
             <div>
               <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Performance Analytics</h2>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">臨床教學成效數據看板</p>
             </div>
          </div>
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl w-fit">
             <button 
               onClick={() => setActiveHistoryTab('feedback')}
               className={cn(
                 "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all",
                 activeHistoryTab === 'feedback' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
               )}
             >
               回饋技巧評定
             </button>
             <button 
               onClick={() => setActiveHistoryTab('milestone')}
               className={cn(
                 "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all",
                 activeHistoryTab === 'milestone' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
               )}
             >
               里程碑評定
             </button>
          </div>
          <button onClick={() => fetchData(user)} className="text-xs font-black text-slate-500 hover:text-slate-900 flex items-center gap-2 px-4 py-2 hover:bg-slate-100 rounded-xl transition-all">
            <RefreshCcw size={14} /> 重新整理
          </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Gauges Section */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-12 shadow-sm">
             <div className="flex items-center justify-between mb-12">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest italic">Performance Overview (Latest)</h3>
             </div>
             
             <div className="flex flex-col items-center">
                <div className="mb-12">
                   <GaugeChart 
                      value={latest.totalScore} 
                      max={maxScore} 
                      label="Total Score" 
                      color="#00813c" 
                      size="lg"
                   />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full border-t border-slate-50 pt-10">
                    {(() => {
                        if (activeHistoryTab === 'feedback') {
                          const colors = { 'E': '#3b82f6', 'R': '#f59e0b', 'C': '#10b981', 'P': '#8b5cf6' };
                          const dimLabels = ['Experience', 'Reflection', 'Conceptualization', 'Plan'];
                          const icons = [<Target size={24} />, <Search size={24} />, <Lightbulb size={24} />, <RouteIcon size={24} />];
                          return ['E','R','C','P'].map((dim, idx) => {
                            const data = latest.categoryScores?.[dimLabels[idx]] || { current: 0, max: 10 };
                            return (
                              <GaugeChart key={dim} value={Number(data.current)} max={Number(data.max)} label={`${dim}\n${dimLabels[idx]}`} color={Object.values(colors)[idx]} size="sm" icon={icons[idx]} />
                            );
                          });
                        } else {
                          const getMilestoneColor = (val: number) => {
                            if (val <= 2) return "#ef4444"; // red-500
                            if (val <= 3) return "#f59e0b"; // amber-500
                            return "#10b981"; // emerald-500
                          };
                          return MILESTONE_CRITERIA.map((crit, idx) => {
                            const level = latest.selectedLevels?.[idx] ?? -1;
                            const levelVal = level + 1;
                            return (
                              <GaugeChart 
                                key={idx} 
                                value={levelVal} 
                                max={5} 
                                label={crit.category.split(' (')[0].split(': ')[1] || crit.category.split(' (')[0]} 
                                color={getMilestoneColor(levelVal)} 
                                size="sm" 
                                icon={crit.icon} 
                              />
                            );
                          });
                        }
                    })()}
                </div>
             </div>
          </div>

          {/* Quick Insights Card */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-1000">
               <Zap size={200} className="text-white" />
             </div>
             <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                   <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8">AI Coaching Insight</h4>
                   <div className="space-y-6">
                     <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
                        <p className="text-slate-400 text-[10px] font-bold uppercase mb-2">Observations</p>
                        <p className="text-xs text-white leading-relaxed font-bold italic">
                          {latest.aiSuggestions?.substring(0, 120) || "AI 觀察中：建議強化與學員的互動，特別是在反思階段的引導式提問。"}
                          {latest.aiSuggestions?.length > 120 ? '...' : ''}
                        </p>
                     </div>
                     <div className="flex items-center gap-6">
                        <div>
                          <p className="text-slate-500 text-[10px] font-bold uppercase">Avg Success</p>
                          <p className="text-3xl font-black text-white">
                            {currentResults.length > 0 
                              ? (currentResults.reduce((a,c)=>a + (activeHistoryTab === 'feedback' ? c.totalScore : (c.totalScore || 0)), 0) / currentResults.length).toFixed(1) 
                              : "0.0"
                            }
                          </p>
                        </div>
                        <div className="w-px h-10 bg-slate-800" />
                        <div>
                          <p className="text-slate-500 text-[10px] font-bold uppercase">Stored Records</p>
                          <p className="text-3xl font-black text-white">{currentResults.length}</p>
                        </div>
                     </div>
                 </div>
                </div>
                <div className="mt-8">
                   <button 
                     onClick={handleExportExcel}
                     className="w-full bg-cathay-green hover:bg-cathay-green-dark text-white py-4 rounded-2xl font-black text-sm transition-all shadow-xl shadow-green-900/20 active:scale-95 flex items-center justify-center gap-2"
                   >
                     <Download size={16} /> 匯出詳細報告 (Excel)
                   </button>
                </div>
             </div>
          </div>
       </div>

       {/* History List */}
       <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4">
             <h3 className="font-black text-slate-800 flex items-center gap-2">
               <History size={18} className="text-slate-400" /> 歷史評核紀錄
             </h3>
             {currentResults.length > 0 && user && (
               <button 
                 onClick={() => {
                   if (confirmClearAll) {
                     handleClearAll();
                   } else {
                     setConfirmClearAll(true);
                   }
                 }}
                 onMouseLeave={() => setConfirmClearAll(false)}
                 disabled={isSubmitting}
                 className={cn(
                   "text-[10px] font-black px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 border disabled:opacity-30 active:scale-95 whitespace-nowrap",
                   confirmClearAll 
                     ? "bg-rose-500 text-white border-rose-600 animate-pulse" 
                     : "text-rose-500 hover:bg-rose-50 border-rose-100"
                 )}
               >
                 {isSubmitting ? <RefreshCcw size={12} className="animate-spin" /> : <Trash2 size={12} />} 
                 {confirmClearAll ? "再次點擊確認清空" : "清空所有紀錄"}
               </button>
             )}
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
                <thead>
                   <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="px-6 py-4">Trainee / Facilitator</th>
                      <th className="px-6 py-4">Manual vs AI Score</th>
                      <th className="px-6 py-4">Completion</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-center">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {currentResults.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/80 transition-colors group">
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
                                 {r.trainee?.[0] || 'T'}
                               </div>
                               <div>
                                  <p className="font-black text-slate-800 leading-tight">{r.trainee}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase">{r.facilitator}</p>
                               </div>
                            </div>
                         </td>
                       <td className="px-6 py-4">
                            {activeHistoryTab === 'feedback' ? (
                              <>
                                <span className="font-black text-base text-slate-900">{r.totalScore}</span>
                                <span className="text-[10px] text-slate-400 font-bold ml-1">/ {r.maxScore}</span>
                              </>
                            ) : (
                              <div className="flex gap-1">
                                {Object.values(r.selectedLevels || {}).map((lv: any, idx) => (
                                  <div key={idx} className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600 border border-slate-200">
                                    {(lv as number) + 1}
                                  </div>
                                ))}
                              </div>
                            )}
                         </td>
                         <td className="px-6 py-4">
                            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                               <div 
                                 className="h-full bg-cathay-green rounded-full transition-all duration-1000" 
                                 style={{ 
                                   width: activeHistoryTab === 'feedback' 
                                     ? `${((r.totalScore as number)/(r.maxScore as number || 1))*100}%` 
                                     : `${((Object.values(r.selectedLevels || {}).reduce((a: number, b: any) => a + (b as number) + 1, 0) as number) / 20) * 100}%` 
                                 }} 
                               />
                            </div>
                         </td>
                         <td className="px-6 py-4 text-[10px] font-bold text-slate-400">
                           {r.createdAt?.toDate?.() ? r.createdAt.toDate().toLocaleDateString('zh-TW') : 'Just now'}
                         </td>
                         <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                               <button className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                  <ChevronRight size={16} />
                               </button>
                               <button 
                                 onClick={() => {
                                   if (confirmDeleteId === r.id) {
                                     handleDelete(r.id, activeHistoryTab);
                                   } else {
                                     setConfirmDeleteId(r.id);
                                   }
                                 }}
                                 onMouseLeave={() => setConfirmDeleteId(null)}
                                 disabled={deletingId === r.id}
                                 className={cn(
                                   "px-3 py-2 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1 font-bold text-[10px]",
                                   confirmDeleteId === r.id 
                                     ? "bg-rose-500 text-white animate-pulse" 
                                     : "bg-rose-50 text-rose-400 hover:bg-rose-100"
                                 )}
                                 title={confirmDeleteId === r.id ? "再次點擊以確認刪除" : "刪除紀錄"}
                               >
                                  {deletingId === r.id ? (
                                    <RefreshCcw size={14} className="animate-spin" />
                                  ) : confirmDeleteId === r.id ? (
                                    <>確定刪除?</>
                                  ) : (
                                    <Trash2 size={14} />
                                  )}
                               </button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
}

function AdminPanel() {
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImages(prev => [...prev, base64]);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <Settings className="text-cathay-green" /> 後台管理系統
        </h2>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm">
        <div className="mb-8">
          <h3 className="text-lg font-black text-slate-800 mb-2">圖片資源管理 (Image Assets)</h3>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">後台圖片上傳與預覽</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border-2 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center gap-4 bg-slate-50/50 hover:bg-slate-50 hover:border-cathay-green/30 transition-all cursor-pointer relative overflow-hidden group">
            <input 
              type="file" 
              onChange={handleUpload}
              className="absolute inset-0 opacity-0 cursor-pointer z-10" 
              accept="image/*"
            />
            {uploading ? (
              <RefreshCcw className="animate-spin text-cathay-green" size={32} />
            ) : (
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <PlayCircle className="text-cathay-green" size={32} />
                </div>
                <p className="font-black text-slate-800">點擊或拖放圖片至此</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Supports JPG, PNG, GIF</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h4 className="font-black text-slate-800 text-sm flex items-center gap-2 uppercase tracking-widest">
              <History size={16} className="text-slate-400" /> 已上傳預覽
            </h4>
            <div className="grid grid-cols-2 gap-4 h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {images.map((img, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative group">
                  <img src={img} alt={`uploaded-${i}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                      className="bg-rose-500 text-white p-2 rounded-xl"
                    >
                      刪除
                    </button>
                  </div>
                </div>
              ))}
              {images.length === 0 && (
                <div className="col-span-2 h-full flex items-center justify-center text-xs text-slate-400 font-bold uppercase italic tracking-widest">
                  No images uploaded yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-[2rem] p-8">
        <h3 className="font-black text-amber-800 mb-4 flex items-center gap-2">
          <Info size={18} /> 後台操作重要提示
        </h3>
        <ul className="space-y-3">
          <li className="flex gap-2 text-sm text-amber-700 font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
            <span>此為臨時上傳空間，若需永久更換手冊圖片，請將圖片存入 public 資料夾並重新命名。</span>
          </li>
          <li className="flex gap-2 text-sm text-amber-700 font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
            <span>資料庫成果可於「成果看板」查看並匯出 CSV。</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function MainAppContent() {
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState<'schedule' | 'rotation' | 'scenarios' | 'tips' | 'facilitator' | 'assessment'>('schedule');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (location.pathname === '/assessment') {
      setActiveTab('assessment');
    }
  }, [location.pathname]);

  const [assessmentSubTab, setAssessmentSubTab] = useState<'feedback' | 'milestone'>('feedback');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [showPasswordError, setShowPasswordError] = useState(false);
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '00000') {
      setIsPasswordVerified(true);
      setShowPasswordError(false);
    } else {
      setShowPasswordError(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 pr-4 border-r border-slate-100">
              <div className="flex items-center gap-1">
                <img 
                  src="logo_cgh.png" 
                  alt="CGH Logo" 
                  className="h-6 w-auto object-contain"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src.includes('undefined')) return;
                    target.style.display = 'none';
                    target.parentElement?.querySelector('.fallback')?.classList.remove('hidden');
                  }}
                />
                <div className="fallback hidden w-5 h-5 bg-cathay-light rounded-full flex items-center justify-center text-cathay-green font-bold text-[8px]">C</div>
                <span className="text-[10px] font-black text-slate-400">CGH</span>
              </div>
              
              <div className="h-4 w-px bg-slate-200 mx-1" />

              <div className="flex items-center gap-1">
                <img 
                  src="logo_tsem.png" 
                  alt="TSEM Logo" 
                  className="h-6 w-auto object-contain"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src.includes('undefined')) return;
                    target.style.display = 'none';
                    target.parentElement?.querySelector('.fallback')?.classList.remove('hidden');
                  }}
                />
                <div className="fallback hidden w-5 h-5 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold text-[8px]">T</div>
                <span className="text-[10px] font-black text-slate-400">TSEM</span>
              </div>
            </div>
            <div>
              <h1 className="text-sm md:text-lg font-black tracking-tight text-slate-800 leading-tight">臨床教練工作坊標準住院醫師/引導師 數位手冊</h1>
              <p className="text-[7px] md:text-[9px] text-cathay-green font-bold tracking-tight border-l-2 border-cathay-green pl-2 ml-1 uppercase leading-none mt-0.5">
                Digital Handbook for Standardized Residents & Facilitators In Clinical Coaching Workshop<br/>
                <span className="text-[6px] md:text-[8px] opacity-60">Cathay General Hospital x Taiwan Society of Emergency Medicine (TSEM)</span>
              </p>
            </div>
            <div className="hidden md:block">
              {/* Removed video library from header */}
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['schedule', 'rotation', 'facilitator', 'scenarios', 'tips'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                  activeTab === tab 
                  ? "bg-white text-cathay-green shadow-sm" 
                  : "text-slate-600 hover:text-slate-900"
                )}
              >
                {tab === 'schedule' ? '課程表' : 
                 tab === 'rotation' ? '分組' : 
                 tab === 'facilitator' ? '引導' : 
                 tab === 'scenarios' ? '情境' : '演練技巧'}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-full mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'schedule' && (
              <motion.div
                key="schedule"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Calendar className="text-cathay-green" /> 工作坊流程
                  </h2>
                  <div className="text-xs bg-cathay-light text-cathay-green font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-cathay-green/20">
                    CATHAY GENERAL HOSPITAL
                  </div>
                </div>

                <div className="space-y-12 pb-12">
                  {/* First Half: Lectures */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-cathay-green rounded-full shadow-sm" />
                      <h3 className="text-xl font-bold text-slate-800">上半場：理論回顧與重點提示</h3>
                    </div>
                    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                      <div className="grid grid-cols-[100px_1fr_1fr] md:grid-cols-[140px_1fr_1fr] bg-slate-50 border-b border-slate-100 font-black text-[10px] md:text-xs uppercase tracking-widest text-slate-400">
                        <div className="px-4 py-3 text-center border-r border-slate-100">Time</div>
                        <div className="px-4 py-3 text-center border-r border-slate-100">Topic</div>
                        <div className="px-4 py-3 text-center">Speaker</div>
                      </div>
                      {WORKSHOP_SCHEDULE.slice(0, 4).map((item, index) => (
                        <div 
                          key={index}
                          className={cn(
                            "grid grid-cols-[100px_1fr_1fr] md:grid-cols-[140px_1fr_1fr] border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors",
                            item.isBreak ? "bg-slate-50/30" : "bg-white"
                          )}
                        >
                          <div className="px-4 py-6 border-r border-slate-100 flex flex-col justify-center items-center text-center">
                            <span className="text-sm font-black text-slate-800 leading-none">{item.time.split('-')[0]}</span>
                            <span className="text-[10px] text-slate-400 font-mono mt-1">{item.minutes}min</span>
                          </div>
                          <div className="px-6 py-6 border-r border-slate-100 flex flex-col justify-center items-center text-center">
                            <div className="flex items-center gap-2 mb-1 justify-center">
                              {item.isBreak ? <Coffee size={14} className="text-amber-500" /> : <BookOpen size={14} className="text-cathay-green" />}
                              <h3 className={cn("text-base font-bold text-slate-800", item.isBreak && "text-slate-500 font-normal")}>
                                {item.topic}
                              </h3>
                            </div>
                            <p className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Settings size={10} /> {item.location}
                            </p>
                          </div>
                          <div className="px-4 py-6 flex flex-col justify-center items-center text-center">
                            {item.speaker ? (
                              <div className="flex flex-col items-center gap-2">
                                <div className="flex -space-x-4">
                                  {item.speaker.split('/').map((s, idx) => {
                                    const name = s.trim();
                                    let imgSrc = "";
                                    if (name.includes('簡')) imgSrc = "speaker_jian.png";
                                    else if (name.includes('楊')) imgSrc = "speaker_yang.png";
                                    else if (name.includes('劉')) imgSrc = "speaker_liu.png";
                                    else if (name.includes('鍾')) imgSrc = "speaker_zhong.png";
                                    else if (name.includes('郭')) imgSrc = "speaker_kuo.png";
                                    
                                    return (
                                      <div key={idx} className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden bg-slate-100 border-2 border-white ring-1 ring-slate-200 shadow-md">
                                        <img 
                                          src={imgSrc} 
                                          alt={name}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            const target = e.currentTarget;
                                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name.charAt(0))}&background=00813c&color=fff`;
                                          }}
                                        />
                                      </div>
                                    );
                                  })}
                                </div>
                                <p className="text-xs text-cathay-green font-black">{item.speaker}</p>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-300 font-medium">--</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Second Half: Practice */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-amber-500 rounded-full shadow-sm" />
                      <h3 className="text-xl font-bold text-slate-800">下半場：分組回饋演練</h3>
                    </div>
                    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                      <div className="grid grid-cols-[100px_1fr_1fr] md:grid-cols-[140px_1fr_1fr] bg-slate-50 border-b border-slate-100 font-black text-[10px] md:text-xs uppercase tracking-widest text-slate-400">
                        <div className="px-4 py-3 text-center border-r border-slate-100">Time</div>
                        <div className="px-4 py-3 text-center border-r border-slate-100">Practical Session</div>
                        <div className="px-4 py-3 text-center">Focus</div>
                      </div>
                      {WORKSHOP_SCHEDULE.slice(4).map((item, index) => (
                        <div 
                          key={index}
                          className={cn(
                            "grid grid-cols-[100px_1fr_1fr] md:grid-cols-[140px_1fr_1fr] border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors",
                            item.isBreak ? "bg-amber-50/30" : (index % 2 === 0 ? "bg-white" : "bg-slate-50/20")
                          )}
                        >
                          <div className="px-4 py-6 border-r border-slate-100 flex flex-col justify-center items-center text-center">
                            <span className="text-sm font-black text-slate-800 leading-none">{item.time.split('-')[0]}</span>
                            <span className="text-[10px] text-slate-400 font-mono mt-1">{item.minutes}min</span>
                          </div>
                          <div className="px-6 py-6 border-r border-slate-100 flex flex-col justify-center items-center text-center">
                            <div className="flex items-center gap-2 mb-1 justify-center">
                              {item.isBreak ? <Coffee size={14} className="text-amber-500" /> : <Zap size={14} className="text-amber-500" />}
                              <h3 className={cn("text-base font-bold text-slate-800", item.isBreak && "text-slate-500 font-normal")}>
                                {item.topic}
                              </h3>
                            </div>
                            <p className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Settings size={10} /> 臨床技能中心
                            </p>
                          </div>
                          <div className="px-4 py-6 flex flex-col justify-center items-center text-center">
                            {item.isBreak ? (
                              <span className="text-[10px] font-black text-amber-500/50 uppercase tracking-tighter">Energy Refill</span>
                            ) : item.topic.includes('總結') ? (
                              <div className="flex flex-col items-center gap-1">
                                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Session Recap</div>
                                <div className="flex items-center gap-1 text-cathay-green font-black text-xs uppercase tracking-widest">
                                  <RefreshCcw size={12} />
                                  <span>reflection</span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-1">
                                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Coach Skill</div>
                                <div className="flex items-center gap-1 text-cathay-green font-black text-xs">
                                  <CheckCircle2 size={12} />
                                  <span>ADAPT/ERCP</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'rotation' && (
              <motion.div
                key="rotation"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Layers className="text-cathay-green" /> 分組演練配表
                  </h2>
                </div>

                {ROTATION_DATA.map((session, sIdx) => (
                  <div key={sIdx} className="space-y-3">
                    <div className="flex items-center gap-2 px-1">
                      <div className="w-1.5 h-5 bg-cathay-green rounded-full shadow-sm shadow-cathay-green/20" />
                      <h3 className="font-bold text-slate-800 text-lg">{session.timeRange}</h3>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm overflow-x-auto">
                      <table className="w-full text-sm text-center border-collapse">
                        <thead className="bg-slate-50/80 backdrop-blur-sm font-black uppercase tracking-widest border-b border-slate-100">
                          <tr>
                            <th className="px-6 py-4 whitespace-nowrap text-[14px] text-cathay-green">地點</th>
                            <th className="px-6 py-4 whitespace-nowrap text-[14px] text-cathay-green">回饋演練</th>
                            <th className="px-6 py-4 whitespace-nowrap text-[14px] text-cathay-green">引導師</th>
                            <th className="px-6 py-4 whitespace-nowrap text-[14px] text-cathay-green">標準住院醫師</th>
                            <th className="px-6 py-4 whitespace-nowrap text-[14px] text-cathay-green text-center">組別</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {session.assignments.map((asgn, aIdx) => (
                            <tr key={aIdx} className="hover:bg-cathay-light/30 transition-colors animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${aIdx * 50}ms` }}>
                              <td className="px-6 py-4 font-black text-slate-800 text-sm whitespace-nowrap">{asgn.room}</td>
                              <td className="px-6 py-4 flex justify-center">
                                <span className={cn(
                                  "px-3 py-1.5 rounded-md text-[13px] font-black tracking-tight flex items-center gap-2 w-fit",
                                  asgn.scenarioType === '病史詢問' ? "bg-blue-100 text-blue-800 border border-blue-200/50" : "bg-amber-100 text-amber-800 border border-amber-200/50"
                                )}>
                                  {asgn.scenarioType === '病史詢問' ? <Stethoscope size={16} /> : <MessageSquareText size={16} />}
                                  {asgn.scenarioType}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-slate-800 font-black text-sm whitespace-nowrap">{asgn.facilitator}</td>
                              <td className="px-6 py-4 text-slate-800 font-black text-sm whitespace-nowrap">{asgn.sr}</td>
                              <td className="px-6 py-4">
                                <span className="bg-slate-900 text-white font-mono text-[11px] font-bold px-2 py-1 rounded shadow-sm inline-block">
                                  {asgn.group}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'facilitator' && (
              <motion.div
                key="facilitator"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <ProtectedSection
                  isPasswordVerified={isPasswordVerified}
                  password={password}
                  setPassword={setPassword}
                  showPasswordError={showPasswordError}
                  handlePasswordSubmit={handlePasswordSubmit}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Layers className="text-cathay-green" /> 引導師帶領流程指南
                    </h2>
                    <div className="flex items-center gap-2">
                      <a 
                        href="https://drive.google.com/drive/folders/13PEp--SFirwaAEblqaC6Ttbs01c84Cwf?usp=sharing" 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-sm font-black hover:bg-slate-800 transition-all shadow-lg hover:scale-105 active:scale-95 group"
                      >
                        <PlayCircle className="text-cathay-green group-hover:animate-pulse" size={18} /> 
                        <span>開啟影片教材庫</span>
                        <ChevronRight size={14} className="opacity-50" />
                      </a>
                    </div>
                  </div>

                  {/* Video Library Promo Card */}
                  <div className="bg-gradient-to-br from-cathay-green to-emerald-700 rounded-3xl p-6 text-white shadow-xl shadow-cathay-green/20 relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                            <PlayCircle size={24} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Learning Movie Library</span>
                        </div>
                        <h3 className="text-2xl font-black mb-2">臨床教練影片教材總庫</h3>
                        <p className="text-white/80 text-sm leading-relaxed max-w-xl">
                          包含「病史詢問」與「病情解釋」兩大類別的所有教學影片 (Round 1 A/B & Round 2 A/B)。
                          請於各階段練習前點擊下方或右上角按鈕開啟雲端資料夾播放。
                        </p>
                      </div>
                      <a 
                        href="https://drive.google.com/drive/folders/13PEp--SFirwaAEblqaC6Ttbs01c84Cwf?usp=sharing" 
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-white text-cathay-green px-8 py-4 rounded-2xl font-black shadow-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 whitespace-nowrap text-lg"
                      >
                        <Zap size={20} /> 立即開啟 Google Drive
                      </a>
                    </div>
                    <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl" />
                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-4">
                    <div className="bg-amber-500 text-white p-2 rounded-xl">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-amber-900">總共 4 場分組回饋演練場次</h4>
                      <p className="text-[11px] text-amber-700 font-medium">每 Session 內含 2 次練習回圈，請掌握時間節奏。</p>
                    </div>
                  </div>

                {/* Overall Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Session 1 */}
                  <div className="bg-slate-50 border border-slate-200 p-1 rounded-2xl flex flex-col gap-1">
                    <div className="px-4 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200/50">Session 1</div>
                    <div className="grid grid-cols-2 gap-1 p-1">
                      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-cathay-green opacity-50" />
                        <div className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Round 1</div>
                        <div className="text-sm font-black text-slate-800">14:40-15:15</div>
                      </div>
                      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-cathay-green" />
                        <div className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Round 2</div>
                        <div className="text-sm font-black text-slate-800">15:20-15:45</div>
                      </div>
                    </div>
                  </div>

                  {/* Session 2 */}
                  <div className="bg-slate-50 border border-slate-200 p-1 rounded-2xl flex flex-col gap-1">
                    <div className="px-4 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200/50">Session 2</div>
                    <div className="grid grid-cols-2 gap-1 p-1">
                      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-cathay-green opacity-30" />
                        <div className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Round 1</div>
                        <div className="text-sm font-black text-slate-800">16:05-16:40</div>
                      </div>
                      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-cathay-green opacity-80" />
                        <div className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Round 2</div>
                        <div className="text-sm font-black text-slate-800">16:45-17:10</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feedback Loop Diagram */}
                <div className="bg-slate-900 rounded-[2rem] p-8 shadow-2xl border border-slate-800 overflow-hidden relative">
                  <div className="relative z-10">
                    <h3 className="text-white text-base font-black mb-8 uppercase tracking-widest flex items-center gap-2">
                      <RefreshCcw className="text-cathay-green" size={18} /> SESSION 帶領結構 (雙回饋循環)
                    </h3>
                    
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
                      {/* Round 1 */}
                      <div className="w-full md:w-[42%] bg-slate-800/40 border border-slate-700/50 p-6 rounded-[1.5rem] relative group">
                        <div className="text-[10px] font-black text-cathay-green mb-4 uppercase tracking-widest opacity-60">Round 1</div>
                        <div className="flex items-center gap-4">
                          <div className="bg-slate-700/50 px-4 py-3 rounded-xl text-white font-black text-sm border border-slate-600/30">影片 A</div>
                          <ChevronRight className="text-slate-600" size={16} />
                          <div className="bg-cathay-green px-5 py-3 rounded-xl text-white font-black text-sm shadow-lg shadow-green-900/20">進行回饋 1</div>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="flex flex-row md:flex-col items-center justify-center gap-0 h-12 md:h-32 w-32 md:w-auto">
                        <div className="h-[1px] md:h-full w-full md:w-[1px] bg-slate-800" />
                        <div className="bg-cathay-green text-white p-3 rounded-full shadow-[0_0_20px_rgba(0,129,60,0.4)] z-10 shrink-0 mx-[-4px]">
                          <Zap size={20} fill="currentColor" />
                        </div>
                        <div className="h-[1px] md:h-full w-full md:w-[1px] bg-slate-800" />
                      </div>

                      {/* Round 2 */}
                      <div className="w-full md:w-[42%] bg-slate-800/40 border border-slate-700/50 p-6 rounded-[1.5rem] relative group">
                        <div className="text-[10px] font-black text-cathay-green mb-4 uppercase tracking-widest opacity-60">Round 2</div>
                        <div className="flex items-center gap-4">
                          <div className="bg-slate-700/50 px-4 py-3 rounded-xl text-white font-black text-sm border border-slate-600/30">影片 B</div>
                          <ChevronRight className="text-slate-600" size={16} />
                          <div className="bg-cathay-green px-5 py-3 rounded-xl text-white font-black text-sm shadow-lg shadow-green-900/20">進行回饋 2</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-10 flex flex-wrap gap-6 pt-6 border-t border-slate-800/50">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-xs font-black text-slate-300">病情解釋：影片 A & 影片 B</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-xs font-black text-slate-300">病史詢問：影片 A & 影片 B</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {FACILITATOR_GUIDE[0].steps.map((step, idx) => (
                    <div key={idx} className="relative pl-8">
                       <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-200" />
                       <div className="absolute left-[-4px] top-1 w-2 h-2 rounded-full bg-cathay-green shadow-[0_0_8px_rgba(0,129,60,0.5)]" />
                       
                       <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                         <div className="flex items-center justify-between mb-4">
                           <div className="flex items-center gap-3">
                             {step.iconName && iconMap[step.iconName] && (
                               <div className="p-2 bg-slate-50 rounded-lg text-cathay-green">
                                 {(() => {
                                   const Icon = iconMap[step.iconName];
                                   return <Icon size={18} />;
                                 })()}
                               </div>
                             )}
                             <h3 className="text-lg font-bold text-slate-800">{step.label}</h3>
                           </div>
                           <span className="text-xs bg-slate-100 text-slate-500 font-bold px-2 py-1 rounded-md">{step.duration}</span>
                         </div>
                         <ul className="space-y-2">
                           {step.items.map((item, iIdx) => (
                             <li key={iIdx} className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                               <CheckCircle2 size={14} className="text-cathay-green mt-0.5 shrink-0" />
                               {item}
                             </li>
                           ))}
                         </ul>
                       </div>
                    </div>
                  ))}
                </div>

                {/* ERCP x ADAPT Mapping Reference (Direct display from public folder) */}
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm mt-12 animate-in fade-in zoom-in duration-500">
                  <div className="bg-slate-900 p-4 border-b border-slate-800">
                    <h3 className="text-white text-sm font-black flex items-center gap-2 uppercase tracking-widest">
                      <ClipboardCheck className="text-cathay-green" size={16} /> ERCP x ADAPT 參考對照圖
                    </h3>
                  </div>
                  
                  <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="max-w-5xl mx-auto">
                      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white group">
                        <img 
                          src="ercp-adapt-mapping.png" 
                          alt="ERCP x ADAPT Mapping Diagram" 
                          className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.parentElement!.innerHTML = `
                              <div class="p-20 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
                                <div class="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                                </div>
                                <p class="text-slate-500 font-bold">請將圖片存為 public/ercp-adapt-mapping.png</p>
                                <p class="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Image Content Placeholder</p>
                              </div>
                            `;
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Text Table Reference */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-4 py-3 text-[11px] font-black text-slate-500 uppercase tracking-widest">ERCP 階段</th>
                          <th className="px-4 py-3 text-[11px] font-black text-slate-500 uppercase tracking-widest">對應 ADAPT</th>
                          <th className="px-4 py-3 text-[11px] font-black text-slate-500 uppercase tracking-widest">回饋重點</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { ercp: "前置", adapt: "Prepare", focus: "建立關係、設定目標、營造安全回饋情境", color: "slate" },
                          { ercp: "Experience", adapt: "Ask", focus: "讓學習者先描述剛剛發生了什麼", color: "blue" },
                          { ercp: "Reflection", adapt: "Ask + Discuss", focus: "引導自我反思、並進行分析與回饋", color: "amber" },
                          { ercp: "Conceptualization", adapt: "Discuss + Ask", focus: "歸納原則、確認理解與學習重點", color: "emerald" },
                          { ercp: "Planning", adapt: "Plan Together", focus: "共同形成具體可行的下一步計畫", color: "cathay" }
                        ].map((row, idx) => (
                          <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className={cn(
                                  "w-1.5 h-1.5 rounded-full",
                                  row.color === 'slate' ? "bg-slate-400" :
                                  row.color === 'blue' ? "bg-blue-400" :
                                  row.color === 'amber' ? "bg-amber-400" :
                                  row.color === 'emerald' ? "bg-emerald-400" : "bg-cathay-green"
                                )} />
                                <span className="text-sm font-bold text-slate-800">{row.ercp}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={cn(
                                "text-xs font-black px-2 py-1 rounded-lg",
                                row.color === 'slate' ? "bg-slate-100 text-slate-600" :
                                row.color === 'blue' ? "bg-blue-50 text-blue-600" :
                                row.color === 'amber' ? "bg-amber-50 text-amber-600" :
                                row.color === 'emerald' ? "bg-emerald-50 text-emerald-600" : "bg-green-50 text-cathay-green"
                              )}>
                                {row.adapt}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600 font-medium">
                              {row.focus}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 bg-slate-50 border-t border-slate-100 italic text-[11px] text-slate-500 flex items-start gap-2">
                    <Info size={14} className="shrink-0 mt-0.5 text-cathay-green" />
                    <span>重點：ERCP 強調學習循環；ADAPT 強調回饋對話技巧。兩者可互補整合。</span>
                  </div>
                </div>

                <div className="mt-12 bg-amber-50 border border-amber-200 rounded-2xl p-6">
                  <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                    <Info size={18} /> 引導師心法小提醒
                  </h4>
                  <p className="text-sm text-amber-700 italic">
                    引導階段的核心在於『深挖』教師的觀察與『連結』SR的演出。若發現回饋過於表面，請適時介入引導，並嚴格管控時間。
                  </p>
                </div>
              </ProtectedSection>
            </motion.div>
          )}

          {activeTab === 'assessment' && (
            <motion.div
              key="assessment"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <ProtectedSection
                isPasswordVerified={isPasswordVerified}
                password={password}
                setPassword={setPassword}
                showPasswordError={showPasswordError}
                handlePasswordSubmit={handlePasswordSubmit}
              >
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <ClipboardList className="text-cathay-green" /> 回饋評核與里程碑等級
                    </h2>
                  </div>

                  {/* Sub-tabs for Assessment */}
                  <div className="flex bg-slate-100 p-1 rounded-2xl w-fit">
                    <button
                      onClick={() => setAssessmentSubTab('feedback')}
                      className={cn(
                        "px-6 py-2 rounded-xl text-xs font-black transition-all",
                        assessmentSubTab === 'feedback' 
                          ? "bg-white text-slate-900 shadow-sm" 
                          : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      回饋評核區
                    </button>
                    <button
                      onClick={() => setAssessmentSubTab('milestone')}
                      className={cn(
                        "px-6 py-2 rounded-xl text-xs font-black transition-all",
                        assessmentSubTab === 'milestone' 
                          ? "bg-white text-slate-900 shadow-sm" 
                          : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      里程碑評等區
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {assessmentSubTab === 'feedback' ? (
                      <motion.div
                        key="feedback-tab"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                      >
                         <FeedbackScoringTable />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="milestone-tab"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                      >
                        <MilestoneAssessment user={user} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-16 pt-16 border-t border-slate-200">
                    <AssessmentDashboard initialTab={assessmentSubTab} />
                  </div>
                </div>
              </ProtectedSection>
            </motion.div>
          )}


            {activeTab === 'scenarios' && (
              <motion.div
                key="scenarios"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <ProtectedSection
                  isPasswordVerified={isPasswordVerified}
                  password={password}
                  setPassword={setPassword}
                  showPasswordError={showPasswordError}
                  handlePasswordSubmit={handlePasswordSubmit}
                >
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Users className="text-cathay-green" /> 標準住院醫師 角色劇本指引
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {SCENARIOS.map((scenario) => (
                      <button
                        key={scenario.id}
                        onClick={() => setSelectedScenario(scenario)}
                        className="p-6 bg-white border border-slate-200 rounded-3xl text-left hover:border-cathay-green hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden flex items-start gap-4"
                      >
                        <div className={cn(
                          "flex-shrink-0 p-4 rounded-2xl transition-colors",
                          scenario.personality === 'agreeable_vague' ? "bg-green-50 text-green-600 group-hover:bg-green-100" :
                          scenario.personality === 'perfectionist' ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100" :
                          "bg-rose-50 text-rose-600 group-hover:bg-rose-100"
                        )}>
                          {scenario.iconName && iconMap[scenario.iconName] && (() => {
                            const Icon = iconMap[scenario.iconName];
                            return <Icon size={28} />;
                          })()}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className={cn(
                            "inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white mb-3 shadow-sm",
                            scenario.personality === 'agreeable_vague' ? "bg-green-600" :
                            scenario.personality === 'perfectionist' ? "bg-emerald-600" :
                            "bg-rose-600"
                          )}>
                            {scenario.personality === 'agreeable_vague' ? '表面認同型' : 
                             scenario.personality === 'perfectionist' ? '完美主義型' : '抗拒/焦慮型'}
                          </div>
                          
                          <h3 className="font-black text-lg mb-1 group-hover:text-cathay-green transition-colors leading-tight">
                            {scenario.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-slate-400 mb-3 font-mono">
                            <Clock size={12} /> {scenario.timeRange}
                          </div>
                          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                            {scenario.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </ProtectedSection>
              </motion.div>
            )}

              {activeTab === 'tips' && (
            <motion.div
              key="tips"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <ProtectedSection
                isPasswordVerified={isPasswordVerified}
                password={password}
                setPassword={setPassword}
                showPasswordError={showPasswordError}
                handlePasswordSubmit={handlePasswordSubmit}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <AlertCircle className="text-rose-500" /> 專業學員類型演出小技巧
                  </h2>
                </div>

                {/* SR Progression Map */}
                <div className="bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-700 overflow-hidden relative">
                  <div className="relative z-10">
                    <h3 className="text-white text-lg font-black mb-4 flex items-center gap-2">
                      <Zap className="text-amber-400" /> 標準住院醫師 演繹順序
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {SR_PROGRESSION.map((step, idx) => (
                        <div key={idx} className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl relative group hover:bg-slate-800 transition-colors">
                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Stage {idx + 1}</div>
                          <h4 className="text-amber-400 font-bold text-sm mb-2">{step.stage}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
                          {idx < SR_PROGRESSION.length - 1 && (
                            <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 z-20">
                              <ChevronRight className="text-slate-600" size={20} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 w-64 h-64 bg-cathay-green/5 rounded-full -mb-32 -mr-32 blur-3xl" />
                </div>

                <div className="space-y-12">
                  {/* 表面認同型 (Yes-Man) Comic Style */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-600 text-white font-black px-3 py-1 rounded text-xs">CHARACTER 01</div>
                      <CheckCircle2 className="text-green-600" size={24} />
                      <h3 className="text-xl font-black text-slate-800">表面認同型 (Yes-Man) 演繹流程</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {[
                        { title: "演出起手", content: "演出過度配合，不斷說『老師說得對』，測試教練是否深挖。" },
                        { title: "互動觀察", content: "對自我表現缺乏深入評估，保持一種『客氣的距離感』。" },
                        { title: "切換點", content: "當教練請學員進行『回顧 (Review)』時，立即回復正常思考。" },
                        { title: "最終目標", content: "讓教練練習如何跳出封閉性提問，引導具體的行動計畫。" }
                      ].map((cell, i) => (
                        <div key={i} className="bg-white border-4 border-slate-900 p-4 rounded shadow-[8px_8px_0_0_rgba(15,23,42,1)] flex flex-col h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] group transition-all hover:-translate-y-1">
                          <div className="bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 w-fit mb-3">SCENE {i+1}</div>
                          <h4 className="font-black text-slate-900 text-sm mb-2 border-b-2 border-slate-900 pb-1">{cell.title}</h4>
                          <p className="text-xs text-slate-700 font-medium leading-relaxed italic">「{cell.content}」</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 完美型學員 (Perfectionist) Comic Style */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-600 text-white font-black px-3 py-1 rounded text-xs">CHARACTER 02</div>
                      <Target className="text-emerald-600" size={24} />
                      <h3 className="text-xl font-black text-slate-800">完美型學員 (Perfectionist) 演繹流程</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {[
                        { title: "演出起手", content: "對負面評價有強烈的自我批評，忽略正向表現的肯定。" },
                        { title: "互動觀察", content: "詢問：『為什麼我表現出的和老師看的不同？』追求回饋細節。" },
                        { title: "切換點", content: "當教練給予『具體且發自內心的鼓勵』後，展現改進意願。" },
                        { title: "最終目標", content: "測試教練是否能處理學員情緒，並引導其關注整體大方向。" }
                      ].map((cell, i) => (
                        <div key={i} className="bg-white border-4 border-slate-900 p-4 rounded shadow-[8px_8px_0_0_rgba(15,23,42,1)] flex flex-col h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] group transition-all hover:-translate-y-1">
                          <div className="bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 w-fit mb-3">SCENE {i+1}</div>
                          <h4 className="font-black text-slate-900 text-sm mb-2 border-b-2 border-slate-900 pb-1">{cell.title}</h4>
                          <p className="text-xs text-slate-700 font-medium leading-relaxed italic">「{cell.content}」</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 抗拒/焦慮型 (Resistant/Anxious) Comic Style */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-rose-600 text-white font-black px-3 py-1 rounded text-xs">CHARACTER 03</div>
                      <AlertTriangle className="text-rose-600" size={24} />
                      <h3 className="text-xl font-black text-slate-800">抗拒/焦慮型 (Resistant) 演繹流程</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {[
                        { title: "演出起手", content: "展現焦慮，反覆看手錶。找出外部原因來開脫自己的表現。" },
                        { title: "互動觀察", content: "建立淡漠關係，回應簡短且防禦性強。肢體語言呈現封閉態。" },
                        { title: "切換點", content: "當教練詢問『是否發生什麼事？』進行情緒正常化後恢復。" },
                        { title: "最終目標", content: "練習教練的情緒偵測能力，以及在壓力狀態下的對話引導。" }
                      ].map((cell, i) => (
                        <div key={i} className="bg-white border-4 border-slate-900 p-4 rounded shadow-[8px_8px_0_0_rgba(15,23,42,1)] flex flex-col h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] group transition-all hover:-translate-y-1">
                          <div className="bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 w-fit mb-3">SCENE {i+1}</div>
                          <h4 className="font-black text-slate-900 text-sm mb-2 border-b-2 border-slate-900 pb-1">{cell.title}</h4>
                          <p className="text-xs text-slate-700 font-medium leading-relaxed italic">「{cell.content}」</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Common Behavior */}
                  <div className="bg-cathay-green text-white p-6 rounded-2xl shadow-lg relative overflow-hidden border-2 border-white/20">
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                         <Info size={20} /> 標準住院醫師 通用行為準則
                      </h3>
                      <p className="text-cathay-light/80 text-sm mb-4">
                        作為標準住院醫師，您的使命是完美呈現特定特質，協助臨床教練達成教學目的。
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 size={16} className="text-white" /> 配合引導師的暫停動作與凍結提示
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 size={16} className="text-white" /> 根據教師使用的回饋模型調整情緒張力
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 size={16} className="text-white" /> 結束後主動詢問引導師的回饋與修正
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 opacity-50 blur-2xl" />
                  </div>
                </div>
              </ProtectedSection>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>

      {/* Mobile Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 md:hidden flex justify-around py-3 px-4 shadow-2xl z-40">
        {(['schedule', 'rotation', 'facilitator', 'scenarios', 'tips'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              activeTab === tab ? "text-cathay-green" : "text-slate-400"
            )}
          >
            {tab === 'schedule' ? <Calendar size={20} /> : 
             tab === 'rotation' ? <Layers size={20} /> :
             tab === 'facilitator' ? <Zap size={20} /> :
             tab === 'scenarios' ? <Users size={20} /> : <AlertCircle size={20} />}
            <span className="text-[10px] font-bold relative">
              {tab === 'schedule' ? '課程表' : 
               tab === 'rotation' ? '分組' :
               tab === 'facilitator' ? '引導' :
               tab === 'scenarios' ? '情境' : '演練技巧'}
            </span>
          </button>
        ))}
      </div>

      {/* Scenario Detail Modal */}
      <AnimatePresence>
        {selectedScenario && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedScenario(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-white"
            >
              <div className={cn(
                "h-2",
                selectedScenario.personality === 'agreeable_vague' ? "bg-green-500" :
                selectedScenario.personality === 'perfectionist' ? "bg-emerald-500" :
                "bg-rose-500"
              )} />
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                  {selectedScenario.iconName && iconMap[selectedScenario.iconName] && (
                    <div className="p-3 bg-slate-100 rounded-2xl text-cathay-green">
                       {(() => {
                         const Icon = iconMap[selectedScenario.iconName];
                         return <Icon size={24} />;
                       })()}
                    </div>
                  )}
                  <h2 className="text-2xl font-black text-slate-800">{selectedScenario.title}</h2>
                </div>
                    <p className="text-sm font-mono text-slate-400 mt-1 flex items-center gap-1">
                      <Clock size={12} /> {selectedScenario.timeRange}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedScenario(null)}
                    className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <ChevronRight size={24} className="rotate-90 text-slate-400" />
                  </button>
                </div>

                <div className="space-y-6">
                  <section>
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-2">角色演出核心</h4>
                    <p className="text-slate-700 leading-relaxed bg-cathay-light p-4 rounded-xl border-l-4 border-cathay-green font-medium">
                      {selectedScenario.roleBehavior}
                    </p>
                  </section>

                  <section>
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-2">演法技巧 (Tips)</h4>
                    <div className="space-y-2">
                      {selectedScenario.tips.map((tip, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                          <div className="w-1.5 h-1.5 bg-cathay-green rounded-full shrink-0" />
                          {tip}
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <button
                  onClick={() => setSelectedScenario(null)}
                  className="w-full mt-8 py-4 bg-cathay-green text-white font-bold rounded-2xl hover:bg-cathay-green-hover transition-all shadow-lg active:scale-95"
                >
                  確認劇本，準備演出
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-12 mb-8 py-8 border-t border-slate-200 text-center">
        <p className="text-xs text-slate-500 font-bold tracking-widest font-sans mb-1">
          社團法人台灣急診醫學會 & 國泰綜合醫院
        </p>
        <p className="text-[10px] text-slate-400 font-medium tracking-widest font-sans">
          國泰綜合醫院教學部 數位科技暨網路資源中心
        </p>
      </footer>

      {/* Padding for mobile nav */}

      <div className="h-20 md:hidden" />
    </div>
  );
}

export default function App() {
  console.log('App mounting...');
  return (
    <Router>
      {/* Mounting Check */}
      <div className="fixed top-4 right-4 z-[9999] bg-cathay-green text-white px-2 py-1 text-[10px] font-bold rounded shadow-xl">Handbook 2.0</div>
      <Navigation />
      <Routes>
        <Route path="/" element={<MainAppContent />} />
        <Route path="/assessment" element={<MainAppContent />} />
        <Route path="/timer" element={
          <div className="min-h-screen bg-[#fdfdfd] flex items-center justify-center p-4">
            <div className="w-full max-w-5xl">
              <WorkshopTimer />
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}
