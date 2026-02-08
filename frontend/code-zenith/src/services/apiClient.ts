const API_HOST = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const BASE_URL = `${API_HOST}/api`;

const fetchWithTimeout = async (resource: string, options: RequestInit = {}, timeout = 8000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(resource, {
        ...options,
        signal: controller.signal,
    });
    clearTimeout(id);
    return response;
};

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetchWithTimeout(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // Parse response body once so we can reuse the message when needed
    const data = await response.json().catch(() => ({}));

    // Handle 401 - Unauthorized
    if (response.status === 401) {
        // Only treat as an expired session when a token exists; otherwise surface the API error (e.g., bad login)
        if (token) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            throw new Error(data.message || 'Session expired. Please login again.');
        }

        throw new Error(data.message || 'Unauthorized');
    }

    if (!response.ok) {
        throw new Error(data.message || `Error: ${response.statusText}`);
    }

    return data;
};
