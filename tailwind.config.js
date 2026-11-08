/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta oscura principal – inspirada en juegos de gran estrategia
        surface: {
          900: '#080b10',   // Fondo máximo (el más oscuro)
          800: '#0d1117',   // Fondo principal de la app
          700: '#131920',   // Paneles y tarjetas
          600: '#1a2230',   // Paneles secundarios / hover
          500: '#1f2b3d',   // Bordes de paneles y divisores
        },
        // Color principal de acento
        accent: {
          DEFAULT: '#3b82f6', // Azul institucional
          hover:   '#2563eb',
          muted:   '#1d4ed8',
        },
        // Colores para indicadores de estado
        success:  '#22c55e',
        warning:  '#f59e0b',
        danger:   '#ef4444',
        info:     '#6366f1',
        // Texto
        text: {
          primary:   '#e2e8f0',
          secondary: '#94a3b8',
          muted:     '#475569',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        'xxs': '0.65rem',
      },
      borderWidth: {
        DEFAULT: '1px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-in',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
