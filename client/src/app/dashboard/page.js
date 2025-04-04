'use client';

import { useState, useEffect } from "react";
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DoctorDashboardLayout from '@/components/DoctorDashboardLayout';
import Link from 'next/link';
import { Bell, Calendar, Users, User, Activity, TrendingUp, ArrowUp, ArrowDown, Loader, Plus, FileText, ClipboardList, AlertCircle } from 'lucide-react';

export default function DoctorDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // Sample data for upcoming appointments
  const upcomingAppointments = [
    { id: 1, patient: "John Smith", date: "Today, 10:00 AM", purpose: "Checkup", avatar: "/images/avatars/1.jpg" },
    { id: 2, patient: "Emily Johnson", date: "Tomorrow, 2:30 PM", purpose: "Follow-up", avatar: "/images/avatars/2.jpg" },
    { id: 3, patient: "Michael Davis", date: "Mar 25, 9:15 AM", purpose: "Consultation", avatar: "/images/avatars/3.jpg" },
  ];

  // Guard to prevent accessing properties on null user
  if (!loading && !user) {
    return null;
  }

  // Sample data for upcoming appointments

  // Sample data for recent activities
  const recentActivities = [
    { id: 1, type: 'vitals', patient: "John Smith", action: "Recorded vitals", time: "2 hours ago", status: "normal" },
    { id: 2, type: 'alert', patient: "Emily Johnson", action: "Low blood pressure alert", time: "1 day ago", status: "critical" },
    { id: 3, type: 'appointment', patient: "Michael Davis", action: "Missed appointment", time: "2 days ago", status: "warning" },
  ];

  if (isLoading) {
    return (
      <DoctorDashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
          <p className="ml-2 text-gray-600">Loading dashboard data...</p>
        </div>
      </DoctorDashboardLayout>
    );
  }

  return (
    <DoctorDashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, Dr. {user?.name.split(' ')[0]}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Here&apos;s an overview of your practice and patients.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link 
              href="/dashboard/patients/add_patient" 
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Patient
            </Link>
            <Link 
              href="/dashboard/alerts" 
              className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Bell className="w-4 h-4 mr-2" />
              View Alerts
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Patients Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Patients</p>
                <h3 className="text-2xl font-bold mt-2 text-gray-800">
                  {dashboardData?.patientStats?.total || '0'}
                </h3>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Users className="text-blue-600 h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs font-medium">
              <ArrowUp className="text-green-500 h-4 w-4 mr-1" />
              <span className="text-green-500">12%</span>
              <span className="text-gray-500 ml-2">from last month</span>
            </div>
          </div>

          {/* Active Alerts Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Alerts</p>
                <h3 className="text-2xl font-bold mt-2 text-gray-800">
                  {dashboardData ? 
                    (dashboardData.alertStats?.byStatus?.New || 0) + 
                    (dashboardData.alertStats?.byStatus?.Acknowledged || 0) : '0'}
                </h3>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <Bell className="text-red-600 h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs font-medium">
              <ArrowDown className="text-green-500 h-4 w-4 mr-1" />
              <span className="text-green-500">8%</span>
              <span className="text-gray-500 ml-2">fewer than last week</span>
            </div>
          </div>

          {/* Consultations Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Consultations</p>
                <h3 className="text-2xl font-bold mt-2 text-gray-800">28</h3>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <Calendar className="text-purple-600 h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs font-medium">
              <ArrowUp className="text-green-500 h-4 w-4 mr-1" />
              <span className="text-green-500">4%</span>
              <span className="text-gray-500 ml-2">from last week</span>
            </div>
          </div>

          {/* Critical Patients Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Critical Patients</p>
                <h3 className="text-2xl font-bold mt-2 text-gray-800">
                  {dashboardData?.criticalPatients?.length || '0'}
                </h3>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <Activity className="text-orange-600 h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs font-medium">
              <ArrowDown className="text-green-500 h-4 w-4 mr-1" />
              <span className="text-green-500">3%</span>
              <span className="text-gray-500 ml-2">decrease this week</span>
            </div>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Critical Patients Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-semibold text-lg text-gray-800">Critical Patients</h2>
              <Link href="/dashboard/patients/manage_patients" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                View All
              </Link>
            </div>
            <div className="p-6">
              {dashboardData && dashboardData.criticalPatients && dashboardData.criticalPatients.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {dashboardData.criticalPatients.map((patient, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-indigo-700 font-medium">
                                  {patient.firstName?.charAt(0) || ''}{patient.lastName?.charAt(0) || ''}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{patient.firstName} {patient.lastName}</div>
                                <div className="text-sm text-gray-500">{patient.age} years old</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{patient.chronicDisease || 'No condition specified'}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Critical
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <Link 
                              href={`/dashboard/patients/vitals/${patient._id}`}
                              className="text-indigo-600 hover:text-indigo-900"
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
                  <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                    <AlertCircle className="h-12 w-12" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No critical patients</h3>
                  <p className="text-gray-500">All your patients are in stable condition.</p>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-lg text-gray-800">Upcoming Appointments</h2>
            </div>
            <div className="p-5">
              <ul className="divide-y divide-gray-100">
                {upcomingAppointments.map((appointment) => (
                  <li key={appointment.id} className="py-3">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-700 font-medium">
                          {appointment.patient.split(' ')[0]?.[0]}{appointment.patient.split(' ')[1]?.[0]}
                        </span>
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {appointment.patient}
                        </p>
                        <div className="flex justify-between">
                          <p className="text-xs text-gray-500">
                            {appointment.date}
                          </p>
                          <p className="text-xs font-medium text-indigo-600">
                            {appointment.purpose}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-5">
                <button className="w-full py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition duration-200">
                  View All Appointments
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-semibold text-lg text-gray-800">Recent Activity</h2>
            <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              View All
            </button>
          </div>
          <div className="p-6">
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivities.map((activity, index) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {index !== recentActivities.length - 1 ? (
                        <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                      ) : null}
                      <div className="relative flex items-start space-x-3">
                        <div className={`relative h-10 w-10 rounded-full flex items-center justify-center
                          ${activity.status === 'critical' ? 'bg-red-100' : 
                            activity.status === 'warning' ? 'bg-yellow-100' : 'bg-green-100'}`}>
                          {activity.type === 'vitals' ? (
                            <Activity className={`h-5 w-5 ${activity.status === 'critical' ? 'text-red-600' : 
                              activity.status === 'warning' ? 'text-yellow-600' : 'text-green-600'}`} />
                          ) : activity.type === 'alert' ? (
                            <Bell className={`h-5 w-5 ${activity.status === 'critical' ? 'text-red-600' : 
                              activity.status === 'warning' ? 'text-yellow-600' : 'text-green-600'}`} />
                          ) : (
                            <Calendar className={`h-5 w-5 ${activity.status === 'critical' ? 'text-red-600' : 
                              activity.status === 'warning' ? 'text-yellow-600' : 'text-green-600'}`} />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {activity.patient}
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500">
                              {activity.time}
                            </p>
                          </div>
                          <div className="mt-2 text-sm text-gray-700">
                            <p>{activity.action}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DoctorDashboardLayout>
  );
}