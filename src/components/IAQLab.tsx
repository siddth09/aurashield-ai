import React, { useState } from 'react';
import { useHousehold } from '../context/HouseholdContext';
import { IAQ_HACKS } from '../data/iaqHacks';
import { CorsiRosenthalCalculator } from './CorsiRosenthalCalculator';
import { 
  Sparkles, 
  Check, 
  Plus, 
  HelpCircle, 
  Wrench, 
  DollarSign, 
  ShieldCheck, 
  BookOpen, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

export const IAQLab: React.FC = () => {
  const { profile, toggleHack } = useHousehold();
  const [activeTab, setActiveTab] = useState<'calculator' | 'catalog'>('calculator');
  const [expandedHackId, setExpandedHackId] = useState<string | null>('corsi-rosenthal');

  return (
    <div className="space-y-6">
      {/* Top Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/70">
        <div>
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-emerald-400" />
            <span className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-bold">
              Engineering & Environmental Physics
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">
            Indoor Air Quality (IAQ) Lab & DIY Suite
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Low-cost open-source purification, draft isolation, and aerosol suppression hacks backed by peer-reviewed aerosol physics.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'calculator'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Corsi-Rosenthal Sizer
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'catalog'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Science Hacks Catalog ({IAQ_HACKS.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Interactive Sizer */}
      {activeTab === 'calculator' && (
        <div className="space-y-6">
          <CorsiRosenthalCalculator />
        </div>
      )}

      {/* Tab 2: Hacks Catalog */}
      {activeTab === 'catalog' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {IAQ_HACKS.map(hack => {
            const isActive = profile.activeHacks.includes(hack.id);
            const isExpanded = expandedHackId === hack.id;

            return (
              <div
                key={hack.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                  isActive
                    ? 'bg-slate-900/95 border-emerald-500/60 shadow-lg shadow-emerald-950/20'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="p-5">
                  {/* Top tags */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                      {hack.badge}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-medium">{hack.difficulty}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono font-bold">
                        {hack.costTier} ({hack.estimatedCost})
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white mt-1">
                    {hack.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    {hack.shortDesc}
                  </p>

                  {/* Metric Pill */}
                  <div className="my-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/50 border border-emerald-700/50 text-emerald-300 text-xs font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Reduces indoor PM2.5 by ~{hack.pm25ReductionPct}%</span>
                  </div>

                  {/* Expandable Details */}
                  {isExpanded && (
                    <div className="space-y-3 mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300 animate-fadeIn">
                      <div>
                        <strong className="text-slate-200 uppercase tracking-wide text-[10px] block mb-1">
                          Materials Needed:
                        </strong>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                          {hack.materialsNeeded.map((m, i) => (
                            <li key={i}>{m}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <strong className="text-slate-200 uppercase tracking-wide text-[10px] block mb-1">
                          Step-by-Step Instructions:
                        </strong>
                        <ol className="list-decimal list-inside space-y-1 text-slate-300">
                          {hack.steps.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ol>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                        <strong className="text-emerald-400 block text-[11px] mb-0.5">
                          Aerosol Physics Explanation:
                        </strong>
                        <p className="leading-relaxed text-[11px]">
                          {hack.physicsExplanation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="bg-slate-950/70 p-3.5 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setExpandedHackId(isExpanded ? null : hack.id)}
                    className="text-xs text-slate-400 hover:text-slate-200 font-medium flex items-center gap-1"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4" /> Less Details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" /> Full Guide & Steps
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => toggleHack(hack.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Active in Home
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" /> Enable in Profile
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
