import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

// Custom plugin to fix wayfinder naming conflicts
function fixWayfinderConflicts() {
    return {
        name: 'fix-wayfinder-conflicts',
        enforce: 'pre', // Run before other plugins
        transform(code, id) {
            // Only fix route index files
            if (!id.includes('/routes/') || !id.endsWith('/index.ts')) {
                return null;
            }
            
            const conflicts = [
                {import: 'import ormawa from', rename: 'import ormawaPage from'},
                {import: 'import detail from', rename: 'import detailPage from'},
                {import: 'import confirm from', rename: 'import confirmPage from'},
                {import: 'import login from', rename: 'import loginPage from'}
            ];
            
            let fixedCode = code;
            let hasChanges = false;
            
            conflicts.forEach(({import: oldImport, rename}) => {
                if (fixedCode.includes(oldImport)) {
                    fixedCode = fixedCode.replace(oldImport, rename);
                    hasChanges = true;
                }
            });
            
            return hasChanges ? { code: fixedCode, map: null } : null;
        }
    };
}

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
        // Wayfinder disabled for build - generate manually before build
        //wayfinder({
        //    formVariants: true,
        //    phpPath: 'C:\\Users\\pogoi\\.config\\herd\\bin\\php82\\php.exe',
        //}),
        fixWayfinderConflicts(), // Fix naming conflicts after wayfinder generates
    ],
    server: {
        host: 'localhost',
        hmr: {
            host: 'localhost',
        },
    },
    esbuild: {
        jsx: 'automatic',
        drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    },
});
