import axios from 'axios';

// Set default config
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;

// Function to get fresh CSRF token from meta tag
const getCsrfToken = (): string | null => {
    const token = document.head.querySelector('meta[name="csrf-token"]');
    return token instanceof HTMLMetaElement ? token.content : null;
};

// Add CSRF token to all requests
const token = getCsrfToken();
if (token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
}

// Add request interceptor to always use fresh CSRF token
axios.interceptors.request.use(
    (config) => {
        const freshToken = getCsrfToken();
        if (freshToken) {
            config.headers['X-CSRF-TOKEN'] = freshToken;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor for error handling
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Redirect to login if unauthorized
            window.location.href = '/login';
        }
        if (error.response?.status === 419) {
            // CSRF token mismatch - reload the page to get fresh token
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

export default axios;
