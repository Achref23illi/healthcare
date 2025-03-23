'use client';

import { useState, useEffect } from "react";
import Link from 'next/link';
import axios from 'axios';
import { Home, Search, Users, User, LogOut, Bell, BarChart, Megaphone } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const ManagePatients = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check authentication and role
    if (!user) {
      router.push('/login');
      return;
    }
    
    // If logged in but not a doctor, redirect to dashboard
    if (user.role !== 'doctor') {
      router.push('/patient-dashboard');
      return;
    }
    
    const fetchPatients = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };
        
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/patients`,
          config
        );
        
        setPatients(response.data.patients || response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching patients:', error);
        setError('Failed to fetch patients. Please try again.');
        setIsLoading(false);
        
        // Handle auth errors
        if (error.response?.status === 401) {
          setTimeout(() => {
            logout();
            router.push('/login');
          }, 2000);
        }
      }
    };
    
    fetchPatients();
  }, [user, router, logout]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleDeletePatient = async (id) => {
    try {
      if (!user?.token) return;
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/patients/${id}`,
        config
      );
      
      // Update state by removing deleted patient
      setPatients(patients.filter(patient => patient._id !== id));
    } catch (error) {
      console.error('Error deleting patient:', error);
      alert('Failed to delete patient.');
    }
  };

  // Filter patients based on search query
  const filteredPatients = patients.filter(patient => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || 
           (patient.chronicDisease && patient.chronicDisease.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="mt-4 text-gray-600">Loading patients...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-5 shadow text-[#0c3948] fixed h-full">
        <h2 className="text-xl font-bold mb-6">Medico</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link href="/dashboard" className="flex items-center text-[#0c3948] p-2 rounded">
                <Home className="w-5 h-5 mr-2" /> Dashboard
              </Link>
            </li>
            <h3 className="text-lg font-semibold mt-4">Information</h3>
            <li className="flex items-center p-2 rounded hover:bg-[#f2f4ea] hover:text-[#0c3948]">
              <Link href="/dashboard/patients/add_patient" className="flex items-center w-full">
                <User className="w-5 h-5 mr-2" /> Add Patient
              </Link>
            </li>
            <li className="flex items-center p-2 rounded bg-[#f2f4ea] hover:bg-[#f2f4ea] hover:text-[#0c3948]">
              <Link href="/dashboard/patients/manage_patients" className="flex items-center w-full">
                <Users className="w-5 h-5 mr-2" /> Patients
              </Link>
            </li>
            <li className="flex items-center p-2 rounded hover:bg-[#f2f4ea] hover:text-[#0c3948]">
              <Link href="/dashboard/alerts" className="flex items-center w-full">
                <Bell className="w-5 h-5 mr-2" /> Alerts
              </Link>
            </li>
            <li className="flex items-center p-2 rounded hover:bg-[#f2f4ea] hover:text-[#0c3948]">
              <BarChart className="w-5 h-5 mr-2" /> Consultation
            </li>
            <h3 className="text-lg font-semibold mt-4">Analytics</h3>
            <li className="flex items-center p-2 rounded hover:bg-[#f2f4ea] hover:text-[#0c3948]">
              <Megaphone className="w-5 h-5 mr-2" /> Marketing
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 ml-64">
        {/* Top Bar */}
        <div className="flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-10">
          <div className="flex items-center bg-gray-100 p-2 rounded-lg">
            <Search className="w-5 h-5 text-gray-500 mr-2" />
            <input 
              type="text" 
              placeholder="Search patient..." 
              className="bg-transparent outline-none text-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
          </div>
          <div className="flex items-center gap-4">
            <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)}>
                <img src="/images/profile.png" alt="Profile" className="w-10 h-10 rounded-full" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white shadow-md rounded-lg p-2 w-48">
                  <button className="flex items-center p-2 w-full hover:bg-gray-100">
                    <User className="w-5 h-5 mr-2" /> Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center p-2 w-full hover:bg-gray-100"
                  >
                    <LogOut className="w-5 h-5 mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* List of patients */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-700 mb-6">Manage Patients</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chronic Disease</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Updated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <tr key={patient._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.firstName} {patient.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.age}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.chronicDisease || 'None'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${patient.status === 'Critical' ? 'bg-red-100 text-red-800' : 
                            patient.status === 'Moderate' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'}`}>
                          {patient.status || 'Stable'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.updatedAt ? new Date(patient.updatedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <Link href={`/dashboard/patients/vitals/${patient._id}`} className="text-indigo-600 hover:text-indigo-900 mr-2">
                          Record Vitals
                        </Link>
                        <button className="text-indigo-600 hover:text-indigo-900 mr-2">Modify</button>
                        <button
                          onClick={() => handleDeletePatient(patient._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No patients found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePatients;