// src/api/axios.js
import axios from 'axios';
const BASE_URL=import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const startCaptureApi  = (sessionId) => api.post('/capture/start', { sessionId });
export const stopCaptureApi   = (sessionId) => api.post('/capture/stop', { sessionId });
export const fetchHistoryApi  = ()           => api.get('/data/history');
export const fetchTopTrackersApi = ()        => api.get('/data/top-trackers');
export const fetchBehavioralReportApi = ()   => api.get('/data/behavioral-report');
export const clearSessionDataApi = (sessionId) => api.delete(`/data/session/${sessionId}`);

export default api;