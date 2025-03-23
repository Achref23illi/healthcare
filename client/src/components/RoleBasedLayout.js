// This layout dynamically renders a sidebar based on the user's role (doctor or patient)
// It protects children routes by redirecting to /login if unauthenticated

'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, User, Users, Bell, BarChart, Home, Thermometer } from 'lucide-react';

export default function RoleBasedLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  const isDoctor = user.role === 'doctor';

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className={`w-64 bg-white p-5 shadow text-gray-800 fixed h-full transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <h2 className="text-xl font-bold mb-6">Medico</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link href={isDoctor ? '/dashboard' : '/patient-dashboard'} className="flex items-center p-2 rounded hover:bg-gray-100">
                <Home className="w-5 h-5 mr-2" /> Dashboard
              </Link>
            </li>
            <h3 className="text-lg font-semibold mt-4">Navigation</h3>
            {!isDoctor && (
              <>
                <li>
                  <Link href="/patient-dashboard/vitals" className="flex items-center p-2 rounded hover:bg-gray-100">
                    <Thermometer className="w-5 h-5 mr-2" /> My Vitals
                  </Link>
                </li>
                <li>
                  <Link href="/patient-dashboard/alerts" className="flex items-center p-2 rounded hover:bg-gray-100">
                    <Bell className="w-5 h-5 mr-2" /> My Alerts
                  </Link>
                </li>
                <li>
                  <Link href="/patient-dashboard/profile" className="flex items-center p-2 rounded hover:bg-gray-100">
                    <User className="w-5 h-5 mr-2" /> Profile
                  </Link>
                </li>
              </>
            )}
            {isDoctor && (
              <>
                <li>
                  <Link href="/dashboard/patients/add_patient" className="flex items-center p-2 rounded hover:bg-gray-100">
                    <User className="w-5 h-5 mr-2" /> Add Patient
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/patients/manage_patients" className="flex items-center p-2 rounded hover:bg-gray-100">
                    <Users className="w-5 h-5 mr-2" /> Patients
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/alerts" className="flex items-center p-2 rounded hover:bg-gray-100">
                    <Bell className="w-5 h-5 mr-2" /> Alerts
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/analytics" className="flex items-center p-2 rounded hover:bg-gray-100">
                    <BarChart className="w-5 h-5 mr-2" /> Analytics
                  </Link>
                </li>
              </>
            )}
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center p-2 text-left w-full rounded hover:bg-gray-100"
              >
                <LogOut className="w-5 h-5 mr-2" /> Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="flex flex-col flex-1 md:ml-64 overflow-y-auto">
        <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-white shadow-md">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            ☰
          </button>
          <h1 className="text-lg font-semibold">Welcome, {user.name}</h1>
        </div>

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
