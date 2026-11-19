import React, { useState } from 'react';
import { calculateCADR, getDIYCostComparison } from '../services/cadrCalculator';
import { 
  Fan, 
  Wind, 
  Volume2, 
  Layers, 
  Scissors
} from 'lucide-react';

export const CorsiRosenthalCalculator: React.FC = () => {
  const [roomLength, setRoomLength] = useState<number>(15);
  const [roomWidth, setRoomWidth] = useState<number>(12);
  const [ceilingHeight, setCeilingHeight] = useState<number>(9);
  const [filterCount, setFilterCount] = useState<1 | 2 | 4 | 5>(4);
  const [fanSpeed, setFanSpeed] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [filterRating, setFilterRating] = useState<'MERV 13' | 'MERV 14' | 'HEPA H13'>('MERV 13');

  const cadrResult = calculateCADR(
    roomLength,
    roomWidth,
    ceilingHeight,
    4.5,
    filterCount,
    fanSpeed,
    filterRating
  );

  const costComparison = getDIYCostComparison(cadrResult.roomVolumeCuFt);

  return (
    <div className="bg-slate-900/90 border border-slate-700/70 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Fan className="w-5 h-5 text-emerald-400" />
            Corsi-Rosenthal Box Engineering Sizer
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Calculate exact Clean Air Delivery Rate (CADR) and Air Changes per Hour (ACH) for your room volume.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-mono border ${
            cadrResult.adequacyStatus === 'Hospital Grade' ? 'bg-indigo-950 text-indigo-300 border-indigo-700' :
            cadrResult.adequacyStatus === 'Adequate' ? 'bg-emerald-950 text-emerald-300 border-emerald-700' :
            'bg-rose-950 text-rose-300 border-rose-700'
          }`}>
            {cadrResult.adequacyStatus} ({cadrResult.achAchieved} ACH)
          </span>
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
        {/* Room Dimensions */}
        <div className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-400" />
            1. Room Dimensions
          </h4>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Length: {roomLength} ft</span>
              <span className="text-slate-400 font-mono">{(roomLength * 0.3048).toFixed(1)} m</span>
            </div>
            <input
              type="range"
              min="8"
              max="35"
              value={roomLength}
              aria-label="Room Length in feet"
              onChange={(e) => setRoomLength(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Width: {roomWidth} ft</span>
              <span className="text-slate-400 font-mono">{(roomWidth * 0.3048).toFixed(1)} m</span>
            </div>
            <input
              type="range"
              min="8"
              max="30"
              value={roomWidth}
              aria-label="Room Width in feet"
              onChange={(e) => setRoomWidth(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Ceiling: {ceilingHeight} ft</span>
            </div>
            <input
              type="range"
              min="8"
              max="14"
              value={ceilingHeight}
              aria-label="Ceiling Height in feet"
              onChange={(e) => setCeilingHeight(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="pt-2 text-xs text-slate-400 border-t border-slate-800 flex justify-between">
            <span>Total Volume:</span>
            <strong className="text-white font-mono">{cadrResult.roomVolumeCuFt.toLocaleString()} cu. ft.</strong>
          </div>
        </div>

        {/* Filter Configuration */}
        <div className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Wind className="w-4 h-4 text-teal-400" />
            2. Filter Geometry
          </h4>

          <div>
            <div className="text-xs text-slate-300 block mb-2 font-medium">Number of MERV Filters:</div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 4, 5].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setFilterCount(count as 1 | 2 | 4 | 5)}
                  className={`py-2 rounded-lg text-xs font-mono font-bold transition-all border ${
                    filterCount === count
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {count === 4 ? '4 (Cube)' : count === 5 ? '5 (Tower)' : count === 2 ? '2 (Wedge)' : '1 (Flat)'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-300 block mb-2 font-medium">Filter Rating:</div>
            <div className="grid grid-cols-3 gap-2">
              {(['MERV 13', 'MERV 14', 'HEPA H13'] as const).map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setFilterRating(rating)}
                  className={`py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
                    filterRating === rating
                      ? 'bg-teal-600 text-white border-teal-500 font-bold'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
            {filterRating === 'HEPA H13' && (
              <p className="text-[10px] text-amber-400 mt-1">
                Note: Standard box fans lack static pressure for dense HEPA. MERV 13 provides the highest airflow CFM with 85%+ capture.
              </p>
            )}
          </div>
        </div>

        {/* Fan Speed & Acoustics */}
        <div className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-indigo-400" />
            3. Fan Speed & Noise
          </h4>

          <div>
            <div className="text-xs text-slate-300 block mb-2 font-medium">20-inch Box Fan Speed:</div>
            <div className="grid grid-cols-3 gap-2">
              {(['Low', 'Medium', 'High'] as const).map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setFanSpeed(spd)}
                  className={`py-2 rounded-lg text-xs font-medium transition-all border ${
                    fanSpeed === spd
                      ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {spd}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>Estimated Sound:</span>
              <strong className="text-slate-200">
                {fanSpeed === 'Low' ? '~43 dBA (Library Quiet)' : fanSpeed === 'Medium' ? '~50 dBA (Gentle Hum)' : '~58 dBA (Moderate)'}
              </strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Power Draw:</span>
              <strong className="text-slate-200">
                {fanSpeed === 'Low' ? '45 Watts' : fanSpeed === 'Medium' ? '65 Watts' : '85 Watts'}
              </strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Daily Electric Cost:</span>
              <strong className="text-emerald-400">~$0.18 / day (24h run)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* CADR Output Metrics Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-600/40 rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-[11px] text-slate-400 uppercase font-semibold">Effective CADR</div>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-0.5">
            {cadrResult.effectiveCADR} <span className="text-xs font-sans text-slate-400 font-normal">CFM</span>
          </div>
          <div className="text-[10px] text-slate-400">Target: {cadrResult.requiredCADR} CFM</div>
        </div>

        <div>
          <div className="text-[11px] text-slate-400 uppercase font-semibold">Air Changes / Hour</div>
          <div className="text-2xl font-black font-mono text-teal-300 mt-0.5">
            {cadrResult.achAchieved} <span className="text-xs font-sans text-slate-400 font-normal">ACH</span>
          </div>
          <div className="text-[10px] text-slate-400">Smog Target: 4.5+ ACH</div>
        </div>

        <div>
          <div className="text-[11px] text-slate-400 uppercase font-semibold">Room Turnover Time</div>
          <div className="text-2xl font-black font-mono text-indigo-300 mt-0.5">
            {Math.round(60 / cadrResult.achAchieved)} <span className="text-xs font-sans text-slate-400 font-normal">mins</span>
          </div>
          <div className="text-[10px] text-slate-400">To filter 100% room air</div>
        </div>

        <div>
          <div className="text-[11px] text-slate-400 uppercase font-semibold">5-Year Savings vs HEPA</div>
          <div className="text-2xl font-black font-mono text-amber-400 mt-0.5">
            ${costComparison.savingsFiveYear} <span className="text-xs font-sans text-slate-400 font-normal">({costComparison.savingsPct}%)</span>
          </div>
          <div className="text-[10px] text-emerald-400">High efficiency, low cost</div>
        </div>
      </div>

      {/* Crucial Shroud Tip */}
      <div className="mt-4 p-3 bg-amber-950/40 border border-amber-600/40 rounded-xl text-xs flex items-start gap-2.5 text-amber-200">
        <Scissors className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300">The Secret Hack: The Cardboard Shroud!</strong> Box fans circulate air in reverse at the blade corners. Cutting a 15-inch circular cardboard shroud and taping it to the front face prevents airflow recirculation, boosting effective CADR by an astonishing <strong>40-50 CFM</strong> for free!
        </div>
      </div>
    </div>
  );
};
