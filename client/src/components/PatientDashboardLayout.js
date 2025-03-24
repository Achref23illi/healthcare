'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LogOut, User, Heart, Bell, Home, Thermometer, Menu, Settings, Activity, Calendar, FileText } from 'lucide-react';

export default function PatientDashboardLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [healthStats, setHealthStats] = useState({
    heartRate: '75 bpm',
    temperature: '36.5°C'
  });

  useEffect(() => {
    // If not logged in, redirect to login
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    // If logged in as doctor, redirect to doctor dashboard
    if (user && user.role === 'doctor') {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Display loading state
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  // Navigation links for patient
  const navLinks = [
    { href: '/patient-dashboard', icon: <Home className="w-5 h-5" />, text: 'Home' },
    { href: '/patient-dashboard/vitals', icon: <Activity className="w-5 h-5" />, text: 'My Vitals' },
    { href: '/patient-dashboard/health-records', icon: <FileText className="w-5 h-5" />, text: 'Health Records' },
    { href: '/patient-dashboard/appointments', icon: <Calendar className="w-5 h-5" />, text: 'Appointments' },
    { href: '/patient-dashboard/alerts', icon: <Bell className="w-5 h-5" />, text: 'Alerts' },
    { href: '/patient-dashboard/profile', icon: <Settings className="w-5 h-5" />, text: 'Settings' },
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
              <div className="h-10 w-10 rounded-md bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                M
              </div>
              <h1 className="ml-3 text-xl font-bold text-gray-800">Medico</h1>
            </div>
          </div>
          
          {/* User Profile Section */}
          <div className="flex flex-col items-center px-6 py-5 border-b border-gray-200">
            <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden mb-3">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <User className="h-8 w-8 text-purple-600" />
              )}
            </div>
            <h2 className="text-md font-semibold text-gray-800">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <span className="mt-2 px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
              Patient
            </span>
          </div>
          
          {/* Health Status Card */}
          <div className="mx-4 my-5 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
            <h3 className="text-sm font-medium text-purple-800 mb-2">Health Status</h3>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Heart className="h-5 w-5 text-pink-500 mr-2" />
                <span className="text-sm font-medium text-gray-900">Heart Rate</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{healthStats.heartRate}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center">
                <Thermometer className="h-5 w-5 text-pink-500 mr-2" />
                <span className="text-sm font-medium text-gray-900">Temperature</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{healthStats.temperature}</span>
            </div>
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
                        ? 'bg-purple-50 text-purple-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3">{link.icon}</span>
                    <span className="font-medium">{link.text}</span>
                    
                    {/* Notification Badge for Alerts */}
                    {link.text === 'Alerts' && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        2
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
            
            <div className="flex-1 flex justify-center md:justify-start">
              <h1 className="text-xl font-semibold text-gray-800 md:ml-4">
                {pathname === '/patient-dashboard' ? 'My Health Dashboard' :
                 pathname === '/patient-dashboard/vitals' ? 'My Vital Signs' :
                 pathname === '/patient-dashboard/health-records' ? 'Health Records' :
                 pathname === '/patient-dashboard/appointments' ? 'My Appointments' :
                 pathname === '/patient-dashboard/alerts' ? 'Health Alerts' :
                 pathname === '/patient-dashboard/profile' ? 'My Profile' : ''}
              </h1>
            </div>
            
            {/* Action Icons */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 focus:outline-none">
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    2
                  </span>
                </button>
              </div>
              
              {/* Profile Menu */}
              <div className="relative">
                <button 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center focus:outline-none"
                >
                  <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-5 w-5 text-purple-600" />
                    )}
                  </div>
                </button>
                
                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link 
                      href="/patient-dashboard/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link 
                      href="/patient-dashboard/settings" 
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