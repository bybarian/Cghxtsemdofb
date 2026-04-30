import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  UserCircle, 
  BookOpen, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
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
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { WORKSHOP_SCHEDULE, SCENARIOS, ROTATION_DATA, FACILITATOR_GUIDE, SR_PROGRESSION } from './constants';
import { Scenario } from './types';

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

export default function App() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'rotation' | 'scenarios' | 'tips' | 'facilitator'>('schedule');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pr-4 border-r border-slate-100">
              <img 
                src="https://www.cgh.org.tw/tw/content/images/logo.png" 
                alt="Cathay Logo" 
                className="h-8 md:h-12 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement?.querySelector('.fallback-cgh')?.classList.remove('hidden');
                }}
              />
              <div className="fallback-cgh hidden w-8 h-8 bg-cathay-light rounded-full flex items-center justify-center text-cathay-green font-bold text-[10px]">CGH</div>
              
              <div className="h-4 w-px bg-slate-200" />

              <img 
                src="https://www.sem.org.tw/template/default/images/logo.png" 
                alt="TSEM Logo" 
                className="h-8 md:h-12 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement?.querySelector('.fallback-tsem')?.classList.remove('hidden');
                }}
              />
              <div className="fallback-tsem hidden w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold text-[10px]">TSEM</div>
            </div>
            <div>
              <h1 className="text-sm md:text-lg font-black tracking-tight text-slate-800 leading-tight">臨床教練工作坊標準住院醫師/引導師 數位手冊</h1>
              <p className="text-[7px] md:text-[9px] text-cathay-green font-bold tracking-tight border-l-2 border-cathay-green pl-2 ml-1 uppercase leading-none mt-0.5">
                Digital Handbook for Standardized Residents & Facilitators in Clinical Coaching Workshop<br/>
                <span className="text-[6px] md:text-[8px] opacity-60">Cathay General Hospital x Taiwan Society of Emergency Medicine (TSEM)</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a 
                href="https://drive.google.com/drive/folders/13PEp--SFirwaAEblqaC6Ttbs01c84Cwf?usp=sharing" 
                target="_blank" 
                rel="noreferrer"
                className="hidden md:flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-black hover:bg-indigo-100 transition-colors"
              >
                <Zap size={14} /> 影片教材庫
              </a>
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
                {tab === 'schedule' ? '課程表' : tab === 'rotation' ? '分組演練' : tab === 'facilitator' ? '引導指引' : tab === 'scenarios' ? '角色指引' : '演導技巧'}
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
                    <Calendar className="text-cathay-green" /> 工作坊流程紀錄
                  </h2>
                  <div className="text-xs bg-cathay-light text-cathay-green font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-cathay-green/20">
                    CATHAY GENERAL HOSPITAL
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  {WORKSHOP_SCHEDULE.map((item, index) => (
                    <div 
                      key={index}
                      className={cn(
                        "flex items-stretch border-b border-slate-100 last:border-0",
                        item.isBreak ? "bg-slate-50/50" : "bg-white"
                      )}
                    >
                      <div className="w-24 md:w-32 px-4 py-4 border-r border-slate-100 flex flex-col justify-center items-center text-center bg-slate-50/30">
                        <span className="text-sm font-bold text-slate-700">{item.time}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{item.minutes}min</span>
                      </div>
                      <div className="flex-1 px-5 py-4 flex flex-col justify-center">
                        <div className="flex items-center gap-2">
                          {item.isBreak ? <Coffee size={14} className="text-amber-500" /> : <BookOpen size={14} className="text-cathay-green" />}
                          <h3 className={cn("text-base font-semibold text-slate-800", item.isBreak && "text-slate-500 font-normal")}>
                            {item.topic}
                          </h3>
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Settings size={10} /> {item.location}
                          </p>
                          {item.speaker && (
                            <p className="text-xs text-cathay-green font-black flex items-center gap-1">
                              <UserCircle size={10} /> {item.speaker}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
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
                      <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-slate-50/80 backdrop-blur-sm font-black uppercase tracking-widest border-b border-slate-100">
                          <tr>
                            <th className="px-6 py-4 whitespace-nowrap text-[14px] text-cathay-green">地點</th>
                            <th className="px-6 py-4 whitespace-nowrap text-[14px] text-cathay-green">情境演練</th>
                            <th className="px-6 py-4 whitespace-nowrap text-[14px] text-cathay-green">引導師</th>
                            <th className="px-6 py-4 whitespace-nowrap text-[14px] text-cathay-green">標準住院醫師</th>
                            <th className="px-6 py-4 text-center whitespace-nowrap text-[14px] text-cathay-green">組別</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {session.assignments.map((asgn, aIdx) => (
                            <tr key={aIdx} className="hover:bg-cathay-light/30 transition-colors animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${aIdx * 50}ms` }}>
                              <td className="px-6 py-4 font-black text-slate-800 text-sm whitespace-nowrap">{asgn.room}</td>
                              <td className="px-6 py-4">
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
                              <td className="px-6 py-4 text-center">
                                <span className="bg-slate-900 text-white font-mono text-[11px] font-bold px-2 py-1 rounded shadow-sm">
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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Layers className="text-indigo-500" /> 引導師帶領流程指南
                  </h2>
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-4">
                    <div className="bg-amber-500 text-white p-2 rounded-xl">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-amber-900">總共 4 場分組演練場次</h4>
                      <p className="text-[11px] text-amber-700 font-medium">每 Session 內含 2 次練習回圈，請掌握時間節奏。</p>
                    </div>
                  </div>
                </div>

                {/* Overall Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Session 1 */}
                  <div className="bg-slate-50 border border-slate-200 p-1 rounded-2xl flex flex-col gap-1">
                    <div className="px-4 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200/50">Session 1</div>
                    <div className="grid grid-cols-2 gap-1 p-1">
                      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                        <div className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Round 1</div>
                        <div className="text-sm font-black text-slate-800">14:40-15:20</div>
                      </div>
                      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                        <div className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Round 2</div>
                        <div className="text-sm font-black text-slate-800">15:20-16:00</div>
                      </div>
                    </div>
                  </div>

                  {/* Session 2 */}
                  <div className="bg-slate-50 border border-slate-200 p-1 rounded-2xl flex flex-col gap-1">
                    <div className="px-4 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200/50">Session 2</div>
                    <div className="grid grid-cols-2 gap-1 p-1">
                      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
                        <div className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Round 1</div>
                        <div className="text-sm font-black text-slate-800">16:10-16:50</div>
                      </div>
                      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                        <div className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Round 2</div>
                        <div className="text-sm font-black text-slate-800">16:50-17:30</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feedback Loop Diagram */}
                <div className="bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-700 overflow-hidden relative theme-comic">
                  <div className="relative z-10">
                    <h3 className="text-white text-sm font-black mb-6 uppercase tracking-widest flex items-center gap-2">
                      <RefreshCcw className="text-indigo-400" size={16} /> Session 帶領結構 (雙回饋循環)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-2 items-center">
                      {/* Loop 1 */}
                      <div className="col-span-3 bg-slate-800/80 border border-indigo-500/30 p-4 rounded-2xl">
                        <div className="text-[10px] font-black text-indigo-400 mb-2 uppercase">Round 1</div>
                        <div className="flex items-center gap-3">
                          <div className="bg-slate-700 p-2 rounded-lg text-white font-black text-xs">影片 A</div>
                          <ChevronRight className="text-slate-600" size={14} />
                          <div className="bg-indigo-600 px-3 py-1.5 rounded-lg text-white font-black text-xs">進行回饋 1</div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center h-full gap-2">
                        <div className="md:w-px md:h-8 w-12 h-px bg-slate-700" />
                        <a 
                          href="https://drive.google.com/drive/folders/13PEp--SFirwaAEblqaC6Ttbs01c84Cwf?usp=sharing"
                          target="_blank"
                          rel="noreferrer"
                          className="bg-indigo-500 hover:bg-indigo-400 text-white p-2 rounded-full transition-transform hover:scale-110 active:scale-95 shadow-lg"
                          title="開啟影片教材雲端資料夾"
                        >
                          <Zap size={16} />
                        </a>
                        <div className="md:w-px md:h-8 w-12 h-px bg-slate-700" />
                      </div>

                      {/* Loop 2 */}
                      <div className="col-span-3 bg-slate-800/80 border border-emerald-500/30 p-4 rounded-2xl">
                        <div className="text-[10px] font-black text-emerald-400 mb-2 uppercase">Round 2</div>
                        <div className="flex items-center gap-3">
                          <div className="bg-slate-700 p-2 rounded-lg text-white font-black text-xs">影片 B</div>
                          <ChevronRight className="text-slate-600" size={14} />
                          <div className="bg-emerald-600 px-3 py-1.5 rounded-lg text-white font-black text-xs">進行回饋 2</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                        <span className="text-[11px] text-slate-200 font-bold">病情解釋：影片 A & 影片 B</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-400" />
                        <span className="text-[11px] text-slate-200 font-bold">病史詢問：影片 A & 影片 B</span>
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

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                  <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                    <Info size={18} /> 引導師心法小提醒
                  </h4>
                  <p className="text-sm text-amber-700 italic">
                    引導階段的核心在於『深挖』教師的觀察與『連結』SR的演出。若發現回饋過於表面，請適時介入引導，並嚴格管控時間。
                  </p>
                </div>
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
                        scenario.personality === 'perfectionist' ? "bg-purple-50 text-purple-600 group-hover:bg-purple-100" :
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
                          scenario.personality === 'perfectionist' ? "bg-purple-600" :
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
                  <div className="flex items-center gap-2">
                    <div className="bg-green-600 text-white font-black px-3 py-1 rounded text-xs">COMIC 01</div>
                    <h3 className="text-xl font-black text-slate-800">表面認同型 (Yes-Man) 演繹流程</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { title: "演出起手", content: "演出過度配合，不斷說『老師說得對』，測試教練是否深挖。" },
                      { title: "互動觀察", content: "對自我表現缺乏深入評估，保持一種『客氣的距離感』。" },
                      { title: "切換點", content: "當教練請學員進行『回顧 (Review)』時，立即回復正常思考。" },
                      { title: "最終目標", content: "讓教練練習如何跳出封閉性提問，引導具體的行動計畫。" }
                    ].map((cell, i) => (
                      <div key={i} className="bg-white border-4 border-slate-900 p-4 rounded shadow-[8px_8px_0_0_rgba(15,23,42,1)] flex flex-col h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                        <div className="bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 w-fit mb-3">SCENE {i+1}</div>
                        <h4 className="font-black text-slate-900 text-sm mb-2 border-b-2 border-slate-900 pb-1">{cell.title}</h4>
                        <p className="text-xs text-slate-700 font-medium leading-relaxed italic">「{cell.content}」</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 完美型學員 (Perfectionist) Comic Style */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-purple-600 text-white font-black px-3 py-1 rounded text-xs">COMIC 02</div>
                    <h3 className="text-xl font-black text-slate-800">完美型學員 (Perfectionist) 演繹流程</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { title: "演出起手", content: "對負面評價有強烈的自我批評，忽略正向表現的肯定。" },
                      { title: "互動觀察", content: "詢問：『為什麼我表現出的和老師看的不同？』追求回饋細節。" },
                      { title: "切換點", content: "當教練給予『具體且發自內心的鼓勵』後，展現改進意願。" },
                      { title: "最終目標", content: "測試教練是否能處理學員情緒，並引導其關注整體大方向。" }
                    ].map((cell, i) => (
                      <div key={i} className="bg-white border-4 border-slate-900 p-4 rounded shadow-[8px_8px_0_0_rgba(15,23,42,1)] flex flex-col h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                        <div className="bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 w-fit mb-3">SCENE {i+1}</div>
                        <h4 className="font-black text-slate-900 text-sm mb-2 border-b-2 border-slate-900 pb-1">{cell.title}</h4>
                        <p className="text-xs text-slate-700 font-medium leading-relaxed italic">「{cell.content}」</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 抗拒/焦慮型 (Resistant/Anxious) Comic Style */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-rose-600 text-white font-black px-3 py-1 rounded text-xs">COMIC 03</div>
                    <h3 className="text-xl font-black text-slate-800">抗拒/焦慮型 (Resistant) 演繹流程</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { title: "演出起手", content: "展現焦慮，反覆看手錶。找出外部原因來開脫自己的表現。" },
                      { title: "互動觀察", content: "建立淡漠關係，回應簡短且防禦性強。肢體語言呈現封閉態。" },
                      { title: "切換點", content: "當教練詢問『是否發生什麼事？』進行情緒正常化後恢復。" },
                      { title: "最終目標", content: "練習教練的情緒偵測能力，以及在壓力狀態下的對話引導。" }
                    ].map((cell, i) => (
                      <div key={i} className="bg-white border-4 border-slate-900 p-4 rounded shadow-[8px_8px_0_0_rgba(15,23,42,1)] flex flex-col h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
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
            <span className="text-[10px] font-bold">
              {tab === 'schedule' ? '課程表' : 
               tab === 'rotation' ? '分組' :
               tab === 'facilitator' ? '引導' :
               tab === 'scenarios' ? '情境' : '演導技巧'}
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
                selectedScenario.personality === 'perfectionist' ? "bg-purple-500" :
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
          國泰綜合醫院教學部數位科技暨網路資源中心
        </p>
      </footer>

      {/* Padding for mobile nav */}

      <div className="h-20 md:hidden" />
    </div>
  );
}
