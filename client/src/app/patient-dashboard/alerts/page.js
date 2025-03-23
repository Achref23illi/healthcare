'use client';

// This page allows patients to view their own health alerts (e.g. abnormal vital signs)

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function PatientAlerts() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };

        const me = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, config);
        const patientId = me.data._id;

        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/alerts?patient=${patientId}`, config);
        setAlerts(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch alerts');
      }
    };

    if (user && user.role === 'patient') {
      fetchAlerts();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Alerts</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {alerts.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {alerts.map((alert, index) => (
              <li key={index} className="py-3">
                <p className="text-sm text-gray-700">
                  <strong>{alert.type === 'vital_sign' ? 'Vital Alert:' : 'Alert:'}</strong> {alert.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Severity: <span className={`font-medium ${
                    alert.severity === 'Critical' ? 'text-red-600' :
                    alert.severity === 'High' ? 'text-orange-500' :
                    alert.severity === 'Medium' ? 'text-yellow-500' :
                    'text-green-500'
                  }`}>{alert.severity}</span>
                  , Status: {alert.status}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No alerts available.</p>
        )}
      </div>
    </div>
  );
}
