
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000', // Adjust port as needed
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(config => {
  console.log('Request:', config.method, config.url);
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      URL: error.config.url,
      Method: error.config.method,
      Status: error.response?.status,
      Data: error.response?.data,
      Message: error.message
    });
    return Promise.reject(error);
  }
);

export default api;