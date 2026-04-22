/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F9FAFB',           // light gray background
        card: '#FFFFFF',         // white cards
        border: '#E5E7EB',       // light borders
        primary: '#2563EB',      // professional blue
        success: '#16A34A',      // green
        warning: '#D97706',      // amber
        danger: '#DC2626',       // red
        textPrimary: '#111827',  // slate 900
        textMuted: '#6B7280',    // gray 500
      },
      fontFamily: {
        body: ['"Inter"', 'sans-serif'],
        heading: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
