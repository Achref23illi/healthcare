'use client';

// This component fetches and displays the logged-in patient's vital signs in a table.
// It requires the user to be authenticated and redirects to /login otherwise.
// It makes two API calls: one to get the user ID and another to get the vital signs.

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function PatientVitals() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [vitals, setVitals] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };

        // First call to get the authenticated user's ID
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, config);
        const userId = response.data._id;

        // Second call to get the vital signs using the user ID
        const vitalResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/vitals/${userId}`, config);
        setVitals(vitalResponse.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch vital signs');
      }
    };

    if (user && user.role === 'patient') {
      fetchVitals();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Vital Signs</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {vitals.length > 0 ? (
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr>
                <th className="border-b p-2 font-medium">Type</th>
                <th className="border-b p-2 font-medium">Value</th>
                <th className="border-b p-2 font-medium">Unit</th>
                <th className="border-b p-2 font-medium">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {vitals.map((vital, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="p-2 capitalize">{vital.type}</td>
                  <td className="p-2">{vital.value}</td>
                  <td className="p-2">{vital.unit}</td>
                  <td className="p-2">{new Date(vital.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No vital signs available.</p>
        )}
      </div>
    </div>
  );
}
