'use client';

// Improved ProfilePage component for client/src/app/patient-dashboard/profile/page.js

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    profilePicture: ''
  });
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    // Only fetch profile if user is logged in
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        
        if (!user?.token) {
          // If no token is available, don't make the API call
          setIsLoading(false);
          return;
        }
        
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };
        
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, config);
        
        setFormData({
          name: res.data.name || '',
          email: res.data.email || '',
          bio: res.data.bio || '',
          profilePicture: res.data.profilePicture || ''
        });
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setIsLoading(false);
        
        // If we get a 401 error, the token is invalid/expired
        if (err.response?.status === 401) {
          logout();
        }
      }
    };
    
    if (user) {
      fetchProfile();
    }
  }, [user, loading, router, logout]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');

    // Check if user is still logged in before submitting
    if (!user?.token) {
      setStatus('You must be logged in to update your profile.');
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, formData, config);
      setStatus('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      
      if (err.response?.status === 401) {
        // If unauthorized, logout the user
        logout();
        return;
      }
      
      setStatus('Failed to update profile. ' + (err.response?.data?.message || ''));
    }
  };

  const handleLogout = () => {
    logout();
  };

  // Display loading state
  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            name="bio"
            rows="3"
            value={formData.bio}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Profile Picture URL</label>
          <input
            type="text"
            name="profilePicture"
            value={formData.profilePicture}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
          />
        </div>

        {status && (
          <div className={`text-sm p-3 rounded ${
            status.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {status}
          </div>
        )}

        <button
          type="submit"
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}