'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DoctorDashboardLayout from '@/components/DoctorDashboardLayout';
import {
  BarChart,
  PieChart,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  Pie,
  Line,
  Cell,
  ResponsiveContainer
} from 'recharts';
import {
  BarChart2,
  PieChart as PieChartIcon,
  TrendingUp,
  Users,
  Calendar,
  AlertCircle,
  Activity,
  Clock,
  Loader,
  Heart,
  Thermometer,
  Droplet,
  RefreshCw,
  ChevronDown,
  CheckCircle,
  XCircle
} from 'lucide-react';

export default function AnalyticsDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  
  // State for all analytics data
  const [dashboardStats, setDashboardStats] = useState(null);
  const [patientTrends, setPatientTrends] = useState(null);
  const [vitalStats, setVitalStats] = useState(null);
  const [appointmentStats, setAppointmentStats] = useState(null);
  
  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [activeTimeRange, setActiveTimeRange] = useState('monthly');
  const [expandedSections, setExpandedSections] = useState({
    patients: true,
    vitals: true,
    appointments: true,
    alerts: true
  });
  
  // For refreshing data
  const [refreshing, setRefreshing] = useState({
    dashboard: false,
    patients: false,
    vitals: false,
    appointments: false
  });
  
  // Theme colors for charts
  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
  const SUCCESS_COLOR = '#10B981';
  const WARNING_COLOR = '#F59E0B';
  const DANGER_COLOR = '#EF4444';
  const PRIMARY_COLOR = '#4F46E5';
  
  // Fetch all analytics data on component mount
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (user.role !== 'doctor') {
      router.push('/patient-dashboard');
      return;
    }
    
    fetchAllAnalytics();
  }, [user, router]);
  
  // Fetch patient trends when time range changes
  useEffect(() => {
    if (user) {
      fetchPatientTrends();
    }
  }, [activeTimeRange, user]);
  
  // Fetch all analytics data
  const fetchAllAnalytics = async () => {
    setIsLoading(true);
    
    try {
      await Promise.all([
        fetchDashboardStats(),
        fetchPatientTrends(),
        fetchVitalStats(),
        fetchAppointmentStats()
      ]);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Individual fetch functions for refreshing specific sections
  const fetchDashboardStats = async () => {
    try {
      setRefreshing(prev => ({ ...prev, dashboard: true }));
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/analytics/dashboard`,
        config
      );
      
      setDashboardStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setRefreshing(prev => ({ ...prev, dashboard: false }));
    }
  };
  
  const fetchPatientTrends = async () => {
    try {
      setRefreshing(prev => ({ ...prev, patients: true }));
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/analytics/patient-trends?period=${activeTimeRange}`,
        config
      );
      
      setPatientTrends(response.data);
    } catch (error) {
      console.error('Error fetching patient trends:', error);
    } finally {
      setRefreshing(prev => ({ ...prev, patients: false }));
    }
  };
  
  const fetchVitalStats = async () => {
    try {
      setRefreshing(prev => ({ ...prev, vitals: true }));
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/analytics/vital-stats`,
        config
      );
      
      setVitalStats(response.data);
    } catch (error) {
      console.error('Error fetching vital statistics:', error);
    } finally {
      setRefreshing(prev => ({ ...prev, vitals: false }));
    }
  };
  
  const fetchAppointmentStats = async () => {
    try {
      setRefreshing(prev => ({ ...prev, appointments: true }));
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/analytics/appointment-stats`,
        config
      );
      
      setAppointmentStats(response.data);
    } catch (error) {
      console.error('Error fetching appointment statistics:', error);
    } finally {
      setRefreshing(prev => ({ ...prev, appointments: false }));
    }
  };
  
  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Handle time range change for patient trends
  const handleTimeRangeChange = (range) => {
    setActiveTimeRange(range);
  };
  
  // Prepare data for patient status pie chart
  const preparePatientStatusData = () => {
    if (!dashboardStats?.patientStats?.byStatus) return [];
    
    return Object.entries(dashboardStats.patientStats.byStatus).map(([status, count], index) => ({
      name: status,
      value: count,
      color: COLORS[index % COLORS.length]
    }));
  };
  
  // Prepare data for alert status pie chart
  const prepareAlertStatusData = () => {
    if (!dashboardStats?.alertStats?.byStatus) return [];
    
    return Object.entries(dashboardStats.alertStats.byStatus).map(([status, count], index) => ({
      name: status,
      value: count,
      color: status === 'New' ? DANGER_COLOR : 
             status === 'Acknowledged' ? WARNING_COLOR : SUCCESS_COLOR
    }));
  };
  
  // Prepare data for vital type alerts bar chart
  const prepareVitalTypeData = () => {
    if (!vitalStats?.alertsByVitalType) return [];
    
    return Object.entries(vitalStats.alertsByVitalType)
      .filter(([_, count]) => count > 0)
      .map(([type, count]) => ({
        name: type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1').trim(),
        value: count
      }));
  };
  
  // Prepare data for appointments by day of week
  const prepareAppointmentsByDayData = () => {
    if (!appointmentStats?.byDayOfWeek) return [];
    
    return appointmentStats.byDayOfWeek.map(item => ({
      name: item.day.substring(0, 3), // Abbreviate day names
      value: item.count
    }));
  };
  
  // Prepare data for appointments by type
  const prepareAppointmentsByTypeData = () => {
    if (!appointmentStats?.byType) return [];
    
    return Object.entries(appointmentStats.byType).map(([type, count], index) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1).replace(/[-_]/g, ' '),
      value: count,
      color: COLORS[index % COLORS.length]
    }));
  };
  
  // Calculate percentage change helper
  const calculatePercentage = (current, previous) => {
    if (!previous) return null;
    const change = ((current - previous) / previous) * 100;
    return change.toFixed(1);
  };
  
  // Loading state
  if (isLoading) {
    return (
      <DoctorDashboardLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <Loader className="h-10 w-10 text-indigo-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading analytics data...</p>
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
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <BarChart2 className="h-6 w-6 mr-2 text-indigo-600" />
              Analytics Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Comprehensive insights into your practice and patient health
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={fetchAllAnalytics}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Data
            </button>
          </div>
        </div>
        
        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {/* Total Patients Card */}
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {dashboardStats?.patientStats?.total || 0}
                </p>
              </div>
              <div className="bg-indigo-100 h-12 w-12 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs font-medium">
              <span className="text-green-500 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                12%
              </span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </div>
          
          {/* Active Alerts */}
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Active Alerts</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {(dashboardStats?.alertStats?.byStatus?.New || 0) + 
                   (dashboardStats?.alertStats?.byStatus?.Acknowledged || 0)}
                </p>
              </div>
              <div className="bg-red-100 h-12 w-12 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs font-medium">
              <span className="text-green-500 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                8%
              </span>
              <span className="text-gray-500 ml-1">decrease from last week</span>
            </div>
          </div>
          
          {/* Appointment Completion */}
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Appointments</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {appointmentStats?.total || 0}
                </p>
              </div>
              <div className="bg-blue-100 h-12 w-12 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs font-medium">
              <span className="text-gray-500">
                {appointmentStats?.byStatus?.confirmed || 0} completed
              </span>
            </div>
          </div>
          
          {/* Average Vitals Health Score */}
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Critical Patients</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {dashboardStats?.criticalPatients?.length || 0}
                </p>
              </div>
              <div className="bg-orange-100 h-12 w-12 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs font-medium">
              <span className="text-green-500 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                5%
              </span>
              <span className="text-gray-500 ml-1">decrease from last month</span>
            </div>
          </div>
        </div>
        
        {/* Patient Analysis Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div 
            className="px-6 py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('patients')}
          >
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-2 text-indigo-600" />
              Patient Analysis
            </h2>
            <button className="text-gray-400 focus:outline-none">
              <ChevronDown 
                className={`h-5 w-5 transform transition-transform duration-200 ${
                  expandedSections.patients ? 'rotate-180' : ''
                }`} 
              />
            </button>
          </div>
          
          {expandedSections.patients && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Patient Growth Trend */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-gray-700">Patient Growth Trend</h3>
                    <div className="flex text-xs">
                      <button
                        onClick={() => handleTimeRangeChange('daily')}
                        className={`px-2 py-1 rounded-l-md ${
                          activeTimeRange === 'daily' 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        Daily
                      </button>
                      <button
                        onClick={() => handleTimeRangeChange('weekly')}
                        className={`px-2 py-1 ${
                          activeTimeRange === 'weekly' 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        Weekly
                      </button>
                      <button
                        onClick={() => handleTimeRangeChange('monthly')}
                        className={`px-2 py-1 rounded-r-md ${
                          activeTimeRange === 'monthly' 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        Monthly
                      </button>
                    </div>
                  </div>
                  
                  <div className="h-64 relative">
                    {refreshing.patients ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                        <Loader className="h-6 w-6 text-indigo-600 animate-spin" />
                      </div>
                    ) : null}
                    
                    {patientTrends?.patientTrends?.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={patientTrends.patientTrends}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="period" 
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => {
                              // Format based on time range
                              if (activeTimeRange === 'daily') {
                                return value.slice(-5); // Just show MM-DD
                              } else if (activeTimeRange === 'weekly') {
                                return `W${value.slice(-2)}`; // Week number
                              } else {
                                return value.slice(-2); // Just show MM for month
                              }
                            }}  
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip 
                            formatter={(value) => [`${value} patients`, 'New Patients']}
                            labelFormatter={(label) => {
                              if (activeTimeRange === 'daily') {
                                return `Date: ${label}`;
                              } else if (activeTimeRange === 'weekly') {
                                return `Week: ${label}`;
                              } else {
                                return `Month: ${label}`;
                              }
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="count" 
                            stroke={PRIMARY_COLOR} 
                            activeDot={{ r: 8 }} 
                            name="New Patients"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-500">
                        <p>No patient trend data available</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Patient Distribution */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-gray-700">Patient Status Distribution</h3>
                    <button 
                      onClick={fetchDashboardStats} 
                      className="text-indigo-600 text-xs hover:text-indigo-800 flex items-center"
                    >
                      <RefreshCw className={`h-3 w-3 mr-1 ${refreshing.dashboard ? 'animate-spin' : ''}`} />
                      Refresh
                    </button>
                  </div>
                  
                  <div className="h-64 relative">
                    {refreshing.dashboard ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                        <Loader className="h-6 w-6 text-indigo-600 animate-spin" />
                      </div>
                    ) : null}
                    
                    {preparePatientStatusData().length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={preparePatientStatusData()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {preparePatientStatusData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} patients`, 'Count']} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-500">
                        <p>No patient distribution data available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Critical Patients Table */}
              {dashboardStats?.criticalPatients?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Critical Patients</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Patient
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Age
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Condition
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Updated
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {dashboardStats.criticalPatients.map((patient, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                                  <span className="text-xs font-medium text-red-800">
                                    {patient.firstName?.charAt(0) || ''}{patient.lastName?.charAt(0) || ''}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {patient.firstName} {patient.lastName}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {patient.age}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {patient.chronicDisease || 'Not specified'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {patient.latestVitals?.updatedAt 
                                ? new Date(patient.latestVitals.updatedAt).toLocaleString() 
                                : 'Not available'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Vital Signs Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div 
            className="px-6 py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('vitals')}
          >
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-red-600" />
              Vital Signs Analysis
            </h2>
            <button className="text-gray-400 focus:outline-none">
              <ChevronDown 
                className={`h-5 w-5 transform transition-transform duration-200 ${
                  expandedSections.vitals ? 'rotate-180' : ''
                }`} 
              />
            </button>
          </div>
          
          {expandedSections.vitals && (
            <div className="p-6">
              {/* Average Vital Signs Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Temperature Card */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Average Temperature</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {vitalStats?.averageVitals?.temperature || '--'} °C
                      </p>
                    </div>
                    <div className="bg-red-100 h-10 w-10 rounded-lg flex items-center justify-center">
                      <Thermometer className="h-5 w-5 text-red-600" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Normal range: 36.1°C - 37.2°C
                  </p>
                </div>
                
                {/* Heart Rate Card */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Average Heart Rate</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {vitalStats?.averageVitals?.heartRate || '--'} bpm
                      </p>
                    </div>
                    <div className="bg-pink-100 h-10 w-10 rounded-lg flex items-center justify-center">
                      <Heart className="h-5 w-5 text-pink-600" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Normal range: 60 - 100 bpm
                  </p>
                </div>
                
                {/* Oxygen Saturation Card */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Average Oxygen Saturation</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {vitalStats?.averageVitals?.oxygenSaturation || '--'} %
                      </p>
                    </div>
                    <div className="bg-blue-100 h-10 w-10 rounded-lg flex items-center justify-center">
                      <Droplet className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Normal range: 95% - 100%
                  </p>
                </div>
              </div>
              
              {/* Vital Sign Alerts Chart */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium text-gray-700">Vital Sign Alerts Distribution</h3>
                  <button 
                    onClick={fetchVitalStats} 
                    className="text-indigo-600 text-xs hover:text-indigo-800 flex items-center"
                  >
                    <RefreshCw className={`h-3 w-3 mr-1 ${refreshing.vitals ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
                
                <div className="h-64 relative">
                  {refreshing.vitals ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                      <Loader className="h-6 w-6 text-indigo-600 animate-spin" />
                    </div>
                  ) : null}
                  
                  {prepareVitalTypeData().length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={prepareVitalTypeData()}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} alerts`, 'Count']} />
                        <Legend />
                        <Bar dataKey="value" name="Alert Count" fill={PRIMARY_COLOR} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      <p>No vital sign alert data available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Appointment Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div 
            className="px-6 py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('appointments')}
          >
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Appointment Analysis
            </h2>
            <button className="text-gray-400 focus:outline-none">
              <ChevronDown 
                className={`h-5 w-5 transform transition-transform duration-200 ${
                  expandedSections.appointments ? 'rotate-180' : ''
                }`} 
              />
            </button>
          </div>
          
          {expandedSections.appointments && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Appointments by Day of Week */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-gray-700">Appointments by Day of Week</h3>
                    <button 
                      onClick={fetchAppointmentStats} 
                      className="text-indigo-600 text-xs hover:text-indigo-800 flex items-center"
                    >
                      <RefreshCw className={`h-3 w-3 mr-1 ${refreshing.appointments ? 'animate-spin' : ''}`} />
                      Refresh
                    </button>
                  </div>
                  
                  <div className="h-64 relative">
                    {refreshing.appointments ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                        <Loader className="h-6 w-6 text-indigo-600 animate-spin" />
                      </div>
                    ) : null}
                    
                    {prepareAppointmentsByDayData().length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={prepareAppointmentsByDayData()}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value} appointments`, 'Count']} />
                          <Bar dataKey="value" name="Appointments" fill={PRIMARY_COLOR} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-500">
                        <p>No appointment day data available</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Appointments by Type */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-gray-700">Appointments by Type</h3>
                    <div className="text-xs text-gray-500">
                      Total: {appointmentStats?.total || 0}
                    </div>
                  </div>
                  
                  <div className="h-64 relative">
                    {refreshing.appointments ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                        <Loader className="h-6 w-6 text-indigo-600 animate-spin" />
                      </div>
                    ) : null}
                    
                    {prepareAppointmentsByTypeData().length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={prepareAppointmentsByTypeData()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {prepareAppointmentsByTypeData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} appointments`, 'Count']} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-500">
                        <p>No appointment type data available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Appointment Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {/* Confirmed Appointments */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Confirmed Appointments</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {appointmentStats?.byStatus?.confirmed || 0}
                      </p>
                    </div>
                    <div className="bg-green-100 h-10 w-10 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {appointmentStats?.total ? 
                      `${Math.round((appointmentStats.byStatus.confirmed || 0) / appointmentStats.total * 100)}% of total` : 
                      '0% of total'}
                  </p>
                </div>
                
                {/* Pending Appointments */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Pending Appointments</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {appointmentStats?.byStatus?.pending || 0}
                      </p>
                    </div>
                    <div className="bg-yellow-100 h-10 w-10 rounded-lg flex items-center justify-center">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {appointmentStats?.total ? 
                      `${Math.round((appointmentStats.byStatus.pending || 0) / appointmentStats.total * 100)}% of total` : 
                      '0% of total'}
                  </p>
                </div>
                
                {/* Cancelled Appointments */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Cancelled Appointments</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {appointmentStats?.byStatus?.cancelled || 0}
                      </p>
                    </div>
                    <div className="bg-red-100 h-10 w-10 rounded-lg flex items-center justify-center">
                      <XCircle className="h-5 w-5 text-red-600" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {appointmentStats?.total ? 
                      `${Math.round((appointmentStats.byStatus.cancelled || 0) / appointmentStats.total * 100)}% of total` : 
                      '0% of total'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Alert Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div 
            className="px-6 py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('alerts')}
          >
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
              Alert Analysis
            </h2>
            <button className="text-gray-400 focus:outline-none">
              <ChevronDown 
                className={`h-5 w-5 transform transition-transform duration-200 ${
                  expandedSections.alerts ? 'rotate-180' : ''
                }`} 
              />
            </button>
          </div>
          
          {expandedSections.alerts && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Alert Status Distribution */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-gray-700">Alert Status Distribution</h3>
                    <button 
                      onClick={fetchDashboardStats} 
                      className="text-indigo-600 text-xs hover:text-indigo-800 flex items-center"
                    >
                      <RefreshCw className={`h-3 w-3 mr-1 ${refreshing.dashboard ? 'animate-spin' : ''}`} />
                      Refresh
                    </button>
                  </div>
                  
                  <div className="h-64 relative">
                    {refreshing.dashboard ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                        <Loader className="h-6 w-6 text-indigo-600 animate-spin" />
                      </div>
                    ) : null}
                    
                    {prepareAlertStatusData().length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={prepareAlertStatusData()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {prepareAlertStatusData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} alerts`, 'Count']} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-500">
                        <p>No alert status data available</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Alert Response Time */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-gray-700">Alert Status Summary</h3>
                  </div>
                  
                  <div className="h-64 flex flex-col justify-center">
                    <div className="grid grid-cols-1 gap-4">
                      {/* New Alerts Card */}
                      <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-red-100 h-10 w-10 rounded-lg flex items-center justify-center mr-3">
                              <AlertCircle className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">New Alerts</p>
                              <p className="text-xs text-gray-500">Require immediate attention</p>
                            </div>
                          </div>
                          <p className="text-2xl font-bold text-gray-900">
                            {dashboardStats?.alertStats?.byStatus?.New || 0}
                          </p>
                        </div>
                      </div>
                      
                      {/* Acknowledged Alerts Card */}
                      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-yellow-100 h-10 w-10 rounded-lg flex items-center justify-center mr-3">
                              <Clock className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Acknowledged Alerts</p>
                              <p className="text-xs text-gray-500">In progress</p>
                            </div>
                          </div>
                          <p className="text-2xl font-bold text-gray-900">
                            {dashboardStats?.alertStats?.byStatus?.Acknowledged || 0}
                          </p>
                        </div>
                      </div>
                      
                      {/* Resolved Alerts Card */}
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-green-100 h-10 w-10 rounded-lg flex items-center justify-center mr-3">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Resolved Alerts</p>
                              <p className="text-xs text-gray-500">Successfully addressed</p>
                            </div>
                          </div>
                          <p className="text-2xl font-bold text-gray-900">
                            {dashboardStats?.alertStats?.byStatus?.Resolved || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DoctorDashboardLayout>
  );
}