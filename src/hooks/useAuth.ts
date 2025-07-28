import { useState, useCallback, useEffect } from 'react';
import { User } from '../types';
import { apiClient } from '../config/api';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Check for existing auth token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        setLoading(true);
        const result = await apiClient.getCurrentUser();
        if (result.success && result.data) {
          setUser(result.data.user);
        } else {
          // Token is invalid, clear it
          apiClient.clearToken();
        }
        setLoading(false);
      }
      setInitialized(true);
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const result = await apiClient.login(email, password);
      if (result.success && result.data) {
        apiClient.setToken(result.data.token);
        setUser(result.data.user);
      } else {
        throw new Error(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    
    try {
      const result = await apiClient.signup(name, email, password);
      if (result.success && result.data) {
        apiClient.setToken(result.data.token);
        setUser(result.data.user);
      } else {
        throw new Error(result.error || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    apiClient.clearToken();
    setUser(null);
  }, []);

  return {
    user,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!user,
    initialized
  };
};