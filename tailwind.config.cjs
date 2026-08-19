/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        'primary-focus': '#1d4ed8',
        'base-content': { DEFAULT: '#525b6b', 900: '#0a0e17' }
      },
      fontFamily: {
        sans: ['system-ui', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    }
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          primary: '#2563eb',
          'primary-content': '#ffffff',
          'primary-focus': '#1d4ed8',
          'base-content': '#525b6b',
          'base-100': '#ffffff',
          'base-200': '#f1f4f9',
          'base-300': '#e2e6ee'
        }
      },
      {
        dark: {
          primary: '#60a5fa',
          'primary-content': '#0a0e17',
          'primary-focus': '#3b82f6',
          'base-content': '#9ca3af',
          'base-100': '#161a23',
          'base-200': '#1f2430',
          'base-300': '#2e3542'
        }
      }
    ],
    darkTheme: 'dark'
  }
}
