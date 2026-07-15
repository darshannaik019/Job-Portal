import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // Send cookies (refresh token)
});

// Request interceptor to attach access token
api.interceptors.request.use(
  async (config) => {
    if (window.Clerk && window.Clerk.session) {
      try {
        const token = await window.Clerk.session.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.error('Error fetching Clerk token:', err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
