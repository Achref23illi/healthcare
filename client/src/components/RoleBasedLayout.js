'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LogOut, User, Users, Bell, BarChart, Home, Thermometer, Menu, Settings, Activity } from 'lucide-react';

export default function RoleBasedLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // If not logged in, redirect to login
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    // Check if user is trying to access the wrong dashboard
    if (user) {
      const isDoctorPath = pathname.startsWith('/dashboard');
      const isPatientPath = pathname.startsWith('/patient-dashboard');
      
      if (user.role === 'doctor' && isPatientPath) {
        router.push('/dashboard');
      } else if (user.role === 'patient' && isDoctorPath) {
        router.push('/patient-dashboard');
      }
    }
  }, [user, loading, router, pathname]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Display loading state
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  const isDoctor = user.role === 'doctor';

  // Generate navigation links based on user role
  const getNavLinks = () => {
    if (isDoctor) {
      return [
        { href: '/dashboard', icon: <Home className="w-5 h-5 mr-2" />, text: 'Dashboard' },
        { href: '/dashboard/patients/add_patient', icon: <User className="w-5 h-5 mr-2" />, text: 'Add Patient' },
        { href: '/dashboard/patients/manage_patients', icon: <Users className="w-5 h-5 mr-2" />, text: 'Patients' },
        { href: '/dashboard/alerts', icon: <Bell className="w-5 h-5 mr-2" />, text: 'Alerts' },
        { href: '/dashboard/analytics', icon: <BarChart className="w-5 h-5 mr-2" />, text: 'Analytics' },
      ];
    } else {
      return [
        { href: '/patient-dashboard', icon: <Home className="w-5 h-5 mr-2" />, text: 'Dashboard' },
        { href: '/patient-dashboard/vitals', icon: <Thermometer className="w-5 h-5 mr-2" />, text: 'My Vitals' },
        { href: '/patient-dashboard/alerts', icon: <Bell className="w-5 h-5 mr-2" />, text: 'My Alerts' },
        { href: '/patient-dashboard/profile', icon: <User className="w-5 h-5 mr-2" />, text: 'Profile' },
      ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside 
        className={`w-64 bg-white p-5 shadow text-gray-800 fixed h-full transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 z-20`}
      >
        <h2 className="text-xl font-bold mb-6 text-[#0c3948]">Medico</h2>
        <div className="flex flex-col items-center mb-6 border-b pb-4">
          <img 
            src={user.profilePicture || "/images/profile.png"} 
            alt="Profile" 
            className="w-16 h-16 rounded-full mb-2"
          />
          <h3 className="font-medium">{user.name}</h3>
          <p className="text-sm text-gray-500 capitalize">{user.role}</p>
        </div>
        
        <nav>
          <ul className="space-y-2">
            {navLinks.map((link, index) => (
              <li key={index}>
                <Link 
                  href={link.href} 
                  className={`flex items-center p-2 rounded hover:bg-[#f2f4ea] transition-colors duration-200 ${
                    pathname === link.href ? 'bg-[#f2f4ea] text-[#0c3948] font-medium' : 'text-gray-700'
                  }`}
                >
                  {link.icon}
                  {link.text}
                </Link>
              </li>
            ))}
            
            <li className="pt-6 mt-6 border-t">
              <button
                onClick={handleLogout}
                className="flex items-center p-2 text-left w-full rounded hover:bg-red-50 text-red-600 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5 mr-2" /> Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 md:ml-64 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-white shadow-md">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold ml-2">Welcome, {user.name}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href={isDoctor ? "/dashboard/alerts" : "/patient-dashboard/alerts"} className="relative">
              <Bell className="w-6 h-6 text-gray-600 hover:text-gray-900 transition-colors duration-200" />
              {/* Notification indicator - can be dynamic */}
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </Link>
            
            <Link href={isDoctor ? "/profile" : "/patient-dashboard/profile"}>
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center hover:bg-indigo-200 transition-colors duration-200">
                <Settings className="w-4 h-4 text-indigo-600" />
              </div>
            </Link>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}