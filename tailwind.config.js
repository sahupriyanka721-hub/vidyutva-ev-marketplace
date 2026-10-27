/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // Brand Oceanic Midnight Navy (Derived from E-VAHAN Logo Typography & Chassis)
          navy: {
            950: '#030B17',
            900: '#06152B',
            850: '#081E3B',
            800: '#0B2545',
            700: '#12396B',
            600: '#1A4D8C',
          },
          // Primary Green / Emerald (Derived from "E-" and leaf symbol)
          primary: '#14532D',
          'primary-dark': '#0d381e',
          'primary-light': '#1b6e3c',
          secondary: '#16A34A',
          'secondary-dark': '#15803D',
          'secondary-light': '#22C55E',
          // Energy Lime (Derived from lightning bolt & spare parts chip)
          accent: '#B7F34A',
          'accent-dark': '#9dd632',
          'accent-light': '#d4ff78',
          // Surfaces (Light Bluish Executive EV Palette)
          bg: '#F0F4F8',
          surface: '#FFFFFF',
          text: '#06152B',
          muted: '#64748B',
          border: '#DCE5EE',
          card: '#FFFFFF',
          tag: '#EDF4FB',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(6, 21, 43, 0.05), 0 1px 2px rgba(6, 21, 43, 0.03)',
        'premium': '0 4px 20px -2px rgba(6, 21, 43, 0.08), 0 2px 6px -1px rgba(6, 21, 43, 0.04)',
        'elevated': '0 10px 30px -4px rgba(6, 21, 43, 0.12), 0 4px 10px -2px rgba(6, 21, 43, 0.06)',
        'glow-emerald': '0 0 20px -3px rgba(22, 163, 74, 0.35)',
        'glow-lime': '0 0 20px -3px rgba(183, 243, 74, 0.4)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
