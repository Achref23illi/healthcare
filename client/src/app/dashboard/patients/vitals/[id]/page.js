'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Bell, Home, Users, User, BarChart, ArrowLeft, LogOut, Menu } from 'lucide-react';

export default function RecordVitals() {
  const params = useParams();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [vitalSign, setVitalSign] = useState({
    type: 'temperature',
    value: '',
    unit: 'C'
  });
  const [message, setMessage] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    const fetchPatient = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };
        
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/patients/${params.id}`,
          config
        );
        
        setPatient(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching patient:', error);
        setIsLoading(false);
      }
    };
    
    fetchPatient();
  }, [params.id, user, router]);

  const handleTypeChange = (e) => {
    const type = e.target.value;
    let unit = vitalSign.unit;
    
    // Set appropriate units based on type
    if (type === 'temperature') unit = 'C';
    else if (type === 'heartRate') unit = 'bpm';
    else if (type === 'oxygenSaturation') unit = '%';
    else if (type === 'bloodPressure') unit = 'mmHg';
    else if (type === 'respiratoryRate') unit = 'breaths/min';
    
    setVitalSign({
      ...vitalSign,
      type,
      unit
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user?.token) return;
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/vitals/${params.id}`,
        vitalSign,
        config
      );
      
      // Show success message
      setMessage({
        type: 'success',
        text: response.data.message || 'Vital sign recorded successfully'
      });
      
      // Refresh patient data to get the updated vital signs
      const patientResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/patients/${params.id}`,
        config
      );
      
      setPatient(patientResponse.data);
      
      // Clear form
      setVitalSign({
        ...vitalSign,
        value: ''
      });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error recording vital sign:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to record vital sign'
      });
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="mt-4 text-gray-600">Loading patient data...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`w-64 bg-white p-5 shadow text-[#0c3948] fixed h-full transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <h2 className="text-xl font-bold mb-6">Medico</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link href="/dashboard" className="flex items-center p-2 rounded hover:bg-[#f2f4ea] text-[#0c3948]">
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
              <Link href="/dashboard/patients/manage_patients" className="flex items-center p-2 rounded bg-[#f2f4ea]">
                <Users className="w-5 h-5 mr-2" /> Patients
              </Link>
            </li>
            <li>
              <Link href="/dashboard/alerts" className="flex items-center p-2 rounded hover:bg-[#f2f4ea]">
                <Bell className="w-5 h-5 mr-2" /> Alerts
              </Link>
            </li>
            <li className="flex items-center p-2 rounded hover:bg-[#f2f4ea]">
              <BarChart className="w-5 h-5 mr-2" /> Consultation
            </li>
          </ul>
        </nav>
      </aside>

      <div className="flex flex-col flex-1 md:ml-64">
        {/* Top Bar */}
        <div className="flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-10">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button onClick={() => router.back()} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg ml-2">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold ml-4">Record Vital Signs</h1>
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

        <div className="p-6">
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {patient.firstName} {patient.lastName}
              </h2>
              <p className="text-gray-600">Age: {patient.age} years</p>
              {patient.chronicDisease && (
                <p className="text-gray-600">Chronic Condition: {patient.chronicDisease}</p>
              )}
              <p className="mt-2">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${patient.status === 'Critical' ? 'bg-red-100 text-red-800' : 
                    patient.status === 'Moderate' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-green-100 text-green-800'}`}>
                  {patient.status || 'Stable'}
                </span>
              </p>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="vitalType" className="block text-sm font-medium text-gray-700">
                  Vital Sign Type
                </label>
                <select
                  id="vitalType"
                  name="type"
                  value={vitalSign.type}
                  onChange={handleTypeChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="temperature">Temperature</option>
                  <option value="heartRate">Heart Rate</option>
                  <option value="oxygenSaturation">Oxygen Saturation</option>
                  <option value="bloodPressure">Blood Pressure</option>
                  <option value="respiratoryRate">Respiratory Rate</option>
                </select>
              </div>

              <div>
                <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                  Value
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="number"
                    name="value"
                    id="value"
                    step="0.1"
                    value={vitalSign.value}
                    onChange={(e) => setVitalSign({...vitalSign, value: e.target.value})}
                    required
                    className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                  />
                  <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    {vitalSign.unit}
                  </span>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#0c3948] hover:bg-[#0a2e3d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Record Vital Sign
                </button>
              </div>
            </form>
          </div>

          {/* Recent Vital Signs */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Vital Signs</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recorded At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patient.vitalSigns && patient.vitalSigns.length > 0 ? (
                    patient.vitalSigns.slice(0, 10).map((vital, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {vital.type.charAt(0).toUpperCase() + vital.type.slice(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {vital.value} {vital.unit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(vital.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {vital.isAlert ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Alert
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Normal
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                        No vital signs recorded yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}