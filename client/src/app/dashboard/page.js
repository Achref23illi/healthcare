'use client';
import { useState, useEffect } from "react";
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import RoleBasedLayout from '@/components/RoleBasedLayout';
import { Bell, Calendar, Users, Activity, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { user, loading } = useAuth();
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0c3948]"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  // Sample data for upcoming appointments - replace with actual data when available
  const upcomingAppointments = [
    { id: 1, patient: "John Smith", date: "Today, 10:00 AM", purpose: "Checkup" },
    { id: 2, patient: "Emily Johnson", date: "Tomorrow, 2:30 PM", purpose: "Follow-up" },
    { id: 3, patient: "Michael Davis", date: "Mar 25, 9:15 AM", purpose: "Consultation" },
  ];

  return (
    <RoleBasedLayout>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <div className="mb-8 bg-gradient-to-r from-[#0c3948] to-[#155e76] rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8 text-white">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
              Welcome back, {user.name}
            </h1>
            <p className="text-blue-50 mb-6">
              Here&apos;s what&apos;s happening with your patients today.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link 
                href="/dashboard/patients/add_patient" 
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Add New Patient
              </Link>
              <Link 
                href="/dashboard/alerts" 
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                View Alerts
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Patients Card */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Patients</p>
                <h3 className="text-2xl font-bold mt-2 text-gray-800">
                  {dashboardData ? dashboardData.patientStats.total : '0'}
                </h3>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Users className="text-[#0c3948] h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs font-medium">
              <ArrowUp className="text-green-500 h-4 w-4 mr-1" />
              <span className="text-green-500">12%</span>
              <span className="text-gray-500 ml-2">from last month</span>
            </div>
          </div>

          {/* Active Alerts Card */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">Active Alerts</p>
                <h3 className="text-2xl font-bold mt-2 text-gray-800">
                  {dashboardData ? 
                    (dashboardData.alertStats?.byStatus?.New || 0) + 
                    (dashboardData.alertStats?.byStatus?.Acknowledged || 0) : '0'}
                </h3>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <Bell className="text-red-500 h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs font-medium">
              <ArrowDown className="text-green-500 h-4 w-4 mr-1" />
              <span className="text-green-500">8%</span>
              <span className="text-gray-500 ml-2">fewer than last week</span>
            </div>
          </div>

          {/* Consultations Card */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">Consultations</p>
                <h3 className="text-2xl font-bold mt-2 text-gray-800">28</h3>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <Calendar className="text-purple-500 h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs font-medium">
              <ArrowUp className="text-green-500 h-4 w-4 mr-1" />
              <span className="text-green-500">4%</span>
              <span className="text-gray-500 ml-2">from last week</span>
            </div>
          </div>

          {/* Patient Health Card */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">Critical Patients</p>
                <h3 className="text-2xl font-bold mt-2 text-gray-800">
                  {dashboardData?.criticalPatients?.length || '0'}
                </h3>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <Activity className="text-orange-500 h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs font-medium">
              <ArrowDown className="text-green-500 h-4 w-4 mr-1" />
              <span className="text-green-500">3%</span>
              <span className="text-gray-500 ml-2">decrease this week</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Critical Patients */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden col-span-full lg:col-span-2">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Critical Patients</h3>
              <Link href="/dashboard/patients/manage_patients" className="text-sm text-[#0c3948] hover:text-[#155e76] font-medium">
                View All
              </Link>
            </div>
            <div className="p-6">
              {dashboardData && dashboardData.criticalPatients && dashboardData.criticalPatients.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {dashboardData.criticalPatients.map((patient, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{patient.firstName} {patient.lastName}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{patient.chronicDisease || 'No condition specified'}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Critical
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                            <Link 
                              href={`/dashboard/patients/vitals/${patient._id}`}
                              className="text-[#0c3948] hover:text-[#155e76]"
                            >
                              Record Vitals
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-gray-500">No critical patients at the moment.</p>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Upcoming Appointments</h3>
            </div>
            <div className="p-5">
              <ul className="divide-y divide-gray-100">
                {upcomingAppointments.map((appointment) => (
                  <li key={appointment.id} className="py-3">
                    <div className="flex items-start">
                      <div className="bg-blue-50 p-2 rounded-lg mr-3">
                        <Calendar className="h-4 w-4 text-[#0c3948]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {appointment.patient}
                        </p>
                        <p className="text-xs text-gray-500">
                          {appointment.date} - {appointment.purpose}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-5">
                <button className="w-full py-2 text-sm font-medium text-[#0c3948] bg-blue-50 hover:bg-blue-100 rounded-lg transition duration-200">
                  View All Appointments
                </button>
              </div>
            </div>
          </div>

          {/* Activity Feed - can be moved as needed */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden lg:col-span-3">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Recent Activity</h3>
              <button className="text-sm text-[#0c3948] hover:text-[#155e76] font-medium">
                View All
              </button>
            </div>
            <div className="p-6">
              <div className="flex space-x-4 mb-6">
                <div className="h-10 w-10 flex-shrink-0 bg-[#0c3948] rounded-full flex items-center justify-center text-white font-medium">
                  JS
                </div>
                <div>
                  <p className="text-sm text-gray-900 font-medium">
                    John Smith&apos;s oxygen levels have improved
                  </p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="flex space-x-4 mb-6">
                <div className="h-10 w-10 flex-shrink-0 bg-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                  EJ
                </div>
                <div>
                  <p className="text-sm text-gray-900 font-medium">
                    New patient Emily Johnson registered
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Yesterday at 3:45 PM</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="h-10 w-10 flex-shrink-0 bg-amber-500 rounded-full flex items-center justify-center text-white font-medium">
                  MD
                </div>
                <div>
                  <p className="text-sm text-gray-900 font-medium">
                    Michael Davis missed his appointment
                  </p>
                  <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleBasedLayout>
  );
}