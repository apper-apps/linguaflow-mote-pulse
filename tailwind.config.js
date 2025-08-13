/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#6366F1',
        secondary: '#8B5CF6', 
        accent: '#EC4899',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
        'gradient-card': 'linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)',
        'gradient-button': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
      },
      animation: {
        'pulse-success': 'pulse 0.5s ease-in-out',
        'rotate-swap': 'rotate 0.3s ease-in-out',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
},
      transitionProperty: {
        'theme': 'background-color, border-color, color, fill, stroke, opacity, box-shadow, transform',
      },
    },
  },
  plugins: [],
}