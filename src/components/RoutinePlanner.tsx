import React, { useState } from 'react';
import { useHousehold } from '../context/HouseholdContext';
import { 
  CheckCircle2, 
  Circle, 
  Leaf, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  Compass, 
  Car, 
  Home, 
  Dumbbell, 
  ShoppingBag 
} from 'lucide-react';
import { RoutineItem } from '../types';

export const RoutinePlanner: React.FC = () => {
  const { routineItems, toggleRoutineItem, aqiData, profile } = useHousehold();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Routines', icon: Compass },
    { id: 'commute', label: 'Commute & Travel', icon: Car },
    { id: 'indoor', label: 'Home & Ventilation', icon: Home },
    { id: 'exercise', label: 'Fitness & Health', icon: Dumbbell },
    { id: 'errand', label: 'Neighborhood Errands', icon: ShoppingBag },
  ];

  const filteredItems = filterCategory === 'all'
    ? routineItems
    : routineItems.filter(item => item.category === filterCategory);

  const completedCount = routineItems.filter(r => r.status === 'completed').length;
  const totalCount = routineItems.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  const handleToggle = (id: string, title: string, wasCompleted: boolean) => {
    toggleRoutineItem(id);
    if (!wasCompleted) {
      setCelebrationMessage(`Great choice! Completed: "${title}". Impact counters updated in your Impact Mirror!`);
      setTimeout(() => setCelebrationMessage(null), 4000);
    }
  };

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-700/60">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Low-Emission Daily Planner
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">
            Climate & Exposure-Adaptive Daily Routine
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Pre-emptive schedule tailored to <strong className="text-slate-200">{profile.cityName}</strong> ({aqiData.category} Smog). Swap high-pollution habits for low-emission alternatives to protect your lungs and reduce collective urban emissions.
          </p>
        </div>

        {/* Progress tracker */}
        <div className="bg-slate-900/80 border border-slate-700/70 rounded-2xl p-3 min-w-[200px] flex items-center gap-3">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-700"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500 transition-all duration-500"
                strokeDasharray={`${completionPercentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute font-mono text-xs font-bold text-white">
              {completionPercentage}%
            </span>
          </div>
          <div>
            <div className="text-xs font-bold text-white">
              {completedCount} of {totalCount} Adopted
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
              <Leaf className="w-3 h-3" />
              Direct Impact Active
            </div>
          </div>
        </div>
      </div>

      {/* Celebration Notification */}
      {celebrationMessage && (
        <div className="my-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-600/50 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{celebrationMessage}</span>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2 my-5">
        {categories.map(cat => {
          const Icon = cat.icon;
          const isActive = filterCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                  : 'bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-700/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Routine Cards List */}
      <div className="space-y-4">
        {filteredItems.map((item: RoutineItem) => {
          const isDone = item.status === 'completed';

          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all duration-200 p-5 ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-800/40 shadow-sm'
                  : 'bg-slate-900/70 hover:bg-slate-900/90 border-slate-700/60 shadow-lg'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Time Slot & Action Button */}
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => handleToggle(item.id, item.title, isDone)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
                    title={isDone ? 'Mark as Pending' : 'Mark Routine as Completed'}
                    aria-label={`Toggle routine ${item.title}`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-950" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-500 hover:text-slate-300" />
                    )}
                  </button>

                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        {item.timeSlot}
                      </span>

                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        item.urgency === 'critical' ? 'bg-rose-950/80 text-rose-300 border-rose-800/60' :
                        item.urgency === 'warning' ? 'bg-amber-950/80 text-amber-300 border-amber-800/60' :
                        'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {item.urgency}
                      </span>

                      {isDone && (
                        <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-700/50 px-2 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Practiced Today
                        </span>
                      )}
                    </div>

                    <h3 className={`text-lg font-bold text-white ${isDone ? 'line-through text-slate-300' : ''}`}>
                      {item.title}
                    </h3>

                    {/* Standard vs Alternative Comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-xl bg-slate-950/60 border border-rose-900/30">
                        <div className="text-[10px] uppercase font-bold text-rose-400/90 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> High-Emission / Exposed Habit:
                        </div>
                        <p className="text-xs text-slate-300 mt-1">
                          {item.standardHabit}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/40">
                        <div className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                          <Leaf className="w-3 h-3" /> Recommended Low-Emission Shift:
                        </div>
                        <p className="text-xs text-emerald-200 mt-1 font-medium">
                          {item.lowEmissionAlternative}
                        </p>
                      </div>
                    </div>

                    {/* Scientific Impact Explanation */}
                    <p className="text-xs text-slate-400 pt-1 leading-relaxed">
                      <strong className="text-slate-300">Why this matters:</strong> {item.explanation}
                    </p>
                  </div>
                </div>

                {/* Quantified Impact Badge */}
                <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400 uppercase font-semibold">Exposure Cut</div>
                    <div className="text-lg font-black font-mono text-emerald-400 flex items-center justify-end gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      -{item.exposureReductionPct}%
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[11px] text-slate-400 uppercase font-semibold">CO₂ Saved</div>
                    <div className="text-sm font-bold font-mono text-teal-300 flex items-center justify-end gap-1">
                      <Leaf className="w-3.5 h-3.5 text-teal-400" />
                      +{item.co2SavedKg} kg
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
