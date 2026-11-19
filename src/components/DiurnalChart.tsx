import React, { useState } from 'react';
import { HourlyForecastItem } from '../types';
import { Sun, CloudFog, Moon, Info } from 'lucide-react';
import { getAQICategory, getAQIColor } from '../services/aqiService';

interface DiurnalChartProps {
  hourly: HourlyForecastItem[];
}

export const DiurnalChart: React.FC<DiurnalChartProps> = ({ hourly }) => {
  const [hoveredHour, setHoveredHour] = useState<HourlyForecastItem | null>(null);

  if (!hourly || hourly.length === 0) return null;

  const maxPM = Math.max(...hourly.map(h => h.pm2_5), 100);

  return (
    <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-5 shadow-xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CloudFog className="w-5 h-5 text-indigo-400" />
              24-Hour Diurnal Inversion & Smog Dynamics
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 font-medium">
              Boundary Layer Physics
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Ground-level thermal inversions trap winter smog overnight. Convective solar heating opens a temporary dilution window at midday.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5 text-emerald-300 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            Solar Window (Safe Flush)
          </span>
          <span className="inline-flex items-center gap-1.5 text-purple-300 bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 rounded">
            <Moon className="w-3.5 h-3.5 text-purple-400" />
            Inversion Trap (Seal Windows)
          </span>
        </div>
      </div>

      {/* Chart visualization */}
      <div className="relative pt-6 pb-2">
        {/* Hover info tooltip */}
        {hoveredHour && (
          <div className="mb-3 p-2.5 rounded-lg bg-slate-900 border border-slate-600 shadow-xl text-xs flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-slate-200 text-sm">{hoveredHour.time}</span>
              <span className={`px-2 py-0.5 rounded border font-semibold ${getAQIColor(getAQICategory(hoveredHour.aqi))}`}>
                AQI {hoveredHour.aqi} ({getAQICategory(hoveredHour.aqi)})
              </span>
            </div>
            <div className="flex items-center gap-4 text-slate-300">
              <span>PM2.5: <strong className="text-white">{hoveredHour.pm2_5} µg/m³</strong></span>
              <span>Temp: <strong className="text-white">{hoveredHour.temperature}°C</strong></span>
              <span>Humidity: <strong className="text-white">{hoveredHour.humidity}%</strong></span>
              {hoveredHour.isVentilationWindow && (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5" /> Optimal Airing Window
                </span>
              )}
              {hoveredHour.isInversionPeak && (
                <span className="text-rose-400 font-semibold flex items-center gap-1">
                  <CloudFog className="w-3.5 h-3.5" /> Ground Smog Trapped
                </span>
              )}
            </div>
          </div>
        )}

        {/* Bar chart container */}
        <div className="h-44 w-full flex items-end gap-1 sm:gap-2 px-1 relative">
          {/* Threshold reference line: WHO 24h interim guideline (37.5 ug/m3) */}
          <div
            className="absolute left-0 right-0 border-b border-dashed border-red-500/40 z-10 pointer-events-none flex items-center justify-end pr-2"
            style={{ bottom: `${Math.min(95, (37.5 / maxPM) * 100)}%` }}
          >
            <span className="text-[10px] text-red-400/90 font-mono bg-slate-900/90 px-1 rounded">
              WHO Target: 37.5 µg/m³
            </span>
          </div>

          {hourly.map((item, idx) => {
            const heightPercent = Math.max(12, Math.min(100, (item.pm2_5 / maxPM) * 100));
            const category = getAQICategory(item.aqi);

            // Styling based on time of day and inversion status
            let barBg = 'bg-slate-600';
            if (item.isVentilationWindow) {
              barBg = 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-lg shadow-emerald-950/50';
            } else if (item.isInversionPeak) {
              barBg = 'bg-gradient-to-t from-purple-800 to-rose-600 shadow-lg shadow-rose-950/50';
            } else if (category === 'Hazardous' || category === 'Severe') {
              barBg = 'bg-gradient-to-t from-rose-700 to-purple-600';
            } else if (category === 'Unhealthy') {
              barBg = 'bg-gradient-to-t from-red-600 to-orange-500';
            } else {
              barBg = 'bg-gradient-to-t from-amber-600 to-yellow-500';
            }

            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                onMouseEnter={() => setHoveredHour(item)}
                onMouseLeave={() => setHoveredHour(null)}
              >
                {/* Bar */}
                <div
                  className={`w-full rounded-t-md transition-all duration-300 group-hover:scale-105 group-hover:brightness-125 ${barBg}`}
                  style={{ height: `${heightPercent}%` }}
                />

                {/* Time Label */}
                <span className="text-[10px] font-mono text-slate-400 mt-2 truncate group-hover:text-white group-hover:font-bold">
                  {item.hour % 3 === 0 ? `${item.hour}h` : ''}
                </span>

                {/* Status Indicator Dot */}
                <span className="mt-0.5">
                  {item.isVentilationWindow ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 block" title="Ventilation Window" />
                  ) : item.isInversionPeak ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 block" title="Inversion Trap" />
                  ) : (
                    <span className="w-1 h-1 rounded-full bg-slate-700 block" />
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actionable Bottom Tip */}
      <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-start gap-2 text-xs text-slate-300 bg-slate-900/50 p-2.5 rounded-xl">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-emerald-300">Action Plan:</strong> Keep all windows firmly sealed until{' '}
          <strong className="text-white">1:00 PM</strong>. When the solar mixing peak arrives, conduct a rapid 15-minute cross-ventilation to exhaust indoor CO2 and cooking vapors, then reseal before the 4:30 PM evening inversion drop.
        </p>
      </div>
    </div>
  );
};
