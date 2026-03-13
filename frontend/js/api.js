const API_URL = window.location.origin.includes('localhost') && !window.location.origin.includes('5000') 
    ? 'http://localhost:5000/api' 
    : '/api';

const api = {
    getHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
    },

    handleError(data, response) {
        if (response.status === 401) {
            // Unauthenticated, clear storage and redirect
            localStorage.clear();
            window.location.href = 'index.html';
        }
        throw new Error(data.message || 'Something went wrong');
    },

    async request(endpoint, options = {}) {
        const url = `${API_URL}${endpoint}`;
        const headers = this.getHeaders();

        const config = { ...options, headers: { ...headers, ...options.headers } };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            if (!response.ok) this.handleError(data, response);
            return data;
        } catch (err) {
            throw err;
        }
    },

    post(endpoint, body) {
        return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) });
    },

    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }
};
