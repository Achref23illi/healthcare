'use client';

import { useState, useEffect } from "react";
import Link from 'next/link';
import axios from 'axios';
import { Search, Users, User, LogOut, Bell, BarChart, Megaphone, Loader, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DoctorDashboardLayout from '@/components/DoctorDashboardLayout';

const ManagePatients = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
    
    fetchPatients();
  }, [user, router, logout]);

  const fetchPatients = async () => {
    try {
      if (!user?.token) {
        setIsLoading(false);
        return;
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      console.log('Fetching patients...');
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/patients`,
        config
      );
      
      console.log('API Response:', response.data);
      
      // Handle the response data
      if (Array.isArray(response.data)) {
        setPatients(response.data);
      } else if (response.data && typeof response.data === 'object') {
        if (Array.isArray(response.data.patients)) {
          setPatients(response.data.patients);
        } else if (response.data.message) {
          // API returned a message instead of data
          console.log('API message:', response.data.message);
          setError(`Server message: ${response.data.message}`);
          setPatients([]);
        } else {
          console.error('Unexpected data structure:', response.data);
          setError('Received unexpected data format from server');
          setPatients([]);
        }
      } else {
        console.error('Unexpected response type:', typeof response.data);
        setError('Received unexpected data format from server');
        setPatients([]);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching patients:', error);
      
      const errorMessage = error.response?.data?.message || 'Failed to fetch patients';
      setError(errorMessage);
      setPatients([]);
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
      setPatients(currentPatients => currentPatients.filter(patient => patient._id !== id));
    } catch (error) {
      console.error('Error deleting patient:', error);
      alert('Failed to delete patient.');
    }
  };

  // Filter patients based on search query
  const filteredPatients = Array.isArray(patients) 
    ? patients.filter(patient => {
        const fullName = `${patient.firstName || ''} ${patient.lastName || ''}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase()) || 
               (patient.chronicDisease && patient.chronicDisease.toLowerCase().includes(searchQuery.toLowerCase()));
      })
    : [];

  return (
    <DoctorDashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Patients</h1>
            <p className="mt-1 text-sm text-gray-500">
              View and manage all your patients in one place
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link 
              href="/dashboard/patients/add_patient" 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Patient
            </Link>
          </div>
        </div>
      
        {/* Search Bar */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search patients by name or condition..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Loading Indicator */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm">
            <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
            <p className="mt-4 text-gray-600">Loading patients...</p>
          </div>
        ) : (
          /* Patients Table */
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                All Patients ({filteredPatients.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chronic Disease</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <tr key={patient._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-indigo-700 font-medium">
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.age}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {patient.chronicDisease || 'None'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${patient.status === 'Critical' ? 'bg-red-100 text-red-800' : 
                              patient.status === 'Moderate' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-green-100 text-green-800'}`}>
                            {patient.status || 'Stable'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {patient.updatedAt ? new Date(patient.updatedAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <Link 
                              href={`/dashboard/patients/vitals/${patient._id}`}
                              className="text-indigo-600 hover:text-indigo-900 font-medium"
                            >
                              Record Vitals
                            </Link>
                            <button
                              onClick={() => handleDeletePatient(patient._id)}
                              className="text-red-600 hover:text-red-900 font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-10 text-center text-sm text-gray-500">
                        <div className="flex flex-col items-center">
                          <Users className="h-10 w-10 text-gray-400 mb-4" />
                          <p className="text-base font-medium text-gray-500">No patients found</p>
                          {searchQuery ? (
                            <p className="text-sm text-gray-400 mt-1">Try adjusting your search criteria</p>
                          ) : (
                            <div className="mt-3">
                              <Link 
                                href="/dashboard/patients/add_patient"
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                              >
                                Add Your First Patient
                              </Link>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DoctorDashboardLayout>
  );
};

export default ManagePatients;