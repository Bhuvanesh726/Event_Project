import axios from 'axios';

const api = axios.create({
  // CHANGED: Read the URL from the .env variable
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// This interceptor will now correctly find and attach the JWT token
api.interceptors.request.use(
  (config) => {
    const userString = localStorage.getItem('user');
    
    if (userString) {
      const userData = JSON.parse(userString);
      const token = userData.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;