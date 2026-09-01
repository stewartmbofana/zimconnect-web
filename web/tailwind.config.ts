/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Pa~ZimConnect brand palette
        brand: {
          emerald: '#059669',  // primary
          gold:    '#EAB308',  // accent
          crimson: '#DC2626',  // alert/urgent
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
