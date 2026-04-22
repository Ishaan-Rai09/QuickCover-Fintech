/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        card: 'hsl(var(--card) / <alpha-value>)',
        border: 'hsl(var(--border) / <alpha-value>)',
        primary: 'hsl(var(--primary) / <alpha-value>)',
        'primary-foreground': 'hsl(var(--primary-foreground) / <alpha-value>)',
        muted: 'hsl(var(--muted) / <alpha-value>)',
        'muted-foreground': 'hsl(var(--muted-foreground) / <alpha-value>)',
        success: 'hsl(var(--success) / <alpha-value>)',
        warning: 'hsl(var(--warning) / <alpha-value>)',
        danger: 'hsl(var(--danger) / <alpha-value>)',
        bg: 'hsl(var(--background) / <alpha-value>)',
        textPrimary: 'hsl(var(--foreground) / <alpha-value>)',
        textMuted: 'hsl(var(--muted-foreground) / <alpha-value>)',
      },
      fontFamily: {
        body: ['"Sora"', 'sans-serif'],
        heading: ['"Sora"', 'sans-serif'],
      },
      boxShadow: {
        sm: '0 12px 30px rgba(3, 7, 18, 0.12)',
        DEFAULT: '0 24px 60px rgba(3, 7, 18, 0.35)',
        md: '0 20px 40px rgba(3, 7, 18, 0.45)',
      }
    },
  },
  plugins: [],
}
