import '../css/app.css';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import axios, { updateCsrfToken, refreshCsrfToken } from './lib/axios';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const isDev = import.meta.env.DEV;

// Disable React DevTools in production
if (!isDev && typeof window !== 'undefined') {
    // @ts-ignore
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
        isDisabled: true,
        supportsFiber: true,
        inject() {},
        onCommitFiberRoot() {},
        onCommitFiberUnmount() {},
    };
}

// Function to get CSRF token from meta tag
const getCsrfToken = (): string => {
    const token = document.head.querySelector('meta[name="csrf-token"]');
    return token instanceof HTMLMetaElement ? token.content : '';
};

// Set initial CSRF token for axios
const csrfToken = getCsrfToken();
if (csrfToken) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
}

// Listen for Inertia navigation events to refresh CSRF token from response
router.on('success', (event) => {
    // Inertia includes fresh CSRF token in page props
    const page = event.detail.page;
    if (page.props?.csrf_token) {
        updateCsrfToken(page.props.csrf_token as string);
    }
});

// Handle 419 errors globally for Inertia requests
router.on('invalid', (event) => {
    const response = event.detail.response;
    if (response.status === 419) {
        // Prevent default Inertia error handling
        event.preventDefault();
        // Fetch fresh CSRF token and retry
        refreshCsrfToken()
            .then((success) => {
                if (success) {
                    // Retry the navigation
                    router.reload({ preserveScroll: true });
                } else {
                    // If refresh fails, do a full page reload as fallback
                    window.location.reload();
                }
            })
            .catch(() => {
                // If refresh fails, do a full page reload as fallback
                window.location.reload();
            });
    }
});

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <App {...props} />
            </StrictMode>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});
