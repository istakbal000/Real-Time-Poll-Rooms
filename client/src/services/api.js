import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api/polls',
});

export const createPoll = (data) => api.post('/', data);
export const getPoll = (id) => api.get(`/${id}`);
export const votePoll = (id, optionId) => api.post(`/${id}/vote`, { optionId });

export default api;
