import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // Send cookies (refresh token)
});

// Request interceptor to attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration & refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is due to expired access token
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.code === 'TOKEN_EXPIRED' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        // Request token refresh
        const { data } = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        const { accessToken } = data;

        localStorage.setItem('token', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, clear state & redirect to login
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('auth-logout'));
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
