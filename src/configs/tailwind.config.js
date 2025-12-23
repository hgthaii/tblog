export const tailwindConfig = {
  theme: {
    fontFamily: {
      sans: ['ConsolasLig', 'system-ui', 'sans-serif'],
    },
    extend: {
      colors: {
        bg: '#1e1e1e', // background
        primary: '#d4d4d4', // text chính
        muted: '#858585', // text phụ
        accent: '#c586c0', // màu nhấn (optional)
        redd: 'red',
      },
      borderColor: {
        primary: '#3c3c3c',
        third: '#d4d4d4',
      },
    },
    variants: {},
    plugins: [],
  },
};
