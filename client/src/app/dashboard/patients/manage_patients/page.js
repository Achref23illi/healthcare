'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { 
  UserPlus, 
  Search, 
  Trash2, 
  Edit, 
  Eye, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Calendar, 
  User, 
  Heart, 
  AlertTriangle, 
  CheckCircle, 
  FilePlus,
  Download, 
  RefreshCw, 
  MoreHorizontal, 
  ArrowUpDown,
  X,
  ExternalLink,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DoctorDashboardLayout from '@/components/DoctorDashboardLayout';

export default function ManagePatients() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  // Add refs for handling outside clicks
  const filterMenuRef = useRef(null);
  const actionsMenuRef = useRef(null);

  // State for patients data
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'lastName', direction: 'ascending' });
  const [openActions, setOpenActions] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(10);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [filters, setFilters] = useState({
    gender: 'all',
    age: 'all',
    status: 'all'
  });
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);

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

  // Fetch patients from API
  useEffect(() => {
    if (!user?.token) return;
    
    const fetchPatients = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };
        
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/patients`,
          config
        );
        
        const patientsWithStatus = response.data.map(patient => {
          // Determine status based on vital signs (example logic)
          let status = 'stable';
          
          // Check for concerning vital signs
          if (
            (patient.temperature && (patient.temperature < 36 || patient.temperature > 38)) ||
            (patient.heartRate && (patient.heartRate < 60 || patient.heartRate > 100)) ||
            (patient.oxygenSaturation && patient.oxygenSaturation < 95)
          ) {
            status = 'concerning';
          }
          
          // Check for critical vital signs
          if (
            (patient.temperature && (patient.temperature < 35 || patient.temperature > 39.5)) ||
            (patient.heartRate && (patient.heartRate < 50 || patient.heartRate > 120)) ||
            (patient.oxygenSaturation && patient.oxygenSaturation < 90)
          ) {
            status = 'critical';
          }
          
          return {
            ...patient,
            status
          };
        });
        
        setPatients(patientsWithStatus);
        setFilteredPatients(patientsWithStatus);
      } catch (err) {
        console.error('Error fetching patients:', err);
        
        if (err.response?.status === 401) {
          setError('Your session has expired. Please log in again.');
          setTimeout(() => logout(), 2000);
        } else {
          setError(err.response?.data?.message || 'Failed to fetch patients. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPatients();
  }, [user, logout]);

  // Search and filter patients
  useEffect(() => {
    let result = [...patients];
    
    // Apply search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(patient => 
        patient.firstName.toLowerCase().includes(searchLower) ||
        patient.lastName.toLowerCase().includes(searchLower) ||
        (patient.email && patient.email.toLowerCase().includes(searchLower)) ||
        (patient.phone && patient.phone.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply filters
    if (filters.gender !== 'all') {
      result = result.filter(patient => patient.gender === filters.gender);
    }
    
    if (filters.status !== 'all') {
      result = result.filter(patient => patient.status === filters.status);
    }
    
    if (filters.age !== 'all') {
      switch (filters.age) {
        case 'under18':
          result = result.filter(patient => patient.age < 18);
          break;
        case '18to40':
          result = result.filter(patient => patient.age >= 18 && patient.age <= 40);
          break;
        case '41to65':
          result = result.filter(patient => patient.age > 40 && patient.age <= 65);
          break;
        case 'over65':
          result = result.filter(patient => patient.age > 65);
          break;
      }
    }
    
    // Sort results
    result.sort((a, b) => {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';
      
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredPatients(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, filters, patients, sortConfig]);

  // Sorting function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Delete patient
  const handleDeletePatient = async () => {
    if (!patientToDelete) return;
    
    try {
      setIsDeleting(true);
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/patients/${patientToDelete._id}`,
        config
      );
      
      setDeleteMessage({
        type: 'success',
        text: 'Patient deleted successfully'
      });
      
      // Update patients list
      setPatients(patients.filter(p => p._id !== patientToDelete._id));
      setSelectedPatients(selectedPatients.filter(id => id !== patientToDelete._id));
      
      // Close the delete modal after a short delay
      setTimeout(() => {
        setShowDeleteConfirm(false);
        setPatientToDelete(null);
        setDeleteMessage(null);
      }, 1500);
    } catch (err) {
      setDeleteMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to delete patient. Please try again.'
      });
      
      if (err.response?.status === 401) {
        setTimeout(() => logout(), 2000);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle batch operations
  const handleBatchDelete = () => {
    if (selectedPatients.length === 0) return;
    
    // This would be expanded to actually delete multiple patients
    alert(`Delete operation would remove ${selectedPatients.length} patients`);
    setSelectedPatients([]);
  };

  // Calculate pagination
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedPatients(currentPatients.map(patient => patient._id));
    } else {
      setSelectedPatients([]);
    }
  };

  const handleSelectPatient = (e, patientId) => {
    if (e.target.checked) {
      setSelectedPatients([...selectedPatients, patientId]);
    } else {
      setSelectedPatients(selectedPatients.filter(id => id !== patientId));
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

  // Add this useEffect to handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close the actions menu when clicking outside
      if (openActions && !event.target.closest(`#patient-actions-${openActions}`)) {
        setOpenActions(null);
      }
    };
    
    // Add event listener to document
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openActions]);

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
                <ClipboardList className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Manage Patients</h1>
                <p className="text-sm text-gray-500 mt-0.5">View, edit and manage your patient records</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link 
                href="/dashboard/patients/add_patient" 
                className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add New Patient
              </Link>
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
                placeholder="Search patients..."
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
                        <h3 className="text-sm font-medium text-gray-900">Filter Patients</h3>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setFilters({
                              gender: 'all',
                              age: 'all',
                              status: 'all'
                            });
                          }}
                          type="button"
                          className="text-xs text-indigo-600 hover:text-indigo-800"
                        >
                          Reset
                        </button>
                      </div>
                      
                      {/* Gender Filter */}
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          value={filters.gender}
                          onChange={(e) => setFilters({...filters, gender: e.target.value})}
                        >
                          <option value="all">All</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      {/* Age Filter */}
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
                        <select 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          value={filters.age}
                          onChange={(e) => setFilters({...filters, age: e.target.value})}
                        >
                          <option value="all">All Ages</option>
                          <option value="under18">Under 18</option>
                          <option value="18to40">18 to 40</option>
                          <option value="41to65">41 to 65</option>
                          <option value="over65">Over 65</option>
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
                          <option value="all">All Status</option>
                          <option value="stable">Stable</option>
                          <option value="concerning">Concerning</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Active Filters */}
              <div className="flex flex-wrap gap-2">
                {filters.gender !== 'all' && (
                  <div className="bg-indigo-50 text-indigo-700 text-xs rounded-full px-3 py-1 flex items-center">
                    Gender: {filters.gender}
                    <button 
                      onClick={() => setFilters({...filters, gender: 'all'})}
                      className="ml-1 focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                
                {filters.age !== 'all' && (
                  <div className="bg-indigo-50 text-indigo-700 text-xs rounded-full px-3 py-1 flex items-center">
                    Age: {filters.age === 'under18' ? 'Under 18' : 
                          filters.age === '18to40' ? '18-40' : 
                          filters.age === '41to65' ? '41-65' : 'Over 65'}
                    <button 
                      onClick={() => setFilters({...filters, age: 'all'})}
                      className="ml-1 focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                
                {filters.status !== 'all' && (
                  <div className="bg-indigo-50 text-indigo-700 text-xs rounded-full px-3 py-1 flex items-center">
                    Status: {filters.status}
                    <button 
                      onClick={() => setFilters({...filters, status: 'all'})}
                      className="ml-1 focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Batch actions */}
              {selectedPatients.length > 0 && (
                <div className="ml-auto">
                  <div className="bg-indigo-50 rounded-lg px-3 py-2 flex items-center">
                    <span className="text-sm text-indigo-700 mr-3">{selectedPatients.length} selected</span>
                    <button 
                      onClick={() => setSelectedPatients([])}
                      className="text-sm text-indigo-600 hover:text-indigo-800 mr-3"
                    >
                      Clear
                    </button>
                    <button 
                      onClick={handleBatchDelete}
                      className="text-sm text-red-600 hover:text-red-800 flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
              
              <div className="ml-auto hidden md:flex items-center">
                <span className="text-sm text-gray-500">
                  {filteredPatients.length} patients
                </span>
                <button 
                  onClick={() => {
                    setIsLoading(true);
                    setTimeout(() => setIsLoading(false), 500);
                  }}
                  type="button"
                  className="ml-2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                  title="Refresh"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Patients Table */}
        <div className="bg-white rounded-xl shadow-sm flex-1 overflow-hidden border border-gray-200">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              <p className="mt-4 text-gray-600">Loading patients...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="rounded-full h-12 w-12 bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <p className="mt-4 text-gray-600">{error}</p>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="rounded-full h-12 w-12 bg-gray-100 flex items-center justify-center">
                <User className="h-6 w-6 text-gray-400" />
              </div>
              <p className="mt-4 text-gray-600">No patients found</p>
              <p className="text-sm text-gray-500 mt-1">
                {searchTerm ? 'Try a different search term or clear filters' : 'Add your first patient to get started'}
              </p>
              {searchTerm && (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setFilters({
                      gender: 'all',
                      age: 'all',
                      status: 'all'
                    });
                  }}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={selectedPatients.length === currentPatients.length && currentPatients.length > 0}
                          onChange={handleSelectAll}
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        onClick={() => requestSort('lastName')}
                        className="group flex items-center space-x-1 focus:outline-none"
                      >
                        <span>Patient Name</span>
                        <span className="text-gray-400 group-hover:text-gray-500">
                          {sortConfig.key === 'lastName' ? (
                            sortConfig.direction === 'ascending' ? 
                              <ChevronUp className="h-4 w-4" /> : 
                              <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ArrowUpDown className="h-4 w-4" />
                          )}
                        </span>
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        onClick={() => requestSort('age')}
                        className="group flex items-center space-x-1 focus:outline-none"
                      >
                        <span>Age</span>
                        <span className="text-gray-400 group-hover:text-gray-500">
                          {sortConfig.key === 'age' ? (
                            sortConfig.direction === 'ascending' ? 
                              <ChevronUp className="h-4 w-4" /> : 
                              <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ArrowUpDown className="h-4 w-4" />
                          )}
                        </span>
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <span>Gender</span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <span>Contact</span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <span>Status</span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <span>Last Update</span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <span>Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentPatients.map((patient) => (
                    <tr key={patient._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={selectedPatients.includes(patient._id)}
                          onChange={(e) => handleSelectPatient(e, patient._id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-indigo-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{patient.firstName} {patient.lastName}</div>
                            <div className="text-sm text-gray-500">
                              {patient.chronicDisease ? (
                                <span className="flex items-center text-xs">
                                  <AlertTriangle className="h-3 w-3 text-amber-500 mr-1" />
                                  {patient.chronicDisease}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{patient.age}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">{patient.gender || 'Not specified'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {patient.email && (
                          <div className="text-sm text-gray-900">{patient.email}</div>
                        )}
                        {patient.phone && (
                          <div className="text-sm text-gray-500">{patient.phone}</div>
                        )}
                        {!patient.email && !patient.phone && (
                          <div className="text-sm text-gray-500">No contact info</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`h-2.5 w-2.5 rounded-full mr-2 ${
                            patient.status === 'critical' ? 'bg-red-500' : 
                            patient.status === 'concerning' ? 'bg-amber-500' : 
                            'bg-green-500'
                          }`}></span>
                          <span className={`text-sm capitalize ${
                            patient.status === 'critical' ? 'text-red-700' : 
                            patient.status === 'concerning' ? 'text-amber-700' : 
                            'text-green-700'
                          }`}>
                            {patient.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(patient.updatedAt).toLocaleDateString()} 
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-center relative" id={`patient-actions-${patient._id}`}>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setOpenActions(openActions === patient._id ? null : patient._id);
                            }}
                            type="button"
                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                            aria-label="Patient actions"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </button>
                          
                          {openActions === patient._id && (
                            <div 
                              className="absolute right-0 mt-6 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="py-1">
                                <Link 
                                  href={`/dashboard/patients/vitals/${patient._id}`}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Heart className="h-4 w-4 mr-3 text-gray-500" />
                                  Add Vital Signs
                                </Link>
                                <button 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setPatientToDelete(patient);
                                    setShowDeleteConfirm(true);
                                    setOpenActions(null);
                                  }}
                                  type="button"
                                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4 mr-3 text-red-500" />
                                  Delete Patient
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination */}
          {!isLoading && !error && filteredPatients.length > 0 && (
            <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === 1 
                      ? 'bg-gray-50 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === totalPages 
                      ? 'bg-gray-50 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstPatient + 1}</span> to{' '}
                    <span className="font-medium">
                      {indexOfLastPatient > filteredPatients.length ? filteredPatients.length : indexOfLastPatient}
                    </span>{' '}
                    of <span className="font-medium">{filteredPatients.length}</span> patients
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                        currentPage === 1 
                          ? 'bg-gray-50 text-gray-400 cursor-not-allowed' 
                          : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    
                    {/* Page buttons */}
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      // Only show a window of 5 pages
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => setCurrentPage(pageNumber)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === pageNumber
                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      }
                      
                      // Add ellipsis
                      if (
                        (pageNumber === currentPage - 2 && pageNumber > 1) ||
                        (pageNumber === currentPage + 2 && pageNumber < totalPages)
                      ) {
                        return (
                          <span
                            key={`ellipsis-${pageNumber}`}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                          >
                            ...
                          </span>
                        );
                      }
                      
                      return null;
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                        currentPage === totalPages 
                          ? 'bg-gray-50 text-gray-400 cursor-not-allowed' 
                          : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="relative mx-auto p-5 w-96 shadow-lg rounded-lg bg-white" onClick={(e) => e.stopPropagation()}>
              <div className="mt-3 text-center">
                {deleteMessage ? (
                  <>
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mt-2">
                      {deleteMessage.type === 'success' ? 'Success!' : 'Error!'}
                    </h3>
                    <div className="mt-2 px-7 py-3">
                      <p className="text-sm text-gray-500">
                        {deleteMessage.text}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                      <Trash2 className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mt-2">
                      Delete Patient
                    </h3>
                    <div className="mt-2 px-7 py-3">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete {patientToDelete?.firstName} {patientToDelete?.lastName}? This action cannot be undone.
                      </p>
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setShowDeleteConfirm(false);
                          setPatientToDelete(null);
                        }}
                        type="button"
                        className="px-4 py-2 bg-white text-gray-700 text-base font-medium rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeletePatient();
                        }}
                        type="button"
                        disabled={isDeleting}
                        className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        {isDeleting ? (
                          <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Deleting...
                          </div>
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DoctorDashboardLayout>
  );
}