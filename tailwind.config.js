/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        aqi: {
          good: '#10B981',       // 0-50 (Emerald)
          moderate: '#F59E0B',   // 51-100 (Amber)
          poor: '#F97316',       // 101-200 (Orange)
          unhealthy: '#EF4444',  // 201-300 (Red)
          severe: '#8B5CF6',     // 301-400 (Purple)
          hazardous: '#881337',  // 401-500+ (Rose-900 / Maroon)
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
