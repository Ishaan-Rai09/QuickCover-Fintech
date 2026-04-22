/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0A0E1A',
        card: '#111827',
        border: '#1F2937',
        primary: '#3B82F6',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        textPrimary: '#F9FAFB',
        textMuted: '#6B7280',
      },
      fontFamily: {
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
        heading: ['"Syne"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
