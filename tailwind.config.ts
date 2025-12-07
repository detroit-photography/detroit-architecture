import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'detroit-green': '#0d2e1f',
        'detroit-gold': '#c4a962',
        'detroit-cream': '#f5f0e6',
        'detroit-dark': '#0a1f14',
      },
      fontFamily: {
        'display': ['Cormorant Garamond', 'serif'],
        'body': ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config

