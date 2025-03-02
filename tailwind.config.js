/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'pastel-blue': '#A8DADC',
                'pastel-pink': '#FEC3A6',
                'pastel-beige': '#F8EDEB',
                'pastel-lilac': '#D9C6E0',
                'primary': '#A8DADC',
                'secondary': '#FEC3A6',
                'accent': '#D9C6E0',
                'background': '#F8EDEB',
            },
            fontFamily: {
                sans: ['Poppins', 'Inter', 'Montserrat', 'sans-serif'],
            },
        },
    },
    plugins: [],
} 