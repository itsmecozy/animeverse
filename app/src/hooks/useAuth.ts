import { useState, useCallback } from 'react';
import { currentUser } from '@/data/mockData';
import type { User } from '@/types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(currentUser);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const login = useCallback(async (_username: string, _password: string) => {
    // Mock login
    setUser(currentUser);
    setIsAuthenticated(true);
    return true;
  }, []);

  const register = useCallback(async (_username: string, _email: string, _password: string) => {
    // Mock register
    setUser(currentUser);
    setIsAuthenticated(true);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const updateProfile = useCallback((updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
  };
};
