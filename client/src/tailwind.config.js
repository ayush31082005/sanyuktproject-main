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
                    dark: 'var(--color-bg-deep)',
                    card: 'var(--color-bg-card)',
                    gold: 'var(--color-gold)',
                    'gold-bright': 'var(--color-gold-bright)',
                    cream: 'var(--color-cream)',
                    brown: 'var(--color-muted-brown)',
                },
                primary: {
                    green: '#0A7A2F',
                    secondary: '#2F7A32',
                },
                accent: {
                    orange: '#F7931E',
                },
                text: {
                    dark: '#222222',
                },
                background: {
                    light: '#F8FAF5',
                },
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                sans: ['Inter', 'sans-serif'],
            },
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'slide-up': {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'slide-right': {
                    '0%': { opacity: '0', transform: 'translateX(-30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                'slide-left': {
                    '0%': { opacity: '0', transform: 'translateX(30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                'bounce-subtle': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                },
            },
            animation: {
                'fade-in': 'fade-in 0.8s ease-out forwards',
                'slide-up': 'slide-up 0.8s ease-out forwards',
                'slide-right': 'slide-right 0.8s ease-out forwards',
                'slide-left': 'slide-left 0.8s ease-out forwards',
                'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
            },
        },
    },
    plugins: [],
}