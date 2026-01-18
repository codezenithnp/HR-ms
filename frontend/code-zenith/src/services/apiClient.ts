const API_HOST = import.meta.env.VITE_API_URL || 'http://localhost:5000';
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

    // Handle 401 - Unauthorized
    if (response.status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || `Error: ${response.statusText}`);
    }

    return data;
};
