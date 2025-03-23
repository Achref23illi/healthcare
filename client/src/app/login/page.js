'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [role, setRole] = useState('patient');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const { login, error } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    try {
      const userData = await login(formData.email, formData.password);

      // Redirect based on role (optional: verify role from response if needed)
      if (userData?.role === 'doctor' || role === 'doctor') {
        router.push('/dashboard');
      } else {
        router.push('/patient-dashboard');
      }
    } catch (err) {
      setLoginError(err?.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('Login page mounted');
    return () => {
      console.log('Login page unmounted');
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 via-purple-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 relative">
        <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl transform -rotate-1 opacity-50"></div>
        <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl transform rotate-1 opacity-50"></div>

        <div className="relative bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">
              Welcome Back
            </h1>
            <p className="mt-3 text-gray-500">Sign in to access your account</p>
          </div>

          {(loginError || error) && (
            <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-pulse" role="alert">
              <p className="text-sm text-red-700">{loginError || error}</p>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 py-3 px-4 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 py-3 px-4 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              {/* Role Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Login as</label>
                <div className="mt-2 flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setRole('patient')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                      role === 'patient'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    Patient
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('doctor')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                      role === 'doctor'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    Doctor
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link href="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </Link>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-gray-600">
                Don’t have an account?{' '}
                <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Create one
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
