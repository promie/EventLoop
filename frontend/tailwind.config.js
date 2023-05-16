/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  // daisyUI config (optional)
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#38b6ff',
          secondary: '#f6d860',
          accent: '#FF0000',
          neutral: '#CFCFCF',
          'base-100': '#ffffff',
        },
      },
      'light',
    ],
  },
}
