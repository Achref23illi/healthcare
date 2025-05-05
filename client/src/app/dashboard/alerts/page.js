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

  // Fetch alerts from API
  const fetchAlerts = async () => {
    try {
      setIsLoading(true);
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      console.log('Re-fetching alerts...');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/alerts`, config);
      console.log('Alerts response:', response.data);
      
      const realAlerts = response.data;
      setAlerts(realAlerts);
      setFilteredAlerts(realAlerts);

      // Recalculate stats
      const calculatedStats = realAlerts.reduce((stats, alert) => {
        const status = alert.status.toLowerCase();
        const priority = alert.priority.toLowerCase();
        
        if (status === 'resolved') {
          stats.resolved++;
        } else if (priority === 'critical') {
          stats.critical++;
        } else if (priority === 'high' || priority === 'medium') {
          stats.warning++;
        } else {
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
    if (!user?.token) return;
    fetchAlerts();
  }, [user, logout]);

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
        (alert.patientId && typeof alert.patientId === 'object' && 
          (`${alert.patientId.firstName} ${alert.patientId.lastName}`).toLowerCase().includes(searchLower))
      );
    }
    
    // Apply filters
    if (filters.type !== 'all') {
      result = result.filter(alert => alert.type === filters.type);
    }
    
    if (filters.priority !== 'all') {
      result = result.filter(alert => alert.priority.toLowerCase() === filters.priority);
    }
    
    if (filters.status !== 'all') {
      result = result.filter(alert => normalizeStatus(alert.status) === filters.status);
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

  // Normalize status values
  // Update the normalizeStatus function
const normalizeStatus = (status) => {
  if (!status) return 'unread';
  
  // Convert various status formats to consistent values
  const statusLower = status.toLowerCase();
  
  if (statusLower === 'new') return 'unread';
  if (statusLower === 'acknowledged') return 'in_progress';
  if (statusLower === 'resolved') return 'resolved';
  
  return statusLower;
};

  // Sorting function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Mark alert as read or in progress
 // Modify the updateAlertStatus function
const updateAlertStatus = async (alertId, newStatus) => {
  try {
    // API mapping - convert UI status to API status
    const apiStatus = newStatus === 'read' ? 'Acknowledged' : 
                      newStatus === 'in_progress' ? 'Acknowledged' : 'Resolved';
    
    console.log('Updating alert', alertId, 'to status:', apiStatus);
    
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    };
    
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/alerts/${alertId}`,
      { status: apiStatus },
      config
    );
    
    console.log('API response:', response.data);
    
    // Update local state immediately for better UI responsiveness
    setAlerts(prevAlerts => prevAlerts.map(alert => 
      alert._id === alertId 
        ? { ...alert, status: apiStatus, updatedAt: new Date().toISOString() } 
        : alert
    ));
    
    // Force a re-fetch of alerts to ensure state is in sync with backend
    fetchAlerts();
    
    // Close the actions dropdown
    setOpenActions(null);
  } catch (error) {
    console.error('Error updating alert status:', error.response?.data || error);
    alert('Failed to update alert status. Please try again.');
  }
};

  // Mark multiple alerts as read
  const markSelectedAsRead = async () => {
    if (!selectedAlerts.length) return;
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      // Update alerts one by one
      for (const alertId of selectedAlerts) {
        const alert = alerts.find(a => a._id === alertId);
        
        if (alert && normalizeStatus(alert.status) === 'unread') {
          await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/alerts/${alertId}`,
            { status: 'Acknowledged' },
            config
          );
        }
      }
      
      // Update local state
      setAlerts(alerts.map(alert => 
        selectedAlerts.includes(alert._id) && normalizeStatus(alert.status) === 'unread'
          ? { ...alert, status: 'Acknowledged', updatedAt: new Date() } 
          : alert
      ));
      
      // Clear selection
      setSelectedAlerts([]);
    } catch (error) {
      console.error('Error marking alerts as read:', error);
    }
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
    function handleClickOutside(event) {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setFilterMenuOpen(false);
      }
      
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target)) {
        setOpenActions(null);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get icon based on alert type
  const getAlertTypeIcon = (type) => {
    const alertType = type || 'vital_sign'; // Default if type is missing
    
    switch (alertType) {
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
      case 'custom':
        return <Info className="h-5 w-5 text-gray-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get color scheme based on priority
  const getPriorityColors = (priority) => {
    const priorityLower = priority?.toLowerCase() || 'info';
    
    switch (priorityLower) {
      case 'critical':
        return {
          bg: 'bg-red-50',
          text: 'text-red-700',
          border: 'border-red-200',
          icon: 'text-red-500',
          badge: 'bg-red-100 text-red-800'
        };
      case 'high':
      case 'warning':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
          icon: 'text-amber-500',
          badge: 'bg-amber-100 text-amber-800'
        };
      case 'medium':
        return {
          bg: 'bg-yellow-50',
          text: 'text-yellow-700',
          border: 'border-yellow-200',
          icon: 'text-yellow-500',
          badge: 'bg-yellow-100 text-yellow-800'
        };
      case 'low':
      case 'info':
      default:
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          icon: 'text-blue-500',
          badge: 'bg-blue-100 text-blue-800'
        };
    }
  };

  // Group alerts by patient
  const groupAlertsByPatient = (alerts) => {
    const groupedAlerts = {};
    
    alerts.forEach(alert => {
      // Check if patientId exists and is an object with _id
      if (alert.patientId && typeof alert.patientId === 'object' && alert.patientId._id) {
        const patientId = alert.patientId._id;
        if (!groupedAlerts[patientId]) {
          groupedAlerts[patientId] = {
            patient: {
              id: patientId,
              name: `${alert.patientId.firstName || ''} ${alert.patientId.lastName || ''}`,
              age: alert.patientId.age,
              // Add other patient details you want to display
            },
            alerts: []
          };
        }
        groupedAlerts[patientId].alerts.push(alert);
      } else {
        // For alerts without a proper patient reference, group under "Unknown"
        const unknownId = 'unknown';
        if (!groupedAlerts[unknownId]) {
          groupedAlerts[unknownId] = {
            patient: {
              id: unknownId,
              name: 'Unknown Patient',
              age: null
            },
            alerts: []
          };
        }
        groupedAlerts[unknownId].alerts.push(alert);
      }
    });
    
    // Convert the groupedAlerts object to an array for easier rendering
    return Object.values(groupedAlerts);
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
      <div className="flex flex-col md:flex-row gap-6 min-h-screen w-full bg-gray-50 overflow-hidden">
        {/* Sidebar for stats, search, and type/priority filters */}
        <aside className="w-full md:w-80 flex-shrink-0 mb-4 md:mb-0 sticky top-0 self-start z-10 h-fit md:h-[calc(100vh-2rem)] overflow-visible">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-indigo-600" /> Alerts & Notifications
            </h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <div>
                  <div className="text-xs text-red-700 font-semibold">Critical</div>
                  <div className="text-lg font-bold text-gray-900">{stats.critical}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
                <div>
                  <div className="text-xs text-amber-700 font-semibold">Warnings</div>
                  <div className="text-lg font-bold text-gray-900">{stats.warning}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                <Info className="h-6 w-6 text-blue-600" />
                <div>
                  <div className="text-xs text-blue-700 font-semibold">Info</div>
                  <div className="text-lg font-bold text-gray-900">{stats.info}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <div className="text-xs text-green-700 font-semibold">Resolved</div>
                  <div className="text-lg font-bold text-gray-900">{stats.resolved}</div>
                </div>
              </div>
            </div>
          </div>
          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="h-4 w-4 text-gray-400 absolute left-2 top-2.5" />
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="all">All Types</option>
                <option value="vital_sign">Vital Signs</option>
                <option value="medication">Medication</option>
                <option value="lab_result">Lab Results</option>
                <option value="appointment">Appointments</option>
                <option value="message">Messages</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </aside>
        {/* Main content */}
        <main className="flex-1 w-full overflow-x-hidden overflow-y-auto max-h-[calc(100vh-2rem)] px-1 md:px-0">
          {/* Top bar for status filter and clear button */}
          <div className="sticky top-0 z-20 bg-gradient-to-r from-indigo-50 via-blue-50 to-white border-b border-indigo-100 flex flex-col sm:flex-row items-center justify-between px-4 py-3 mb-4 gap-3 shadow-sm rounded-xl">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg">
                <CheckCircle className="h-4 w-4 mr-1 text-indigo-500" />
                Status
              </span>
              <select
                id="status-filter"
                className="px-4 py-2 border border-indigo-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="all">All Statuses</option>
                <option value="unread">Unread</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <span className="text-xs text-gray-700 hidden sm:inline-block font-medium bg-white px-3 py-1 rounded-lg border border-gray-200">
                {filteredAlerts.length} Alerts
              </span>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilters({ ...filters, status: 'all', type: 'all', priority: 'all' });
                }}
                className="flex items-center gap-1 px-4 py-2 text-xs font-semibold bg-white text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 shadow-none"
              >
                <X className="h-4 w-4 mr-1" />
                Clear Filters
              </button>
            </div>
          </div>
          {/* Alerts grid */}
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
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredAlerts.map((alert) => {
                const priorityColors = getPriorityColors(alert.priority);
                const alertStatus = normalizeStatus(alert.status);
                return (
                  <div
                    key={alert._id}
                    className={`flex flex-col h-full rounded-xl border ${priorityColors.border} bg-white shadow-sm p-4 transition hover:shadow-md`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${priorityColors.bg}`}>{getAlertTypeIcon(alert.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-semibold ${priorityColors.text}`}>{alert.priority}</span>
                          {alertStatus === 'resolved' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">Resolved</span>
                          )}
                        </div>
                        <div className="text-sm font-bold text-gray-900 line-clamp-1">{alert.title || `${alert.type.replace('_', ' ')} alert`}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mb-2 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {alert.patientId && typeof alert.patientId === 'object' ? `${alert.patientId.firstName} ${alert.patientId.lastName}` : 'Unknown Patient'}
                    </div>
                    <div className="text-sm text-gray-700 mb-2 line-clamp-2">{alert.description}</div>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="h-3 w-3" />{formatDate(alert.createdAt)}</span>
                      <div className="flex gap-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={selectedAlerts.includes(alert._id)}
                          onChange={(e) => handleSelectAlert(e, alert._id)}
                        />
                        {alertStatus !== 'resolved' && (
                          <button
                            onClick={() => updateAlertStatus(alert._id, 'resolved')}
                            className="px-3 py-1 text-xs bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100 transition-colors"
                            type="button"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </DoctorDashboardLayout>
  );
}