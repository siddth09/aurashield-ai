import React, { useState } from 'react';
import { hasActiveApiKey } from '../services/geminiService';
import { 
  X, 
  Key, 
  ExternalLink, 
  Check, 
  ShieldCheck 
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('aurashield_gemini_api_key') || '');
  const [saved, setSaved] = useState(false);
  const isEnvKey = Boolean(import.meta.env.VITE_GEMINI_API_KEY);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('aurashield_gemini_api_key', apiKey.trim());
    } else {
      localStorage.removeItem('aurashield_gemini_api_key');
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    localStorage.removeItem('aurashield_gemini_api_key');
    setApiKey('');
    setSaved(true);
    setTimeout(() => setSaved(false), 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          aria-label="Close Settings"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-700/50 flex items-center justify-center text-indigo-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">GenAI Settings & Engine</h2>
            <p className="text-xs text-slate-400">Configure your Google Gemini API credentials.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5 text-xs">
          {/* Active status indicator */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-3 h-3 rounded-full ${hasActiveApiKey() ? 'bg-emerald-400 shadow-md shadow-emerald-500/50' : 'bg-indigo-400'}`} />
              <div>
                <div className="font-bold text-white">
                  {hasActiveApiKey() ? 'Live Google Gemini Active' : 'Intelligent Local Engine Active'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {hasActiveApiKey() ? 'Connected to Gemini 2.5 Flash' : 'Zero-config offline mode with medical-grade heuristics'}
                </div>
              </div>
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
              {hasActiveApiKey() ? 'LIVE' : 'HEURISTIC'}
            </span>
          </div>

          <div>
            <label htmlFor="gemini-api-key" className="block text-slate-300 mb-1.5 font-semibold">
              Google Gemini API Key
            </label>
            <input
              id="gemini-api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
            />
            {isEnvKey && (
              <p className="text-[11px] text-teal-400 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                VITE_GEMINI_API_KEY detected in environment.
              </p>
            )}
            <p className="text-[11px] text-slate-400 mt-1.5">
              Keys are stored securely strictly in your browser&apos;s local storage and never transmitted to external third-party servers.
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-slate-300 space-y-1.5">
            <div className="flex items-center justify-between font-semibold text-white">
              <span>Need a free Gemini key?</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 text-[11px]"
              >
                Google AI Studio <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Google AI Studio provides a free-tier API key with generous RPM limits suitable for personal and hackathon evaluation.
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            {apiKey ? (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-rose-400 hover:text-rose-300"
              >
                Clear Key
              </button>
            ) : <span />}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all flex items-center gap-1.5 shadow-md"
              >
                {saved ? <Check className="w-4 h-4" /> : null}
                {saved ? 'Saved!' : 'Save Key'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
