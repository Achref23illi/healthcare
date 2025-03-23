'use client';
import { useState, useEffect } from "react";
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import RoleBasedLayout from '@/components/RoleBasedLayout';
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  Activity, 
  ChevronDown, 
  AlertCircle, 
  CheckCircle,
  Filter,
  Stethoscope,
  Calendar
} from 'lucide-react';

const ManagePatients = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState({
    status: '',
    minAge: '',
    maxAge: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    stable: 0,
    moderate: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(10);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    const fetchPatients = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };
        
        // Build URL with filter parameters
        let url = `${process.env.NEXT_PUBLIC_API_URL}/patients`;
        const queryParams = [];
        
        if (filter.status) queryParams.push(`status=${filter.status}`);
        if (filter.minAge) queryParams.push(`minAge=${filter.minAge}`);
        if (filter.maxAge) queryParams.push(`maxAge=${filter.maxAge}`);
        
        if (queryParams.length > 0) {
          url += `?${queryParams.join('&')}`;
        }
        
        const response = await axios.get(url, config);
        
        const patientsData = response.data.patients || response.data;
        setPatients(patientsData);
        
        // Update stats
        setStats({
          total: patientsData.length,
          critical: patientsData.filter(p => p.status === 'Critical').length,
          moderate: patientsData.filter(p => p.status === 'Moderate').length,
          stable: patientsData.filter(p => (p.status === 'Stable' || !p.status)).length
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching patients:', error);
        setIsLoading(false);
      }
    };
    
    fetchPatients();
  }, [user, router, filter]);

  const handleDeletePatient = async (id) => {
    try {
      if (!user?.token) return;
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/patients/${id}`,
        config
      );
      
      // Update state by removing deleted patient
      setPatients(patients.filter(patient => patient._id !== id));
      
      // Update stats
      const deletedPatient = patients.find(p => p._id === id);
      const status = deletedPatient.status || 'Stable';
      
      setStats({
        ...stats,
        total: stats.total - 1,
        critical: status === 'Critical' ? stats.critical - 1 : stats.critical,
        moderate: status === 'Moderate' ? stats.moderate - 1 : stats.moderate,
        stable: (status === 'Stable' || !status) ? stats.stable - 1 : stats.stable
      });
      
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting patient:', error);
      alert('Failed to delete patient.');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is implemented through the filtered patients below
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Critical':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: <AlertCircle className="h-4 w-4 mr-1 text-red-600" />
        };
      case 'Moderate':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          icon: <AlertCircle className="h-4 w-4 mr-1 text-yellow-600" />
        };
      default:
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
        };
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilter({
      status: '',
      minAge: '',
      maxAge: ''
    });
    setSearchQuery('');
  };

  // Filter patients based on search query
  const filteredPatients = patients.filter(patient => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const disease = (patient.chronicDisease || '').toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    
    return fullName.includes(searchLower) || disease.includes(searchLower);
  });

  // Pagination
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) {
    return (
      <RoleBasedLayout>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0c3948]"></div>
          <p className="mt-4 text-gray-600">Loading patients...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              View and manage your patient records
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/dashboard/patients/add_patient">
              <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#0c3948] hover:bg-[#155e76] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0c3948]">
                <Plus className="h-4 w-4 mr-2" />
                Add New Patient
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-[#0c3948] rounded-md p-3">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Patients
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
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Critical
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stats.critical}
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
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Moderate
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stats.moderate}
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
                      Stable
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stats.stable}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <form onSubmit={handleSearch} className="w-full md:max-w-xs">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="focus:ring-[#0c3948] focus:border-[#0c3948] block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search patients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
              
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="mt-3 md:mt-0 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                <Filter className="h-4 w-4 mr-2" />
                {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
            
            {isFilterOpen && (
              <div className="mt-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      id="status"
                      name="status"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#0c3948] focus:border-[#0c3948] sm:text-sm rounded-md"
                      value={filter.status}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Statuses</option>
                      <option value="Critical">Critical</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Stable">Stable</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="minAge" className="block text-sm font-medium text-gray-700">Min Age</label>
                    <input
                      type="number"
                      name="minAge"
                      id="minAge"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0c3948] focus:border-[#0c3948] sm:text-sm"
                      placeholder="Min Age"
                      value={filter.minAge}
                      onChange={handleFilterChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="maxAge" className="block text-sm font-medium text-gray-700">Max Age</label>
                    <input
                      type="number"
                      name="maxAge"
                      id="maxAge"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0c3948] focus:border-[#0c3948] sm:text-sm"
                      placeholder="Max Age"
                      value={filter.maxAge}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Patient Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Patients ({filteredPatients.length})
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
                    Age
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chronic Disease
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentPatients.length > 0 ? (
                  currentPatients.map((patient) => (
                    <tr key={patient._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-[#0c3948]">
                              {patient.firstName?.charAt(0)}{patient.lastName?.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {patient.firstName} {patient.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.age}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.chronicDisease || 'None'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(patient.status || 'Stable').bg} ${getStatusBadge(patient.status || 'Stable').text}`}>
                          {getStatusBadge(patient.status || 'Stable').icon}
                          {patient.status || 'Stable'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {patient.updatedAt ? new Date(patient.updatedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <Link
                            href={`/dashboard/patients/vitals/${patient._id}`}
                            className="text-[#0c3948] hover:text-[#155e76] font-medium inline-flex items-center"
                          >
                            <Stethoscope className="h-4 w-4 mr-1" />
                            Vitals
                          </Link>
                          <Link
                            href={`/dashboard/patients/edit/${patient._id}`}
                            className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Link>
                          <button 
                            onClick={() => setShowDeleteConfirm(patient._id)}
                            className="text-red-600 hover:text-red-900 inline-flex items-center"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                        </div>
                        
                        {/* Delete confirmation modal */}
                        {showDeleteConfirm === patient._id && (
                          <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                                <div>
                                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                    <AlertCircle className="h-6 w-6 text-red-600" aria-hidden="true" />
                                  </div>
                                  <div className="mt-3 text-center sm:mt-5">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                      Delete Patient Record
                                    </h3>
                                    <div className="mt-2">
                                      <p className="text-sm text-gray-500">
                                        Are you sure you want to delete the record for {patient.firstName} {patient.lastName}? This action cannot be undone.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                  <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm"
                                    onClick={() => handleDeletePatient(patient._id)}
                                  >
                                    Delete
                                  </button>
                                  <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                                    onClick={() => setShowDeleteConfirm(null)}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-500">
                      <div className="flex flex-col items-center">
                        <svg className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
                        </svg>
                        <p className="text-base font-medium text-gray-500">No patients found</p>
                        <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter criteria</p>
                        <Link href="/dashboard/patients/add_patient">
                          <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0c3948] hover:bg-[#155e76] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0c3948]">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Your First Patient
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {filteredPatients.length > patientsPerPage && (
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
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
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                        currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronDown className="h-5 w-5 transform rotate-90" />
                    </button>
                    
                    {/* Page numbers */}
                    {[...Array(totalPages).keys()].map((number) => (
                      <button
                        key={number + 1}
                        onClick={() => paginate(number + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === number + 1
                            ? 'z-10 bg-[#0c3948] border-[#0c3948] text-white'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {number + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                        currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronDown className="h-5 w-5 transform -rotate-90" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </RoleBasedLayout>
  );
};

export default ManagePatients;