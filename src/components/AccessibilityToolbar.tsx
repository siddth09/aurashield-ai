import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { 
  Eye, 
  Contrast, 
  Type, 
  Volume2, 
  X
} from 'lucide-react';

export const AccessibilityToolbar: React.FC = () => {
  const { 
    highContrast, 
    toggleHighContrast, 
    fontSize, 
    setFontSize, 
    colorblindFriendly, 
    toggleColorblindFriendly,
    announce 
  } = useAccessibility();

  const [isOpen, setIsOpen] = useState(false);

  const handleTestAnnouncement = () => {
    announce('AuraShield Accessibility Voice Cue: Outdoor AQI is currently hazardous. Keep windows sealed.');
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {isOpen ? (
        <div className="bg-slate-900 border-2 border-emerald-500/80 rounded-2xl p-4 shadow-2xl w-72 mb-2 animate-fadeIn text-xs text-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-emerald-400" />
              Inclusive Accessibility
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
              aria-label="Close Accessibility Controls"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Contrast className="w-4 h-4 text-amber-400" />
                High Contrast (AAA)
              </span>
              <button
                onClick={toggleHighContrast}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] border transition-all ${
                  highContrast
                    ? 'bg-amber-400 text-black border-amber-300'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {highContrast ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Colorblind Shapes */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-teal-400" />
                Colorblind Shapes
              </span>
              <button
                onClick={toggleColorblindFriendly}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] border transition-all ${
                  colorblindFriendly
                    ? 'bg-teal-500 text-white border-teal-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {colorblindFriendly ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Font Size */}
            <div>
              <span className="flex items-center gap-1.5 mb-1.5">
                <Type className="w-4 h-4 text-indigo-400" />
                Text Sizing
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {(['normal', 'large', 'xlarge'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`py-1 rounded-lg font-mono text-[11px] uppercase border font-semibold ${
                      fontSize === size
                        ? 'bg-indigo-600 text-white border-indigo-400'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {size === 'normal' ? '100%' : size === 'large' ? '125%' : '150%'}
                  </button>
                ))}
              </div>
            </div>

            {/* Screen Reader Test */}
            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={handleTestAnnouncement}
                className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center gap-1.5 text-[11px]"
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                Test ARIA Announcement
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/50 shadow-2xl flex items-center justify-center transition-transform hover:scale-110"
        title="Open Accessibility Controls"
        aria-label="Open Accessibility Toolbar"
      >
        <Eye className="w-5 h-5" />
      </button>
    </div>
  );
};
