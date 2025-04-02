'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DoctorDashboardLayout from '@/components/DoctorDashboardLayout';
import { 
  Calendar, 
  ArrowLeft, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Users, 
  CheckCircle, 
  XCircle, 
  Filter,
  AlertCircle,
  Search
} from 'lucide-react';

export default function AppointmentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  // State variables
  const [isLoading, setIsLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week'); // 'day', 'week', 'month'
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [filter, setFilter] = useState({
    status: 'all',
    search: ''
  });
  
  // Mock data for appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };
        
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/appointments`, config);
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
    
    if (user?.token) {
      fetchAppointments();
    }
  }, [user]);
  
  // Check authentication and role
  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'doctor') {
      router.push('/patient-dashboard');
    }
  }, [user, router]);
  
  // Function to navigate between dates
  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() + direction);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + (direction * 7));
    } else if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + direction);
    }
    setCurrentDate(newDate);
  };
  
  // Function to format date range for display
  const formatDateRange = () => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    
    if (view === 'day') {
      return currentDate.toLocaleDateString(undefined, options);
    } else if (view === 'week') {
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - currentDate.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      if (weekStart.getMonth() === weekEnd.getMonth()) {
        return `${weekStart.toLocaleDateString(undefined, { month: 'short' })} ${weekStart.getDate()} - ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
      } else {
        return `${weekStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString(undefined, options)}`;
      }
    } else if (view === 'month') {
      return currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    }
  };
  
  // Function to filter appointments
  const getFilteredAppointments = () => {
    return appointments.filter(appointment => {
      // Filter by status
      if (filter.status !== 'all' && appointment.status !== filter.status) {
        return false;
      }
      
      // Filter by search term
      if (filter.search && !appointment.patientName.toLowerCase().includes(filter.search.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  };
  
  // Function to get appointment time display
  const formatAppointmentTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Function to get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: <CheckCircle className="w-3 h-3 mr-1" />
        };
      case 'pending':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          icon: <Clock className="w-3 h-3 mr-1" />
        };
      case 'cancelled':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: <XCircle className="w-3 h-3 mr-1" />
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: null
        };
    }
  };

  // UI Component: New Appointment Modal (placeholder)
  const NewAppointmentModal = () => {
    if (!showNewAppointmentModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Schedule New Appointment</h2>
          <p className="text-gray-600 mb-4">This functionality requires backend implementation.</p>
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => setShowNewAppointmentModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DoctorDashboardLayout>
      <div className="h-full flex flex-col">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-indigo-500" />
              Appointment Management
            </h1>
            <p className="text-xs text-gray-500">
              Schedule and manage patient appointments
            </p>
          </div>
          <div className="flex items-center mt-2 md:mt-0 space-x-2">
            <button 
              onClick={() => setShowNewAppointmentModal(true)}
              className="inline-flex items-center px-3 py-2 text-xs border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-3 w-3 mr-1" />
              New Appointment
            </button>
            <button 
              onClick={() => router.back()}
              className="inline-flex items-center px-3 py-2 text-xs border border-gray-300 shadow-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              Back
            </button>
          </div>
        </div>

        {/* Main Content Area - Single Screen */}
        <div className="flex-1 flex overflow-hidden">
          <div className="w-full flex">
            {/* Left Panel - Calendar Controls */}
            <div className="w-64 pr-4 flex flex-col space-y-3">
              {/* Calendar Navigation */}
              <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-medium text-gray-700">Calendar</h3>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => navigateDate(-1)} 
                      className="p-1 rounded-md hover:bg-gray-100"
                    >
                      <ChevronLeft className="h-4 w-4 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => navigateDate(1)} 
                      className="p-1 rounded-md hover:bg-gray-100"
                    >
                      <ChevronRight className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
                
                <div className="text-sm font-medium text-gray-800 mb-3">
                  {formatDateRange()}
                </div>
                
                <div className="flex border rounded-md overflow-hidden text-xs">
                  <button 
                    onClick={() => setView('day')} 
                    className={`flex-1 py-1.5 ${view === 'day' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Day
                  </button>
                  <button 
                    onClick={() => setView('week')} 
                    className={`flex-1 py-1.5 ${view === 'week' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Week
                  </button>
                  <button 
                    onClick={() => setView('month')} 
                    className={`flex-1 py-1.5 ${view === 'month' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Month
                  </button>
                </div>
              </div>
              
              {/* Filters */}
              <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-medium text-gray-700">Filter Appointments</h3>
                  <Filter className="h-3 w-3 text-gray-500" />
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label htmlFor="statusFilter" className="block text-xs font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="statusFilter"
                      value={filter.status}
                      onChange={(e) => setFilter({...filter, status: e.target.value})}
                      className="block w-full text-xs pl-3 pr-10 py-1.5 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                    >
                      <option value="all">All Statuses</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="searchFilter" className="block text-xs font-medium text-gray-700 mb-1">
                      Search Patient
                    </label>
                    <div className="relative">
                      <Search className="h-3 w-3 absolute left-2 top-2 text-gray-400" />
                      <input 
                        type="text" 
                        id="searchFilter"
                        placeholder="Patient name..." 
                        className="pl-7 pr-3 py-1.5 text-xs w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={filter.search}
                        onChange={(e) => setFilter({...filter, search: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setFilter({status: 'all', search: ''})}
                    className="w-full text-xs py-1 text-center text-indigo-600 hover:text-indigo-800 focus:outline-none"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
              
              {/* Backend Status Notice */}
              <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                <div className="flex items-start">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="ml-2">
                    <p className="text-xs font-medium text-yellow-800">Backend Notice</p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Appointments functionality requires backend implementation. This UI shows example data.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Appointments List/Calendar */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 flex items-center">
                  Upcoming Appointments
                  <span className="ml-2 px-1.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {getFilteredAppointments().length}
                  </span>
                </h3>
              </div>
              
              {/* Appointments List */}
              <div className="overflow-auto max-h-[calc(100vh-260px)]">
                {getFilteredAppointments().length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Patient
                        </th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-xs">
                      {getFilteredAppointments().map((appointment) => (
                        <tr key={appointment.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                                <Users className="h-3 w-3 text-indigo-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 leading-none">
                                  {appointment.patientName}
                                </div>
                                <div className="text-gray-500 text-xs">
                                  ID: {appointment.patientId}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            {appointment.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            {formatAppointmentTime(appointment.date)}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            {appointment.duration} min
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap capitalize">
                            {appointment.type}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(appointment.status).bg} ${getStatusBadge(appointment.status).text}`}>
                              {getStatusBadge(appointment.status).icon}
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <button className="text-xs px-2 py-1 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors duration-150">
                                Edit
                              </button>
                              <button className="text-xs px-2 py-1 text-red-700 bg-red-50 hover:bg-red-100 rounded transition-colors duration-150">
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Calendar className="h-10 w-10 text-gray-400 mb-4" />
                    <p className="text-base font-medium text-gray-500">No appointments found</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or schedule a new appointment</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal for new appointments */}
      <NewAppointmentModal />
    </DoctorDashboardLayout>
  );
}