import axios from 'axios';

// Try to detect if we're in development
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
export const API_URL = isDevelopment ? 'http://localhost:5000' : 'https://real-time-poll-rooms-4.onrender.com';

console.log('Environment:', { isDevelopment, hostname: window.location.hostname, API_URL });

// Create axios instance with retry logic
const api = axios.create({
    baseURL: `${API_URL}/api/polls`,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Health check function
export const checkHealth = async () => {
    try {
        const response = await axios.get(`${API_URL}/`, { timeout: 5000 });
        console.log('Health check successful:', response.status);
        return response.status === 200;
    } catch (error) {
        console.error('Health check failed:', error.message);
        return false;
    }
};

export const createPoll = async (data) => {
    try {
        console.log('Creating poll at:', `${API_URL}/api/polls`);
        const response = await api.post('/', data);
        return response;
    } catch (error) {
        console.error('Create poll error:', error);
        throw error;
    }
};

export const getPoll = async (id) => {
    try {
        const response = await api.get(`/${id}`);
        return response;
    } catch (error) {
        console.error('Get poll error:', error);
        throw error;
    }
};

export const votePoll = async (id, optionId) => {
    try {
        const response = await api.post(`/${id}/vote`, { optionId });
        return response;
    } catch (error) {
        console.error('Vote poll error:', error);
        throw error;
    }
};

export default api;
