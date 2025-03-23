'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Filter, ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import RoleBasedLayout from '@/components/RoleBasedLayout';

export default function Alerts() {
  const { user } = useAuth();
  const router = useRouter();
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: '',
    severity: ''
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    acknowledged: 0,
    resolved: 0
  });

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
        
        const alertsData = response.data.alerts || response.data;
        setAlerts(alertsData);
        
        // Calculate stats
        setStats({
          total: alertsData.length,
          new: alertsData.filter(a => a.status === 'New').length,
          acknowledged: alertsData.filter(a => a.status === 'Acknowledged').length,
          resolved: alertsData.filter(a => a.status === 'Resolved').length
        });
        
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
      
      // Update stats
      setStats({
        ...stats,
        new: newStatus === 'New' ? stats.new : (stats.new - (alerts.find(a => a._id === alertId).status === 'New' ? 1 : 0)),
        acknowledged: newStatus === 'Acknowledged' ? stats.acknowledged + 1 : (stats.acknowledged - (alerts.find(a => a._id === alertId).status === 'Acknowledged' ? 1 : 0)),
        resolved: newStatus === 'Resolved' ? stats.resolved + 1 : (stats.resolved - (alerts.find(a => a._id === alertId).status === 'Resolved' ? 1 : 0))
      });
    } catch (error) {
      console.error('Error updating alert status:', error);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': 
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: <AlertCircle className="w-4 h-4 mr-1 text-red-800" />
        };
      case 'High': 
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-800',
          icon: <AlertCircle className="w-4 h-4 mr-1 text-orange-800" />
        };
      case 'Medium': 
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          icon: <AlertCircle className="w-4 h-4 mr-1 text-yellow-800" />
        };
      case 'Low': 
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          icon: <AlertCircle className="w-4 h-4 mr-1 text-blue-800" />
        };
      default: 
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: <AlertCircle className="w-4 h-4 mr-1 text-gray-800" />
        };
    }
  };
  
  const getStatusInfo = (status) => {
    switch (status) {
      case 'New': 
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: <Clock className="w-4 h-4 mr-1 text-red-800" />
        };
      case 'Acknowledged': 
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          icon: <CheckCircle className="w-4 h-4 mr-1 text-yellow-800" />
        };
      case 'Resolved': 
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: <CheckCircle className="w-4 h-4 mr-1 text-green-800" />
        };
      default: 
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: <Clock className="w-4 h-4 mr-1 text-gray-800" />
        };
    }
  };

  if (isLoading) {
    return (
      <RoleBasedLayout>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0c3948]"></div>
          <p className="mt-4 text-gray-600">Loading alerts...</p>
        </div>
      </RoleBasedLayout>
    );
  }

  return (
    <RoleBasedLayout>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Alert Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Monitor and respond to patient alerts
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button 
              onClick={() => router.back()}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0c3948]"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-[#0c3948] rounded-md p-3">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Alerts
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stats.total}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      New Alerts
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stats.new}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Acknowledged
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stats.acknowledged}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Resolved
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stats.resolved}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 md:mb-0">
                Filter Alerts
              </h3>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                <Filter className="h-4 w-4 mr-2" />
                {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
            
            {isFilterOpen && (
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Status
                  </label>
                  <select
                    id="statusFilter"
                    value={filter.status}
                    onChange={(e) => setFilter({...filter, status: e.target.value})}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#0c3948] focus:border-[#0c3948] sm:text-sm rounded-md"
                  >
                    <option value="">All Statuses</option>
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
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#0c3948] focus:border-[#0c3948] sm:text-sm rounded-md"
                  >
                    <option value="">All Severities</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Alerts Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              All Alerts ({alerts.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {alerts.length > 0 ? (
                  alerts.map((alert) => (
                    <tr key={alert._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-xs font-medium text-[#0c3948]">
                              {alert.patient?.firstName?.charAt(0) || '?'}{alert.patient?.lastName?.charAt(0) || '?'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {alert.patient?.firstName ? 
                                `${alert.patient.firstName} ${alert.patient.lastName}` : 
                                '(Patient Name)'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-md">{alert.message}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(alert.severity).bg} ${getSeverityColor(alert.severity).text}`}>
                          {getSeverityColor(alert.severity).icon}
                          {alert.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusInfo(alert.status).bg} ${getStatusInfo(alert.status).text}`}>
                          {getStatusInfo(alert.status).icon}
                          {alert.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(alert.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {alert.status === 'New' && (
                            <button 
                              onClick={() => handleStatusUpdate(alert._id, 'Acknowledged')}
                              className="text-yellow-600 hover:text-yellow-900 bg-yellow-50 px-2 py-1 rounded"
                            >
                              Acknowledge
                            </button>
                          )}
                          {alert.status !== 'Resolved' && (
                            <button 
                              onClick={() => handleStatusUpdate(alert._id, 'Resolved')}
                              className="text-green-600 hover:text-green-900 bg-green-50 px-2 py-1 rounded"
                            >
                              Resolve
                            </button>
                          )}
                          
                          <Link
                            href={`/dashboard/patients/vitals/${alert.patient?._id}`}
                            className="text-[#0c3948] hover:text-[#155e76] px-2 py-1 rounded"
                          >
                            View Patient
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-500">
                      <div className="flex flex-col items-center">
                        <XCircle className="h-10 w-10 text-gray-400 mb-4" />
                        <p className="text-base font-medium text-gray-500">No alerts found</p>
                        <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or check back later</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RoleBasedLayout>
  );
}