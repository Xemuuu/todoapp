import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_KEY = import.meta.env.VITE_API_KEY || 'your-super-secret-api-key-2026';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': API_KEY,
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data);
    
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      config.headers.Authorization = `Bearer ${savedToken}`;
    }
    
    const isAuthEndpoint = config.url?.includes('/auth/');
    
    const savedUser = localStorage.getItem('user');
    if (savedUser && !isAuthEndpoint) {
      try {
        const user = JSON.parse(savedUser);
        if (user && user.id) {
          // Dodaj userId do query params dla GET, DELETE, PATCH requests
          if (config.method === 'get' || config.method === 'delete' || config.method === 'patch') {
            if (!config.params) {
              config.params = {};
            }
            config.params.userId = user.id;
          }
          
          // Dodaj userId do body TYLKO dla POST requests (create)
          if (config.method === 'post' && config.data) {
            if (!config.data.userId) {
              config.data.userId = user.id;
            }
          }
        }
      } catch (error) {
        console.error('Failed to parse user from localStorage', error);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor do obsługi błędów
api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.success && response.data.data) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    console.error('[API Error]', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
