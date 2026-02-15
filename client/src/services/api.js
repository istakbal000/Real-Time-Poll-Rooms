import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: `${API_URL}/api/polls`,
});

export const createPoll = (data) => api.post('/', data);
export const getPoll = (id) => api.get(`/${id}`);
export const votePoll = (id, optionId) => api.post(`/${id}/vote`, { optionId });

export default api;
