'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import RoleBasedLayout from '@/components/RoleBasedLayout';

export default function PatientDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/patients/my-doctor`, config);
        setDoctor(response.data);
      } catch (err) {
        setError('Could not fetch doctor info.');
        console.error(err);
      }
    };

    if (user && user.role === 'patient') {
      fetchDoctor();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-100 via-purple-50 to-blue-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
        <p className="text-gray-600 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <RoleBasedLayout>
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Patient Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Assigned Doctor</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {doctor ? (
          <div>
            <p><strong>Name:</strong> {doctor.name}</p>
            <p><strong>Email:</strong> {doctor.email}</p>
            <p><strong>Specialization:</strong> {doctor.specialization || 'N/A'}</p>
          </div>
        ) : (
          <p className="text-gray-500">You do not have an assigned doctor yet.</p>
        )}
      </div>
    </div>
    </RoleBasedLayout>
  );
}
