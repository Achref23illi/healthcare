'use client';

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Handle hydration mismatch by setting mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Configure axios to always include the token if it exists
  useEffect(() => {
    if (!mounted) return;

    if (user?.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [user, mounted]);

  // Load user from local storage on initial load
  useEffect(() => {
    if (!mounted) return;
  
    const loadUser = async () => {
      try {
        // Check if this was a manual logout
        const wasManualLogout = sessionStorage.getItem('manual_logout');
        
        if (wasManualLogout) {
          // Clear the flag but don't automatically log back in
          sessionStorage.removeItem('manual_logout');
          return;
        }
        
        console.log('Loading user from storage...');
        
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          console.log('Found stored user');
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Rest of your existing code for token verification
        } else {
          console.log('No stored user found');
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to load user from storage', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
  
    loadUser();
  }, [mounted]);

  // Register user
  const register = async (userData) => {
    if (!mounted) return;
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`, 
        userData
      );
      
      const data = response.data;
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      
      return data;
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Registration failed. Please try again.'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    if (!mounted) return;
    try {
      setLoading(true);
      setError(null);
      
      console.log('Sending login request to server...');
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`, 
        { email, password }
      );
      
      const data = response.data;
      console.log('Login successful, received data:', data);
      
      // Verify the response has role and token
      if (!data.role || !data.token) {
        throw new Error('Invalid response from server');
      }
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(data));
      
      // Update context state
      setUser(data);
      console.log('User state updated in context');
      
      return data;
    } catch (error) {
      console.error('Login error in context:', error);
      setError(
        error.response?.data?.message || 
        'Login failed. Please check your credentials.'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    if (!mounted) return;
    
    try {
      // Set a manual logout flag to prevent redirect loops
      sessionStorage.setItem('manual_logout', 'true');
      
      // Clear user state first
      setUser(null);
      
      // Remove all stored authentication data
      localStorage.removeItem('user');
      
      // Clear any authorization headers
      delete axios.defaults.headers.common['Authorization'];
      
      // Navigate with replacement to prevent history issues
      router.replace('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Force a hard refresh as a fallback
      window.location.href = '/login';
    }
  };

  // Get user profile
  const getUserProfile = async () => {
    if (!mounted) return;
    try {
      setLoading(true);
      
      if (!user?.token) {
        throw new Error('Not authenticated');
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/me`, 
        config
      );
      
      return response.data;
    } catch (error) {
      console.error('Failed to get user profile', error);
      if (error.response?.status === 401) {
        // Token expired or invalid, log out
        logout();
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    if (!mounted) return;
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.token) {
        throw new Error('Not authenticated');
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile`, 
        userData, 
        config
      );
      
      // Update user in localStorage and state
      const updatedUser = {
        ...user,
        ...response.data,
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return updatedUser;
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Failed to update profile. Please try again.'
      );
      
      if (error.response?.status === 401) {
        // Token expired or invalid, log out
        logout();
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update user password
  const updatePassword = async (currentPassword, newPassword) => {
    if (!mounted) return;
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.token) {
        throw new Error('Not authenticated');
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/users/password`,
        { currentPassword, newPassword },
        config
      );
      
      return response.data;
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Failed to update password. Please try again.'
      );
      
      if (error.response?.status === 401) {
        // Token expired or invalid, log out
        logout();
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update notification settings
  const updateNotificationSettings = async (settings) => {
    if (!mounted) return;
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.token) {
        throw new Error('Not authenticated');
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/users/notifications`,
        settings,
        config
      );
      
      return response.data;
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Failed to update notification settings. Please try again.'
      );
      
      if (error.response?.status === 401) {
        // Token expired or invalid, log out
        logout();
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    if (!mounted) return;
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, 
        { email }
      );
      
      return response.data;
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Failed to process password reset. Please try again.'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (password, token) => {
    if (!mounted) return;
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password/${token}`, 
        { password }
      );
      
      return response.data;
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Failed to reset password. Please try again.'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Don't render children until hydration is complete
  if (!mounted) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        getUserProfile,
        updateProfile,
        updatePassword,
        updateNotificationSettings,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};