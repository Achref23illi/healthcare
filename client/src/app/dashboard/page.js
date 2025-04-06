'use client';

import { useState, useEffect } from "react";
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DoctorDashboardLayout from '@/components/DoctorDashboardLayout';
import Link from 'next/link';
import { 
  Bell, Calendar, Users, User, Activity, TrendingUp, ArrowUp, ArrowDown, 
  Loader, Plus, FileText, ClipboardList, AlertCircle, Thermometer,
  Heart, Clock, Clipboard, Zap, UserPlus, ChevronRight, CheckCircle
} from 'lucide-react';

export default function DoctorDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Format the current date and time
  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

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

  // Sample data for recent activities
  const recentActivities = [
    { id: 1, type: 'vitals', patient: "John Smith", action: "Recorded vitals", time: "2 hours ago", status: "normal" },
    { id: 2, type: 'alert', patient: "Emily Johnson", action: "Low blood pressure alert", time: "1 day ago", status: "critical" },
    { id: 3, type: 'appointment', patient: "Michael Davis", action: "Missed appointment", time: "2 days ago", status: "warning" },
    { id: 4, type: 'vitals', patient: "Sarah Wilson", action: "Updated patient history", time: "3 days ago", status: "normal" },
  ];

  // Enhanced loading state
  if (isLoading) {
    return (
      <DoctorDashboardLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-indigo-600 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full bg-white"></div>
            </div>
          </div>
          <p className="mt-6 text-gray-700 font-medium">Loading your dashboard...</p>
        </div>
      </DoctorDashboardLayout>
    );
  }

  return (
    <DoctorDashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Page Header with Greeting and Date */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl shadow-md mb-6 overflow-hidden">
          <div className="px-6 py-8 md:px-10 md:flex md:justify-between md:items-center">
            <div>
              <div className="flex items-center">
                <Thermometer className="h-7 w-7 mr-3 text-indigo-200" />
                <h1 className="text-2xl md:text-3xl font-bold">
                  Welcome back, Dr. {user?.name.split(' ')[0]}
                </h1>
              </div>
              <p className="mt-2 text-indigo-100 max-w-lg">
                {formattedDate} • You have {dashboardData?.alertStats?.byStatus?.New || 0} new alerts and {upcomingAppointments.length} upcoming appointments today.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Link 
                href="/dashboard/patients/add_patient" 
                className="flex items-center px-4 py-2 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 transition-all duration-200 shadow-sm"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                New Patient
              </Link>
              <Link 
                href="/dashboard/appointments" 
                className="flex items-center px-4 py-2 bg-indigo-500 bg-opacity-30 backdrop-blur-sm text-white border border-indigo-400 border-opacity-30 rounded-lg hover:bg-opacity-40 transition-all duration-200"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule
              </Link>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Patients Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 relative overflow-hidden group">
            <div className="absolute right-0 top-0 h-24 w-24 bg-blue-50 rounded-bl-full transform translate-x-6 -translate-y-6 group-hover:translate-x-4 group-hover:-translate-y-4 transition-all duration-300"></div>
            <div className="relative">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Patients</p>
                  <h3 className="text-3xl font-bold mt-2 text-gray-800">
                    {dashboardData?.patientStats?.total || '0'}
                  </h3>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg shadow-sm">
                  <Users className="text-blue-600 h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs font-medium">
                <span className="flex items-center text-green-500 bg-green-50 px-2 py-1 rounded-full">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  12%
                </span>
                <span className="text-gray-500 ml-2">from last month</span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link href="/dashboard/patients/manage_patients" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                  View all patients
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* Active Alerts Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 relative overflow-hidden group">
            <div className="absolute right-0 top-0 h-24 w-24 bg-red-50 rounded-bl-full transform translate-x-6 -translate-y-6 group-hover:translate-x-4 group-hover:-translate-y-4 transition-all duration-300"></div>
            <div className="relative">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Alerts</p>
                  <h3 className="text-3xl font-bold mt-2 text-gray-800">
                    {dashboardData ? 
                      (dashboardData.alertStats?.byStatus?.New || 0) + 
                      (dashboardData.alertStats?.byStatus?.Acknowledged || 0) : '0'}
                  </h3>
                </div>
                <div className="bg-red-100 p-3 rounded-lg shadow-sm">
                  <Bell className="text-red-600 h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs font-medium">
                <span className="flex items-center text-green-500 bg-green-50 px-2 py-1 rounded-full">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  8%
                </span>
                <span className="text-gray-500 ml-2">fewer than last week</span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link href="/dashboard/alerts" className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center">
                  View all alerts
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* Consultations Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 relative overflow-hidden group">
            <div className="absolute right-0 top-0 h-24 w-24 bg-purple-50 rounded-bl-full transform translate-x-6 -translate-y-6 group-hover:translate-x-4 group-hover:-translate-y-4 transition-all duration-300"></div>
            <div className="relative">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Consultations</p>
                  <h3 className="text-3xl font-bold mt-2 text-gray-800">28</h3>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg shadow-sm">
                  <FileText className="text-purple-600 h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs font-medium">
                <span className="flex items-center text-green-500 bg-green-50 px-2 py-1 rounded-full">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  4%
                </span>
                <span className="text-gray-500 ml-2">from last week</span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link href="/dashboard/appointments" className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center">
                  View consultations
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* Critical Patients Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 relative overflow-hidden group">
            <div className="absolute right-0 top-0 h-24 w-24 bg-orange-50 rounded-bl-full transform translate-x-6 -translate-y-6 group-hover:translate-x-4 group-hover:-translate-y-4 transition-all duration-300"></div>
            <div className="relative">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Critical Patients</p>
                  <h3 className="text-3xl font-bold mt-2 text-gray-800">
                    {dashboardData?.criticalPatients?.length || '0'}
                  </h3>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg shadow-sm">
                  <Zap className="text-orange-600 h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs font-medium">
                <span className="flex items-center text-green-500 bg-green-50 px-2 py-1 rounded-full">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  3%
                </span>
                <span className="text-gray-500 ml-2">decrease this week</span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button className="text-orange-600 hover:text-orange-800 text-sm font-medium flex items-center">
                  View details
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Critical Patients Section with enhanced design */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 lg:col-span-2 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center">
                <Heart className="h-5 w-5 text-red-500 mr-2" />
                <h2 className="font-semibold text-lg text-gray-800">Critical Patients</h2>
              </div>
              <Link href="/dashboard/patients/manage_patients" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="p-6">
              {dashboardData && dashboardData.criticalPatients && dashboardData.criticalPatients.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-gray-200">
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
                        <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-red-100 to-orange-100 flex items-center justify-center">
                                <span className="text-red-700 font-medium">
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
                            <div className="text-xs text-gray-500">Last updated: 2 hours ago</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Critical
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <Link 
                              href={`/dashboard/patients/vitals/${patient._id}`}
                              className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded-md hover:bg-indigo-100 transition-colors duration-150"
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
                  <div className="mx-auto h-16 w-16 text-gray-400 mb-4 bg-gray-50 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No critical patients</h3>
                  <p className="text-gray-500">All your patients are in stable condition.</p>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Upcoming Appointments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-indigo-500 mr-2" />
                <h2 className="font-semibold text-lg text-gray-800">Upcoming Appointments</h2>
              </div>
            </div>
            <div className="p-6">
              <ul className="divide-y divide-gray-100">
                {upcomingAppointments.map((appointment) => (
                  <li key={appointment.id} className="py-4 hover:bg-gray-50 px-4 rounded-lg -mx-4 transition-colors duration-150">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-indigo-100 to-blue-100 flex items-center justify-center border border-indigo-200">
                        <span className="text-indigo-700 font-medium">
                          {appointment.patient.split(' ')[0]?.[0]}{appointment.patient.split(' ')[1]?.[0]}
                        </span>
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {appointment.patient}
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1 text-gray-400" />
                            {appointment.date}
                          </div>
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                            {appointment.purpose}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link href="/dashboard/appointments" className="w-full py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all duration-200 flex items-center justify-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  View All Appointments
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Recent Activity with Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center">
              <Activity className="h-5 w-5 text-indigo-500 mr-2" />
              <h2 className="font-semibold text-lg text-gray-800">Recent Activity</h2>
            </div>
            <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="p-6">
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivities.map((activity, index) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {index !== recentActivities.length - 1 ? (
                        <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-indigo-100" aria-hidden="true"></span>
                      ) : null}
                      <div className="relative flex items-start space-x-3">
                        <div className={`relative h-10 w-10 rounded-full flex items-center justify-center border
                          ${activity.status === 'critical' ? 'bg-red-100 border-red-200' : 
                            activity.status === 'warning' ? 'bg-yellow-100 border-yellow-200' : 'bg-green-100 border-green-200'}`}>
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
                        <div className="min-w-0 flex-1 bg-gray-50 rounded-lg p-3">
                          <div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-900">
                                {activity.patient}
                              </span>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                                ${activity.status === 'critical' ? 'bg-red-100 text-red-800' : 
                                  activity.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                {activity.status}
                              </span>
                            </div>
                            <p className="mt-0.5 text-xs text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {activity.time}
                            </p>
                          </div>
                          <div className="mt-2 text-sm text-gray-700">
                            <p>{activity.action}</p>
                          </div>
                          <div className="mt-2">
                            <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                              View details
                            </button>
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