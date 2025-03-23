'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, Home, Users, User, BarChart, Search, Megaphone, LogOut, Menu } from 'lucide-react';

export default function Alerts() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: '',
    severity: ''
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    const fetchAlerts = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };
        
        let url = `${process.env.NEXT_PUBLIC_API_URL}/alerts`;
        const queryParams = [];
        
        if (filter.status) queryParams.push(`status=${filter.status}`);
        if (filter.severity) queryParams.push(`severity=${filter.severity}`);
        
        if (queryParams.length > 0) {
          url += `?${queryParams.join('&')}`;
        }
        
        const response = await axios.get(url, config);
        
        setAlerts(response.data.alerts || response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching alerts:', error);
        setIsLoading(false);
      }
    };
    
    fetchAlerts();
  }, [user, filter, router]);

  const handleStatusUpdate = async (alertId, newStatus) => {
    try {
      if (!user?.token) return;
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/alerts/${alertId}`,
        { status: newStatus },
        config
      );
      
      // Update alerts in state
      setAlerts(alerts.map(alert => 
        alert._id === alertId ? { ...alert, status: newStatus } : alert
      ));
    } catch (error) {
      console.error('Error updating alert status:', error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="mt-4 text-gray-600">Loading alerts...</p>
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
              <Link href="/dashboard" className="flex items-center p-2 rounded hover:bg-[#f2f4ea]">
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
            <li>
              <Link href="/dashboard/alerts" className="flex items-center bg-[#f2f4ea] text-[#0c3948] p-2 rounded">
                <Bell className="w-5 h-5 mr-2" /> Alerts
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
        {/* Top Bar */}
        <div className="flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-10">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold ml-4">Alert Management</h1>
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
          <div className="mb-6">
            <p className="text-gray-600">Monitor and respond to patient alerts</p>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-4">
            <div>
              <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <select
                id="statusFilter"
                value={filter.status}
                onChange={(e) => setFilter({...filter, status: e.target.value})}
                className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">All</option>
                <option value="New">New</option>
                <option value="Acknowledged">Acknowledged</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="severityFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Severity
              </label>
              <select
                id="severityFilter"
                value={filter.severity}
                onChange={(e) => setFilter({...filter, severity: e.target.value})}
                className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">All</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Alerts Table */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {alerts.length > 0 ? (
                  alerts.map((alert) => (
                    <tr key={alert._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {alert.patient?.firstName ? 
                            `${alert.patient.firstName} ${alert.patient.lastName}` : 
                            '(Patient Name)'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{alert.message}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          alert.status === 'New' ? 'bg-red-100 text-red-800' :
                          alert.status === 'Acknowledged' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {alert.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(alert.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {alert.status === 'New' && (
                          <button 
                            onClick={() => handleStatusUpdate(alert._id, 'Acknowledged')}
                            className="text-indigo-600 hover:text-indigo-900 mr-2"
                          >
                            Acknowledge
                          </button>
                        )}
                        {alert.status !== 'Resolved' && (
                          <button 
                            onClick={() => handleStatusUpdate(alert._id, 'Resolved')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Resolve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No alerts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}