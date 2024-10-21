import { nextui } from '@nextui-org/react';
import { fontFamily } from 'tailwindcss/defaultTheme';

import type { Config } from 'tailwindcss';

const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1280px'
      }
    },
    fontFamily: {
      sans: ['var(--font-geist-sans)', ...fontFamily.sans],
      mono: ['var(--font-geist-mono)', ...fontFamily.sans]
    }
  },
  darkMode: 'class',
  plugins: [nextui()]
} satisfies Config;

export default config;
