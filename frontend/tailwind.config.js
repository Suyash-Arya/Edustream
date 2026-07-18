/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Brand: deep chalkboard ink (structure — nav, footer, headings)
        ink: {
          50: '#eef4f2',
          100: '#d3e3df',
          200: '#a3c4bc',
          300: '#719f95',
          400: '#3f766c',
          500: '#255a51',
          600: '#123832',
          700: '#0e2b27',
          800: '#0a201c',
          900: '#071613',
        },
        // Brand: warm mustard "highlighter" accent (CTAs, emphasis)
        gold: {
          50: '#fdf8e9',
          100: '#faedc0',
          200: '#f5db85',
          300: '#f0c752',
          400: '#ecb62c',
          500: '#dc9f18',
          600: '#b57e10',
          700: '#8c600d',
          800: '#6b490c',
          900: '#4f360a',
        },
        // Overriding Tailwind's built-in indigo scale — used across the
        // app for buttons, links, and focus rings, so this reskins most
        // pages without touching every component individually.
        indigo: {
          50: '#eefaf7',
          100: '#d2f2ea',
          200: '#a6e4d6',
          300: '#72d0bd',
          400: '#3fb69f',
          500: '#1f9684',
          600: '#157567',
          700: '#105c52',
          800: '#0d4a42',
          900: '#0a3a34',
        },
        // Overriding purple too, since a few components pair it with
        // indigo for gradients/accents.
        purple: {
          50: '#fdf8e9',
          100: '#faedc0',
          200: '#f5db85',
          300: '#f0c752',
          400: '#ecb62c',
          500: '#dc9f18',
          600: '#b57e10',
          700: '#8c600d',
          800: '#6b490c',
          900: '#4f360a',
        },
        primary: '#157567',
        secondary: '#dc9f18',
        success: '#1a8f5e',
        danger: '#c0392b',
        warning: '#dc9f18',
        dark: '#123832',
        light: '#f4f7f5',
      },
      backgroundImage: {
        'ruled-paper': 'repeating-linear-gradient(180deg, transparent, transparent 27px, rgba(18,56,50,0.08) 28px)',
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
        slideDown: 'slideDown 0.3s ease-out',
        marker: 'marker 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        marker: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
    },
  },
  plugins: [],
}
