import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                'farcaster-purple': '#472a91',
                'money-green': '#44b600',
                'gold-shine': '#ffd700',
                'retro-gray': '#1a1a1a',
            },
            fontFamily: {
                pixel: ['var(--font-press-start-2p)', 'monospace'],
            },
            animation: {
                heartbeat: 'heartbeat 3s ease-in-out infinite',
            },
            keyframes: {
                heartbeat: {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' },
                },
            },
        },
    },
    plugins: [],
};
export default config;
