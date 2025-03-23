'use client';
import Head from "next/head";
import { useState, useEffect } from "react";
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import RoleBasedLayout from '@/components/RoleBasedLayout';

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        if (!user?.token) return;

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/analytics/dashboard`,
          config
        );

        setDashboardData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setIsLoading(false);
      }
    };

    if (user) {
      fetchDashboardStats();
    }
  }, [user]);

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
      <Head>
        <title>Dashboard</title>
      </Head>
      <div className="p-6 pt-10 pl-8 w-full">
        <div className="bg-white overflow-hidden shadow-lg rounded-lg mb-8 w-full">
          <div className="p-6 bg-[#0c3948] text-white">
            <h2 className="text-2xl font-bold">Welcome to your dashboard, {user.name}!</h2>
            <p className="mt-2 text-indigo-100">We&apos;re glad to have you here. This is your secure personal space.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-gray-500">Patients</h3>
            <p className="text-2xl font-bold">
              {dashboardData ? dashboardData.patientStats.total : '...'}
            </p>
            <p className="text-green-500">Recent Activity</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-gray-500">Alerts</h3>
            <p className="text-2xl font-bold">
              {dashboardData ? 
                (dashboardData.alertStats?.byStatus?.New || 0) + 
                (dashboardData.alertStats?.byStatus?.Acknowledged || 0) : 
                '...'}
            </p>
            <p className="text-amber-500">Need attention</p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 w-full">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-gray-500">Patient Status</h3>
            <div className="h-32 bg-[#f2f4ea] mt-4 rounded p-4">
              {dashboardData && dashboardData.criticalPatients && (
                <div>
                  <h4 className="font-semibold">Critical Patients: {dashboardData.criticalPatients.length}</h4>
                  <ul className="mt-2">
                    {dashboardData.criticalPatients.map((patient, index) => (
                      <li key={index} className="text-sm text-red-600">
                        {patient.firstName} {patient.lastName} - {patient.chronicDisease || 'No condition specified'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </RoleBasedLayout>
  );
}
