'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DoctorDashboardLayout from '@/components/DoctorDashboardLayout';
import axios from 'axios';
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
  const [appointments, setAppointments] = useState([]); // Store appointments
  
  // Fetch appointments when component mounts or user changes
  useEffect(() => {
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
  
  // Function to fetch appointments from API
  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/appointments`, config);
      
      // Process the response data to ensure dates are Date objects
      const processedAppointments = response.data.map(appt => ({
        ...appt,
        // Convert date string to Date object
        date: new Date(appt.date)
      }));
      
      setAppointments(processedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      // Set some mock data for testing if API fails
      setAppointments([
        {
          id: 1,
          patientName: "John Smith",
          patientId: "P12345",
          date: new Date("2025-04-15T10:00:00"),
          duration: 30,
          type: "check-up",
          status: "confirmed"
        },
        {
          id: 2,
          patientName: "Emma Johnson",
          patientId: "P12346",
          date: new Date("2025-04-16T14:30:00"),
          duration: 45,
          type: "consultation",
          status: "pending"
        },
        {
          id: 3,
          patientName: "Michael Brown",
          patientId: "P12347",
          date: new Date("2025-04-17T09:15:00"),
          duration: 60,
          type: "follow-up",
          status: "confirmed"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
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
      if (filter.search) {
        const patientNameOrId = appointment.patientName || 
                               (appointment.patient && (
                                 appointment.patient.firstName + ' ' + appointment.patient.lastName ||
                                 appointment.patient.name
                               ));
        
        if (!patientNameOrId || !patientNameOrId.toLowerCase().includes(filter.search.toLowerCase())) {
          return false;
        }
      }
      
      return true;
    });
  };
  
  // Function to get appointment time display
  const formatAppointmentTime = (date) => {
    if (!(date instanceof Date) || isNaN(date)) {
      return 'Invalid date';
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Safe function to format date
  const formatAppointmentDate = (date) => {
    if (!(date instanceof Date) || isNaN(date)) {
      return 'Invalid date';
    }
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
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

  // New Appointment Modal Component
  const NewAppointmentModal = () => {
    const [patients, setPatients] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
      patient: '',
      date: '',
      time: '',
      duration: 30,
      type: 'check-up',
      notes: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitMessage, setSubmitMessage] = useState({ type: '', message: '' });
  
    // Fetch patients when modal opens
    useEffect(() => {
      if (showNewAppointmentModal) {
        fetchPatients();
      }
    }, [showNewAppointmentModal]);
  
    // Function to fetch patients
    const fetchPatients = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };
        
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/patients`, config);
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };
  
    // Handle form input changes
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    // Validate form
    const validateForm = () => {
      const errors = {};
      
      if (!formData.patient) errors.patient = 'Patient is required';
      if (!formData.date) errors.date = 'Date is required';
      if (!formData.time) errors.time = 'Time is required';
      if (!formData.duration) errors.duration = 'Duration is required';
      if (!formData.type) errors.type = 'Appointment type is required';
      
      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    };
  
    // Submit form
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!validateForm()) return;
      
      setIsSubmitting(true);
      setSubmitMessage({ type: '', message: '' });
      
      try {
        // Combine date and time
        const dateTime = new Date(`${formData.date}T${formData.time}`);
        
        const appointmentData = {
          patient: formData.patient,
          date: dateTime.toISOString(),
          duration: parseInt(formData.duration),
          type: formData.type,
          notes: formData.notes || '',
          status: 'pending'
        };
        
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };
        
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/appointments`,
          appointmentData,
          config
        );
        
        setSubmitMessage({
          type: 'success',
          message: 'Appointment scheduled successfully!'
        });
        
        // Reset form
        setFormData({
          patient: '',
          date: '',
          time: '',
          duration: 30,
          type: 'check-up',
          notes: ''
        });
        
        // Refresh appointments list
        fetchAppointments();
        
        // Close modal after success (with a slight delay to show success message)
        setTimeout(() => {
          setShowNewAppointmentModal(false);
        }, 1500);
      } catch (error) {
        console.error('Error creating appointment:', error);
        setSubmitMessage({
          type: 'error',
          message: error.response?.data?.message || 'Failed to schedule appointment'
        });
      } finally {
        setIsSubmitting(false);
      }
    };
  
    // Format today's date for min attribute
    const today = new Date().toISOString().split('T')[0];
  
    if (!showNewAppointmentModal) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Schedule New Appointment</h2>
            <button
              onClick={() => setShowNewAppointmentModal(false)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
  
          {/* Success/Error Message */}
          {submitMessage.message && (
            <div className={`mb-4 p-3 rounded-md ${
              submitMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {submitMessage.message}
            </div>
          )}
  
          <form onSubmit={handleSubmit}>
            {/* Patient Selection */}
            <div className="mb-4">
              <label htmlFor="patient" className="block text-sm font-medium text-gray-700 mb-1">
                Patient <span className="text-red-500">*</span>
              </label>
              <select
                id="patient"
                name="patient"
                value={formData.patient}
                onChange={handleChange}
                className={`block w-full rounded-md border ${formErrors.patient ? 'border-red-300' : 'border-gray-300'} focus:border-indigo-500 focus:ring-indigo-500 text-sm`}
              >
                <option value="">Select a patient</option>
                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
              </select>
              {formErrors.patient && (
                <p className="mt-1 text-sm text-red-600">{formErrors.patient}</p>
              )}
            </div>
  
            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  min={today}
                  value={formData.date}
                  onChange={handleChange}
                  className={`block w-full rounded-md border ${formErrors.date ? 'border-red-300' : 'border-gray-300'} focus:border-indigo-500 focus:ring-indigo-500 text-sm`}
                />
                {formErrors.date && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.date}</p>
                )}
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={`block w-full rounded-md border ${formErrors.time ? 'border-red-300' : 'border-gray-300'} focus:border-indigo-500 focus:ring-indigo-500 text-sm`}
                />
                {formErrors.time && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.time}</p>
                )}
              </div>
            </div>
  
            {/* Duration and Type */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (min) <span className="text-red-500">*</span>
                </label>
                <select
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className={`block w-full rounded-md border ${formErrors.duration ? 'border-red-300' : 'border-gray-300'} focus:border-indigo-500 focus:ring-indigo-500 text-sm`}
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                </select>
                {formErrors.duration && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.duration}</p>
                )}
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`block w-full rounded-md border ${formErrors.type ? 'border-red-300' : 'border-gray-300'} focus:border-indigo-500 focus:ring-indigo-500 text-sm`}
                >
                  <option value="check-up">Check-up</option>
                  <option value="consultation">Consultation</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="initial">Initial Visit</option>
                  <option value="emergency">Emergency</option>
                </select>
                {formErrors.type && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.type}</p>
                )}
              </div>
            </div>
  
            {/* Notes */}
            <div className="mb-4">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                className="block w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                placeholder="Enter any relevant notes for this appointment"
              />
            </div>
  
            {/* Form Actions */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setShowNewAppointmentModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-sm font-medium"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 inline-block text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Scheduling...
                  </>
                ) : 'Schedule Appointment'}
              </button>
            </div>
          </form>
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
            </div>

            {/* Right Panel - Appointments List/Calendar */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 flex items-center">
                  {isLoading ? 'Loading appointments...' : 'Upcoming Appointments'}
                  {!isLoading && (
                    <span className="ml-2 px-1.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {getFilteredAppointments().length}
                    </span>
                  )}
                </h3>
              </div>
              
              {/* Appointments List */}
              <div className="overflow-auto max-h-[calc(100vh-260px)]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : getFilteredAppointments().length > 0 ? (
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
                      {getFilteredAppointments().map((appointment) => {
                        // Extract patient name from different possible formats
                        const patientName = appointment.patientName || 
                                          (appointment.patient && (
                                            appointment.patient.firstName ? 
                                            `${appointment.patient.firstName} ${appointment.patient.lastName || ''}` : 
                                            appointment.patient.name || 'Unknown Patient'
                                          ));
                        
                        // Extract patient ID
                        const patientId = appointment.patientId || 
                                         (appointment.patient && appointment.patient._id) || 
                                         appointment._id || 'Unknown';
                        
                        return (
                          <tr key={appointment.id || appointment._id} className="hover:bg-gray-50">
                            <td className="px-3 py-2 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                                  <Users className="h-3 w-3 text-indigo-600" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900 leading-none">
                                    {patientName}
                                  </div>
                                  <div className="text-gray-500 text-xs">
                                    ID: {patientId}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              {formatAppointmentDate(appointment.date)}
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
                        );
                      })}
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