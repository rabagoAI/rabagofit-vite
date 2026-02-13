/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                gray: {
                    900: '#09090b', // Zinc 950
                    800: '#18181b', // Zinc 900
                    750: '#27272a', // Zinc 800
                    700: '#3f3f46', // Zinc 700
                    600: '#52525b', // Zinc 600
                    500: '#71717a', // Zinc 500
                    400: '#a1a1aa', // Zinc 400
                    300: '#d4d4d8', // Zinc 300
                    200: '#e4e4e7', // Zinc 200
                    100: '#f4f4f5', // Zinc 100
                },
                emerald: {
                    400: '#34d399',
                    500: '#10b981',
                    600: '#059669',
                    glow: '#10b981',
                }
            },
            boxShadow: {
                'glow': '0 0 15px rgba(16, 185, 129, 0.3)',
                'glow-lg': '0 0 25px rgba(16, 185, 129, 0.4)',
                'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.15)',
                'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            }
        },
    },
    plugins: [],
}
