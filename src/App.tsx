import React, { useState, Suspense, lazy } from 'react';
import { HouseholdProvider, useHousehold } from './context/HouseholdContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { AQIOverview } from './components/AQIOverview';
import { DiurnalChart } from './components/DiurnalChart';
import { RoutinePlanner } from './components/RoutinePlanner';
import { ImpactMirror } from './components/ImpactMirror';
import { HouseholdProfileModal } from './components/HouseholdProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { AccessibilityToolbar } from './components/AccessibilityToolbar';
import { 
  ShieldAlert, 
  Bot, 
  Leaf
} from 'lucide-react';

/** Lazy-loaded heavy components for code-splitting & efficiency */
const IAQLab = lazy(() => import('./components/IAQLab').then(m => ({ default: m.IAQLab })));
const AuraCopilot = lazy(() => import('./components/AuraCopilot').then(m => ({ default: m.AuraCopilot })));
const CommunityHub = lazy(() => import('./components/CommunityHub').then(m => ({ default: m.CommunityHub })));

/** Loading spinner shown while lazy components are loading */
const LazyFallback = () => (
  <div className="flex items-center justify-center py-20" role="status" aria-label="Loading section">
    <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
    <span className="sr-only">Loading...</span>
  </div>
);

const MainDashboard: React.FC<{
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
}> = ({ onOpenProfile, onOpenSettings, activeView, setActiveView }) => {
  const { aqiData, profile, impactMetrics } = useHousehold();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        onOpenProfile={onOpenProfile}
        onOpenSettings={onOpenSettings}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Urgent Emergency Smog Banner when AQI is Severe or Hazardous */}
        {aqiData.aqi >= 250 && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/90 via-slate-900 to-purple-950/90 border border-rose-600/50 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  Emergency Smog Advisory: Inversion Ceiling Active
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 border border-rose-700 text-rose-300 font-mono">
                    AQI {aqiData.aqi}
                  </span>
                </h4>
                <p className="text-xs text-rose-200/80 mt-0.5">
                  Keep windows sealed. Cancel outdoor cardio. Run indoor DIY Corsi-Rosenthal filtration in bedrooms.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveView('copilot')}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-rose-950/50"
              >
                <Bot className="w-4 h-4" />
                Ask Copilot Triage
              </button>
              <button
                onClick={() => setActiveView('iaq')}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all border border-slate-700"
              >
                Build DIY Filter
              </button>
            </div>
          </div>
        )}

        {/* View Switcher Router */}
        <Suspense fallback={<LazyFallback />}>
          {activeView === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              <AQIOverview />
              <DiurnalChart hourly={aqiData.hourly} />

              {/* Quick Two-Column Spotlight */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RoutinePlanner />
                <div className="space-y-8">
                  <ImpactMirror />
                  <AuraCopilot />
                </div>
              </div>
            </div>
          )}

          {activeView === 'routines' && (
            <div className="animate-fadeIn">
              <RoutinePlanner />
            </div>
          )}

          {activeView === 'iaq' && (
            <div className="animate-fadeIn">
              <IAQLab />
            </div>
          )}

          {activeView === 'impact' && (
            <div className="animate-fadeIn">
              <ImpactMirror />
            </div>
          )}

          {activeView === 'copilot' && (
            <div className="animate-fadeIn max-w-4xl mx-auto">
              <AuraCopilot />
            </div>
          )}

          {activeView === 'community' && (
            <div className="animate-fadeIn">
              <CommunityHub />
            </div>
          )}
        </Suspense>
      </main>

      {/* Accessibility Toolbar Floating Control */}
      <AccessibilityToolbar />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-900/60 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Leaf className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-white">AuraShield AI</span>
            <span>— [Challenge 6] Urban Air Quality Assistant</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400 font-medium">
            <span>Open-Meteo Air Quality Telemetry</span>
            <span>•</span>
            <span>Berkeley Earth Cigarette Model</span>
            <span>•</span>
            <span>Google Gemini GenAI</span>
            <span>•</span>
            <span>WCAG AAA Accessible</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeView, setActiveView] = useState('overview');

  return (
    <ErrorBoundary>
      <AccessibilityProvider>
        <HouseholdProvider>
          <MainDashboard
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            activeView={activeView}
            setActiveView={setActiveView}
          />
          <HouseholdProfileModal
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
          />
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
          />
        </HouseholdProvider>
      </AccessibilityProvider>
    </ErrorBoundary>
  );
}

export default App;
