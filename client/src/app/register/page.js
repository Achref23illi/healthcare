'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    assignedDoctor: ''
  });
  const [role, setRole] = useState('patient');
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const { register, error } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users?role=doctor`);
        setDoctors(res.data);
      } catch (err) {
        console.error('Error fetching doctors:', err);
      }
    };

    fetchDoctors(); // Fetch doctors regardless of role
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');

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
        role
      };

      if (role === 'patient') {
        payload.age = formData.age;
        payload.assignedDoctor = formData.assignedDoctor;
      }

      await register(payload);

      router.push(role === 'doctor' ? '/dashboard' : '/patient-dashboard');
    } catch (err) {
      console.error('Registration error details:', err);
      setRegisterError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

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
              Create Account
            </h1>
            <p className="mt-3 text-gray-500">Sign up to get started with our platform</p>
          </div>

          {(registerError || error) && (
            <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md" role="alert">
              <p className="text-sm text-red-700">{registerError || error}</p>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-1 py-3 px-4 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
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
                  minLength={6}
                  className="mt-1 py-3 px-4 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={6}
                  className="mt-1 py-3 px-4 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              {/* Patient-specific fields */}
              {role === 'patient' && (
                <>
                  {/* Age */}
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                    <input
                      id="age"
                      name="age"
                      type="number"
                      required
                      className="mt-1 py-3 px-4 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g. 35"
                      value={formData.age}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Doctor selection */}
                  <div>
                    <label htmlFor="assignedDoctor" className="block text-sm font-medium text-gray-700">Assign to Doctor</label>
                    <select
                      id="assignedDoctor"
                      name="assignedDoctor"
                      required
                      className="mt-1 py-3 px-4 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      value={formData.assignedDoctor}
                      onChange={handleChange}
                    >
                      <option value="">Select a doctor</option>
                      {doctors
                        .filter(doc => doc.role === 'doctor')
                        .map(doc => (
                          <option key={doc._id} value={doc._id}>{doc.name}</option>
                        ))}
                    </select>
                  </div>
                </>
              )}

              {/* Role Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Register as</label>
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

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isLoading ? 'Creating account...' : 'Sign up'}
              </button>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
