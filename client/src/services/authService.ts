import apiClient from './apiClient';

// Check if user is authenticated by calling /me endpoint
export const checkAuthStatus = async () => {
  try {
    const response = await apiClient.get('/users/me');
    
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
