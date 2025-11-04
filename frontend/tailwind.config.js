/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'one-piece': ['One Piece', 'sans-serif'],
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'fade-out': 'fadeOut linear forwards',
        'appear': 'appear 0.3s ease-out forwards',
        'spin-slow': 'spin 20s linear infinite',
        'dropdown-open': 'dropdownOpen 0.2s ease-out forwards',
        'dropdown-close': 'dropdownClose 0.2s ease-in forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeOut: {
          'from': { opacity: '1' },
          'to': { opacity: '0' },
        },
        appear: {
          'from': { opacity: '0', transform: 'scale(0.8)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        dropdownOpen: {
          'from': { 
            opacity: '0', 
            transform: 'translateY(-10px) scale(0.95)',
          },
          'to': { 
            opacity: '1', 
            transform: 'translateY(0) scale(1)',
          },
        },
        dropdownClose: {
          'from': { 
            opacity: '1', 
            transform: 'translateY(0) scale(1)',
          },
          'to': { 
            opacity: '0', 
            transform: 'translateY(-10px) scale(0.95)',
          },
        },
      },
    },
  },
  plugins: [],
}

