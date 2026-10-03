import type { Config } from 'tailwindcss';
const config: Config = { darkMode: 'class', content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'], theme: { extend: { colors: { brand: { 50: '#eef8ff', 500: '#1683ff', 600: '#0b6ddd', 700: '#0957b4' } } } }, plugins: [] };
export default config;
