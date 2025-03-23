'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LogOut, 
  User, 
  Users, 
  Bell, 
  BarChart, 
  Home, 
  Thermometer,
  ChevronDown,
  Settings,
  Menu,
  X,
  Search,
  Calendar,
  Activity,
  FileText,
  HelpCircle
} from 'lucide-react';

export default function RoleBasedLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById('sidebar');
      const menuButton = document.getElementById('menu-button');
      
      if (sidebarOpen && sidebar && !sidebar.contains(event.target) && 
          menuButton && !menuButton.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchQuery);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0c3948]"></div>
        <p className="mt-4 text-gray-500">Loading...</p>
      </div>
    );
  }

  const isDoctor = user.role === 'doctor';

  // Sample notifications - replace with actual data when available
  const notifications = [
    { id: 1, message: "John Smith's oxygen levels are critical", time: "2 minutes ago", isUnread: true },
    { id: 2, message: "New alert from patient Emily Johnson", time: "1 hour ago", isUnread: true },
    { id: 3, message: "Michael Davis updated their information", time: "3 hours ago", isUnread: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 flex flex-col overflow-y-auto`}
      >
        {/* Logo */}
        <div className="p-6 flex items-center">
          <div className="h-10 w-10 rounded-full bg-[#0c3948] flex items-center justify-center text-white font-bold text-xl">M</div>
          <span className="ml-3 text-xl font-bold text-[#0c3948]">Medico</span>
          <button
            className="ml-auto md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-4 px-4">
          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
                Main
              </h3>
              <div className="space-y-1">
                <Link 
                  href={isDoctor ? '/dashboard' : '/patient-dashboard'} 
                  className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-[#0c3948] hover:bg-blue-50"
                >
                  <Home className="text-gray-400 group-hover:text-[#0c3948] mr-3 h-5 w-5" />
                  Dashboard
                </Link>
                
                {isDoctor && (
                  <>
                    <Link 
                      href="/dashboard/patients/manage_patients" 
                      className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-[#0c3948] hover:bg-blue-50"
                    >
                      <Users className="text-gray-400 group-hover:text-[#0c3948] mr-3 h-5 w-5" />
                      Patients
                    </Link>
                    <Link 
                      href="/dashboard/alerts" 
                      className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-[#0c3948] hover:bg-blue-50"
                    >
                      <Bell className="text-gray-400 group-hover:text-[#0c3948] mr-3 h-5 w-5" />
                      Alerts
                    </Link>
                    <Link 
                      href="/dashboard/appointments" 
                      className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-[#0c3948] hover:bg-blue-50"
                    >
                      <Calendar className="text-gray-400 group-hover:text-[#0c3948] mr-3 h-5 w-5" />
                      Appointments
                    </Link>
                  </>
                )}
                
                {!isDoctor && (
                  <>
                    <Link 
                      href="/patient-dashboard/vitals" 
                      className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-[#0c3948] hover:bg-blue-50"
                    >
                      <Activity className="text-gray-400 group-hover:text-[#0c3948] mr-3 h-5 w-5" />
                      My Vitals
                    </Link>
                    <Link 
                      href="/patient-dashboard/alerts" 
                      className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-[#0c3948] hover:bg-blue-50"
                    >
                      <Bell className="text-gray-400 group-hover:text-[#0c3948] mr-3 h-5 w-5" />
                      My Alerts
                    </Link>
                    <Link 
                      href="/patient-dashboard/appointments" 
                      className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-[#0c3948] hover:bg-blue-50"
                    >
                      <Calendar className="text-gray-400 group-hover:text-[#0c3948] mr-3 h-5 w-5" />
                      Appointments
                    </Link>
                  </>
                )}
              </div>
            </div>

            {isDoctor && (
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
                  Management
                </h3>
                <div className="space-y-1">
                  <Link 
                    href="/dashboard/patients/add_patient" 
                    className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-[#0c3948] hover:bg-blue-50"
                  >
                    <User className="text-gray-400 group-hover:text-[#0c3948] mr-3 h-5 w-5" />
                    Add Patient
                  </Link>
                  <Link 
                    href="/dashboard/analytics" 
                    className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-[#0c3948] hover:bg-blue-50"
                  >
                    <BarChart className="text-gray-400 group-hover:text-[#0c3948] mr-3 h-5 w-5" />
                    Analytics
                  </Link>
                  <Link 
                    href="/dashboard/reports" 
                    className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-[#0c3948] hover:bg-blue-50"
                  >
                    <FileText className="text-gray-400 group-hover:text-[#0c3948] mr-3 h-5 w-5" />
                    Reports
                  </Link>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
                Account
              </h3>
              <div className="space-y-1">
                <Link 
                  href={isDoctor ? "/profile" : "/patient-dashboard/profile"} 
                  className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-[#0c3948] hover:bg-blue-50"
                >
                  <User className="text-gray-400 group-hover:text-[#0c3948] mr-3 h-5 w-5" />
                  Profile
                </Link>
                <Link 
                  href="/settings" 
                  className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-[#0c3948] hover:bg-blue-50"
                >
                  <Settings className="text-gray-400 group-hover:text-[#0c3948] mr-3 h-5 w-5" />
                  Settings
                </Link>
                <Link 
                  href="/help" 
                  className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-[#0c3948] hover:bg-blue-50"
                >
                  <HelpCircle className="text-gray-400 group-hover:text-[#0c3948] mr-3 h-5 w-5" />
                  Help & Support
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-[#0c3948] font-semibold">
              {user.name?.slice(0, 2).toUpperCase() || 'U'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user.name}</p>
              <p className="text-xs text-gray-500">{isDoctor ? 'Doctor' : 'Patient'}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="ml-auto text-gray-400 hover:text-red-500"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        {/* Top Navigation */}
        <header className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            {/* Mobile menu button */}
            <button
              id="menu-button"
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Search */}
            <div className="max-w-md w-full hidden md:block">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#0c3948] focus:border-[#0c3948] sm:text-sm"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>

            {/* Right side buttons */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-6 w-6" />
                  {notifications.filter(n => n.isUnread).length > 0 && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                  )}
                </button>
                
                {/* Dropdown menu for notifications */}
                {notificationsOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.length > 0 ? (
                          <div className="divide-y divide-gray-100">
                            {notifications.map((notification) => (
                              <div 
                                key={notification.id} 
                                className={`px-4 py-3 hover:bg-gray-50 ${notification.isUnread ? 'bg-blue-50' : ''}`}
                              >
                                <p className="text-sm text-gray-700">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="px-4 py-6 text-center">
                            <p className="text-sm text-gray-500">No notifications yet</p>
                          </div>
                        )}
                      </div>
                      <div className="border-t border-gray-100 px-4 py-2">
                        <button className="text-xs text-[#0c3948] font-medium hover:text-[#155e76]">
                          Mark all as read
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  className="flex items-center space-x-2 focus:outline-none"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                >
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-[#0c3948] text-sm font-semibold">
                    {user.name?.slice(0, 2).toUpperCase() || 'U'}
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
                
                {/* Dropdown menu for profile */}
                {profileMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1">
                      <Link 
                        href={isDoctor ? "/profile" : "/patient-dashboard/profile"}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Your Profile
                      </Link>
                      <Link 
                        href="/settings" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          setProfileMenuOpen(false);
                          handleLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-center text-xs text-gray-500">
              &copy; {new Date().getFullYear()} Medico. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}