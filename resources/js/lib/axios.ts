import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Set default config
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

// XSRF cookie name that Laravel uses
axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

// Function to get fresh CSRF token from meta tag
const getCsrfToken = (): string | null => {
    const token = document.head.querySelector('meta[name="csrf-token"]');
    return token instanceof HTMLMetaElement ? token.content : null;
};

// Function to update CSRF token in meta tag and axios defaults
const updateCsrfToken = (newToken: string): void => {
    const meta = document.head.querySelector('meta[name="csrf-token"]');
    if (meta instanceof HTMLMetaElement) {
        meta.content = newToken;
    }
    axios.defaults.headers.common['X-CSRF-TOKEN'] = newToken;
};

// Function to refresh CSRF token from server
const refreshCsrfToken = async (): Promise<boolean> => {
    try {
        // Call csrf-cookie endpoint to get fresh XSRF-TOKEN cookie
        const response = await axios.get('/sanctum/csrf-cookie', {
            withCredentials: true,
            // Skip interceptor for this request to avoid infinite loop
            headers: { 'X-Skip-Csrf-Refresh': 'true' }
        });

        // Try to get CSRF token from XSRF-TOKEN cookie
        const xsrfCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('XSRF-TOKEN='));

        if (xsrfCookie) {
            const cookieValue = decodeURIComponent(xsrfCookie.split('=')[1]);
            updateCsrfToken(cookieValue);
            return true;
        }

        return response.status === 200;
    } catch {
        return false;
    }
};

// Add CSRF token to all requests
const token = getCsrfToken();
if (token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
}

// Track if we're currently refreshing CSRF token
let isRefreshingCsrf = false;
let csrfRefreshPromise: Promise<boolean> | null = null;

// Add request interceptor to always use fresh CSRF token
axios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const freshToken = getCsrfToken();
        if (freshToken) {
            config.headers['X-CSRF-TOKEN'] = freshToken;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor for error handling with CSRF token refresh
axios.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401) {
            // Redirect to login if unauthorized
            window.location.href = '/login';
            return Promise.reject(error);
        }

        // Handle 419 CSRF token mismatch - try to refresh token and retry
        if (error.response?.status === 419 && originalRequest && !originalRequest._retry) {
            // Skip if this is the csrf-cookie request itself
            if (originalRequest.headers?.['X-Skip-Csrf-Refresh']) {
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            // If already refreshing, wait for that to complete
            if (isRefreshingCsrf && csrfRefreshPromise) {
                const success = await csrfRefreshPromise;
                if (success) {
                    const newToken = getCsrfToken();
                    if (newToken) {
                        originalRequest.headers['X-CSRF-TOKEN'] = newToken;
                    }
                    return axios(originalRequest);
                }
            }

            // Start refreshing CSRF token
            isRefreshingCsrf = true;
            csrfRefreshPromise = refreshCsrfToken();

            try {
                const success = await csrfRefreshPromise;
                if (success) {
                    const newToken = getCsrfToken();
                    if (newToken) {
                        originalRequest.headers['X-CSRF-TOKEN'] = newToken;
                    }
                    return axios(originalRequest);
                }
            } finally {
                isRefreshingCsrf = false;
                csrfRefreshPromise = null;
            }
        }

        return Promise.reject(error);
    }
);

export default axios;
export { getCsrfToken, updateCsrfToken, refreshCsrfToken };
