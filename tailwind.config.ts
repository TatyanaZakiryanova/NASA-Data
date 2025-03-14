import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        customBackground: 'rgb(44, 44, 44)',
        customBackground2: 'rgb(59, 59, 59)',
        customButton: 'rgb(99, 63, 140)',
        customButtonHover: 'rgb(94, 54, 139)',
        customTextColor: 'rgb(224, 224, 224)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        toastIn: {
          '0%': { transform: 'translateY(-50px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        toastOut: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-50px)', opacity: '0' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out forwards',
        toastIn: 'toastIn 0.3s ease-out',
        toastOut: 'toastOut 0.3s ease-in',
      },
    },
  },
  plugins: [],
};
export default config;
