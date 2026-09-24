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
        git: {
          bg: '#0d1117',
          card: '#161b22',
          border: '#30363d',
          accent: '#238636',
          blue: '#58a6ff',
          green: '#3fb950',
          purple: '#bc8cff',
          orange: '#d29922',
          red: '#f85149',
          cyan: '#39c5cf',
          muted: '#8b949e',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
