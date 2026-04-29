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
  Layers
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { WORKSHOP_SCHEDULE, SCENARIOS, ROTATION_DATA } from './constants';
import { Scenario } from './types';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'rotation' | 'scenarios' | 'tips'>('schedule');
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
                className="h-8 md:h-10 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement?.querySelector('.fallback-cgh')?.classList.remove('hidden');
                }}
              />
              <div className="fallback-cgh hidden w-8 h-8 bg-cathay-green rounded-full flex items-center justify-center text-white font-bold text-xs">CGH</div>
              
              <img 
                src="https://www.sem.org.tw/template/default/images/logo.png" 
                alt="TSEM Logo" 
                className="h-8 md:h-10 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement?.querySelector('.fallback-tsem')?.classList.remove('hidden');
                }}
              />
              <div className="fallback-tsem hidden w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold text-[10px]">TSEM</div>
            </div>
            <div>
              <h1 className="text-sm md:text-lg font-black tracking-tight text-slate-800 leading-tight">國泰綜合醫院 SR 數位手冊</h1>
              <p className="text-[9px] md:text-[10px] text-cathay-green font-bold tracking-widest border-l-2 border-cathay-green pl-2 ml-1 uppercase">
                Taiwan Society of Emergency Medicine (TSEM)
              </p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['schedule', 'rotation', 'scenarios', 'tips'] as const).map((tab) => (
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
                {tab === 'schedule' ? '課程表' : tab === 'rotation' ? '分組演練' : tab === 'scenarios' ? '角色指引' : '演導技巧'}
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
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <Settings size={10} /> {item.location}
                        </p>
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
                        <thead className="bg-slate-50/80 backdrop-blur-sm text-slate-500 font-black uppercase text-[10px] tracking-widest border-b border-slate-100">
                          <tr>
                            <th className="px-6 py-4 whitespace-nowrap">地點</th>
                            <th className="px-6 py-4 whitespace-nowrap">情境演練</th>
                            <th className="px-6 py-4 whitespace-nowrap">引導師</th>
                            <th className="px-6 py-4 whitespace-nowrap">SR</th>
                            <th className="px-6 py-4 text-center whitespace-nowrap">組別</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {session.assignments.map((asgn, aIdx) => (
                            <tr key={aIdx} className="hover:bg-cathay-light/30 transition-colors animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${aIdx * 50}ms` }}>
                              <td className="px-6 py-4 font-black text-slate-700 whitespace-nowrap">{asgn.room}</td>
                              <td className="px-6 py-4">
                                <span className={cn(
                                  "px-2.5 py-1 rounded-md text-[11px] font-black tracking-tight",
                                  asgn.scenarioType === '病史詢問' ? "bg-blue-100 text-blue-700 border border-blue-200/50" : "bg-amber-100 text-amber-700 border border-amber-200/50"
                                )}>
                                  {asgn.scenarioType}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-slate-600 font-medium whitespace-nowrap">{asgn.facilitator}</td>
                              <td className="px-6 py-4 text-slate-600 font-bold whitespace-nowrap">{asgn.sr}</td>
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

            {activeTab === 'scenarios' && (
              <motion.div
                key="scenarios"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Users className="text-cathay-green" /> SR 角色劇本指引
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SCENARIOS.map((scenario) => (
                    <button
                      key={scenario.id}
                      onClick={() => setSelectedScenario(scenario)}
                      className="p-5 bg-white border border-slate-200 rounded-2xl text-left hover:border-cathay-green hover:shadow-md transition-all group relative overflow-hidden"
                    >
                      <div className={cn(
                        "absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[10px] font-bold uppercase tracking-widest text-white shadow-sm",
                        scenario.personality === 'agreeable_vague' ? "bg-green-600" :
                        scenario.personality === 'perfectionist' ? "bg-purple-600" :
                        "bg-rose-600"
                      )}>
                        {scenario.personality === 'agreeable_vague' ? '表面認同型' : 
                         scenario.personality === 'perfectionist' ? '完美主義型' : '抗拒/焦慮型'}
                      </div>
                      
                      <h3 className="font-bold text-lg mb-1 group-hover:text-cathay-green transition-colors">
                        {scenario.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-3 font-mono">
                        <Clock size={12} /> {scenario.timeRange}
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {scenario.description}
                      </p>
                      <div className="mt-4 flex items-center gap-1 text-cathay-green text-xs font-bold uppercase tracking-tighter">
                        查看詳細演法 <ChevronRight size={14} />
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
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <AlertCircle className="text-rose-500" /> 專業學員類型演出小技巧
              </h2>

              <div className="space-y-6">
                {/* Agreeable Type */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-100 p-2 rounded-lg text-green-600">
                      <UserCircle size={20} />
                    </div>
                    <h3 className="text-xl font-bold">表面認同型 (Yes-Man)</h3>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      '過度配合，不斷說『老師說得對』',
                      '對自我表現缺乏深入評估',
                      '測試教練是否能問出封閉性以外的問題',
                      '表現出良好的態度但沒有具體的行動計畫',
                      '避免衝突，保持一種客氣的距離感',
                    ].map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-600 bg-slate-50 p-3 rounded-xl text-sm italic">
                        <span className="text-green-400 mt-0.5">•</span> {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resistant Type */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-rose-100 p-2 rounded-lg text-rose-600">
                      <Clock size={20} />
                    </div>
                    <h3 className="text-xl font-bold">抗拒/焦慮型 (Resistant/Anxious)</h3>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      '展現出焦慮（如：看手錶、心不在焉）',
                      '建立較淡漠的關係與防禦性回應',
                      '找出各種外部原因來開脫自己的表現',
                      '肢體語言呈現封閉態',
                      '測試教練是否能進行情緒正常化',
                    ].map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-600 bg-slate-50 p-3 rounded-xl text-sm italic">
                        <span className="text-rose-400 mt-0.5">•</span> {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Perfectionist Type */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                      <CheckCircle2 size={20} />
                    </div>
                    <h3 className="text-xl font-bold">完美型學員 (Perfectionist)</h3>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      '對負面評價有強烈的自我批評',
                      '忽略正向表現的肯定',
                      '詢問：『為什麼我表現出的和老師看的不同？』',
                      '不僅僅試圖讓老師誇獎你，要挖深自己的負面評價原因',
                      '追求回饋細節，而非大方向',
                    ].map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-600 bg-slate-50 p-3 rounded-xl text-sm italic">
                        <span className="text-purple-400 mt-0.5">•</span> {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Common Behavior */}
                <div className="bg-cathay-green text-white p-6 rounded-2xl shadow-lg relative overflow-hidden border-2 border-white/20">
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                       <Info size={20} /> SR 通用行為準則
                    </h3>
                    <p className="text-cathay-light/80 text-sm mb-4">
                      作為 SR，您的使命是完美呈現特定特質，協助臨床教練達成教學目的。
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
        {(['schedule', 'rotation', 'scenarios', 'tips'] as const).map((tab) => (
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
             tab === 'scenarios' ? <Users size={20} /> : <AlertCircle size={20} />}
            <span className="text-[10px] font-bold">
              {tab === 'schedule' ? '課程表' : 
               tab === 'rotation' ? '分組' :
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
                    <h2 className="text-2xl font-black text-slate-800">{selectedScenario.title}</h2>
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
