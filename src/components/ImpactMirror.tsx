import React from 'react';
import { useHousehold } from '../context/HouseholdContext';
import { getMonthlyProjection } from '../services/impactEngine';
import { 
  Activity, 
  Flame, 
  Leaf, 
  ShieldCheck, 
  TrendingUp, 
  HeartPulse, 
  Trees, 
  Info
} from 'lucide-react';

export const ImpactMirror: React.FC = () => {
  const { impactMetrics, profile } = useHousehold();
  const monthly = getMonthlyProjection(impactMetrics);

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-700/60">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-bold">
              Quantified Impact Engine
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">
            The Impact Mirror: Personal & Community Footprint
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Mathematical quantification of your daily routine shifts and indoor air quality hacks. Track real particulate reduction in your lungs and localized carbon emissions prevented.
          </p>
        </div>

        {/* Overall Health Shield Score Badge */}
        <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-950 flex items-center justify-center border border-emerald-700/50">
            <HeartPulse className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="text-[11px] uppercase font-bold text-slate-400">Health Shield Score</div>
            <div className="text-2xl font-black font-mono text-emerald-400">
              {impactMetrics.healthRiskReductionScore} <span className="text-xs font-sans text-slate-400 font-normal">/ 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        {/* Card 1: PM2.5 Micrograms Kept Out of Lungs */}
        <div className="bg-slate-900/80 border border-slate-700/70 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Lung Exposure Prevented</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-black font-mono text-emerald-400">
              {impactMetrics.totalPM25ExposurePreventedUg.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 font-sans">µg of toxic PM2.5 filtered</div>
          </div>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            Based on 11 m³ daily inhalation volume.
          </div>
        </div>

        {/* Card 2: Cigarettes Avoided (Berkeley Earth Model) */}
        <div className="bg-slate-900/80 border border-rose-900/40 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-xs text-rose-300">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Passive Cigarettes Avoided</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-black font-mono text-rose-400">
              {impactMetrics.cigarettesAvoidedEquivalent}
            </div>
            <div className="text-xs text-slate-400 font-sans">cigarettes equivalent / day</div>
          </div>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            Berkeley Earth rule: 22 µg/m³ ≈ 1 cig.
          </div>
        </div>

        {/* Card 3: Community CO2e Prevented */}
        <div className="bg-slate-900/80 border border-teal-900/40 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-xs text-teal-300">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Community Emissions Saved</span>
            <Leaf className="w-4 h-4 text-teal-400" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-black font-mono text-teal-300">
              {impactMetrics.co2ePreventedKg} <span className="text-sm font-sans font-normal text-slate-400">kg</span>
            </div>
            <div className="text-xs text-slate-400 font-sans">CO₂e eliminated today</div>
          </div>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            Via Metro, carpool & induction shift.
          </div>
        </div>

        {/* Card 4: Indoor AQI Cleanliness Delta */}
        <div className="bg-slate-900/80 border border-indigo-900/40 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-xs text-indigo-300">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Home Sanctuary Cleanliness</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-black font-mono text-indigo-400">
              +{impactMetrics.indoorAQIImprovementPct}%
            </div>
            <div className="text-xs text-slate-400 font-sans">cleaner than ambient outdoor air</div>
          </div>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            Active filters: {profile.activeHacks.length} hack(s).
          </div>
        </div>
      </div>

      {/* Long-term Monthly & Annual Projection */}
      <div className="bg-slate-950/80 border border-slate-700/60 rounded-2xl p-5 my-6">
        <div className="flex items-center gap-2 mb-4">
          <Trees className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white">
            Projected Cumulative Impact (Winter Smog Season - 30 Days)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-lg font-black font-mono text-white">
                {monthly.monthlyPM25AvoidedMg} mg
              </div>
              <div className="text-xs text-slate-400">
                Particulate soot filtered from lungs
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-950 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <div className="text-lg font-black font-mono text-white">
                {monthly.monthlyCigarettesAvoided} Cigarettes
              </div>
              <div className="text-xs text-slate-400">
                Passive toxic inhalation avoided
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-950 flex items-center justify-center shrink-0">
              <Trees className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <div className="text-lg font-black font-mono text-white">
                {monthly.monthlyCO2SavedKg} kg CO₂e
              </div>
              <div className="text-xs text-slate-400">
                Equal to {monthly.treesEquivalentAnnual} mature trees/year
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Explanatory Science Note */}
      <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-700/40 text-xs text-indigo-200 flex items-start gap-3">
        <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-indigo-100 font-bold block mb-1">
            Understanding the Direct Impact Formula:
          </strong>
          Sub-micron PM2.5 particles deposit deep into the lung alveoli, entering the systemic bloodstream and triggering systemic inflammation. Every microgram prevented by earlier commute timing, N95 filtration, damp mopping, and Corsi-Rosenthal boxes directly reduces acute cardiovascular and pulmonary stress, especially for young children and asthmatic family members.
        </div>
      </div>
    </div>
  );
};
