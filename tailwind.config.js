/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          blue: '#00E5FF',
          cyan: '#00FFF0',
          green: '#00FF95',
          pink: '#FF5EF9',
          waterblue: '#1CBBFF',
          background: 'rgba(0, 49, 69, 0.15)',
        },
      },
      boxShadow: {
        'neon-glow': '0 0 5px rgba(0, 229, 255, 0.7), 0 0 20px rgba(0, 229, 255, 0.5)',
        'neon-pulse': '0 0 5px rgba(0, 229, 255, 0.7), 0 0 25px rgba(0, 229, 255, 0.5), 0 0 50px rgba(0, 229, 255, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'water-flow': 'waterFlow 10s ease-in-out infinite',
      },
      keyframes: {
        waterFlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

