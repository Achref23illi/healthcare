'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { 
  Bell, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle, 
  X, 
  User, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Heart,
  Thermometer,
  Percent,
  Calendar,
  Clock,
  EyeOff,
  MoreHorizontal,
  ArrowUpDown,
  RefreshCw,
  MessageSquare,
  ExternalLink,
  Info
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DoctorDashboardLayout from '@/components/DoctorDashboardLayout';

export default function AlertsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  // Refs for clickable elements
  const filterMenuRef = useRef(null);
  const actionsMenuRef = useRef(null);

  // State for alerts
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'descending' });
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [openActions, setOpenActions] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    priority: 'all',
    status: 'all'
  });
  const [selectedAlerts, setSelectedAlerts] = useState([]);
  const [stats, setStats] = useState({
    critical: 0,
    warning: 0,
    info: 0,
    resolved: 0
  });

  // Check authentication and role
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (user.role !== 'doctor') {
      router.push('/patient-dashboard');
    }
  }, [user, router]);

  // Fetch alerts from API
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setIsLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/alerts`, config);
        const realAlerts = response.data;
        setAlerts(realAlerts);
        setFilteredAlerts(realAlerts);

        // Calculate stats
        const calculatedStats = realAlerts.reduce((stats, alert) => {
          if (alert.status === 'resolved') {
            stats.resolved++;
          } else if (alert.priority === 'critical') {
            stats.critical++;
          } else if (alert.priority === 'warning') {
            stats.warning++;
          } else if (alert.priority === 'info') {
            stats.info++;
          }
          return stats;
        }, { critical: 0, warning: 0, info: 0, resolved: 0 });

        setStats(calculatedStats);
      } catch (err) {
        console.error('Error fetching alerts:', err);
        setError('Failed to load alerts. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchAlerts();
    }
  }, [user]);

  // Filter and sort alerts
  useEffect(() => {
    if (!alerts.length) return;
    
    let result = [...alerts];
    
    // Apply search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(alert => 
        (alert.title && alert.title.toLowerCase().includes(searchLower)) ||
        (alert.description && alert.description.toLowerCase().includes(searchLower)) ||
        (alert.patientId && 
          (`${alert.patientId.firstName} ${alert.patientId.lastName}`).toLowerCase().includes(searchLower))
      );
    }
    
    // Apply filters
    if (filters.type !== 'all') {
      result = result.filter(alert => alert.type === filters.type);
    }
    
    if (filters.priority !== 'all') {
      result = result.filter(alert => alert.priority === filters.priority);
    }
    
    if (filters.status !== 'all') {
      result = result.filter(alert => alert.status === filters.status);
    }
    
    // Sort results
    result.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (sortConfig.key === 'createdAt' || sortConfig.key === 'updatedAt') {
        // Date sorting
        const dateA = new Date(aValue);
        const dateB = new Date(bValue);
        
        return sortConfig.direction === 'ascending' 
          ? dateA - dateB 
          : dateB - dateA;
      } else {
        // String and other value sorting
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      }
    });
    
    setFilteredAlerts(result);
  }, [searchTerm, filters, sortConfig, alerts]);

  // Sorting function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Mark alert as read or in progress
  const updateAlertStatus = (alertId, newStatus) => {
    // This would be an API call in a real app
    setAlerts(alerts.map(alert => 
      alert._id === alertId 
        ? { ...alert, status: newStatus, updatedAt: new Date() } 
        : alert
    ));
    setOpenActions(null);
  };

  // Mark multiple alerts as read
  const markSelectedAsRead = () => {
    if (!selectedAlerts.length) return;
    
    setAlerts(alerts.map(alert => 
      selectedAlerts.includes(alert._id) && alert.status === 'unread'
        ? { ...alert, status: 'read', updatedAt: new Date() } 
        : alert
    ));
    
    setSelectedAlerts([]);
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      return d.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  // Handle selecting all alerts
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedAlerts(filteredAlerts.map(alert => alert._id));
    } else {
      setSelectedAlerts([]);
    }
  };

  // Handle selecting a single alert
  const handleSelectAlert = (e, alertId) => {
    if (e.target.checked) {
      setSelectedAlerts([...selectedAlerts, alertId]);
    } else {
      setSelectedAlerts(selectedAlerts.filter(id => id !== alertId));
    }
  };

  // Close all dropdown menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setFilterMenuOpen(false);
      }
      
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target)) {
        setOpenActions(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get icon based on alert type
  const getAlertTypeIcon = (type) => {
    switch (type) {
      case 'vital_sign':
        return <Heart className="h-5 w-5 text-red-500" />;
      case 'medication':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'lab_result':
        return <Thermometer className="h-5 w-5 text-blue-500" />;
      case 'appointment':
        return <Calendar className="h-5 w-5 text-purple-500" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case 'system':
        return <Info className="h-5 w-5 text-gray-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get color scheme based on priority
  const getPriorityColors = (priority) => {
    switch (priority) {
      case 'critical':
        return {
          bg: 'bg-red-50',
          text: 'text-red-700',
          border: 'border-red-200',
          icon: 'text-red-500',
          badge: 'bg-red-100 text-red-800'
        };
      case 'warning':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
          icon: 'text-amber-500',
          badge: 'bg-amber-100 text-amber-800'
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          icon: 'text-blue-500',
          badge: 'bg-blue-100 text-blue-800'
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
          icon: 'text-gray-500',
          badge: 'bg-gray-100 text-gray-800'
        };
    }
  };

  if (!user || user.role !== 'doctor') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <DoctorDashboardLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden border border-gray-200">
          <div className="px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                <Bell className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Alerts & Notifications</h1>
                <p className="text-sm text-gray-500 mt-0.5">Monitor and manage clinical alerts</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => setIsLoading(false), 500);
                }}
                className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
              >
                <RefreshCw className="mr-1.5 h-4 w-4 text-gray-500" />
                Refresh
              </button>
              {selectedAlerts.length > 0 && (
                <button
                  onClick={markSelectedAsRead}
                  className="inline-flex items-center px-3 py-1.5 bg-indigo-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
                >
                  <CheckCircle className="mr-1.5 h-4 w-4" />
                  Mark as Read ({selectedAlerts.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-red-50 border border-red-100 rounded-xl shadow-sm p-4">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-red-700 font-medium">Critical</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.critical}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-100 rounded-xl shadow-sm p-4">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-amber-700 font-medium">Warnings</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.warning}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-xl shadow-sm p-4">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Info className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">Information</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.info}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-100 rounded-xl shadow-sm p-4">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-700 font-medium">Resolved</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.resolved}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm mb-6 p-4 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="w-full md:w-1/3 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
              <div className="relative" ref={filterMenuRef}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setFilterMenuOpen(!filterMenuOpen);
                  }}
                  type="button"
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Filter className="mr-2 h-4 w-4 text-gray-500" />
                  Filters
                  <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                </button>
                
                {filterMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-medium text-gray-900">Filter Alerts</h3>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setFilters({
                              type: 'all',
                              priority: 'all',
                              status: 'all'
                            });
                          }}
                          type="button"
                          className="text-xs text-indigo-600 hover:text-indigo-800"
                        >
                          Reset
                        </button>
                      </div>
                      
                      {/* Alert Type Filter */}
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alert Type</label>
                        <select 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          value={filters.type}
                          onChange={(e) => setFilters({...filters, type: e.target.value})}
                        >
                          <option value="all">All Types</option>
                          <option value="vital_sign">Vital Signs</option>
                          <option value="medication">Medication</option>
                          <option value="lab_result">Lab Results</option>
                          <option value="appointment">Appointments</option>
                          <option value="message">Messages</option>
                          <option value="system">System</option>
                        </select>
                      </div>
                      
                      {/* Priority Filter */}
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          value={filters.priority}
                          onChange={(e) => setFilters({...filters, priority: e.target.value})}
                        >
                          <option value="all">All Priorities</option>
                          <option value="critical">Critical</option>
                          <option value="warning">Warning</option>
                          <option value="info">Information</option>
                        </select>
                      </div>
                      
                      {/* Status Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          value={filters.status}
                          onChange={(e) => setFilters({...filters, status: e.target.value})}
                        >
                          <option value="all">All Statuses</option>
                          <option value="unread">Unread</option>
                          <option value="read">Read</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Sort buttons */}
              <button
                onClick={() => requestSort('createdAt')}
                type="button"
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                {sortConfig.key === 'createdAt' ? (
                  sortConfig.direction === 'ascending' ? 'Oldest First' : 'Newest First'
                ) : 'Sort by Date'}
                {sortConfig.key === 'createdAt' && (
                  sortConfig.direction === 'ascending' ? 
                    <ChevronUp className="ml-1 h-4 w-4 text-gray-500" /> :
                    <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                )}
              </button>
              
              {/* Active Filters */}
              <div className="flex flex-wrap gap-2">
                {filters.type !== 'all' && (
                  <div className="bg-indigo-50 text-indigo-700 text-xs rounded-full px-3 py-1 flex items-center">
                    Type: {filters.type.replace('_', ' ')}
                    <button 
                      onClick={() => setFilters({...filters, type: 'all'})}
                      className="ml-1 focus:outline-none"
                      type="button"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                
                {filters.priority !== 'all' && (
                  <div className="bg-indigo-50 text-indigo-700 text-xs rounded-full px-3 py-1 flex items-center">
                    Priority: {filters.priority}
                    <button 
                      onClick={() => setFilters({...filters, priority: 'all'})}
                      className="ml-1 focus:outline-none"
                      type="button"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                
                {filters.status !== 'all' && (
                  <div className="bg-indigo-50 text-indigo-700 text-xs rounded-full px-3 py-1 flex items-center">
                    Status: {filters.status.replace('_', ' ')}
                    <button 
                      onClick={() => setFilters({...filters, status: 'all'})}
                      className="ml-1 focus:outline-none"
                      type="button"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Selection count */}
              {selectedAlerts.length > 0 && (
                <div className="ml-auto">
                  <div className="bg-indigo-50 rounded-lg px-3 py-2 flex items-center">
                    <span className="text-sm text-indigo-700 mr-3">{selectedAlerts.length} selected</span>
                    <button 
                      onClick={() => setSelectedAlerts([])}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                      type="button"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Alerts Content */}
        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              <p className="mt-4 text-gray-600">Loading alerts...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="rounded-full h-12 w-12 bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <p className="mt-4 text-gray-600">{error}</p>
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="rounded-full h-12 w-12 bg-gray-100 flex items-center justify-center">
                <Bell className="h-6 w-6 text-gray-400" />
              </div>
              <p className="mt-4 text-gray-600">No alerts found</p>
              <p className="text-sm text-gray-500 mt-1">
                {searchTerm || filters.type !== 'all' || filters.priority !== 'all' || filters.status !== 'all' 
                  ? 'Try adjusting your filters or search terms' 
                  : 'You have no alerts at this time'}
              </p>
              {(searchTerm || filters.type !== 'all' || filters.priority !== 'all' || filters.status !== 'all') && (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setFilters({
                      type: 'all',
                      priority: 'all',
                      status: 'all'
                    });
                  }}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  type="button"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4 overflow-auto max-h-[calc(100vh-320px)] pr-1">
              {/* Select all checkbox */}
              <div className="flex items-center mb-2 pl-4">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={selectedAlerts.length === filteredAlerts.length && filteredAlerts.length > 0}
                  onChange={handleSelectAll}
                  id="select-all"
                />
                <label htmlFor="select-all" className="ml-2 text-sm text-gray-600">
                  Select all
                </label>
                <span className="ml-auto text-sm text-gray-500">
                  {filteredAlerts.length} alert{filteredAlerts.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              {filteredAlerts.map(alert => {
                const priorityColors = getPriorityColors(alert.priority);
                
                return (
                  <div 
                    key={alert._id} 
                    className={`border rounded-xl p-4 shadow-sm transition-all duration-200 ${
                      priorityColors.bg
                    } ${
                      priorityColors.border
                    } ${
                      alert.status === 'unread' ? 'border-l-4' : ''
                    }`}
                  >
                    <div className="flex items-start">
                      {/* Checkbox */}
                      <div className="mr-3 mt-1">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={selectedAlerts.includes(alert._id)}
                          onChange={(e) => handleSelectAlert(e, alert._id)}
                        />
                      </div>
                      
                      {/* Alert icon */}
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 ${
                        alert.priority === 'critical' ? 'bg-red-100' : 
                        alert.priority === 'warning' ? 'bg-amber-100' : 
                        'bg-blue-100'
                      }`}>
                        {getAlertTypeIcon(alert.type)}
                      </div>
                      
                      {/* Alert content */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className={`font-medium ${priorityColors.text}`}>
                              {alert.title}
                            </h3>
                            
                            {/* Patient info if applicable */}
                            {alert.patientId && (
                              <div className="flex items-center mt-1 text-sm text-gray-600">
                                <User className="h-3.5 w-3.5 mr-1" />
                                <Link 
                                  href={`/dashboard/patients/view_patient/${alert.patientId._id}`}
                                  className="font-medium text-indigo-600 hover:text-indigo-800"
                                >
                                  {alert.patientId.firstName} {alert.patientId.lastName}
                                </Link>
                                <span className="mx-1">•</span>
                                <span>{alert.patientId.age} years</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center">
                            {/* Priority badge */}
                            <span className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${priorityColors.badge}`}>
                              {alert.priority}
                            </span>
                            
                            {/* Status indicator */}
                            {alert.status === 'unread' && (
                              <div className="ml-2 h-2 w-2 rounded-full bg-blue-600"></div>
                            )}
                            
                            {/* Actions menu */}
                            <div className="relative ml-2" ref={actionsMenuRef}>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setOpenActions(openActions === alert._id ? null : alert._id);
                                }}
                                type="button"
                                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                aria-label="Alert actions"
                              >
                                <MoreHorizontal className="h-5 w-5" />
                              </button>
                              
                              {openActions === alert._id && (
                                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                  <div className="py-1">
                                    {alert.status === 'unread' && (
                                      <button 
                                        onClick={() => updateAlertStatus(alert._id, 'read')}
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        type="button"
                                      >
                                        <CheckCircle className="h-4 w-4 mr-3 text-gray-500" />
                                        Mark as Read
                                      </button>
                                    )}
                                    
                                    {(alert.status === 'unread' || alert.status === 'read') && (
                                      <button 
                                        onClick={() => updateAlertStatus(alert._id, 'in_progress')}
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        type="button"
                                      >
                                        <ArrowUpDown className="h-4 w-4 mr-3 text-gray-500" />
                                        Mark In Progress
                                      </button>
                                    )}
                                    
                                    {alert.status !== 'resolved' && (
                                      <button 
                                        onClick={() => updateAlertStatus(alert._id, 'resolved')}
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        type="button"
                                      >
                                        <CheckCircle className="h-4 w-4 mr-3 text-green-500" />
                                        Resolve Alert
                                      </button>
                                    )}
                                    
                                    {alert.patientId && (
                                      <Link 
                                        href={`/dashboard/patients/view_patient/${alert.patientId._id}`}
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <ExternalLink className="h-4 w-4 mr-3 text-gray-500" />
                                        View Patient
                                      </Link>
                                    )}
                                    
                                    <button 
                                      onClick={() => {
                                        setOpenActions(null);
                                        // Additional logic to permanently dismiss alert could go here
                                      }}
                                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                      type="button"
                                    >
                                      <EyeOff className="h-4 w-4 mr-3 text-red-500" />
                                      Dismiss
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Alert description */}
                        <p className="mt-1 text-sm text-gray-700">
                          {alert.description}
                        </p>
                        
                        {/* Alert specific details */}
                        {alert.vitalSign && (
                          <div className="mt-2 bg-white bg-opacity-50 rounded-md p-2 text-sm">
                            <div className="flex items-center text-gray-700">
                              {alert.vitalSign.type === 'temperature' && (
                                <Thermometer className="h-4 w-4 mr-1.5 text-red-500" />
                              )}
                              {alert.vitalSign.type === 'heart_rate' && (
                                <Heart className="h-4 w-4 mr-1.5 text-red-500" />
                              )}
                              {alert.vitalSign.type === 'oxygen_saturation' && (
                                <Percent className="h-4 w-4 mr-1.5 text-blue-500" />
                              )}
                              <span className="font-medium">
                                {alert.vitalSign.type.replace('_', ' ')}: 
                              </span>
                              <span className="ml-2">
                                {alert.vitalSign.value} {alert.vitalSign.unit}
                              </span>
                              <span className="mx-2 text-gray-400">|</span>
                              <span className="text-gray-600">
                                Threshold: {alert.vitalSign.threshold} {alert.vitalSign.unit}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {alert.appointment && (
                          <div className="mt-2 bg-white bg-opacity-50 rounded-md p-2 text-sm">
                            <div className="flex items-center text-gray-700">
                              <Calendar className="h-4 w-4 mr-1.5 text-purple-500" />
                              <span className="font-medium">
                                {alert.appointment.type}: 
                              </span>
                              <span className="ml-2">
                                {new Date(alert.appointment.date).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              {alert.appointment.location && (
                                <>
                                  <span className="mx-2 text-gray-400">|</span>
                                  <span className="text-gray-600">
                                    {alert.appointment.location}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Alert footer info */}
                        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                          <span>{formatDate(alert.createdAt)}</span>
                          
                          <div className="flex items-center">
                            {alert.status && (
                              <span className={`capitalize px-2 py-0.5 rounded-full ${
                                alert.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                alert.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                alert.status === 'read' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {alert.status.replace('_', ' ')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DoctorDashboardLayout>
  );
}