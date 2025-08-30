import axios from 'axios';

const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:5000/api';

// Check if user is authenticated by calling /me endpoint
export const checkAuthStatus = async () => {
  try {
    axios.defaults.withCredentials = true;
    const response = await axios.get(`${backendUrl}/users/me`);
    
    if (response.data.success && response.data.user) {
      return {
        isAuthenticated: true,
        user: response.data.user,
        isAdmin: response.data.user.isAdmin || false
      };
    }
    
    return {
      isAuthenticated: false,
      user: null,
      isAdmin: false
    };
  } catch (error) {
    console.log('Auth check failed:', error);
    return {
      isAuthenticated: false,
      user: null,
      isAdmin: false
    };
  }
};
