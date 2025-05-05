'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import DoctorDashboardLayout from '@/components/DoctorDashboardLayout';
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, Thermometer, Heart, Wind, Droplets, Activity } from 'lucide-react';

export default function RecordVitals() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vitalSign, setVitalSign] = useState({
    type: 'temperature',
    value: '',
    unit: 'C'
  });
  const [message, setMessage] = useState(null);

  // Normal ranges for vital signs
  const normalRanges = {
    temperature: { min: 36.1, max: 37.2, unit: 'C' },
    heartRate: { min: 60, max: 100, unit: 'bpm' },
    oxygenSaturation: { min: 95, max: 100, unit: '%' },
    bloodPressure: { min: '90/60', max: '120/80', unit: 'mmHg' },
    respiratoryRate: { min: 12, max: 20, unit: 'breaths/min' }
  };

  // Icons for vital sign types
  const vitalIcons = {
    temperature: <Thermometer className="h-5 w-5 text-indigo-500" />,
    heartRate: <Heart className="h-5 w-5 text-red-500" />,
    oxygenSaturation: <Wind className="h-5 w-5 text-blue-500" />,
    bloodPressure: <Droplets className="h-5 w-5 text-purple-500" />,
    respiratoryRate: <Activity className="h-5 w-5 text-green-500" />
  };

  // Display names for vital sign types
  const vitalDisplayNames = {
    temperature: 'Temperature',
    heartRate: 'Heart Rate',
    oxygenSaturation: 'Oxygen Saturation',
    bloodPressure: 'Blood Pressure',
    respiratoryRate: 'Respiratory Rate'
  };

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
        setError(error.response?.data?.message || 'Patient not found or access denied');
        setIsLoading(false);
        
        // Redirect to manage patients page after 3 seconds if patient not found
        setTimeout(() => {
          router.push('/dashboard/patients/manage_patients');
        }, 3000);
      }
    };
    
    fetchPatient();
  }, [params.id, user, router]);

  const handleTypeChange = (e) => {
    const type = e.target.value;
    let unit = '';
    
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

  if (isLoading) {
    return (
      <DoctorDashboardLayout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="ml-3 text-gray-600">Loading patient data...</p>
        </div>
      </DoctorDashboardLayout>
    );
  }
  
  if (error) {
    return (
      <DoctorDashboardLayout>
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <div className="text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <p className="text-gray-500 mb-4">Redirecting to patient management...</p>
              <button
                onClick={() => router.push('/dashboard/patients/manage_patients')}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Go to Patient Management
              </button>
            </div>
          </div>
        </div>
      </DoctorDashboardLayout>
    );
  }

  return (
    <DoctorDashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header with back button */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button 
              onClick={() => router.back()} 
              className="mr-4 p-2 rounded-full hover:bg-gray-100 text-gray-600 focus:outline-none"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Record Vital Signs</h1>
          </div>
        </div>

        {/* Patient info card */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {patient?.firstName} {patient?.lastName}
              </h2>
              <div className="mt-2 space-y-1">
                <p className="text-gray-600">Age: {patient?.age} years</p>
                <p className="text-gray-600">Gender: {patient?.gender || 'Not specified'}</p>
                {patient?.chronicDisease && (
                  <p className="text-gray-600">Chronic Condition: {patient.chronicDisease}</p>
                )}
              </div>
            </div>
            <div>
              <span className={`px-3 py-1.5 inline-flex text-sm font-medium rounded-full 
                ${patient?.status === 'Critical' ? 'bg-red-100 text-red-800' : 
                  patient?.status === 'Moderate' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-green-100 text-green-800'}`}>
                {patient?.status || 'Stable'}
              </span>
            </div>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.type === 'success' ? 
              <CheckCircle className="h-5 w-5 mr-2" /> : 
              <AlertCircle className="h-5 w-5 mr-2" />}
            {message.text}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Recording form */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Record New Vital Sign</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="vitalType" className="block text-sm font-medium text-gray-700 mb-1">
                  Vital Sign Type
                </label>
                <select
                  id="vitalType"
                  name="type"
                  value={vitalSign.type}
                  onChange={handleTypeChange}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  {Object.keys(vitalDisplayNames).map(type => (
                    <option key={type} value={type}>{vitalDisplayNames[type]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
                  Value
                </label>
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="number"
                    name="value"
                    id="value"
                    step="0.1"
                    value={vitalSign.value}
                    onChange={(e) => setVitalSign({...vitalSign, value: e.target.value})}
                    required
                    className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 h-10"
                    placeholder={`${normalRanges[vitalSign.type]?.min} - ${normalRanges[vitalSign.type]?.max}`}
                  />
                  <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm h-10">
                    {vitalSign.unit}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Normal range: {normalRanges[vitalSign.type]?.min} - {normalRanges[vitalSign.type]?.max} {normalRanges[vitalSign.type]?.unit}
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Record Vital Sign
                </button>
              </div>
            </form>
          </div>

          {/* Latest readings summary */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Latest Readings Summary</h3>
            <div className="grid grid-cols-1 gap-4">
              {Object.keys(vitalDisplayNames).map(type => {
                // Find the latest vital sign for this type by sorting them by timestamp
                const vitalsOfType = patient?.vitalSigns?.filter(v => v.type === type) || [];
                const latestVital = vitalsOfType.length > 0 ? 
                  [...vitalsOfType].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0] : null;
                
                return (
                  <div key={type} className="flex items-center p-3 border rounded-lg bg-gray-50">
                    <div className="mr-3">
                      {vitalIcons[type]}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-700">{vitalDisplayNames[type]}</h4>
                      {latestVital ? (
                        <div className="flex items-center mt-1">
                          <p className={`text-base font-semibold ${latestVital.isAlert ? 'text-red-600' : 'text-gray-900'}`}>
                            {latestVital.value} {latestVital.unit}
                          </p>
                          {latestVital.isAlert ? 
                            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">Alert</span> :
                            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">Normal</span>
                          }
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 mt-1">No data recorded</p>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {latestVital && new Date(latestVital.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Vital Signs History */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Vital Signs History</h3>
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
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patient?.vitalSigns && patient.vitalSigns.length > 0 ? (
                  // Sort vital signs by timestamp in descending order (newest first)
                  [...patient.vitalSigns]
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .slice(0, 20)
                    .map((vital, index) => (
                    <tr key={index} className={vital.isAlert ? "bg-red-50" : ""}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="mr-2">
                            {vitalIcons[vital.type]}
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {vitalDisplayNames[vital.type]}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        <span className={vital.isAlert ? "text-red-600" : ""}>
                          {vital.value} {vital.unit}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(vital.timestamp).toLocaleDateString()} at {new Date(vital.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {vital.isAlert ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            <AlertCircle className="h-3 w-3 mr-1" /> Alert
                          </span>
                        ) : (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" /> Normal
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
    </DoctorDashboardLayout>
  );
}