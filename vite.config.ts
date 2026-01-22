import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
            phpPath: 'C:\\Users\\pogoi\\.config\\herd\\bin\\php82\\php.exe',
        }),
    ],
    server: {
        host: 'localhost',
        hmr: {
            host: 'localhost',
        },
    },
    esbuild: {
        jsx: 'automatic',
    },
});
