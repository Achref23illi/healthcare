'use client';
import Head from "next/head";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { Bell, Home, Users, User, BarChart, Search, Megaphone, LogOut, Menu } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const router = useRouter();

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-100 via-purple-50 to-blue-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
        <p className="text-gray-600 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <div className="flex h-screen bg-gray-100">
        <aside
          className={`w-64 bg-white p-5 shadow text-[#0c3948] fixed h-full transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0`}
        >
          <h2 className="text-xl font-bold mb-6">Medico</h2>
          <nav>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="flex items-center bg-[#f2f4ea] text-[#0c3948] p-2 rounded">
                  <Home className="w-5 h-5 mr-2" /> Dashboard
                </Link>
              </li>
              <h3 className="text-lg font-semibold mt-4">Information</h3>
              <li>
                <Link href="/dashboard/patients/add_patient" className="flex items-center p-2 rounded hover:bg-[#f2f4ea]">
                  <User className="w-5 h-5 mr-2" /> Add Patient
                </Link>
              </li>
              <li>
                <Link href="/dashboard/patients/manage_patients" className="flex items-center p-2 rounded hover:bg-[#f2f4ea]">
                  <Users className="w-5 h-5 mr-2" /> Patients
                </Link>
              </li>
              <li className="flex items-center p-2 rounded hover:bg-[#f2f4ea]">
                <BarChart className="w-5 h-5 mr-2" /> Consultation
              </li>
              <h3 className="text-lg font-semibold mt-4">Analytics</h3>
              <li className="flex items-center p-2 rounded hover:bg-[#f2f4ea]">
                <Megaphone className="w-5 h-5 mr-2" /> Marketing
              </li>
            </ul>
          </nav>
        </aside>

        <div className="flex flex-col flex-1 md:ml-64">
          <div className="flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-10">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center bg-gray-100 p-2 rounded-lg ml-2">
                <Search className="w-5 h-5 text-gray-500 mr-2" />
                <input type="text" placeholder="Search patient..." className="bg-transparent outline-none text-gray-700" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
              <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <img src="/images/profile.png" alt="Profile" className="w-10 h-10 rounded-full" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white shadow-md rounded-lg p-2 w-48">
                    <button className="flex items-center p-2 w-full hover:bg-gray-100">
                      <User className="w-5 h-5 mr-2" /> Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center p-2 w-full hover:bg-gray-100"
                    >
                      <LogOut className="w-5 h-5 mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 pt-10 pl-8 w-full">
            <div className="bg-white overflow-hidden shadow-lg rounded-lg mb-8 w-full">
              <div className="p-6 bg-[#0c3948] text-white">
                <h2 className="text-2xl font-bold">Welcome to your dashboard, {user.name}!</h2>
                <p className="mt-2 text-indigo-100">We're glad to have you here. This is your secure personal space.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-gray-500">Patients</h3>
                <p className="text-2xl font-bold">3,782</p>
                <p className="text-green-500">+11.01%</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-gray-500">Consultations</h3>
                <p className="text-2xl font-bold">5,359</p>
                <p className="text-red-500">-9.05%</p>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 w-full">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-gray-500">Monthly Patients</h3>
                <div className="h-32 bg-[#f2f4ea] mt-4 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}