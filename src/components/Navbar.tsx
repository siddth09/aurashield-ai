import React, { useState } from 'react';
import { useHousehold } from '../context/HouseholdContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { AQIBadge } from './AQIBadge';
import { PRESET_CITIES } from '../data/presetCities';
import { 
  ShieldAlert, 
  MapPin, 
  Settings, 
  User, 
  Navigation, 
  Contrast, 
  Leaf, 
  Sparkles,
  Bot
} from 'lucide-react';

interface NavbarProps {
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenProfile,
  onOpenSettings,
  activeView,
  setActiveView,
}) => {
  const { aqiData, selectedCityId, selectCityById, setCustomCoordinates } = useHousehold();
  const { highContrast, toggleHighContrast } = useAccessibility();
  const [isLocating, setIsLocating] = useState(false);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCustomCoordinates(pos.coords.latitude, pos.coords.longitude, 'My Local Area');
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        alert('Could not retrieve your location. Falling back to preset.');
        setIsLocating(false);
      }
    );
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-950/50">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-white font-sans">
                  Aura<span className="text-emerald-400">Shield</span>
                </span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-mono text-[10px] font-bold">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Urban Smog & Air Quality Assistant
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/80 p-1 rounded-2xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveView('overview')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeView === 'overview' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Smog Telemetry
            </button>
            <button
              onClick={() => setActiveView('routines')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeView === 'routines' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Daily Routines
            </button>
            <button
              onClick={() => setActiveView('iaq')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeView === 'iaq' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              IAQ Lab & DIY
            </button>
            <button
              onClick={() => setActiveView('impact')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeView === 'impact' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Impact Mirror
            </button>
            <button
              onClick={() => setActiveView('copilot')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                activeView === 'copilot' ? 'bg-teal-600 text-white shadow-md' : 'text-teal-400 hover:text-teal-200'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              Aura Copilot
            </button>
            <button
              onClick={() => setActiveView('community')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeView === 'community' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Community
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* Quick Live AQI Badge */}
            <div className="hidden lg:block">
              <AQIBadge aqi={aqiData.aqi} category={aqiData.category} size="sm" />
            </div>

            {/* GPS Locate Me Button */}
            <button
              onClick={handleUseMyLocation}
              disabled={isLocating}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all disabled:opacity-50"
              title="Use GPS Geolocation"
              aria-label="Use My GPS Location"
            >
              <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin text-emerald-400' : ''}`} />
            </button>

            {/* High Contrast Quick Toggle */}
            <button
              onClick={toggleHighContrast}
              className={`p-2 rounded-xl transition-all ${
                highContrast
                  ? 'bg-amber-400 text-black'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Toggle High Contrast Mode (WCAG AAA)"
              aria-label="Toggle High Contrast"
            >
              <Contrast className="w-4 h-4" />
            </button>

            {/* Household Profile Button */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-all border border-slate-700"
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Profile</span>
            </button>

            {/* Settings Modal Button */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
              title="GenAI & API Settings"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile View Navigation Scroller */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800 text-xs">
          {[
            { id: 'overview', label: 'Telemetry' },
            { id: 'routines', label: 'Routines' },
            { id: 'iaq', label: 'IAQ Lab' },
            { id: 'impact', label: 'Impact Mirror' },
            { id: 'copilot', label: 'Aura Copilot' },
            { id: 'community', label: 'Community' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                activeView === tab.id ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
