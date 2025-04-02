'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { 
  Bell, 
  Home, 
  Users, 
  User, 
  ArrowLeft,
  Plus,
  Thermometer,
  Heart,
  Percent,
  UserPlus,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  FilePlus2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DoctorDashboardLayout from '@/components/DoctorDashboardLayout';

export default function AddPatient() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Form state
  const [patient, setPatient] = useState({
    firstName: '',
    lastName: '',
    age: '',
    chronicDisease: '',
    temperature: '',
    heartRate: '',
    oxygenSaturation: ''
  });

  // UI state
  const [formTouched, setFormTouched] = useState({
    firstName: false,
    lastName: false,
    age: false,
    chronicDisease: false,
    temperature: false,
    heartRate: false,
    oxygenSaturation: false
  });
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTips, setShowTips] = useState(false);

  // Check authentication and role
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (user.role !== 'doctor') {
      router.push('/patient-dashboard');
    }
  }, [user, router]);

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient({
      ...patient,
      [name]: name === 'age' || name === 'temperature' || name === 'heartRate' || name === 'oxygenSaturation' 
        ? value === '' ? '' : Number(value) 
        : value
    });

    // Mark field as touched
    if (!formTouched[name]) {
      setFormTouched({ ...formTouched, [name]: true });
    }
  };

  // Mark field as touched on blur
  const handleBlur = (e) => {
    const { name } = e.target;
    if (!formTouched[name]) {
      setFormTouched({ ...formTouched, [name]: true });
    }
  };

  // Toggle tips display
  const toggleTips = () => {
    setShowTips(!showTips);
  };

  // Clear form
  const clearForm = () => {
    setPatient({
      firstName: '',
      lastName: '',
      age: '',
      chronicDisease: '',
      temperature: '',
      heartRate: '',
      oxygenSaturation: ''
    });
    
    // Reset touched states
    const resetTouched = {};
    Object.keys(formTouched).forEach(key => {
      resetTouched[key] = false;
    });
    setFormTouched(resetTouched);
    
    // Clear any messages
    setMessage(null);
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched for validation
    const allTouched = {};
    Object.keys(formTouched).forEach(key => {
      allTouched[key] = true;
    });
    setFormTouched(allTouched);
    
    // Check required fields
    if (!patient.firstName || !patient.lastName || !patient.age) {
      setMessage({
        type: 'error',
        text: 'Please fill in all required fields'
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check if user is authenticated
      if (!user?.token) {
        setMessage({
          type: 'error',
          text: 'Authentication error. Please log in again.'
        });
        logout();
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
          doctor: user._id
        },
        config
      );
      
      setMessage({
        type: 'success',
        text: 'Patient added successfully!'
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
      
      // Reset touched states
      const resetTouched = {};
      Object.keys(formTouched).forEach(key => {
        resetTouched[key] = false;
      });
      setFormTouched(resetTouched);
      
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      if (error.response?.status === 401) {
        setMessage({
          type: 'error',
          text: 'Your session has expired. Please log in again.'
        });
        setTimeout(() => logout(), 2000);
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

  // Validation helper functions
  const getValidationState = (field) => {
    if (!formTouched[field]) return { isValid: true, message: '' };
    
    switch (field) {
      case 'firstName':
      case 'lastName':
        return { 
          isValid: patient[field].trim() !== '', 
          message: `${field === 'firstName' ? 'First name' : 'Last name'} is required` 
        };
      case 'age':
        return { 
          isValid: patient.age !== '' && !isNaN(patient.age) && patient.age > 0, 
          message: patient.age === '' ? 'Age is required' : 
                   isNaN(patient.age) ? 'Age must be a number' : 
                   patient.age <= 0 ? 'Age must be greater than 0' : ''
        };
      case 'temperature':
        if (patient.temperature === '') return { isValid: true, message: '' };
        return { 
          isValid: !isNaN(patient.temperature) && patient.temperature >= 35 && patient.temperature <= 42, 
          message: 'Temperature should be between 35°C and 42°C' 
        };
      case 'heartRate':
        if (patient.heartRate === '') return { isValid: true, message: '' };
        return { 
          isValid: !isNaN(patient.heartRate) && patient.heartRate >= 40 && patient.heartRate <= 200, 
          message: 'Heart rate should be between 40 and 200 bpm' 
        };
      case 'oxygenSaturation':
        if (patient.oxygenSaturation === '') return { isValid: true, message: '' };
        return { 
          isValid: !isNaN(patient.oxygenSaturation) && patient.oxygenSaturation >= 70 && patient.oxygenSaturation <= 100, 
          message: 'Oxygen saturation should be between 70% and 100%' 
        };
      default:
        return { isValid: true, message: '' };
    }
  };

  // Check if form has any validation errors
  const hasValidationErrors = () => {
    return Object.keys(formTouched).some(field => 
      formTouched[field] && !getValidationState(field).isValid
    );
  };

  // Check if all required fields are filled
  const areRequiredFieldsFilled = () => {
    return patient.firstName.trim() !== '' && 
           patient.lastName.trim() !== '' && 
           patient.age !== '' && 
           !isNaN(patient.age) && 
           patient.age > 0;
  };

  if (!user || user.role !== 'doctor') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <DoctorDashboardLayout>
      <div className="h-full flex flex-col">
        {/* Compact Header */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <FilePlus2 className="h-5 w-5 text-indigo-600 mr-2" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Add New Patient</h1>
              <p className="text-xs text-gray-500">Enter patient details to add them to your practice</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearForm}
              className="inline-flex items-center px-2 py-1 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              <X className="mr-1 h-3 w-3 text-gray-500" />
              Clear
            </button>
            <Link 
              href="/dashboard/patients/manage_patients" 
              className="inline-flex items-center px-2 py-1 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              <ArrowLeft className="mr-1 h-3 w-3 text-gray-500" />
              Back
            </Link>
          </div>
        </div>

        {/* Main Content Area - Single Screen */}
        <div className="flex-1 flex overflow-hidden">
          <div className="w-full max-w-6xl mx-auto flex">
            {/* Left side - Form Card */}
            <div className="flex-1 bg-white rounded-xl shadow-md overflow-hidden flex flex-col border border-gray-200">
              {/* Card Header */}
              <div className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-white/20 p-1 rounded-lg mr-2">
                    <UserPlus className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-sm font-medium text-white">Patient Information</h2>
                </div>
                <button
                  type="button"
                  onClick={toggleTips}
                  className="flex items-center bg-white/10 hover:bg-white/20 transition-colors duration-200 p-1 rounded-lg text-white text-xs"
                >
                  <Info className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Tips</span>
                </button>
              </div>
              
              {/* Form Status Message */}
              {message && (
                <div className={`mx-3 my-1.5 ${
                  message.type === 'success' 
                  ? 'bg-green-50 border-l-4 border-green-500 text-green-700' 
                  : 'bg-red-50 border-l-4 border-red-500 text-red-700'
                } p-1.5 rounded-md flex items-center text-xs shadow-sm`}>
                  {message.type === 'success' 
                    ? <CheckCircle className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" /> 
                    : <AlertCircle className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />}
                  <p>{message.text}</p>
                </div>
              )}
              
              {/* Form Content */}
              <div className="p-3 flex-1 overflow-hidden">
                <form onSubmit={handleSubmit} className="h-full">
                  <div className="grid grid-cols-3 gap-x-3 gap-y-2">
                    {/* Personal Information */}
                    <div className="col-span-3">
                      <h3 className="text-xs font-medium text-gray-700 mb-1 border-b border-gray-200 pb-1 flex items-center">
                        <User className="h-3 w-3 mr-1 text-indigo-500" />
                        Personal Information
                      </h3>
                    </div>

                    {/* First Name */}
                    <div className="col-span-1">
                      <label htmlFor="firstName" className="block text-xs font-medium text-gray-700">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                          <User className="h-3 w-3 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={patient.firstName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="First Name"
                          className={`block w-full text-xs pl-7 pr-2 py-1.5 placeholder-gray-400 border ${
                            formTouched.firstName 
                              ? getValidationState('firstName').isValid 
                                ? 'border-green-300 bg-green-50/30' 
                                : 'border-red-300 bg-red-50/30' 
                              : 'border-gray-300'
                          } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
                          required
                        />
                        {formTouched.firstName && getValidationState('firstName').isValid && (
                          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          </div>
                        )}
                      </div>
                      {formTouched.firstName && !getValidationState('firstName').isValid && (
                        <p className="mt-0.5 text-xs text-red-600">{getValidationState('firstName').message}</p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="col-span-1">
                      <label htmlFor="lastName" className="block text-xs font-medium text-gray-700">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                          <User className="h-3 w-3 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={patient.lastName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Last Name"
                          className={`block w-full text-xs pl-7 pr-2 py-1.5 placeholder-gray-400 border ${
                            formTouched.lastName 
                              ? getValidationState('lastName').isValid 
                                ? 'border-green-300 bg-green-50/30' 
                                : 'border-red-300 bg-red-50/30' 
                              : 'border-gray-300'
                          } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
                          required
                        />
                        {formTouched.lastName && getValidationState('lastName').isValid && (
                          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          </div>
                        )}
                      </div>
                      {formTouched.lastName && !getValidationState('lastName').isValid && (
                        <p className="mt-0.5 text-xs text-red-600">{getValidationState('lastName').message}</p>
                      )}
                    </div>

                    {/* Age */}
                    <div className="col-span-1">
                      <label htmlFor="age" className="block text-xs font-medium text-gray-700">
                        Age <span className="text-red-500">*</span>
                      </label>
                      <div className="relative mt-1">
                        <input
                          type="number"
                          id="age"
                          name="age"
                          value={patient.age}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="e.g. 45"
                          className={`block w-full text-xs px-2 py-1.5 placeholder-gray-400 border ${
                            formTouched.age 
                              ? getValidationState('age').isValid 
                                ? 'border-green-300 bg-green-50/30' 
                                : 'border-red-300 bg-red-50/30' 
                              : 'border-gray-300'
                          } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
                          required
                        />
                        {formTouched.age && getValidationState('age').isValid && (
                          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          </div>
                        )}
                      </div>
                      {formTouched.age && !getValidationState('age').isValid && (
                        <p className="mt-0.5 text-xs text-red-600">{getValidationState('age').message}</p>
                      )}
                    </div>

                    {/* Chronic Disease */}
                    <div className="col-span-3">
                      <label htmlFor="chronicDisease" className="block text-xs font-medium text-gray-700 flex items-center">
                        Chronic Disease 
                        <span className="text-gray-500 text-xs font-normal ml-1">(if any)</span>
                      </label>
                      <input
                        type="text"
                        id="chronicDisease"
                        name="chronicDisease"
                        value={patient.chronicDisease}
                        onChange={handleChange}
                        placeholder="e.g. Diabetes, Hypertension"
                        className="mt-1 block w-full text-xs px-2 py-1.5 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      />
                    </div>

                    {/* Vital Signs Header */}
                    <div className="col-span-3 mt-1">
                      <h3 className="text-xs font-medium text-gray-700 mb-1 border-b border-gray-200 pb-1 flex items-center">
                        <Heart className="h-3 w-3 mr-1 text-red-500" />
                        Initial Vital Signs <span className="text-gray-500 text-xs font-normal ml-1">(optional)</span>
                      </h3>
                    </div>

                    {/* Temperature */}
                    <div className="col-span-1">
                      <label htmlFor="temperature" className="block text-xs font-medium text-gray-700">
                        Temperature (°C)
                      </label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                          <Thermometer className="h-3 w-3 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          step="0.1"
                          id="temperature"
                          name="temperature"
                          value={patient.temperature}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="e.g. 36.5"
                          className={`block w-full text-xs pl-7 pr-2 py-1.5 placeholder-gray-400 border ${
                            formTouched.temperature && patient.temperature !== '' 
                              ? getValidationState('temperature').isValid 
                                ? 'border-green-300 bg-green-50/30' 
                                : 'border-red-300 bg-red-50/30' 
                              : 'border-gray-300'
                          } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
                        />
                        {formTouched.temperature && patient.temperature !== '' && getValidationState('temperature').isValid && (
                          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          </div>
                        )}
                      </div>
                      {formTouched.temperature && patient.temperature !== '' && !getValidationState('temperature').isValid && (
                        <p className="mt-0.5 text-xs text-red-600">{getValidationState('temperature').message}</p>
                      )}
                    </div>

                    {/* Heart Rate */}
                    <div className="col-span-1">
                      <label htmlFor="heartRate" className="block text-xs font-medium text-gray-700">
                        Heart Rate (bpm)
                      </label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                          <Heart className="h-3 w-3 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          id="heartRate"
                          name="heartRate"
                          value={patient.heartRate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="e.g. 75"
                          className={`block w-full text-xs pl-7 pr-2 py-1.5 placeholder-gray-400 border ${
                            formTouched.heartRate && patient.heartRate !== '' 
                              ? getValidationState('heartRate').isValid 
                                ? 'border-green-300 bg-green-50/30' 
                                : 'border-red-300 bg-red-50/30' 
                              : 'border-gray-300'
                          } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
                        />
                        {formTouched.heartRate && patient.heartRate !== '' && getValidationState('heartRate').isValid && (
                          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          </div>
                        )}
                      </div>
                      {formTouched.heartRate && patient.heartRate !== '' && !getValidationState('heartRate').isValid && (
                        <p className="mt-0.5 text-xs text-red-600">{getValidationState('heartRate').message}</p>
                      )}
                    </div>

                    {/* Oxygen Saturation */}
                    <div className="col-span-1">
                      <label htmlFor="oxygenSaturation" className="block text-xs font-medium text-gray-700">
                        Oxygen Saturation (%)
                      </label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                          <Percent className="h-3 w-3 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          id="oxygenSaturation"
                          name="oxygenSaturation"
                          value={patient.oxygenSaturation}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="e.g. 98"
                          className={`block w-full text-xs pl-7 pr-2 py-1.5 placeholder-gray-400 border ${
                            formTouched.oxygenSaturation && patient.oxygenSaturation !== '' 
                              ? getValidationState('oxygenSaturation').isValid 
                                ? 'border-green-300 bg-green-50/30' 
                                : 'border-red-300 bg-red-50/30' 
                              : 'border-gray-300'
                          } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
                        />
                        {formTouched.oxygenSaturation && patient.oxygenSaturation !== '' && getValidationState('oxygenSaturation').isValid && (
                          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          </div>
                        )}
                      </div>
                      {formTouched.oxygenSaturation && patient.oxygenSaturation !== '' && !getValidationState('oxygenSaturation').isValid && (
                        <p className="mt-0.5 text-xs text-red-600">{getValidationState('oxygenSaturation').message}</p>
                      )}
                    </div>

                    {/* Submit Button - Full Width */}
                    <div className="col-span-3 mt-3">
                      <button
                        type="submit"
                        disabled={isLoading || hasValidationErrors()}
                        className={`w-full flex justify-center items-center py-2 border border-transparent rounded-md shadow-sm text-white text-xs font-medium
                          ${isLoading || hasValidationErrors() 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : areRequiredFieldsFilled()
                              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700'
                              : 'bg-indigo-400'
                          } focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition-all duration-200`}
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                            Add Patient
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Right side - Form guide */}
            <div className={`${showTips ? 'block' : 'hidden lg:block'} w-64 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl shadow-md ml-4 p-4 text-white overflow-auto max-h-[calc(100vh-220px)]`}>
              {/* Mobile Close Button */}
              <div className="flex justify-between items-center mb-2 lg:hidden">
                <h3 className="font-medium text-sm">Quick Tips</h3>
                <button 
                  onClick={toggleTips} 
                  className="text-white/70 hover:text-white transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <h3 className="font-medium mb-2 text-sm hidden lg:block">Adding a new patient</h3>
              <p className="text-xs text-indigo-100 mb-4">
                Complete the form with the patient&apos;s basic information and initial vital signs.
              </p>
              
              <div className="space-y-3 mt-4">
                <div className="flex items-start">
                  <div className="mt-0.5 bg-white/20 rounded-full p-0.5">
                    <CheckCircle className="h-2 w-2 text-white" />
                  </div>
                  <p className="ml-2 text-xs text-indigo-100">Required fields are marked with *</p>
                </div>
                <div className="flex items-start">
                  <div className="mt-0.5 bg-white/20 rounded-full p-0.5">
                    <CheckCircle className="h-2 w-2 text-white" />
                  </div>
                  <p className="ml-2 text-xs text-indigo-100">Vital signs should be within normal ranges</p>
                </div>
                <div className="flex items-start">
                  <div className="mt-0.5 bg-white/20 rounded-full p-0.5">
                    <CheckCircle className="h-2 w-2 text-white" />
                  </div>
                  <p className="ml-2 text-xs text-indigo-100">Patient will be added to your patient list</p>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-white/20">
                <h4 className="font-medium text-xs mb-2">Reference Ranges</h4>
                <ul className="text-xs text-indigo-100 space-y-1.5">
                  <li className="flex justify-between">
                    <span>• Temperature:</span> 
                    <span className="font-medium">35-42°C</span>
                  </li>
                  <li className="flex justify-between">
                    <span>• Heart Rate:</span> 
                    <span className="font-medium">40-200 bpm</span>
                  </li>
                  <li className="flex justify-between">
                    <span>• O₂ Saturation:</span> 
                    <span className="font-medium">70-100%</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-6 pt-4 border-t border-white/20">
                <h4 className="font-medium text-xs mb-2">Next steps</h4>
                <ul className="text-xs text-indigo-100 space-y-1">
                  <li>• Record vital signs</li>
                  <li>• Set up monitoring alerts</li>
                  <li>• Schedule an appointment</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DoctorDashboardLayout>
  );
}