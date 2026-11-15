/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border, 214.3 31.8% 91.4%))',
        input: 'hsl(var(--input, 214.3 31.8% 91.4%))',
        ring: 'hsl(var(--ring, 221.2 83.2% 53.3%))',
        background: 'hsl(var(--background, 0 0% 100%))',
        foreground: 'hsl(var(--foreground, 222.2 84% 4.9%))',
        primary: {
          DEFAULT: '#2563eb', // modern vibrant blue
          foreground: '#ffffff',
          hover: '#1d4ed8',
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          DEFAULT: '#f1f5f9',
          foreground: '#0f172a',
          hover: '#e2e8f0',
        },
        muted: {
          DEFAULT: '#f8fafc',
          foreground: '#64748b',
        },
        accent: {
          DEFAULT: '#f1f5f9',
          foreground: '#0f172a',
        },
        success: {
          DEFAULT: '#10b981',
          foreground: '#ffffff',
          50: '#ecfdf5',
          100: '#d1fae5',
        },
        warning: {
          DEFAULT: '#f59e0b',
          foreground: '#ffffff',
          50: '#fffbeb',
          100: '#fef3c7',
        },
        danger: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
          50: '#fef2f2',
          100: '#fee2e2',
        },
      },
      borderRadius: {
        lg: '0.625rem',
        md: '0.5rem',
        sm: '0.375rem',
      },
    },
  },
  plugins: [],
};

