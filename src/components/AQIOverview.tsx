import React from 'react';
import { useHousehold } from '../context/HouseholdContext';
import { AQIBadge } from './AQIBadge';
import { 
  CloudFog, 
  Wind, 
  Droplets, 
  Thermometer, 
  Clock, 
  ShieldAlert, 
  RotateCw, 
  Flame 
} from 'lucide-react';
import { PRESET_CITIES } from '../data/presetCities';

export const AQIOverview: React.FC = () => {
  const { aqiData, isLoadingAQI, refreshAQI, selectCityById, selectedCityId } = useHousehold();

  const pm25EquivalentCigarettes = Math.round((aqiData.pollutants.pm2_5 / 22) * 10) / 10;

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
      {/* Background ambient glow based on AQI severity */}
      <div 
        className={`absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none ${
          aqiData.aqi > 300 ? 'bg-rose-600' : aqiData.aqi > 200 ? 'bg-orange-600' : aqiData.aqi > 100 ? 'bg-amber-600' : 'bg-emerald-600'
        }`}
      />

      {/* Header bar: Location and City Quick Select */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-700/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-bold">
              Live Meteorological & Smog Telemetry
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            {aqiData.location}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            Lat {aqiData.latitude.toFixed(3)}°, Lon {aqiData.longitude.toFixed(3)}° • Updated {new Date(aqiData.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* City preset dropdown & Refresh */}
        <div className="flex items-center gap-2.5">
          <select
            value={selectedCityId}
            onChange={(e) => selectCityById(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            aria-label="Select Winter Smog Hotspot City"
          >
            {PRESET_CITIES.map(city => (
              <option key={city.id} value={city.id}>
                {city.name} ({city.country})
              </option>
            ))}
          </select>

          <button
            onClick={refreshAQI}
            disabled={isLoadingAQI}
            className="p-2 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-all disabled:opacity-50"
            title="Refresh Live Data"
            aria-label="Refresh AQI Data"
          >
            <RotateCw className={`w-4 h-4 ${isLoadingAQI ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 items-center">
        {/* Left: Huge AQI Meter */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              US AQI Index
            </span>
            <AQIBadge aqi={aqiData.aqi} category={aqiData.category} showShapeName={true} size="md" />
          </div>

          <div className="my-4 flex items-baseline gap-3">
            <span className="text-6xl font-black font-mono tracking-tight text-white">
              {aqiData.aqi}
            </span>
            <div className="flex flex-col">
              <span className={`text-lg font-bold ${
                aqiData.aqi > 300 ? 'text-rose-400' : aqiData.aqi > 200 ? 'text-orange-400' : 'text-amber-400'
              }`}>
                {aqiData.category}
              </span>
              <span className="text-xs text-slate-400">
                Dominant: PM2.5 Soot
              </span>
            </div>
          </div>

          {/* Smoking equivalence stat */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2.5 text-xs text-rose-300/90 bg-rose-950/30 p-2.5 rounded-xl border border-rose-900/30">
            <Flame className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              24-hour outdoor air inhalation equals smoking <strong className="text-white font-mono">{pm25EquivalentCigarettes}</strong> cigarettes/day (Berkeley Earth formula).
            </span>
          </div>
        </div>

        {/* Center: Inversion & Safe Window Diagnostic */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Thermal Inversion Card */}
          <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold flex items-center gap-1.5">
                <CloudFog className="w-4 h-4 text-purple-400" />
                Thermal Inversion Trap
              </span>
              <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                aqiData.inversionRisk === 'Extreme' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                aqiData.inversionRisk === 'High' ? 'bg-purple-950 text-purple-400 border border-purple-800' :
                'bg-amber-950 text-amber-400 border border-amber-800'
              }`}>
                {aqiData.inversionRisk} Risk
              </span>
            </div>

            <p className="text-xs text-slate-300 my-2">
              Cold dense air lid prevents vertical mixing. Smog is compressed within the bottom 150m of the urban canopy.
            </p>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span className="flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-slate-400" /> {aqiData.temperature}°C
              </span>
              <span className="flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-blue-400" /> {aqiData.humidity}% RH
              </span>
              <span className="flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-teal-400" /> {aqiData.windSpeed} km/h
              </span>
            </div>
          </div>

          {/* Safe Ventilation Window Card */}
          <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                Solar Flush Window
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-800 text-emerald-400 font-mono text-[11px] font-bold">
                {aqiData.ventilationWindow.startHour}:00 - {aqiData.ventilationWindow.endHour}:00 PM
              </span>
            </div>

            <p className="text-xs text-slate-300 my-2">
              {aqiData.ventilationWindow.note}
            </p>

            <div className="text-[11px] text-emerald-300/90 pt-2 border-t border-slate-800 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Recommended: 15-minute quick cross-ventilation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pollutant Breakdown Grid */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Particulate & Chemical Pollutant Matrix
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div className="bg-slate-900/70 border border-slate-700/60 rounded-xl p-3 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-medium">PM2.5</div>
            <div className="text-lg font-black font-mono text-rose-400 mt-0.5">{aqiData.pollutants.pm2_5}</div>
            <div className="text-[10px] text-slate-500">µg/m³ (WHO: 15)</div>
          </div>

          <div className="bg-slate-900/70 border border-slate-700/60 rounded-xl p-3 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-medium">PM10</div>
            <div className="text-lg font-black font-mono text-orange-400 mt-0.5">{aqiData.pollutants.pm10}</div>
            <div className="text-[10px] text-slate-500">µg/m³ (WHO: 45)</div>
          </div>

          <div className="bg-slate-900/70 border border-slate-700/60 rounded-xl p-3 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-medium">NO₂</div>
            <div className="text-lg font-black font-mono text-amber-400 mt-0.5">{aqiData.pollutants.no2}</div>
            <div className="text-[10px] text-slate-500">µg/m³ (Diesel)</div>
          </div>

          <div className="bg-slate-900/70 border border-slate-700/60 rounded-xl p-3 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-medium">SO₂</div>
            <div className="text-lg font-black font-mono text-teal-400 mt-0.5">{aqiData.pollutants.so2}</div>
            <div className="text-[10px] text-slate-500">µg/m³ (Coal/Fuel)</div>
          </div>

          <div className="bg-slate-900/70 border border-slate-700/60 rounded-xl p-3 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-medium">Ozone (O₃)</div>
            <div className="text-lg font-black font-mono text-blue-400 mt-0.5">{aqiData.pollutants.o3}</div>
            <div className="text-[10px] text-slate-500">µg/m³</div>
          </div>

          <div className="bg-slate-900/70 border border-slate-700/60 rounded-xl p-3 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-medium">Carbon Monoxide</div>
            <div className="text-lg font-black font-mono text-indigo-400 mt-0.5">{aqiData.pollutants.co}</div>
            <div className="text-[10px] text-slate-500">mg/m³</div>
          </div>
        </div>
      </div>
    </div>
  );
};
