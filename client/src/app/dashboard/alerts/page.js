'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Filter, 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Search,
  ChevronDown,
  UserRound,
  MessageSquare,
  Calendar
} from 'lucide-react';
import DoctorDashboardLayout from '@/components/DoctorDashboardLayout';

export default function Alerts() {
  const { user } = useAuth();
  const router = useRouter();
  
  // State management
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: '',
    severity: '',
    search: ''
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    acknowledged: 0,
    resolved: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  });
  
  const ITEMS_PER_PAGE = 10;

  // Fetch alerts data
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
        
        // Apply client-side search filtering if search is present
        let filteredAlerts = alertsData;
        if (filter.search.trim() !== '') {
          const searchTerm = filter.search.toLowerCase();
          filteredAlerts = alertsData.filter(alert => 
            (alert.message && alert.message.toLowerCase().includes(searchTerm)) ||
            (alert.patient?.firstName && alert.patient.firstName.toLowerCase().includes(searchTerm)) ||
            (alert.patient?.lastName && alert.patient.lastName.toLowerCase().includes(searchTerm))
          );
        }
        
        // Apply sorting
        filteredAlerts = sortAlerts(filteredAlerts);
        
        setAlerts(filteredAlerts);
        
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
  }, [user, filter.status, filter.severity, filter.search, router, sortConfig]);

  // Sort alerts based on current sort configuration
  const sortAlerts = (alertsToSort) => {
    return [...alertsToSort].sort((a, b) => {
      if (sortConfig.key === 'createdAt') {
        const aTime = new Date(a.createdAt).getTime();
        const bTime = new Date(b.createdAt).getTime();
        return sortConfig.direction === 'asc' ? aTime - bTime : bTime - aTime;
      } else if (sortConfig.key === 'severity') {
        const severityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
        const aValue = severityOrder[a.severity] || 0;
        const bValue = severityOrder[b.severity] || 0;
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      } else if (sortConfig.key === 'status') {
        const statusOrder = { 'New': 3, 'Acknowledged': 2, 'Resolved': 1 };
        const aValue = statusOrder[a.status] || 0;
        const bValue = statusOrder[b.status] || 0;
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
  };

  // Handle column sorting
  const handleSort = (key) => {
    setSortConfig(prevSort => ({
      key,
      direction: prevSort.key === key && prevSort.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  // Handle alert status updates
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

  // Get visual styling for severity
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': 
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: <AlertCircle className="w-3 h-3 mr-1 text-red-800" />
        };
      case 'High': 
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-800',
          icon: <AlertCircle className="w-3 h-3 mr-1 text-orange-800" />
        };
      case 'Medium': 
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          icon: <AlertCircle className="w-3 h-3 mr-1 text-yellow-800" />
        };
      case 'Low': 
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          icon: <AlertCircle className="w-3 h-3 mr-1 text-blue-800" />
        };
      default: 
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: <AlertCircle className="w-3 h-3 mr-1 text-gray-800" />
        };
    }
  };
  
  // Get visual styling for status
  const getStatusInfo = (status) => {
    switch (status) {
      case 'New': 
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: <Clock className="w-3 h-3 mr-1 text-red-800" />
        };
      case 'Acknowledged': 
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          icon: <CheckCircle className="w-3 h-3 mr-1 text-yellow-800" />
        };
      case 'Resolved': 
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: <CheckCircle className="w-3 h-3 mr-1 text-green-800" />
        };
      default: 
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: <Clock className="w-3 h-3 mr-1 text-gray-800" />
        };
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setFilter({...filter, search: e.target.value});
    setCurrentPage(1); // Reset to first page on new search
  };

  // Get paginated alerts
  const getPaginatedAlerts = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return alerts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <DoctorDashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading alerts...</p>
        </div>
      </DoctorDashboardLayout>
    );
  }

  return (
    <DoctorDashboardLayout>
      <div className="h-full flex flex-col">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
              Alert Management
            </h1>
            <p className="text-xs text-gray-500">
              Monitor and respond to patient alerts efficiently
            </p>
          </div>
          <div className="flex items-center mt-2 md:mt-0">
            <div className="relative mr-2">
              <Search className="h-4 w-4 absolute left-2 top-2.5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search alerts..." 
                className="pl-8 pr-4 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={filter.search}
                onChange={handleSearchChange}
              />
            </div>
            <button 
              onClick={() => router.back()}
              className="inline-flex items-center px-3 py-2 text-xs border border-gray-300 shadow-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              Back
            </button>
          </div>
        </div>

        {/* Main Content Area - Single Screen */}
        <div className="flex-1 flex overflow-hidden">
          <div className="w-full flex">
            {/* Left Panel - Stats + Filters */}
            <div className="w-64 pr-4 flex flex-col space-y-3">
              {/* Stats Cards */}
              <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
                <h3 className="text-xs font-medium text-gray-700 mb-2">Alerts Overview</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                        <AlertCircle className="h-3 w-3 text-indigo-600" />
                      </div>
                      <span className="text-xs text-gray-600">Total</span>
                    </div>
                    <span className="text-sm font-semibold">{stats.total}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mr-2">
                        <Clock className="h-3 w-3 text-red-600" />
                      </div>
                      <span className="text-xs text-gray-600">New</span>
                    </div>
                    <span className="text-sm font-semibold">{stats.new}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center mr-2">
                        <CheckCircle className="h-3 w-3 text-yellow-600" />
                      </div>
                      <span className="text-xs text-gray-600">Acknowledged</span>
                    </div>
                    <span className="text-sm font-semibold">{stats.acknowledged}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-1">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-xs text-gray-600">Resolved</span>
                    </div>
                    <span className="text-sm font-semibold">{stats.resolved}</span>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-medium text-gray-700">Filter Alerts</h3>
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="inline-flex items-center text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    <Filter className="h-3 w-3 mr-1" />
                    {isFilterOpen ? 'Hide' : 'Show'}
                  </button>
                </div>
                
                {isFilterOpen && (
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="statusFilter" className="block text-xs font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        id="statusFilter"
                        value={filter.status}
                        onChange={(e) => setFilter({...filter, status: e.target.value})}
                        className="block w-full text-xs pl-3 pr-10 py-1.5 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                      >
                        <option value="">All Statuses</option>
                        <option value="New">New</option>
                        <option value="Acknowledged">Acknowledged</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="severityFilter" className="block text-xs font-medium text-gray-700 mb-1">
                        Severity
                      </label>
                      <select
                        id="severityFilter"
                        value={filter.severity}
                        onChange={(e) => setFilter({...filter, severity: e.target.value})}
                        className="block w-full text-xs pl-3 pr-10 py-1.5 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                      >
                        <option value="">All Severities</option>
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    
                    <button 
                      onClick={() => setFilter({status: '', severity: '', search: ''})}
                      className="w-full text-xs py-1 text-center text-indigo-600 hover:text-indigo-800 focus:outline-none"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
              
              {/* Sort Options */}
              <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
                <h3 className="text-xs font-medium text-gray-700 mb-2">Sort By</h3>
                <div className="space-y-1.5">
                  <button 
                    onClick={() => handleSort('createdAt')}
                    className={`flex w-full items-center justify-between px-2 py-1 text-xs rounded-md ${
                      sortConfig.key === 'createdAt' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1.5" />
                      Date
                    </span>
                    {sortConfig.key === 'createdAt' && (
                      <ChevronDown className={`h-3 w-3 transform ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                  
                  <button 
                    onClick={() => handleSort('severity')}
                    className={`flex w-full items-center justify-between px-2 py-1 text-xs rounded-md ${
                      sortConfig.key === 'severity' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1.5" />
                      Severity
                    </span>
                    {sortConfig.key === 'severity' && (
                      <ChevronDown className={`h-3 w-3 transform ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                  
                  <button 
                    onClick={() => handleSort('status')}
                    className={`flex w-full items-center justify-between px-2 py-1 text-xs rounded-md ${
                      sortConfig.key === 'status' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1.5" />
                      Status
                    </span>
                    {sortConfig.key === 'status' && (
                      <ChevronDown className={`h-3 w-3 transform ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Panel - Alerts Table */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-700 flex items-center">
                  All Alerts 
                  <span className="ml-2 px-1.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {alerts.length}
                  </span>
                </h3>
                <div className="flex items-center text-xs text-gray-500">
                  <span>Page {currentPage} of {Math.max(1, Math.ceil(alerts.length / ITEMS_PER_PAGE))}</span>
                  <div className="flex ml-2">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={`px-2 py-1 rounded-l-md border border-r-0 ${
                        currentPage === 1 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Prev
                    </button>
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(Math.ceil(alerts.length / ITEMS_PER_PAGE), p + 1))}
                      disabled={currentPage >= Math.ceil(alerts.length / ITEMS_PER_PAGE)}
                      className={`px-2 py-1 rounded-r-md border ${
                        currentPage >= Math.ceil(alerts.length / ITEMS_PER_PAGE) 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Alerts Table */}
              <div className="overflow-auto max-h-[calc(100vh-260px)]">
                {alerts.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Patient
                        </th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Message
                        </th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Severity
                        </th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-xs">
                      {getPaginatedAlerts().map((alert) => (
                        <tr key={alert._id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                                <UserRound className="h-3 w-3 text-indigo-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 leading-none">
                                  {alert.patient?.firstName ? 
                                    `${alert.patient.firstName} ${alert.patient.lastName}` : 
                                    '(Patient Name)'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-start max-w-[180px]">
                              <MessageSquare className="h-3 w-3 text-gray-400 mr-1.5 mt-0.5 flex-shrink-0" />
                              <div className="text-gray-900 truncate" title={alert.message}>
                                {alert.message}
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity).bg} ${getSeverityColor(alert.severity).text}`}>
                              {getSeverityColor(alert.severity).icon}
                              {alert.severity}
                            </span>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(alert.status).bg} ${getStatusInfo(alert.status).text}`}>
                              {getStatusInfo(alert.status).icon}
                              {alert.status}
                            </span>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-gray-500">
                            {formatDate(alert.createdAt)}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              {alert.status === 'New' && (
                                <button 
                                  onClick={() => handleStatusUpdate(alert._id, 'Acknowledged')}
                                  className="text-xs px-2 py-1 text-yellow-700 bg-yellow-50 hover:bg-yellow-100 rounded transition-colors duration-150"
                                >
                                  Ack
                                </button>
                              )}
                              {alert.status !== 'Resolved' && (
                                <button 
                                  onClick={() => handleStatusUpdate(alert._id, 'Resolved')}
                                  className="text-xs px-2 py-1 text-green-700 bg-green-50 hover:bg-green-100 rounded transition-colors duration-150"
                                >
                                  Resolve
                                </button>
                              )}
                              
                              {alert.patient?._id && (
                                <Link
                                  href={`/dashboard/patients/vitals/${alert.patient._id}`}
                                  className="text-xs px-2 py-1 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors duration-150"
                                >
                                  Patient
                                </Link>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <XCircle className="h-10 w-10 text-gray-400 mb-4" />
                    <p className="text-base font-medium text-gray-500">No alerts found</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or check back later</p>
                  </div>
                )}
              </div>
              
              {/* Pagination - Bottom (Mobile friendly) */}
              {alerts.length > ITEMS_PER_PAGE && (
                <div className="px-4 py-2 border-t border-gray-200 flex justify-between items-center bg-gray-50 md:hidden">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`px-2 py-1 text-xs rounded-md border ${
                      currentPage === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  <span className="text-xs text-gray-500">
                    Page {currentPage} of {Math.ceil(alerts.length / ITEMS_PER_PAGE)}
                  </span>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(Math.ceil(alerts.length / ITEMS_PER_PAGE), p + 1))}
                    disabled={currentPage >= Math.ceil(alerts.length / ITEMS_PER_PAGE)}
                    className={`px-2 py-1 text-xs rounded-md border ${
                      currentPage >= Math.ceil(alerts.length / ITEMS_PER_PAGE) 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DoctorDashboardLayout>
  );
}