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
  const router = useRouter();

  // Load user from local storage on initial load
  useEffect(() => {
    const loadUser = async () => {
      try {
        console.log('Loading user from storage...');
        
        // Make sure we only run this on client-side
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('user');
          
          if (storedUser) {
            console.log('Found stored user');
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            console.log('User set from localStorage:', parsedUser);
          } else {
            console.log('No stored user found');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Failed to load user from storage', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Register user
  const register = async (userData) => {
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
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(data));
      }
      
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
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  // Get user profile
  const getUserProfile = async (token) => {
    try {
      setLoading(true);
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/me`, 
        config
      );
      
      return response.data;
    } catch (error) {
      console.error('Failed to get user profile', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = user?.token;
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile`, 
        userData, 
        config
      );
      
      // Update user in localStorage and state
      const updatedUser = {
        ...response.data,
        token
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return updatedUser;
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Failed to update profile. Please try again.'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
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