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
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
          {/* Close button */}
          <button
            onClick={() => setShowNewAppointmentModal(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-indigo-600 focus:outline-none"
            aria-label="Close"
          >
            <XCircle className="h-6 w-6" />
          </button>

          {/* Modal Header */}
          <div className="mb-6 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-indigo-500" />
            <h2 className="text-xl font-extrabold text-indigo-800">Schedule New Appointment</h2>
          </div>

          {/* Success/Error Message */}
          {submitMessage.message && (
            <div className={`mb-4 p-3 rounded-md text-sm font-semibold flex items-center gap-2 ${
              submitMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {submitMessage.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              {submitMessage.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Patient Selection */}
            <div>
              <label htmlFor="patient" className="block text-sm font-medium text-gray-700 mb-1">
                Patient <span className="text-red-500">*</span>
              </label>
              <select
                id="patient"
                name="patient"
                value={formData.patient}
                onChange={handleChange}
                className={`block w-full rounded-lg border ${formErrors.patient ? 'border-red-300' : 'border-gray-300'} focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm py-2 bg-white appearance-none transition shadow-sm hover:border-indigo-400`}
              >
                <option value="">Select a patient</option>
                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
              </select>
              {formErrors.patient && (
                <p className="mt-1 text-xs text-red-600">{formErrors.patient}</p>
              )}
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
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
                  className={`block w-full rounded-lg border ${formErrors.date ? 'border-red-300' : 'border-gray-300'} focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2`}
                />
                {formErrors.date && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.date}</p>
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
                  className={`block w-full rounded-lg border ${formErrors.time ? 'border-red-300' : 'border-gray-300'} focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2`}
                />
                {formErrors.time && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.time}</p>
                )}
              </div>
            </div>

            {/* Duration and Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (min) <span className="text-red-500">*</span>
                </label>
                <select
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className={`block w-full rounded-lg border ${formErrors.duration ? 'border-red-300' : 'border-gray-300'} focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm py-2 bg-white appearance-none transition shadow-sm hover:border-indigo-400`}
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                </select>
                {formErrors.duration && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.duration}</p>
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
                  className={`block w-full rounded-lg border ${formErrors.type ? 'border-red-300' : 'border-gray-300'} focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm py-2 bg-white appearance-none transition shadow-sm hover:border-indigo-400`}
                >
                  <option value="check-up">Check-up</option>
                  <option value="consultation">Consultation</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="initial">Initial Visit</option>
                  <option value="emergency">Emergency</option>
                </select>
                {formErrors.type && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.type}</p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2"
                placeholder="Enter any relevant notes for this appointment"
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setShowNewAppointmentModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-sm font-semibold flex items-center gap-2"
              >
                {isSubmitting ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 inline-block text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : <Plus className="h-4 w-4" />}
                {isSubmitting ? 'Scheduling...' : 'Schedule Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Add this function inside AppointmentsPage
  const handleUpdateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments/${appointmentId}`,
        { status: newStatus },
        config
      );
      fetchAppointments(); // Refresh list
    } catch (error) {
      alert(
        error.response?.data?.message || `Failed to update appointment status to ${newStatus}`
      );
    }
  };

  return (
    <DoctorDashboardLayout>
      <div className="h-full flex flex-col bg-gradient-to-br from-indigo-50 via-blue-50 to-white min-h-screen">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2 px-2 pt-4">
          <div>
            <h1 className="text-2xl font-extrabold text-indigo-800 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-indigo-500" />
              Appointments
            </h1>
            <p className="text-xs text-gray-500 mt-1">Schedule and manage patient appointments</p>
          </div>
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <button 
              onClick={() => setShowNewAppointmentModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            >
              <Plus className="h-4 w-4" />
              New Appointment
            </button>
            <button 
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col md:flex-row gap-6 px-2 pb-6">
          {/* Sidebar */}
          <aside className="w-full md:w-72 flex-shrink-0 mb-4 md:mb-0">
            <div className="bg-white rounded-2xl shadow border border-indigo-100 p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold text-indigo-700 flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-indigo-400" /> Calendar
                </h3>
                <div className="flex gap-1">
                  <button 
                    onClick={() => navigateDate(-1)} 
                    className="p-1 rounded-md hover:bg-indigo-50"
                  >
                    <ChevronLeft className="h-4 w-4 text-indigo-500" />
                  </button>
                  <button 
                    onClick={() => navigateDate(1)} 
                    className="p-1 rounded-md hover:bg-indigo-50"
                  >
                    <ChevronRight className="h-4 w-4 text-indigo-500" />
                  </button>
                </div>
              </div>
              <div className="text-base font-semibold text-indigo-900 mb-3">
                {formatDateRange()}
              </div>
              <div className="flex border rounded-lg overflow-hidden text-xs font-semibold">
                <button 
                  onClick={() => setView('day')} 
                  className={`flex-1 py-2 ${view === 'day' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-700 hover:bg-indigo-50'}`}
                >Day</button>
                <button 
                  onClick={() => setView('week')} 
                  className={`flex-1 py-2 ${view === 'week' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-700 hover:bg-indigo-50'}`}
                >Week</button>
                <button 
                  onClick={() => setView('month')} 
                  className={`flex-1 py-2 ${view === 'month' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-700 hover:bg-indigo-50'}`}
                >Month</button>
              </div>
            </div>
            {/* Filters */}
            <div className="bg-white rounded-2xl shadow border border-indigo-100 p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold text-indigo-700 flex items-center gap-1">
                  <Filter className="h-4 w-4 text-indigo-400" /> Filters
                </h3>
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
                    className="block w-full text-xs pl-3 pr-10 py-2 border border-indigo-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
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
                    <Search className="h-4 w-4 absolute left-2 top-2 text-indigo-400" />
                    <input 
                      type="text" 
                      id="searchFilter"
                      placeholder="Patient name..." 
                      className="pl-8 pr-3 py-2 text-xs w-full border border-indigo-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={filter.search}
                      onChange={(e) => setFilter({...filter, search: e.target.value})}
                    />
                  </div>
                </div>
                <button 
                  onClick={() => setFilter({status: 'all', search: ''})}
                  className="w-full text-xs py-2 text-center font-semibold bg-white text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 focus:outline-none"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </aside>

          {/* Appointments List as Cards */}
          <section className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-indigo-800 flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-500" />
                Upcoming Appointments
              </h3>
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-semibold">
                {getFilteredAppointments().length} total
              </span>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : getFilteredAppointments().length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {getFilteredAppointments().map((appointment, idx) => {
                  const patientName = appointment.patientName || 
                    (appointment.patient && (
                      appointment.patient.firstName ? 
                        `${appointment.patient.firstName} ${appointment.patient.lastName || ''}` : 
                        appointment.patient.name || 'Unknown Patient'
                    ));
                  const patientId = appointment.patientId || 
                    (appointment.patient && appointment.patient._id) || 
                    appointment._id || 'Unknown';
                  const statusBadge = getStatusBadge(appointment.status);
                  // Avatar initials
                  const initials = patientName
                    ? patientName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
                    : 'P';
                  // Highlight next upcoming appointment
                  const isNext = idx === 0;
                  return (
                    <div
                      key={appointment.id || appointment._id}
                      className={`relative bg-white rounded-3xl shadow-lg border border-indigo-100 p-6 flex flex-col gap-3 transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl group ${isNext ? 'ring-2 ring-indigo-300' : ''}`}
                    >
                      {/* Status dot */}
                      <span className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
                        appointment.status === 'confirmed' ? 'bg-green-400' : appointment.status === 'pending' ? 'bg-yellow-400' : appointment.status === 'cancelled' ? 'bg-red-400' : 'bg-gray-300'
                      }`} title={appointment.status}></span>
                      <div className="flex items-center gap-3 mb-1">
                        {/* Avatar */}
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-200 to-blue-100 flex items-center justify-center text-indigo-700 font-bold text-lg shadow-inner border-2 border-indigo-100">
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-indigo-900 text-base leading-tight truncate max-w-[160px] md:max-w-[200px] xl:max-w-[240px]">
                            {patientName}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-[160px] md:max-w-[200px] xl:max-w-[240px]">
                            ID: {patientId}
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${statusBadge.bg} ${statusBadge.text} shadow-sm`}>
                          {statusBadge.icon}
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-700 mt-1">
                        <span className="inline-flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded shadow-sm">
                          <Calendar className="h-4 w-4 text-indigo-400" /> {formatAppointmentDate(appointment.date)}
                        </span>
                        <span className="inline-flex items-center gap-1 bg-blue-50 px-2 py-1 rounded shadow-sm">
                          <Clock className="h-4 w-4 text-blue-400" /> {formatAppointmentTime(appointment.date)}
                        </span>
                        <span className="inline-flex items-center gap-1 bg-green-50 px-2 py-1 rounded shadow-sm">
                          <Clock className="h-4 w-4 text-green-400" /> {appointment.duration} min
                        </span>
                        <span className="inline-flex items-center gap-1 bg-gray-50 px-2 py-1 rounded capitalize shadow-sm">
                          <AlertCircle className="h-4 w-4 text-gray-400" /> {appointment.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        {/* Edit button (optional) */}
                        <button
                          className="text-xs px-3 py-1 text-indigo-700 bg-indigo-50 hover:bg-indigo-200 rounded-lg font-semibold transition-colors duration-150 shadow-sm"
                          title="Edit appointment"
                        >
                          Edit
                        </button>
                        {/* Confirm button (show if not confirmed/cancelled) */}
                        {appointment.status !== 'confirmed' && appointment.status !== 'cancelled' && (
                          <button
                            className="text-xs px-3 py-1 text-green-700 bg-green-50 hover:bg-green-200 rounded-lg font-semibold transition-colors duration-150 shadow-sm"
                            title="Confirm appointment"
                            onClick={() => handleUpdateAppointmentStatus(appointment._id || appointment.id, 'confirmed')}
                          >
                            Confirm
                          </button>
                        )}
                        {/* Cancel button (show if not cancelled) */}
                        {appointment.status !== 'cancelled' && (
                          <button
                            className="text-xs px-3 py-1 text-red-700 bg-red-50 hover:bg-red-200 rounded-lg font-semibold transition-colors duration-150 shadow-sm"
                            title="Cancel appointment"
                            onClick={() => handleUpdateAppointmentStatus(appointment._id || appointment.id, 'cancelled')}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                      {/* Highlight badge for next appointment */}
                      {isNext && (
                        <span className="absolute -top-3 left-4 bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow font-bold animate-pulse">Next</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <img src="/images/consultation.png" alt="No appointments" className="h-28 w-28 mb-4 opacity-80" />
                <p className="text-base font-medium text-gray-500">No appointments found</p>
                <p className="text-sm text-gray-400 mt-1 mb-3">Try adjusting your filters or schedule a new appointment</p>
                <button
                  onClick={() => setShowNewAppointmentModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                >
                  <Plus className="h-4 w-4" />
                  Schedule Appointment
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
      {/* Modal for new appointments */}
      <NewAppointmentModal />
    </DoctorDashboardLayout>
  );
}