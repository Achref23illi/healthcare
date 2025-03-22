'use client';
import Head from "next/head";
import { useState } from "react";
import Link from 'next/link';
import { Home, Search, Users, User, LogOut, Bell, BarChart, Megaphone } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const ManagePatients = () => {
  const { logout } = useAuth(); // Extrait logout du contexte
  const router = useRouter(); // Extrait router pour la redirection

  const [patients, setPatients] = useState([
    { id: 1, firstName: 'Ali', lastName: 'Ben', age: 30, chronicDisease: 'Diabète', temperature: 37, heartRate: 80, oxygenSaturation: 98, priority: 'High', status: 'In Progress', appointmentDate: '2024-04-10' },
    { id: 2, firstName: 'Sara', lastName: 'Mez', age: 25, chronicDisease: 'Hypertension', temperature: 36.8, heartRate: 75, oxygenSaturation: 97, priority: 'Medium', status: 'Todo', appointmentDate: '2024-04-12' },
  ]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout(); // Appeler la fonction logout
    router.push('/login'); // Rediriger vers la page de connexion
  };

  const handleDeletePatient = (id) => {
    setPatients(patients.filter(patient => patient.id !== id)); // Supprimer un patient
  };

  return (
    <div className="flex min-h-screen">
      <Head>
        <title>Gérer les patients</title>
      </Head>
      {/* Sidebar */}
      <aside className="w-64 bg-white p-5 shadow text-[#0c3948] fixed h-full">
        <h2 className="text-xl font-bold mb-6">TailAdmin</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link href="/dashboard" className="flex items-center  text-[#0c3948] p-2 rounded">
                <Home className="w-5 h-5 mr-2" /> Dashboard
              </Link>
            </li>
            <h3 className="text-lg font-semibold mt-4">Informations</h3>
            <li className="flex items-center p-2 rounded hover:bg-[#f2f4ea] hover:text-[#0c3948]">
              <Link href="/dashboard/patients/add_patient" className="flex items-center w-full">
                <User className="w-5 h-5 mr-2" /> Ajouter un patient
              </Link>
            </li>
            <li className="flex items-center p-2 rounded bg-[#f2f4ea] hover:bg-[#f2f4ea] hover:text-[#0c3948]">
              <Link href="/dashboard/patients/manage_patients" className="flex items-center w-full">
                <Users className="w-5 h-5 mr-2" /> Patients
              </Link>
            </li>
            <li className="flex items-center p-2 rounded hover:bg-[#f2f4ea] hover:text-[#0c3948]">
              <BarChart className="w-5 h-5 mr-2" /> Consultation
            </li>
            <h3 className="text-lg font-semibold mt-4">Analytics</h3>
            <li className="flex items-center p-2 rounded hover:bg-[#f2f4ea] hover:text-[#0c3948]">
              <Megaphone className="w-5 h-5 mr-2" /> Marketing
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 ml-64">
        {/* Top Bar */}
        <div className="flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-10">
          <div className="flex items-center bg-gray-100 p-2 rounded-lg">
            <Search className="w-5 h-5 text-gray-500 mr-2" />
            <input type="text" placeholder="Rechercher un patient..." className="bg-transparent outline-none text-gray-700" />
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
                    <User className="w-5 h-5 mr-2" /> Modifier le profil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center p-2 w-full hover:bg-gray-100"
                  >
                    <LogOut className="w-5 h-5 mr-2" /> Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Liste des patients */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-700 mb-6">Gérer les patients</h2>
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Âge</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Maladie chronique</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priorité</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date de rendez-vous</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {patients.map((patient) => (
                  <tr key={patient.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.firstName} {patient.lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.chronicDisease}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.priority}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.appointmentDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-2">Modifier</button>
                      <button
                        onClick={() => handleDeletePatient(patient.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePatients;