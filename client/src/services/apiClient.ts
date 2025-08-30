import axios from 'axios';

const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to:`, config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.log('Unauthorized access - user may need to login');
      // Optionally redirect to login or clear user state
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
