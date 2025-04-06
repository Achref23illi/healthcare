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
  FilePlus2,
  ChevronRight,
  CalendarClock,
  ClipboardList,
  ShieldCheck,
  AlertTriangle,
  ChevronLeft
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
    gender: '',
    email: '',
    phone: '',
    chronicDisease: '',
    allergies: '',
    medication: '',
    temperature: '',
    heartRate: '',
    oxygenSaturation: '',
    notes: ''
  });

  // UI state
  const [formTouched, setFormTouched] = useState({
    firstName: false,
    lastName: false,
    age: false,
    gender: false,
    email: false,
    phone: false,
    chronicDisease: false,
    allergies: false,
    medication: false,
    temperature: false,
    heartRate: false,
    oxygenSaturation: false,
    notes: false
  });
  
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [percentComplete, setPercentComplete] = useState(33);

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

  // Navigate between form steps
  const goToStep = (step) => {
    setCurrentStep(step);
    setPercentComplete(step === 1 ? 33 : step === 2 ? 66 : 100);
  };

  // Go to next step
  const goToNextStep = () => {
    const nextStep = currentStep + 1;
    if (nextStep <= 3) {
      goToStep(nextStep);
    }
  };

  // Go to previous step
  const goToPrevStep = () => {
    const prevStep = currentStep - 1;
    if (prevStep >= 1) {
      goToStep(prevStep);
    }
  };

  // Clear form
  const clearForm = () => {
    setPatient({
      firstName: '',
      lastName: '',
      age: '',
      gender: '',
      email: '',
      phone: '',
      chronicDisease: '',
      allergies: '',
      medication: '',
      temperature: '',
      heartRate: '',
      oxygenSaturation: '',
      notes: ''
    });
    
    // Reset touched states
    const resetTouched = {};
    Object.keys(formTouched).forEach(key => {
      resetTouched[key] = false;
    });
    setFormTouched(resetTouched);
    
    // Clear any messages and return to first step
    setMessage(null);
    setCurrentStep(1);
    setPercentComplete(33);
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
      setCurrentStep(1); // Return to first step if basic info is missing
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
      
      // Prepare patient data, removing empty fields
      const patientData = { ...patient, doctor: user._id };
      Object.keys(patientData).forEach(key => {
        if (patientData[key] === '') {
          delete patientData[key];
        }
      });
      
      // Send request to backend API
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/patients`,
        patientData,
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
        gender: '',
        email: '',
        phone: '',
        chronicDisease: '',
        allergies: '',
        medication: '',
        temperature: '',
        heartRate: '',
        oxygenSaturation: '',
        notes: ''
      });
      
      // Reset touched states
      const resetTouched = {};
      Object.keys(formTouched).forEach(key => {
        resetTouched[key] = false;
      });
      setFormTouched(resetTouched);
      
      // Return to first step
      setCurrentStep(1);
      setPercentComplete(33);
      
      setTimeout(() => {
        setMessage(null);
        router.push('/dashboard/patients/manage_patients');
      }, 2000);
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
      case 'email':
        if (patient.email === '') return { isValid: true, message: '' };
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return {
          isValid: emailRegex.test(patient.email),
          message: 'Enter a valid email address'
        };
      case 'phone':
        if (patient.phone === '') return { isValid: true, message: '' };
        return {
          isValid: patient.phone.length >= 8,
          message: 'Enter a valid phone number'
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

  // Check if current step has validation errors
  const currentStepHasErrors = () => {
    if (currentStep === 1) {
      return ['firstName', 'lastName', 'age', 'gender', 'email', 'phone'].some(field => 
        formTouched[field] && !getValidationState(field).isValid
      );
    } else if (currentStep === 2) {
      return ['chronicDisease', 'allergies', 'medication'].some(field => 
        formTouched[field] && !getValidationState(field).isValid
      );
    } else {
      return ['temperature', 'heartRate', 'oxygenSaturation'].some(field => 
        formTouched[field] && !getValidationState(field).isValid
      );
    }
  };

  // Check if all required fields are filled for current step
  const requiredFieldsFilledForStep = () => {
    if (currentStep === 1) {
      return patient.firstName.trim() !== '' && 
             patient.lastName.trim() !== '' && 
             patient.age !== '' && 
             !isNaN(patient.age) && 
             patient.age > 0;
    }
    return true; // Other steps don't have required fields
  };

  // Check if form has any validation errors overall
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
        {/* Enhanced header with progress bar */}
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden border border-gray-200">
          <div className="px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                <UserPlus className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Add New Patient</h1>
                <p className="text-sm text-gray-500 mt-0.5">Complete the form to register a new patient</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link 
                href="/dashboard/patients/manage_patients" 
                className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
              >
                <ArrowLeft className="mr-1.5 h-4 w-4 text-gray-500" />
                Cancel
              </Link>
              <button
                onClick={clearForm}
                className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
              >
                <X className="mr-1.5 h-4 w-4 text-gray-500" />
                Reset Form
              </button>
            </div>
          </div>
          
          {/* Progress bar and steps */}
          <div className="flex justify-between bg-gray-50 border-t border-gray-200 px-6 py-3">
            <div className="hidden sm:flex items-center space-x-6">
              <button 
                onClick={() => goToStep(1)}
                className={`flex items-center ${currentStep === 1 ? 'text-indigo-600' : 'text-gray-500'}`}
              >
                <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-2 ${
                  currentStep === 1 ? 'bg-indigo-100 text-indigo-600' : 
                  currentStep > 1 ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > 1 ? <CheckCircle className="h-4 w-4" /> : '1'}
                </div>
                <span className={`text-sm font-medium ${currentStep === 1 ? 'text-indigo-600' : 'text-gray-500'}`}>Basic Info</span>
              </button>
              
              <div className="h-0.5 w-6 bg-gray-200"></div>
              
              <button 
                onClick={() => currentStep > 1 || areRequiredFieldsFilled() ? goToStep(2) : null}
                className={`flex items-center ${
                  !areRequiredFieldsFilled() && currentStep < 2 ? 'opacity-50 cursor-not-allowed' : 
                  currentStep === 2 ? 'text-indigo-600' : 'text-gray-500'
                }`}
                disabled={!areRequiredFieldsFilled() && currentStep < 2}
              >
                <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-2 ${
                  currentStep === 2 ? 'bg-indigo-100 text-indigo-600' : 
                  currentStep > 2 ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > 2 ? <CheckCircle className="h-4 w-4" /> : '2'}
                </div>
                <span className={`text-sm font-medium ${currentStep === 2 ? 'text-indigo-600' : 'text-gray-500'}`}>Medical History</span>
              </button>
              
              <div className="h-0.5 w-6 bg-gray-200"></div>
              
              <button 
                onClick={() => currentStep > 2 || areRequiredFieldsFilled() ? goToStep(3) : null}
                className={`flex items-center ${
                  !areRequiredFieldsFilled() && currentStep < 3 ? 'opacity-50 cursor-not-allowed' : 
                  currentStep === 3 ? 'text-indigo-600' : 'text-gray-500'
                }`}
                disabled={!areRequiredFieldsFilled() && currentStep < 3}
              >
                <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-2 ${
                  currentStep === 3 ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-500'
                }`}>
                  3
                </div>
                <span className={`text-sm font-medium ${currentStep === 3 ? 'text-indigo-600' : 'text-gray-500'}`}>Vital Signs</span>
              </button>
            </div>
            
            {/* Mobile progress indicator */}
            <div className="flex items-center sm:hidden">
              <span className="text-xs font-medium text-gray-500">Step {currentStep} of 3</span>
            </div>
            
            <div className="w-full sm:w-1/3">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-300"
                  style={{ width: `${percentComplete}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area with Multi-Step Form */}
        <div className="flex-1 flex overflow-hidden">
          <div className="w-full max-w-6xl mx-auto flex">
            {/* Left side - Form Card */}
            <div className="flex-1 bg-white rounded-xl shadow-md overflow-hidden flex flex-col border border-gray-200">
              {/* Form Status Message */}
              {message && (
                <div className={`mx-6 my-3 ${
                  message.type === 'success' 
                  ? 'bg-green-50 border-l-4 border-green-500 text-green-700' 
                  : 'bg-red-50 border-l-4 border-red-500 text-red-700'
                } p-3 rounded-md flex items-center text-sm shadow-sm`}>
                  {message.type === 'success' 
                    ? <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" /> 
                    : <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />}
                  <p>{message.text}</p>
                </div>
              )}
              
              {/* Form Content */}
              <div className="p-6 flex-1 overflow-auto">
                <form onSubmit={handleSubmit} className="h-full">
                  {/* Step 1: Basic Information */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="flex items-center mb-4">
                        <User className="h-5 w-5 text-indigo-500 mr-2" />
                        <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {/* First Name */}
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                            First Name <span className="text-red-500">*</span>
                          </label>
                          <div className="relative mt-1">
                            <input
                              type="text"
                              id="firstName"
                              name="firstName"
                              value={patient.firstName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="First Name"
                              className={`block w-full px-4 py-2.5 text-gray-800 placeholder-gray-400 border ${
                                formTouched.firstName 
                                  ? getValidationState('firstName').isValid 
                                    ? 'border-green-300 bg-green-50/30' 
                                    : 'border-red-300 bg-red-50/30' 
                                  : 'border-gray-300'
                              } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
                              required
                            />
                            {formTouched.firstName && getValidationState('firstName').isValid && (
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              </div>
                            )}
                          </div>
                          {formTouched.firstName && !getValidationState('firstName').isValid && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              {getValidationState('firstName').message}
                            </p>
                          )}
                        </div>

                        {/* Last Name */}
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                            Last Name <span className="text-red-500">*</span>
                          </label>
                          <div className="relative mt-1">
                            <input
                              type="text"
                              id="lastName"
                              name="lastName"
                              value={patient.lastName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="Last Name"
                              className={`block w-full px-4 py-2.5 text-gray-800 placeholder-gray-400 border ${
                                formTouched.lastName 
                                  ? getValidationState('lastName').isValid 
                                    ? 'border-green-300 bg-green-50/30' 
                                    : 'border-red-300 bg-red-50/30' 
                                  : 'border-gray-300'
                              } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
                              required
                            />
                            {formTouched.lastName && getValidationState('lastName').isValid && (
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              </div>
                            )}
                          </div>
                          {formTouched.lastName && !getValidationState('lastName').isValid && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              {getValidationState('lastName').message}
                            </p>
                          )}
                        </div>

                        {/* Age */}
                        <div>
                          <label htmlFor="age" className="block text-sm font-medium text-gray-700">
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
                              className={`block w-full px-4 py-2.5 text-gray-800 placeholder-gray-400 border ${
                                formTouched.age 
                                  ? getValidationState('age').isValid 
                                    ? 'border-green-300 bg-green-50/30' 
                                    : 'border-red-300 bg-red-50/30' 
                                  : 'border-gray-300'
                              } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
                              required
                            />
                            {formTouched.age && getValidationState('age').isValid && (
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              </div>
                            )}
                          </div>
                          {formTouched.age && !getValidationState('age').isValid && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              {getValidationState('age').message}
                            </p>
                          )}
                        </div>

                        {/* Gender */}
                        <div>
                          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                            Gender
                          </label>
                          <div className="relative mt-1">
                            <select
                              id="gender"
                              name="gender"
                              value={patient.gender}
                              onChange={handleChange}
                              className="block w-full px-4 py-2.5 text-gray-800 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                            >
                              <option value="">Select gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>

                        {/* Email */}
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <div className="relative mt-1">
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={patient.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="patient@example.com"
                              className={`block w-full px-4 py-2.5 text-gray-800 placeholder-gray-400 border ${
                                formTouched.email && patient.email !== '' 
                                  ? getValidationState('email').isValid 
                                    ? 'border-green-300 bg-green-50/30' 
                                    : 'border-red-300 bg-red-50/30' 
                                  : 'border-gray-300'
                              } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
                            />
                            {formTouched.email && patient.email !== '' && getValidationState('email').isValid && (
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              </div>
                            )}
                          </div>
                          {formTouched.email && patient.email !== '' && !getValidationState('email').isValid && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              {getValidationState('email').message}
                            </p>
                          )}
                        </div>

                        {/* Phone */}
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone
                          </label>
                          <div className="relative mt-1">
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={patient.phone}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="Phone number"
                              className={`block w-full px-4 py-2.5 text-gray-800 placeholder-gray-400 border ${
                                formTouched.phone && patient.phone !== '' 
                                  ? getValidationState('phone').isValid 
                                    ? 'border-green-300 bg-green-50/30' 
                                    : 'border-red-300 bg-red-50/30' 
                                  : 'border-gray-300'
                              } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
                            />
                            {formTouched.phone && patient.phone !== '' && getValidationState('phone').isValid && (
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              </div>
                            )}
                          </div>
                          {formTouched.phone && patient.phone !== '' && !getValidationState('phone').isValid && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              {getValidationState('phone').message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Medical History */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="flex items-center mb-4">
                        <ClipboardList className="h-5 w-5 text-indigo-500 mr-2" />
                        <h2 className="text-lg font-medium text-gray-900">Medical History</h2>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-y-4">
                        {/* Chronic Disease */}
                        <div>
                          <label htmlFor="chronicDisease" className="block text-sm font-medium text-gray-700 flex items-center">
                            Chronic Disease 
                            <span className="text-gray-500 text-sm font-normal ml-2">(if any)</span>
                          </label>
                          <div className="relative mt-1">
                            <input
                              type="text"
                              id="chronicDisease"
                              name="chronicDisease"
                              value={patient.chronicDisease}
                              onChange={handleChange}
                              placeholder="e.g. Diabetes, Hypertension"
                              className="block w-full px-4 py-2.5 text-gray-800 placeholder-gray-400 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                            />
                          </div>
                        </div>

                        {/* Allergies */}
                        <div>
                          <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">
                            Allergies
                          </label>
                          <div className="relative mt-1">
                            <input
                              type="text"
                              id="allergies"
                              name="allergies"
                              value={patient.allergies}
                              onChange={handleChange}
                              placeholder="e.g. Penicillin, Peanuts"
                              className="block w-full px-4 py-2.5 text-gray-800 placeholder-gray-400 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                            />
                          </div>
                        </div>

                        {/* Current Medication */}
                        <div>
                          <label htmlFor="medication" className="block text-sm font-medium text-gray-700">
                            Current Medication
                          </label>
                          <div className="relative mt-1">
                            <input
                              type="text"
                              id="medication"
                              name="medication"
                              value={patient.medication}
                              onChange={handleChange}
                              placeholder="List of current medications"
                              className="block w-full px-4 py-2.5 text-gray-800 placeholder-gray-400 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                            />
                          </div>
                        </div>

                        {/* Notes */}
                        <div>
                          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                            Additional Notes
                          </label>
                          <div className="relative mt-1">
                            <textarea
                              id="notes"
                              name="notes"
                              value={patient.notes}
                              onChange={handleChange}
                              rows={4}
                              placeholder="Any other relevant medical information"
                              className="block w-full px-4 py-2.5 text-gray-800 placeholder-gray-400 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Vital Signs */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="flex items-center mb-4">
                        <Heart className="h-5 w-5 text-red-500 mr-2" />
                        <h2 className="text-lg font-medium text-gray-900">Initial Vital Signs</h2>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                        {/* Reference Ranges Card */}
                        <div className="md:col-span-3 bg-blue-50 rounded-lg p-4 mb-2 border border-blue-100">
                          <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                            <ShieldCheck className="h-4 w-4 mr-2" />
                            Reference Ranges
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex justify-between items-center p-2 bg-white rounded-md border border-blue-100">
                              <div className="flex items-center">
                                <Thermometer className="h-4 w-4 text-red-500 mr-2" />
                                <span className="text-sm text-gray-700">Temperature:</span>
                              </div>
                              <span className="text-sm font-medium text-gray-900">35-42°C</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-white rounded-md border border-blue-100">
                              <div className="flex items-center">
                                <Heart className="h-4 w-4 text-red-500 mr-2" />
                                <span className="text-sm text-gray-700">Heart Rate:</span>
                              </div>
                              <span className="text-sm font-medium text-gray-900">40-200 bpm</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-white rounded-md border border-blue-100">
                              <div className="flex items-center">
                                <Percent className="h-4 w-4 text-blue-500 mr-2" />
                                <span className="text-sm text-gray-700">O₂ Saturation:</span>
                              </div>
                              <span className="text-sm font-medium text-gray-900">70-100%</span>
                            </div>
                          </div>
                        </div>

                        {/* Temperature */}
                        <div>
                          <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">
                            Temperature (°C)
                          </label>
                          <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Thermometer className="h-5 w-5 text-gray-400" />
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
                              className={`block w-full pl-10 pr-3 py-2.5 text-gray-800 placeholder-gray-400 border ${
                                formTouched.temperature && patient.temperature !== '' 
                                  ? getValidationState('temperature').isValid 
                                    ? 'border-green-300 bg-green-50/30' 
                                    : 'border-red-300 bg-red-50/30' 
                                  : 'border-gray-300'
                              } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
                            />
                            {formTouched.temperature && patient.temperature !== '' && getValidationState('temperature').isValid && (
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              </div>
                            )}
                          </div>
                          {formTouched.temperature && patient.temperature !== '' && !getValidationState('temperature').isValid && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              {getValidationState('temperature').message}
                            </p>
                          )}
                        </div>

                        {/* Heart Rate */}
                        <div>
                          <label htmlFor="heartRate" className="block text-sm font-medium text-gray-700">
                            Heart Rate (bpm)
                          </label>
                          <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Heart className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="number"
                              id="heartRate"
                              name="heartRate"
                              value={patient.heartRate}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="e.g. 75"
                              className={`block w-full pl-10 pr-3 py-2.5 text-gray-800 placeholder-gray-400 border ${
                                formTouched.heartRate && patient.heartRate !== '' 
                                  ? getValidationState('heartRate').isValid 
                                    ? 'border-green-300 bg-green-50/30' 
                                    : 'border-red-300 bg-red-50/30' 
                                  : 'border-gray-300'
                              } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
                            />
                            {formTouched.heartRate && patient.heartRate !== '' && getValidationState('heartRate').isValid && (
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              </div>
                            )}
                          </div>
                          {formTouched.heartRate && patient.heartRate !== '' && !getValidationState('heartRate').isValid && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              {getValidationState('heartRate').message}
                            </p>
                          )}
                        </div>

                        {/* Oxygen Saturation */}
                        <div>
                          <label htmlFor="oxygenSaturation" className="block text-sm font-medium text-gray-700">
                            Oxygen Saturation (%)
                          </label>
                          <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Percent className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="number"
                              id="oxygenSaturation"
                              name="oxygenSaturation"
                              value={patient.oxygenSaturation}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="e.g. 98"
                              className={`block w-full pl-10 pr-3 py-2.5 text-gray-800 placeholder-gray-400 border ${
                                formTouched.oxygenSaturation && patient.oxygenSaturation !== '' 
                                  ? getValidationState('oxygenSaturation').isValid 
                                    ? 'border-green-300 bg-green-50/30' 
                                    : 'border-red-300 bg-red-50/30' 
                                  : 'border-gray-300'
                              } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
                            />
                            {formTouched.oxygenSaturation && patient.oxygenSaturation !== '' && getValidationState('oxygenSaturation').isValid && (
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              </div>
                            )}
                          </div>
                          {formTouched.oxygenSaturation && patient.oxygenSaturation !== '' && !getValidationState('oxygenSaturation').isValid && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              {getValidationState('oxygenSaturation').message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>
              
              {/* Form Navigation Buttons */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={goToPrevStep}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1.5" />
                    Previous
                  </button>
                ) : (
                  <div></div> // Empty div to maintain layout
                )}
                
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={goToNextStep}
                    disabled={!requiredFieldsFilledForStep() || currentStepHasErrors()}
                    className={`flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium ${
                      !requiredFieldsFilledForStep() || currentStepHasErrors()
                        ? 'bg-indigo-300 cursor-not-allowed text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200`}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading || hasValidationErrors() || !areRequiredFieldsFilled()}
                    className={`flex items-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium ${
                      isLoading || hasValidationErrors() || !areRequiredFieldsFilled()
                        ? 'bg-green-300 cursor-not-allowed text-white'
                        : 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200`}
                    onClick={handleSubmit}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-1.5" />
                        Add Patient
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Right side - Form guide */}
            <div className="hidden xl:block w-80 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl shadow-md ml-6 p-5 text-white overflow-auto max-h-[calc(100vh-220px)]">
              <div className="mb-4">
                <h3 className="font-medium text-lg">Adding a new patient</h3>
                <p className="text-indigo-100 mt-1">
                  Complete all required information to register a new patient in your practice.
                </p>
              </div>
              
              <div className="mt-8">
                <div className="flex items-center mb-3">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 ${
                    currentStep === 1 ? 'bg-white text-indigo-600' : 
                    currentStep > 1 ? 'bg-green-400 text-white' : 'bg-white/30 text-white'
                  }`}>
                    {currentStep > 1 ? <CheckCircle className="h-4 w-4" /> : '1'}
                  </div>
                  <div>
                    <h4 className="font-medium">Basic Information</h4>
                    <p className="text-xs text-indigo-100">Patient personal details</p>
                  </div>
                </div>
                
                <div className="w-0.5 h-6 bg-white/20 ml-3"></div>
                
                <div className="flex items-center mb-3">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 ${
                    currentStep === 2 ? 'bg-white text-indigo-600' : 
                    currentStep > 2 ? 'bg-green-400 text-white' : 'bg-white/30 text-white'
                  }`}>
                    {currentStep > 2 ? <CheckCircle className="h-4 w-4" /> : '2'}
                  </div>
                  <div>
                    <h4 className="font-medium">Medical History</h4>
                    <p className="text-xs text-indigo-100">Past conditions and notes</p>
                  </div>
                </div>
                
                <div className="w-0.5 h-6 bg-white/20 ml-3"></div>
                
                <div className="flex items-center">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 ${
                    currentStep === 3 ? 'bg-white text-indigo-600' : 'bg-white/30 text-white'
                  }`}>
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Vital Signs</h4>
                    <p className="text-xs text-indigo-100">Initial health metrics</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/20">
                <h4 className="font-medium flex items-center">
                  <CalendarClock className="h-4 w-4 mr-2" />
                  What&apos;s next?
                </h4>
                <ul className="mt-3 space-y-2 text-sm text-indigo-100">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-indigo-200" />
                    After adding a patient, you can record their vital signs regularly
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-indigo-200" />
                    Set up monitoring alerts for critical conditions
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-indigo-200" />
                    Schedule appointments for follow-up care
                  </li>
                </ul>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <h4 className="font-medium text-white flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    Did you know?
                  </h4>
                  <p className="mt-2 text-sm text-indigo-100">
                    Regularly updated patient records help identify health trends and improve care outcomes by up to 35%.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DoctorDashboardLayout>
  );
}