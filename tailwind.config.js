/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // LostLink logosundan türetilmiş palet.
        // "Lost" -> ink (koyu lacivert), "Link" -> sky mavi gradient.
        ink: {
          900: '#0a0f1f',
          800: '#111a33',
          700: '#1a2547',
          600: '#243056',
        },
        brand: {
          50:  '#eaf6ff',
          100: '#d1ecff',
          200: '#a7dbff',
          300: '#6ec4ff',
          400: '#38abff',
          500: '#1592f0',
          600: '#0a78d1',
          700: '#0a5da3',
          800: '#0b4678',
          900: '#0a345a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 30px rgba(21,146,240,0.35)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #1592f0 0%, #38abff 50%, #6ec4ff 100%)',
        'ink-gradient':   'linear-gradient(135deg, #0a0f1f 0%, #1a2547 100%)',
        'orbit':
          'radial-gradient(ellipse 80% 40% at 50% 50%, rgba(21,146,240,0.15) 0%, transparent 70%)',
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'orbit-spin': 'orbitSpin 30s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        orbitSpin: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
