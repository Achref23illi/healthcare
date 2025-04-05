'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { LogOut, User, Users, Bell, BarChart, Home, Thermometer, Menu, Settings, 
         Activity, Calendar, PieChart, AlertCircle, CheckCircle, Plus } from 'lucide-react';

export default function DoctorDashboardLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [alertsDropdownOpen, setAlertsDropdownOpen] = useState(false);
  const [alertCount, setAlertCount] = useState(0);
  const [alerts, setAlerts] = useState([]);

  const alertsDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    // If not logged in, redirect to login
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    // If logged in as patient, redirect to patient dashboard
    if (user && user.role === 'patient') {
      router.push('/patient-dashboard');
    }
  }, [user, loading, router]);

  // Fetch alerts data
  useEffect(() => {
    if (user?.token) {
      const fetchAlerts = async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          };
          
          // Fetch recent alerts (New status only)
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/alerts?status=New`,
            config
          );
          
          // Set alert count and actual alerts data
          const alertsData = response.data;
          setAlerts(alertsData);
          setAlertCount(alertsData.length);
        } catch (error) {
          console.error('Error fetching alerts:', error);
        }
      };

      fetchAlerts();
      
      // Set up an interval to refresh alerts periodically
      const intervalId = setInterval(fetchAlerts, 60000); // Refresh every minute
      
      // Clean up interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [user]);

  // Handle click outside for alerts dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (alertsDropdownRef.current && !alertsDropdownRef.current.contains(event.target)) {
        setAlertsDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }

    // Add event listener when dropdown is open
    if (alertsDropdownOpen || profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [alertsDropdownOpen, profileDropdownOpen]);

  // Handle alert click to navigate to patient profile
  const handleAlertClick = (alert) => {
    setAlertsDropdownOpen(false);
    
    // Check if alert contains a patient ID
    if (alert.patient) {
      router.push(`/dashboard/patients/vitals/${alert.patient}`);
    } else {
      // Fallback if patient ID is not available
      router.push('/dashboard/alerts');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Format timestamp for alerts
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Display loading state
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  // Navigation links for doctor
  const navLinks = [
    { href: '/dashboard', icon: <Home className="w-5 h-5" />, text: 'Dashboard' },
    { href: '/dashboard/patients/add_patient', icon: <User className="w-5 h-5" />, text: 'Add Patient' },
    { href: '/dashboard/patients/manage_patients', icon: <Users className="w-5 h-5" />, text: 'Manage Patients' },
    { href: '/dashboard/alerts', icon: <Bell className="w-5 h-5" />, text: 'Alerts' },
    { href: '/dashboard/appointments', icon: <Calendar className="w-5 h-5" />, text: 'Appointments' },
    { href: '/dashboard/analytics', icon: <PieChart className="w-5 h-5" />, text: 'Analytics' },
    { href: '/dashboard/settings', icon: <Settings className="w-5 h-5" />, text: 'Settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`w-72 bg-white shadow-lg fixed h-full transform transition-transform duration-300 ease-in-out z-20
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header with Logo */}
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-md bg-gradient-to-r from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                M
              </div>
              <h1 className="ml-3 text-xl font-bold text-gray-800">Medico</h1>
            </div>
          </div>
          
          {/* User Profile Section */}
          <div className="flex flex-col items-center px-6 py-5 border-b border-gray-200">
            <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden mb-3">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <User className="h-8 w-8 text-indigo-600" />
              )}
            </div>
            <h2 className="text-md font-semibold text-gray-800">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <span className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Doctor
            </span>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex-grow px-4 py-5 overflow-y-auto">
            <ul className="space-y-1">
            {navLinks.map((link, index) => (
              <li key={index}>
                <Link 
                  href={link.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                    pathname === link.href 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{link.icon}</span>
                  <span className="font-medium">{link.text}</span>
                  
                  {/* Dynamic Notification Badge for Alerts */}
                  {link.text === 'Alerts' && alertCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {alertCount}
                    </span>
                  )}
                </Link>
              </li>
            ))}
            </ul>
          </nav>
          
          {/* Logout Button */}
          <div className="px-4 py-5 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-72">
        {/* Top Navigation Bar */}
        <header className="bg-white shadow-sm z-10 sticky top-0">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            {/* Search Bar (hidden on small screens) */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Action Icons */}
            <div className="flex items-center space-x-4">
              {/* Notifications Dropdown */}
              <div className="relative">
                <button 
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-600 focus:outline-none"
                  onClick={() => {
                    setAlertsDropdownOpen(!alertsDropdownOpen);
                    setProfileDropdownOpen(false);
                  }}
                >
                  <Bell className="h-6 w-6" />
                  {alertCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                      {alertCount}
                    </span>
                  )}
                </button>
                
                {/* Alerts Dropdown Menu */}
                {alertsDropdownOpen && (
                  <div ref={alertsDropdownRef} className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl py-1 z-30 max-h-96 overflow-y-auto">
                    <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
                      {alertCount > 0 && (
                        <span className="text-xs px-2 py-0.5 bg-red-100 text-red-800 rounded-full">
                          {alertCount} new
                        </span>
                      )}
                    </div>
                    
                    {alerts.length > 0 ? (
                      <div>
                        {alerts.map((alert) => (
                          <div 
                            key={alert._id} 
                            className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer"
                            onClick={() => handleAlertClick(alert)}
                          >
                            <div className="flex items-start">
                              <div className={`flex-shrink-0 h-8 w-8 rounded-full ${
                                alert.severity === 'Critical' ? 'bg-red-100' : 
                                alert.severity === 'High' ? 'bg-orange-100' : 
                                alert.severity === 'Medium' ? 'bg-yellow-100' : 'bg-blue-100'
                              } flex items-center justify-center mr-3`}>
                                <AlertCircle className={`h-4 w-4 ${
                                  alert.severity === 'Critical' ? 'text-red-600' : 
                                  alert.severity === 'High' ? 'text-orange-600' : 
                                  alert.severity === 'Medium' ? 'text-yellow-600' : 'text-blue-600'
                                }`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-800 line-clamp-2">{alert.message}</p>
                                <div className="mt-1 flex justify-between items-center">
                                  <p className="text-xs text-gray-500">
                                    {formatTimestamp(alert.createdAt)}
                                  </p>
                                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                    alert.severity === 'Critical' ? 'bg-red-100 text-red-800' : 
                                    alert.severity === 'High' ? 'bg-orange-100 text-orange-800' : 
                                    alert.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {alert.severity}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <div className="p-3 text-center">
                          <Link 
                            href="/dashboard/alerts"
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                            onClick={() => setAlertsDropdownOpen(false)}
                          >
                            View all notifications
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="px-4 py-6 text-center">
                        <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-gray-100 mb-3">
                          <CheckCircle className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500">No new notifications</p>
                      </div>
                    )}
                    
                    {/* Add New Alert Button */}
                    <div className="px-4 py-3 border-t border-gray-100">
                      <button 
                        className="w-full px-4 py-2 bg-indigo-600 text-white text-xs font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center"
                        onClick={() => {
                          setAlertsDropdownOpen(false);
                          router.push('/dashboard/alerts?create=true');
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Create New Alert
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Profile Menu */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setProfileDropdownOpen(!profileDropdownOpen);
                    setAlertsDropdownOpen(false);
                  }}
                  className="flex items-center focus:outline-none"
                >
                  <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-5 w-5 text-indigo-600" />
                    )}
                  </div>
                </button>
                
                {/* Profile Dropdown Menu */}
                {profileDropdownOpen && (
                  <div ref={profileDropdownRef} className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30">
                    <Link 
                      href="/dashboard/settings" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Your Settings
                    </Link>
                    <Link 
                      href="/dashboard/settings" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}