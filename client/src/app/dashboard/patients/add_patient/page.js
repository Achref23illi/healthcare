'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { Bell, Home, Users, User, BarChart, Search, Megaphone, LogOut, Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AddPatient() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [patient, setPatient] = useState({
    firstName: '',
    lastName: '',
    age: '',
    chronicDisease: '',
    temperature: '',
    heartRate: '',
    oxygenSaturation: ''
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check authentication and role
  useEffect(() => {
    // If not logged in, redirect to login
    if (!user) {
      router.push('/login');
      return;
    }
    
    // If logged in but not a doctor, redirect to dashboard
    if (user.role !== 'doctor') {
      router.push('/patient-dashboard');
    }
  }, [user, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient({
      ...patient,
      [name]: name === 'age' || name === 'temperature' || name === 'heartRate' || name === 'oxygenSaturation' ? Number(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Check if user is authenticated
      if (!user?.token) {
        setMessage({
          type: 'error',
          text: 'Authentication error. Please log in again.'
        });
        logout(); // Logout and redirect to login page
        return;
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      // Send request to backend API
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/patients`,
        {
          ...patient,
          doctor: user._id // Ensure the doctor ID is set
        },
        config
      );
      
      console.log('Patient Data:', response.data);
      setMessage({
        type: 'success',
        text: 'Patient information saved successfully!'
      });
      
      // Reset form
      setPatient({
        firstName: '',
        lastName: '',
        age: '',
        chronicDisease: '',
        temperature: '',
        heartRate: '',
        oxygenSaturation: ''
      });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error adding patient:', error);
      
      // Handle authentication errors
      if (error.response?.status === 401) {
        setMessage({
          type: 'error',
          text: 'Your session has expired. Please log in again.'
        });
        setTimeout(() => logout(), 2000); // Logout after showing message
      } else {
        setMessage({
          type: 'error',
          text: error.response?.data?.message || 'Failed to save patient information.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const fields = [
    { name: 'firstName', label: 'First Name', type: 'text' },
    { name: 'lastName', label: 'Last Name', type: 'text' },
    { name: 'age', label: 'Age', type: 'number' },
    { name: 'chronicDisease', label: 'Chronic Disease', type: 'text' },
    { name: 'temperature', label: 'Temperature (°C)', type: 'number' },
    { name: 'heartRate', label: 'Heart Rate (bpm)', type: 'number' },
    { name: 'oxygenSaturation', label: 'Oxygen Saturation (%)', type: 'number' }
  ];

  // Show loading spinner if still checking authentication or if the user is not a doctor
  if (!user || user.role !== 'doctor') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Add Patient</title>
      </Head>
      <div className="flex h-screen bg-gradient-to-r from-gray-50 to-gray-100">
        {/* Sidebar */}
        <aside
          className={`w-64 bg-white p-5 shadow-lg text-[#0c3948] fixed h-full transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0`}
        >
          <h2 className="text-xl font-bold mb-6">Medico</h2>
          <nav>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="flex items-center text-[#0c3948] p-2 rounded-lg hover:bg-[#f2f4ea] transition duration-200">
                  <Home className="w-5 h-5 mr-2" /> Dashboard
                </Link>
              </li>
              <h3 className="text-lg font-semibold mt-4">Information</h3>
              <li>
                <Link href="/dashboard/patients/add_patient" className="flex items-center p-2 rounded-lg bg-[#f2f4ea] hover:bg-[#f2f4ea] transition duration-200">
                  <User className="w-5 h-5 mr-2" /> Add Patient
                </Link>
              </li>
              <li>
                <Link href="/dashboard/patients/manage_patients" className="flex items-center p-2 rounded-lg hover:bg-[#f2f4ea] transition duration-200">
                  <Users className="w-5 h-5 mr-2" /> Patients
                </Link>
              </li>
              <li>
                <Link href="/dashboard/alerts" className="flex items-center p-2 rounded-lg hover:bg-[#f2f4ea] transition duration-200">
                  <Bell className="w-5 h-5 mr-2" /> Alerts
                </Link>
              </li>
              <li className="flex items-center p-2 rounded-lg hover:bg-[#f2f4ea] transition duration-200">
                <BarChart className="w-5 h-5 mr-2" /> Consultation
              </li>
              <h3 className="text-lg font-semibold mt-4">Analytics</h3>
              <li className="flex items-center p-2 rounded-lg hover:bg-[#f2f4ea] transition duration-200">
                <Megaphone className="w-5 h-5 mr-2" /> Marketing
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex flex-col flex-1 md:ml-64">
          {/* Top Bar */}
          <div className="flex justify-between items-center p-4 bg-white shadow-lg sticky top-0 z-10">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition duration-200"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center bg-gray-100 p-2 rounded-lg ml-2">
                <Search className="w-5 h-5 text-gray-500 mr-2" />
                <input type="text" placeholder="Search patient..." className="bg-transparent outline-none text-gray-700" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-800 transition duration-200" />
              <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <img src="/images/profile.png" alt="Profile" className="w-10 h-10 rounded-full hover:opacity-80 transition duration-200" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg p-2 w-48">
                    <button className="flex items-center p-2 w-full hover:bg-gray-100 rounded-lg transition duration-200">
                      <User className="w-5 h-5 mr-2" /> Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center p-2 w-full hover:bg-gray-100 rounded-lg transition duration-200"
                    >
                      <LogOut className="w-5 h-5 mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Patient Form */}
          <div className="mt-10 p-6">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-2xl">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Add a New Patient</h2>
              
              {message && (
                <div className={`mb-6 p-4 rounded-lg ${
                  message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {message.text}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fields.map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                      <input
                        type={field.type}
                        name={field.name}
                        placeholder={field.label}
                        value={patient[field.name]}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        required={field.name === 'firstName' || field.name === 'lastName' || field.name === 'age'}
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#0c3948] to-[#0c3948] text-white p-3 rounded-lg hover:from-[#0c3948] hover:to-[#0c3948] focus:ring-2 focus:ring-[#0c3948] focus:ring-offset-2 transition duration-200"
                >
                  {isLoading ? 'Adding Patient...' : 'Add Patient'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}