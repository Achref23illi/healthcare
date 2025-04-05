'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Eye, 
  EyeOff, 
  UserPlus, 
  AlertCircle, 
  ArrowLeft, 
  CheckCircle, 
  User, 
  Mail, 
  Lock,
  Stethoscope 
} from 'lucide-react';

export default function RegisterPage() {
  // Form and auth state management
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formTouched, setFormTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const { register, error } = useAuth();
  const router = useRouter();

  // Form input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Mark field as touched
    if (!formTouched[name]) {
      setFormTouched({ ...formTouched, [name]: true });
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Mark field as touched on blur
  const handleBlur = (e) => {
    const { name } = e.target;
    if (!formTouched[name]) {
      setFormTouched({ ...formTouched, [name]: true });
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');

    // Mark all fields as touched for validation
    const allTouched = {};
    Object.keys(formTouched).forEach(key => {
      allTouched[key] = true;
    });
    setFormTouched(allTouched);

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setRegisterError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'doctor'
      };

      await register(payload);
      router.push('/dashboard');
    } catch (err) {
      console.error('Registration error details:', err);
      setRegisterError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Password validation helper functions
  const isPasswordValid = () => {
    return formData.password.length >= 6;
  };

  const isPasswordMatching = () => {
    return formData.password === formData.confirmPassword && formData.confirmPassword !== '';
  };

  // Check if form is ready for submission
  const isFormValid = () => {
    return formData.name && formData.email && 
      formData.password && isPasswordValid() && 
      formData.confirmPassword && isPasswordMatching();
  };

  // Get validation state for form fields
  const getValidationState = (field) => {
    if (!formTouched[field]) return { isValid: true, message: '' };
    
    switch (field) {
      case 'name':
        return { 
          isValid: !!formData.name, 
          message: !formData.name ? 'Name is required' : '' 
        };
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return { 
          isValid: emailRegex.test(formData.email), 
          message: !formData.email ? 'Email is required' : 
            !emailRegex.test(formData.email) ? 'Enter a valid email address' : '' 
        };
      case 'password':
        return { 
          isValid: isPasswordValid(), 
          message: !formData.password ? 'Password is required' : 
            !isPasswordValid() ? 'Password must be at least 6 characters' : '' 
        };
      case 'confirmPassword':
        return { 
          isValid: isPasswordMatching(), 
          message: !formData.confirmPassword ? 'Confirm your password' : 
            !isPasswordMatching() ? 'Passwords do not match' : '' 
        };
      default:
        return { isValid: true, message: '' };
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      {/* Header with Back Link */}
      <div className="flex items-center h-12 px-4">
        <Link href="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-200">
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span className="text-sm">Back to Home</span>
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center px-4 py-6 sm:py-8">
        <div className="w-full max-w-6xl">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl">
            <div className="flex flex-col md:flex-row h-full">
              {/* Left Side - Information and Branding */}
              <div className="md:w-2/5 lg:w-1/3 bg-gradient-to-br from-indigo-600 to-blue-600 text-white flex flex-col">
                <div className="h-full flex flex-col p-6 lg:p-8">
                  {/* Logo and Brand */}
                  <div className="mb-8">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Stethoscope className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  
                  {/* Headline */}
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold mb-2">Join Medico as a Doctor</h1>
                    <p className="text-indigo-100 text-sm mb-6">Create your doctor account and start providing exceptional healthcare to your patients.</p>
                  </div>
                  
                  {/* Benefits List */}
                  <div className="space-y-4 mt-4">
                    <div className="flex items-start">
                      <div className="mt-1 bg-white/20 rounded-full p-1">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                      <p className="ml-2 text-sm text-indigo-100">Monitor patients in real-time</p>
                    </div>
                    <div className="flex items-start">
                      <div className="mt-1 bg-white/20 rounded-full p-1">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                      <p className="ml-2 text-sm text-indigo-100">Receive critical alerts instantly</p>
                    </div>
                    <div className="flex items-start">
                      <div className="mt-1 bg-white/20 rounded-full p-1">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                      <p className="ml-2 text-sm text-indigo-100">Manage patient data securely</p>
                    </div>
                  </div>
                  
                  {/* Login Link */}
                  <div className="mt-auto pt-6">
                    <p className="text-xs text-indigo-200">
                      Already have an account?
                    </p>
                    <Link 
                      href="/login" 
                      className="inline-block mt-1 text-sm font-medium text-white hover:underline transition-all duration-200"
                    >
                      Sign in instead
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="md:w-3/5 lg:w-2/3 p-6 lg:p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Create your doctor account</h2>
                
                {/* Error Alert */}
                {(registerError || error) && (
                  <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded-md" role="alert">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                      <p className="text-sm text-red-700">{registerError || error}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="h-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {/* Name Field */}
                    <div className="relative">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          className={`appearance-none block w-full pl-10 pr-3 py-2 border ${
                            formTouched.name ? (getValidationState('name').isValid ? 'border-green-300' : 'border-red-300') : 'border-gray-300'
                          } rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors duration-200`}
                          placeholder="Dr. John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {formTouched.name && getValidationState('name').isValid && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                        )}
                      </div>
                      {formTouched.name && !getValidationState('name').isValid && (
                        <p className="mt-1 text-xs text-red-600">{getValidationState('name').message}</p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="relative">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          className={`appearance-none block w-full pl-10 pr-3 py-2 border ${
                            formTouched.email ? (getValidationState('email').isValid ? 'border-green-300' : 'border-red-300') : 'border-gray-300'
                          } rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors duration-200`}
                          placeholder="doctor@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {formTouched.email && getValidationState('email').isValid && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                        )}
                      </div>
                      {formTouched.email && !getValidationState('email').isValid && (
                        <p className="mt-1 text-xs text-red-600">{getValidationState('email').message}</p>
                      )}
                    </div>

                    {/* Password Field */}
                    <div className="relative">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required
                          minLength={6}
                          className={`appearance-none block w-full pl-10 pr-10 py-2 border ${
                            formTouched.password ? (getValidationState('password').isValid ? 'border-green-300' : 'border-red-300') : 'border-gray-300'
                          } rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors duration-200`}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {formTouched.password && !getValidationState('password').isValid && (
                        <p className="mt-1 text-xs text-red-600">{getValidationState('password').message}</p>
                      )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="relative">
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          required
                          minLength={6}
                          className={`appearance-none block w-full pl-10 pr-3 py-2 border ${
                            formTouched.confirmPassword ? (getValidationState('confirmPassword').isValid ? 'border-green-300' : 'border-red-300') : 'border-gray-300'
                          } rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors duration-200`}
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {formTouched.confirmPassword && getValidationState('confirmPassword').isValid && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                        )}
                      </div>
                      {formTouched.confirmPassword && !getValidationState('confirmPassword').isValid && (
                        <p className="mt-1 text-xs text-red-600">{getValidationState('confirmPassword').message}</p>
                      )}
                    </div>
                  </div>

                  {/* Terms and Conditions Checkbox */}
                  <div className="mt-6">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="terms"
                          name="terms"
                          type="checkbox"
                          required
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                      </div>
                      <div className="ml-2 text-sm text-gray-500">
                        <label htmlFor="terms">
                          I agree to the{" "}
                          <a href="#" className="text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a href="#" className="text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                            Privacy Policy
                          </a>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={isLoading || !isFormValid()}
                      className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white shadow-sm transition-all duration-200 ${
                        isFormValid()
                          ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:shadow-md'
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating account...
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Create Doctor Account
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}