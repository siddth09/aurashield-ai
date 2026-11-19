import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  colorblindFriendly: boolean;
  screenReaderAnnouncements: boolean;
  toggleHighContrast: () => void;
  setFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  toggleColorblindFriendly: () => void;
  announce: (message: string) => void;
  lastAnnouncement: string;
}

const AccessibilityContext = createContext<AccessibilitySettings | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('aurashield_high_contrast') === 'true';
  });

  const [fontSize, setFontSizeState] = useState<'normal' | 'large' | 'xlarge'>(() => {
    return (localStorage.getItem('aurashield_font_size') as 'normal' | 'large' | 'xlarge') || 'normal';
  });

  const [colorblindFriendly, setColorblindFriendly] = useState<boolean>(() => {
    return localStorage.getItem('aurashield_colorblind') === 'true';
  });

  const [lastAnnouncement, setLastAnnouncement] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('aurashield_high_contrast', String(highContrast));
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('aurashield_font_size', fontSize);
    document.documentElement.classList.remove('text-normal', 'text-large', 'text-xlarge');
    document.documentElement.classList.add(`text-${fontSize}`);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('aurashield_colorblind', String(colorblindFriendly));
  }, [colorblindFriendly]);

  const toggleHighContrast = () => setHighContrast(prev => !prev);
  const setFontSize = (size: 'normal' | 'large' | 'xlarge') => setFontSizeState(size);
  const toggleColorblindFriendly = () => setColorblindFriendly(prev => !prev);

  const announce = (message: string) => {
    setLastAnnouncement(message);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        fontSize,
        colorblindFriendly,
        screenReaderAnnouncements: true,
        toggleHighContrast,
        setFontSize,
        toggleColorblindFriendly,
        announce,
        lastAnnouncement,
      }}
    >
      {/* Screen Reader ARIA Live Region */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="a11y-announcements"
      >
        {lastAnnouncement}
      </div>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};
