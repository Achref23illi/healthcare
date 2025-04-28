'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import {
  LogOut, User, Users, Bell, BarChart, Home, Thermometer, Menu, Settings,
  Activity, Calendar, PieChart, AlertCircle, CheckCircle, Plus, Search,
  Layers, ClipboardList, Clock, Stethoscope, Shield
} from 'lucide-react';

export default function DoctorDashboardLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [alertsDropdownOpen, setAlertsDropdownOpen] = useState(false);
  const [alertCount, setAlertCount] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const alertsDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Auth and redirect logic
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user && user.role !== 'doctor') {
      logout();
      router.push('/login');
    }
  }, [user, loading, router, logout]);

  // Fetch alerts data
  // In DoctorDashboardLayout.js
  useEffect(() => {
    if (user?.token) {
      const fetchAlerts = async () => {
        try {
          console.log('Fetching alerts for user:', user.id);

          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          };

          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/alerts?status=New`,
            config
          );

          console.log('Alerts response:', response.data);
          const alertsData = response.data;
          setAlerts(alertsData);
          setAlertCount(alertsData.length);
        } catch (error) {
          console.error('Error fetching alerts:', error.response?.data || error.message);
        }
      };

      fetchAlerts();
    }
  }, [user]);

  // Handle click outside for dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (alertsDropdownRef.current && !alertsDropdownRef.current.contains(event.target)) {
        setAlertsDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }

    if (alertsDropdownOpen || profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [alertsDropdownOpen, profileDropdownOpen]);

  // Handle alert click 
  const handleAlertClick = (alert) => {
    setAlertsDropdownOpen(false);

    try {
      if (alert.patient && typeof alert.patient === 'string' && alert.patient.length > 0) {
        router.push(`/dashboard/patients/vitals/${alert.patient}`);
      } else {
        router.push('/dashboard/alerts');
      }
    } catch (error) {
      console.error('Error handling alert click:', error);
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

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
    }
  };

  // Display loading state with improved spinner
  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-50 to-white">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-indigo-600 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-white"></div>
          </div>
        </div>
        <p className="mt-6 text-gray-700 font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  // Enhanced navigation links for doctor with categories
  const navLinks = [
    {
      category: "Main",
      items: [
        { href: '/dashboard', icon: <Home className="w-5 h-5" />, text: 'Dashboard' },
      ]
    },
    {
      category: "Patient Management",
      items: [
        { href: '/dashboard/patients/add_patient', icon: <User className="w-5 h-5" />, text: 'Add Patient' },
        { href: '/dashboard/patients/manage_patients', icon: <Users className="w-5 h-5" />, text: 'Manage Patients' },
      ]
    },
    {
      category: "Clinical",
      items: [
        { href: '/dashboard/alerts', icon: <Bell className="w-5 h-5" />, text: 'Alerts', badge: alertCount },
        { href: '/dashboard/appointments', icon: <Calendar className="w-5 h-5" />, text: 'Appointments' },
      ]
    },
    {
      category: "Analysis",
      items: [
        { href: '/dashboard/analytics', icon: <PieChart className="w-5 h-5" />, text: 'Analytics' },
      ]
    },
    {
      category: "Account",
      items: [
        { href: '/dashboard/settings', icon: <Settings className="w-5 h-5" />, text: 'Settings' },
      ]
    }
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

      {/* Enhanced Sidebar with gradient accents */}
      <aside
        className={`w-72 bg-white shadow-lg fixed h-full transform transition-transform duration-300 ease-in-out z-20
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Enhanced sidebar header with logo */}
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-blue-600">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-md bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl shadow-md">
                M
              </div>
              <h1 className="ml-3 text-xl font-bold text-white">Medico</h1>
              <div className="ml-auto md:hidden">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-white p-1 rounded-full hover:bg-white hover:bg-opacity-10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced user profile section */}
          <div className="flex flex-col items-center px-6 py-6 border-b border-gray-200 bg-indigo-50">
            <div className="h-16 w-16 rounded-full bg-white border-4 border-indigo-100 shadow-md flex items-center justify-center overflow-hidden mb-3">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <User className="h-8 w-8 text-indigo-600" />
              )}
            </div>
            <h2 className="text-md font-semibold text-gray-800">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <span className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full flex items-center">
              <Stethoscope className="w-3 h-3 mr-1" />
              Doctor
            </span>
          </div>

          {/* Navigation Links with Categories */}
          <nav className="flex-grow px-4 py-5 overflow-y-auto">
            {navLinks.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-6">
                <h3 className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {section.category}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${pathname === link.href
                            ? 'bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 shadow-sm'
                            : 'text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                        <span className={`mr-3 ${pathname === link.href ? 'text-indigo-600' : 'text-gray-500'}`}>
                          {link.icon}
                        </span>
                        <span className="font-medium">{link.text}</span>

                        {/* Dynamic Notification Badge */}
                        {link.badge > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Enhanced Logout Button */}
          <div className="px-4 py-5 border-t border-gray-200 bg-indigo-50">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 bg-white border border-gray-200 text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200 shadow-sm"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-72">
        {/* Enhanced Top Navigation Bar */}
        <header className="bg-white shadow-sm z-10 sticky top-0 border-b border-gray-100">
          <div className="flex items-center justify-between px-6 py-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Page title derived from pathname */}
            <div className="hidden md:block">
              <h1 className="text-xl font-semibold text-gray-800">
                {pathname === '/dashboard' ? 'Dashboard' :
                  pathname.includes('/add_patient') ? 'Add Patient' :
                    pathname.includes('/manage_patients') ? 'Manage Patients' :
                      pathname.includes('/alerts') ? 'Alerts' :
                        pathname.includes('/appointments') ? 'Appointments' :
                          pathname.includes('/analytics') ? 'Analytics' :
                            pathname.includes('/settings') ? 'Settings' : 'Dashboard'}
              </h1>
            </div>

            {/* Enhanced Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for patients, appointments..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <Search className="h-5 w-5" />
                </div>
                <button
                  type="submit"
                  className="absolute right-2 top-2 text-gray-500 hover:text-indigo-600"
                >
                  <span className="text-xs bg-gray-200 hover:bg-indigo-100 px-2 py-1 rounded">⌘K</span>
                </button>
              </div>
            </form>

            {/* Action Icons with improved styling */}
            <div className="flex items-center space-x-2">
              {/* Quick Actions Button */}
              <div className="relative hidden md:block">
                <button
                  className="p-2 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors duration-200 focus:outline-none"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors duration-200 focus:outline-none"
                  onClick={() => {
                    setAlertsDropdownOpen(!alertsDropdownOpen);
                    setProfileDropdownOpen(false);
                  }}
                >
                  <Bell className="h-5 w-5" />
                  {alertCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center border-2 border-white">
                      {alertCount}
                    </span>
                  )}
                </button>

                {/* Enhanced Alerts Dropdown Menu */}
                {alertsDropdownOpen && (
                  <div ref={alertsDropdownRef} className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl py-1 z-30 max-h-96 overflow-y-auto border border-gray-100">
                    <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-blue-50">
                      <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                      {alertCount > 0 && (
                        <span className="text-xs px-2 py-0.5 bg-red-100 text-red-800 rounded-full font-medium">
                          {alertCount} new
                        </span>
                      )}
                    </div>

                    {alerts.length > 0 ? (
                      <div>
                        {alerts.map((alert) => (
                          <div
                            key={alert._id}
                            className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer transition-colors duration-150"
                            onClick={() => handleAlertClick(alert)}
                          >
                            <div className="flex items-start">
                              <div className={`flex-shrink-0 h-8 w-8 rounded-full ${alert.priority === 'critical' ? 'bg-red-100' :
                                  alert.priority === 'high' ? 'bg-orange-100' :
                                    alert.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                                } flex items-center justify-center mr-3 shadow-sm`}>
                                <AlertCircle className={`h-4 w-4 ${alert.priority === 'critical' ? 'text-red-600' :
                                    alert.priority === 'high' ? 'text-orange-600' :
                                      alert.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                                  }`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-800 line-clamp-2 font-medium">{alert.description}</p>
                                <div className="mt-1 flex justify-between items-center">
                                  <p className="text-xs text-gray-500 flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {formatTimestamp(alert.createdAt)}
                                  </p>
                                  <span className={`text-xs px-1.5 py-0.5 rounded-full flex items-center ${alert.priority === 'critical' ? 'bg-red-100 text-red-800' :
                                      alert.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                        alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                                    }`}>
                                    <span className={`h-1.5 w-1.5 rounded-full mr-1 ${alert.priority === 'critical' ? 'bg-red-500' :
                                        alert.priority === 'high' ? 'bg-orange-500' :
                                          alert.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                                      }`}></span>
                                    {alert.priority.charAt(0).toUpperCase() + alert.priority.slice(1)}
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

                    {/* Enhanced New Alert Button */}
                    <div className="px-4 py-3 border-t border-gray-100">
                      <button
                        className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-medium rounded-md hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 flex items-center justify-center shadow-sm"
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

              {/* Enhanced Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(!profileDropdownOpen);
                    setAlertsDropdownOpen(false);
                  }}
                  className="flex items-center focus:outline-none"
                >
                  <div className="h-9 w-9 rounded-full bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center overflow-hidden shadow-sm">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-5 w-5 text-indigo-600" />
                    )}
                  </div>
                </button>

                {/* Enhanced Profile Dropdown Menu */}
                {profileDropdownOpen && (
                  <div ref={profileDropdownRef} className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-1 z-30 border border-gray-100">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-700">{user.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                    </div>

                    <Link
                      href="/dashboard/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      Your Profile
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-2 text-gray-500" />
                      Settings
                    </Link>
                    <Link
                      href="#"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <Shield className="h-4 w-4 mr-2 text-gray-500" />
                      Privacy & Security
                    </Link>

                    <div className="border-t border-gray-100 mt-1"></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Enhanced Main Content Area */}
        <main className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}