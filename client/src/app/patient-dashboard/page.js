'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import PatientDashboardLayout from '@/components/PatientDashboardLayout';
import Link from 'next/link';
import { User, Heart, Activity, Thermometer, Droplet, Calendar, Clock, AlertCircle, FileText, Pill, CheckCircle } from 'lucide-react';

export default function PatientDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);
  const [vitals, setVitals] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.token) return;

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };

        // Fetch assigned doctor info
        const docResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/patients/my-doctor`, config);
        setDoctor(docResponse.data);

        // Fetch the user's vitals - simplified for demo
        // In a real app, you would fetch actual vitals
        setVitals({
          heartRate: { value: 72, unit: 'bpm', status: 'normal', time: '2 hours ago' },
          temperature: { value: 36.7, unit: '°C', status: 'normal', time: '2 hours ago' },
          bloodPressure: { value: '120/80', unit: 'mmHg', status: 'normal', time: '2 hours ago' },
          oxygenSaturation: { value: 98, unit: '%', status: 'normal', time: '2 hours ago' },
          respiratoryRate: { value: 16, unit: 'breaths/min', status: 'normal', time: '2 hours ago' }
        });

        // Fetch alerts (sample data for demo)
        setAlerts([
          { id: 1, message: 'Reminder: Take your medication', severity: 'Low', status: 'New', createdAt: new Date(Date.now() - 60 * 60 * 1000) },
          { id: 2, message: 'Appointment tomorrow at 10:00 AM', severity: 'Medium', status: 'New', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        ]);

        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  // Sample data for upcoming appointments
  const upcomingAppointments = [
    { id: 1, doctor: "Dr. Sarah Johnson", specialization: "Cardiologist", date: "Mar 24, 2025", time: "10:00 AM" },
    { id: 2, doctor: "Dr. Robert Chen", specialization: "General Physician", date: "Apr 2, 2025", time: "2:30 PM" }
  ];

  // Sample data for medications
  const medications = [
    { id: 1, name: "Lisinopril", dosage: "10mg", frequency: "Once daily", time: "8:00 AM", status: "taken" },
    { id: 2, name: "Metformin", dosage: "500mg", frequency: "Twice daily", time: "8:00 PM", status: "pending" },
    { id: 3, name: "Atorvastatin", dosage: "20mg", frequency: "Once daily", time: "10:00 PM", status: "pending" }
  ];

  if (isLoading) {
    return (
      <PatientDashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <p className="ml-2 text-gray-600">Loading your health data...</p>
        </div>
      </PatientDashboardLayout>
    );
  }

  return (
    <PatientDashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <div className="mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-8 md:flex md:items-center md:justify-between">
            <div className="text-white">
              <h1 className="text-2xl font-bold mb-2">Hello, {user.name}</h1>
              <p className="text-purple-100">
                Welcome to your personal health dashboard
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex">
              <Link 
                href="/patient-dashboard/appointments" 
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Appointment
              </Link>
            </div>
          </div>
        </div>

        {/* Health Summary Cards */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Health Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Heart Rate Card */}
            <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
              <div className="flex items-center mb-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <Heart className="text-red-600 h-5 w-5" />
                </div>
                <h3 className="ml-2 text-sm font-medium text-gray-700">Heart Rate</h3>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{vitals.heartRate.value}</p>
                  <p className="text-xs text-gray-500">{vitals.heartRate.unit}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  vitals.heartRate.status === 'normal' ? 'bg-green-100 text-green-800' : 
                  vitals.heartRate.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {vitals.heartRate.status === 'normal' ? 'Normal' : 
                   vitals.heartRate.status === 'warning' ? 'Warning' : 'Critical'}
                </span>
              </div>
              <p className="mt-2 text-xs text-gray-500">Updated {vitals.heartRate.time}</p>
            </div>

            {/* Temperature Card */}
            <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
              <div className="flex items-center mb-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Thermometer className="text-orange-600 h-5 w-5" />
                </div>
                <h3 className="ml-2 text-sm font-medium text-gray-700">Temperature</h3>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{vitals.temperature.value}</p>
                  <p className="text-xs text-gray-500">{vitals.temperature.unit}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  vitals.temperature.status === 'normal' ? 'bg-green-100 text-green-800' : 
                  vitals.temperature.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {vitals.temperature.status === 'normal' ? 'Normal' : 
                   vitals.temperature.status === 'warning' ? 'Warning' : 'Critical'}
                </span>
              </div>
              <p className="mt-2 text-xs text-gray-500">Updated {vitals.temperature.time}</p>
            </div>

            {/* Blood Pressure Card */}
            <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
              <div className="flex items-center mb-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Activity className="text-blue-600 h-5 w-5" />
                </div>
                <h3 className="ml-2 text-sm font-medium text-gray-700">Blood Pressure</h3>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{vitals.bloodPressure.value}</p>
                  <p className="text-xs text-gray-500">{vitals.bloodPressure.unit}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  vitals.bloodPressure.status === 'normal' ? 'bg-green-100 text-green-800' : 
                  vitals.bloodPressure.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {vitals.bloodPressure.status === 'normal' ? 'Normal' : 
                   vitals.bloodPressure.status === 'warning' ? 'Warning' : 'Critical'}
                </span>
              </div>
              <p className="mt-2 text-xs text-gray-500">Updated {vitals.bloodPressure.time}</p>
            </div>

            {/* Oxygen Card */}
            <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
              <div className="flex items-center mb-3">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <Droplet className="text-indigo-600 h-5 w-5" />
                </div>
                <h3 className="ml-2 text-sm font-medium text-gray-700">Oxygen</h3>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{vitals.oxygenSaturation.value}</p>
                  <p className="text-xs text-gray-500">{vitals.oxygenSaturation.unit}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  vitals.oxygenSaturation.status === 'normal' ? 'bg-green-100 text-green-800' : 
                  vitals.oxygenSaturation.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {vitals.oxygenSaturation.status === 'normal' ? 'Normal' : 
                   vitals.oxygenSaturation.status === 'warning' ? 'Warning' : 'Critical'}
                </span>
              </div>
              <p className="mt-2 text-xs text-gray-500">Updated {vitals.oxygenSaturation.time}</p>
            </div>

            {/* Respiratory Rate Card */}
            <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
              <div className="flex items-center mb-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Lungs className="text-green-600 h-5 w-5" />
                </div>
                <h3 className="ml-2 text-sm font-medium text-gray-700">Respiratory Rate</h3>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{vitals.respiratoryRate.value}</p>
                  <p className="text-xs text-gray-500">{vitals.respiratoryRate.unit}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  vitals.respiratoryRate.status === 'normal' ? 'bg-green-100 text-green-800' : 
                  vitals.respiratoryRate.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {vitals.respiratoryRate.status === 'normal' ? 'Normal' : 
                   vitals.respiratoryRate.status === 'warning' ? 'Warning' : 'Critical'}
                </span>
              </div>
              <p className="mt-2 text-xs text-gray-500">Updated {vitals.respiratoryRate.time}</p>
            </div>
          </div>
        </div>

        {/* Main Content Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Your Doctor */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Doctor</h2>
            
            {doctor ? (
              <div className="flex flex-col items-center text-center">
                <div className="h-20 w-20 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  {doctor.profilePicture ? (
                    <img src={doctor.profilePicture} alt="Doctor" className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <User className="h-10 w-10 text-purple-600" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{doctor.specialization || 'General Physician'}</p>
                
                <div className="mt-4 flex space-x-3">
                  <button className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors duration-200">
                    Send Message
                  </button>
                  <button className="px-3 py-2 border border-purple-600 text-purple-600 rounded-lg text-sm hover:bg-purple-50 transition-colors duration-200">
                    Book Appointment
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                  <User className="h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">No doctor assigned</h3>
                <p className="text-gray-500 mb-4">You don&apos;t have an assigned doctor yet.</p>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors duration-200">
                  Find a Doctor
                </button>
              </div>
            )}
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-lg text-gray-800">Upcoming Appointments</h2>
            </div>
            <div className="p-6">
              {upcomingAppointments.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {upcomingAppointments.map((appointment) => (
                    <li key={appointment.id} className="py-3">
                      <div className="flex items-start">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <Calendar className="text-purple-600 h-5 w-5" />
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {appointment.doctor}
                          </p>
                          <p className="text-xs text-gray-500">
                            {appointment.specialization}
                          </p>
                          <div className="mt-1 flex items-center">
                            <Clock className="h-3 w-3 text-gray-400 mr-1" />
                            <p className="text-xs text-gray-500">
                              {appointment.date} at {appointment.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6">
                  <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                    <Calendar className="h-12 w-12" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-1">No upcoming appointments</h3>
                  <p className="text-gray-500">Schedule your next appointment</p>
                </div>
              )}
              
              <div className="mt-4">
                <button className="w-full py-2 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition duration-200">
                  Book New Appointment
                </button>
              </div>
            </div>
          </div>

          {/* Today's Medications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-lg text-gray-800">Today&apos;s Medications</h2>
            </div>
            <div className="p-6">
              <ul className="divide-y divide-gray-100">
                {medications.map((medication) => (
                  <li key={medication.id} className="py-3">
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center
                        ${medication.status === 'taken' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                        {medication.status === 'taken' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Pill className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {medication.name}
                          </p>
                          <p className="text-xs font-medium px-2 py-0.5 rounded-full
                            ${medication.status === 'taken' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                            {medication.status === 'taken' ? 'Taken' : 'Pending'}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500">
                          {medication.dosage} - {medication.frequency}
                        </p>
                        <div className="mt-1 flex items-center">
                          <Clock className="h-3 w-3 text-gray-400 mr-1" />
                          <p className="text-xs text-gray-500">
                            {medication.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="mt-4 flex space-x-2">
                <button className="flex-1 py-2 text-sm font-medium text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-lg transition duration-200">
                  Medication History
                </button>
                <button className="flex-1 py-2 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition duration-200">
                  Manage Medications
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Health Alerts */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-semibold text-lg text-gray-800">Health Alerts</h2>
            <Link href="/patient-dashboard/alerts" className="text-sm text-purple-600 hover:text-purple-800 font-medium">
              View All
            </Link>
          </div>
          <div className="p-6">
            {alerts.length > 0 ? (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="bg-red-50 rounded-lg p-4 flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{alert.message}</h3>
                      <div className="mt-2 text-xs text-red-700 flex justify-between">
                        <span>Severity: {alert.severity}</span>
                        <span>{new Date(alert.createdAt).toLocaleTimeString()} - {new Date(alert.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                  <CheckCircle className="h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">No active alerts</h3>
                <p className="text-gray-500">Everything looks good!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PatientDashboardLayout>
  );
}