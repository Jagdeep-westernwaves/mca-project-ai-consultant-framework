import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Adjust base URL for Django container
});

// Automatically inject JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('aimcf_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercept token expirations (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('aimcf_access_token');
      localStorage.removeItem('aimcf_refresh_token');
      // Force page refresh to trigger routing redirect
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
