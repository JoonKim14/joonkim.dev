/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Space colors (dark/cold)
        space: {
          black: '#0a0a0f',
          'black-light': '#111117',
          navy: '#0d1b2a',
          'navy-light': '#1b263b',
          purple: '#1a1a2e',
          'purple-light': '#16213e',
        },
        // Planet colors (warm/green sanctuary)
        planet: {
          green: {
            dark: '#2d6a4f',
            DEFAULT: '#40916c',
            medium: '#52b788',
            light: '#74c69d',
            pale: '#95d5b2',
          },
          blue: {
            dark: '#0077b6',
            DEFAULT: '#00b4d8',
            medium: '#48cae4',
            light: '#90e0ef',
            pale: '#ade8f4',
          },
          warm: {
            orange: '#f77f00',
            gold: '#fcbf49',
            cream: '#eae2b7',
            peach: '#ffb4a2',
            rose: '#e5989b',
          },
        },
      },
    },
  },
  plugins: [],
}
