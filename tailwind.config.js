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
        bg: {
          darkest: '#050505',
          darker: '#0A0A0A',
          DEFAULT: '#0F0F0F',
          card: '#141414',
          cardHover: '#1A1A1A',
          surface: '#222222',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(59, 130, 246, 0.3)',
        },
        accent: {
          light: '#60A5FA',
          DEFAULT: '#3B82F6', // Electric Blue
          dark: '#2563EB',
          glow: 'rgba(59, 130, 246, 0.18)',
        },
        text: {
          primary: '#F5F5F5',
          secondary: '#A1A1A1',
          muted: '#666666',
        },
        syntax: {
          keyword: '#F43F5E',
          func: '#60A5FA',
          string: '#34D399',
          number: '#FBBF24',
          comment: '#666666',
          variable: '#A78BFA',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
