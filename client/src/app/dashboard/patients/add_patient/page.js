'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import RoleBasedLayout from '@/components/RoleBasedLayout';

export default function AddPatient() {
  const { user } = useAuth();
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

  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
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
    setMessage(null);
    setIsSubmitting(true);

    try {
      // Get token from auth context
      const token = user?.token;
      
      if (!token) {
        setMessage({
          type: 'error',
          text: 'You must be logged in to add a patient'
        });
        return;
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      // Send request to backend API
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/patients`,
        patient,
        config
      );
      
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
      setTimeout(() => {
        setMessage(null);
        // Optionally navigate to manage patients page
        // router.push('/dashboard/patients/manage_patients');
      }, 3000);
    } catch (error) {
      console.error('Error adding patient:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to save patient information.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    { name: 'firstName', label: 'First Name', type: 'text' },
    { name: 'lastName', label: 'Last Name', type: 'text' },
    { name: 'age', label: 'Age', type: 'number' },
    { name: 'chronicDisease', label: 'Chronic Disease', type: 'text' },
    { name: 'temperature', label: 'Temperature (°C)', type: 'number', step: '0.1' },
    { name: 'heartRate', label: 'Heart Rate (bpm)', type: 'number' },
    { name: 'oxygenSaturation', label: 'Oxygen Saturation (%)', type: 'number', step: '0.1' }
  ];

  if (!user) {
    return (
      <RoleBasedLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0c3948]"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </RoleBasedLayout>
    );
  }

  return (
    <RoleBasedLayout>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Patient</h1>
            <p className="mt-1 text-sm text-gray-500">
              Enter patient information and initial vital signs
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button 
              onClick={() => router.back()}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0c3948]"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Patient Information</h2>
          </div>

          {/* Notification */}
          {message && (
            <div className={`m-6 p-4 rounded-md ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {message.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400" />
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    message.type === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {message.text}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map((field) => (
                <div key={field.name}>
                  <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    id={field.name}
                    placeholder={field.label}
                    value={patient[field.name]}
                    onChange={handleChange}
                    step={field.step}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0c3948] focus:border-[#0c3948] sm:text-sm"
                    required={field.name !== 'chronicDisease'}
                  />
                  {field.name === 'chronicDisease' && (
                    <p className="mt-1 text-xs text-gray-500">
                      Leave blank if patient has no chronic conditions
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setPatient({
                    firstName: '',
                    lastName: '',
                    age: '',
                    chronicDisease: '',
                    temperature: '',
                    heartRate: '',
                    oxygenSaturation: ''
                  });
                }}
                className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0c3948]"
              >
                Clear Form
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#0c3948] hover:bg-[#155e76] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0c3948]"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : 'Add Patient'}
              </button>
            </div>
          </form>
        </div>

        {/* Additional help section */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Adding a New Patient</h3>
          <p className="text-sm text-gray-600 mb-4">
            When adding a new patient, please ensure you have accurate information. The vital signs will be used as baseline measurements.
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
            <li>First name and last name should match legal documents</li>
            <li>Age should be entered in years</li>
            <li>Normal temperature range is typically 36.1°C to 37.2°C</li>
            <li>Normal resting heart rate for adults ranges from 60-100 beats per minute</li>
            <li>Normal oxygen saturation is usually 95% or higher</li>
          </ul>
        </div>
      </div>
    </RoleBasedLayout>
  );
}