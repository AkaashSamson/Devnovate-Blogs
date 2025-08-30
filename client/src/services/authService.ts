import apiClient from './apiClient';
import { setAuthToken, removeAuthToken } from './tokenService';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    isAccountVerified: boolean;
    isAdmin: boolean;
  };
}

// Login user
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    
    console.log('Login response:', response.data);
    
    if (response.data.success) {
      // Store token if provided (production)
      if (response.data.token) {
        console.log('Storing token:', response.data.token.substring(0, 20) + '...');
        setAuthToken(response.data.token);
      } else {
        console.log('No token in response - using cookie auth');
      }
    }
    
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { success: false, message: 'Login failed' };
  }
};

// Register user
export const registerUser = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    
    if (response.data.success) {
      // Store token if provided (production)
      if (response.data.token) {
        setAuthToken(response.data.token);
      }
    }
    
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { success: false, message: 'Registration failed' };
  }
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always remove token from localStorage
    removeAuthToken();
  }
};

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
    // Clear invalid token
    removeAuthToken();
    return {
      isAuthenticated: false,
      user: null,
      isAdmin: false
    };
  }
};
