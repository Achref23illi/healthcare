// server/controllers/analyticsController.js
const Patient = require('../models/Patient');
const Alert = require('../models/Alert');
const Appointment = require('../models/Appointment');
const mongoose = require('mongoose');

// Get dashboard summary statistics
// In server/controllers/analyticsController.js
// Update the getDashboardStats function

exports.getDashboardStats = async (req, res) => {
  try {
    const doctorId = req.user.id;
    
    // Get total patient count
    const totalPatients = await Patient.countDocuments({ doctor: doctorId });
    
    // Get patients by status
    const patientsByStatus = await Patient.aggregate([
      { $match: { doctor: doctorId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // DEBUGGING: Find all alerts first to verify they exist
    const allAlerts = await Alert.find({ doctor: doctorId });
    console.log('Total alerts found:', allAlerts.length);
    console.log('Alert statuses:', allAlerts.map(a => a.status));
    
    // Get alerts by status - simplified approach
    const alertsByStatus = {};
    
    // Count alerts directly instead of using aggregation
    const newAlerts = await Alert.countDocuments({ doctor: doctorId, status: 'New' });
    const acknowledgedAlerts = await Alert.countDocuments({ doctor: doctorId, status: 'Acknowledged' });
    const resolvedAlerts = await Alert.countDocuments({ doctor: doctorId, status: 'Resolved' });
    
    console.log('Direct counts - New:', newAlerts, 'Acknowledged:', acknowledgedAlerts, 'Resolved:', resolvedAlerts);
    
    alertsByStatus['New'] = newAlerts;
    alertsByStatus['Acknowledged'] = acknowledgedAlerts;
    alertsByStatus['Resolved'] = resolvedAlerts;
    
    // Get critical patients
    const criticalPatients = await Patient.find({
      doctor: doctorId,
      status: 'Critical'
    }).select('firstName lastName age chronicDisease latestVitals').limit(5);
    
    // Format response data
    const formattedPatientsByStatus = {};
    patientsByStatus.forEach(item => {
      if (item && item._id) {
        formattedPatientsByStatus[item._id] = item.count;
      }
    });
    
    res.json({
      patientStats: {
        total: totalPatients,
        byStatus: formattedPatientsByStatus
      },
      alertStats: {
        byStatus: alertsByStatus
      },
      criticalPatients
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get patient trends over time
exports.getPatientTrends = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { period = 'monthly' } = req.query; // 'daily', 'weekly', 'monthly'
    
    let groupByFormat;
    let limit;
    
    // Set date formatting based on period
    if (period === 'daily') {
      groupByFormat = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
      limit = 30; // Last 30 days
    } else if (period === 'weekly') {
      groupByFormat = { 
        $dateToString: { 
          format: "%Y-W%U", 
          date: "$createdAt" 
        } 
      };
      limit = 12; // Last 12 weeks
    } else {
      // Monthly (default)
      groupByFormat = { 
        $dateToString: { 
          format: "%Y-%m", 
          date: "$createdAt" 
        } 
      };
      limit = 12; // Last 12 months
    }
    
    // Get new patients over time
    const newPatientsTrend = await Patient.aggregate([
      { $match: { doctor: new mongoose.Types.ObjectId(doctorId) } },
      { 
        $group: {
          _id: groupByFormat,
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: limit },
      { $sort: { _id: 1 } } // Sort by date ascending for chart
    ]);
    
    res.json({
      patientTrends: newPatientsTrend.map(item => ({
        period: item._id,
        count: item.count
      }))
    });
  } catch (error) {
    console.error('Error fetching patient trends:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get vital signs statistics
exports.getVitalSignsStats = async (req, res) => {
  try {
    const doctorId = req.user.id;
    
    // Get patients
    const patients = await Patient.find({ doctor: doctorId });
    
    // Calculate average vital signs
    let tempSum = 0, tempCount = 0;
    let hrSum = 0, hrCount = 0;
    let oxySum = 0, oxyCount = 0;
    
    // Collect vital signs data
    patients.forEach(patient => {
      // Check for latest vitals
      if (patient.latestVitals) {
        if (patient.latestVitals.temperature) {
          tempSum += patient.latestVitals.temperature;
          tempCount++;
        }
        if (patient.latestVitals.heartRate) {
          hrSum += patient.latestVitals.heartRate;
          hrCount++;
        }
        if (patient.latestVitals.oxygenSaturation) {
          oxySum += patient.latestVitals.oxygenSaturation;
          oxyCount++;
        }
      }
      
      // For historical vitals analysis, we would process the vitalSigns array
    });
    
    // Alerts by vital sign type
    const alertsByVitalType = await Alert.aggregate([
      { $match: { doctor: doctorId, type: 'vital_sign' } },
      { $group: { _id: '$message', count: { $sum: 1 } } }
    ]);
    
    // Process alert messages to extract vital sign types
    const vitalTypeStats = {
      temperature: 0,
      heartRate: 0,
      oxygenSaturation: 0,
      bloodPressure: 0,
      other: 0
    };
    
    alertsByVitalType.forEach(alert => {
      const message = alert._id.toLowerCase();
      if (message.includes('temperature')) {
        vitalTypeStats.temperature += alert.count;
      } else if (message.includes('heart rate') || message.includes('heartrate')) {
        vitalTypeStats.heartRate += alert.count;
      } else if (message.includes('oxygen') || message.includes('o2')) {
        vitalTypeStats.oxygenSaturation += alert.count;
      } else if (message.includes('blood pressure') || message.includes('bp')) {
        vitalTypeStats.bloodPressure += alert.count;
      } else {
        vitalTypeStats.other += alert.count;
      }
    });
    
    res.json({
      averageVitals: {
        temperature: tempCount > 0 ? (tempSum / tempCount).toFixed(1) : null,
        heartRate: hrCount > 0 ? Math.round(hrSum / hrCount) : null,
        oxygenSaturation: oxyCount > 0 ? Math.round(oxySum / oxyCount) : null
      },
      alertsByVitalType: vitalTypeStats
    });
  } catch (error) {
    console.error('Error fetching vital signs statistics:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get appointment statistics
exports.getAppointmentStats = async (req, res) => {
  try {
    const doctorId = req.user.id;
    
    // Get appointments by status
    const appointmentsByStatus = await Appointment.aggregate([
      { $match: { doctor: new mongoose.Types.ObjectId(doctorId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Get appointments by type
    const appointmentsByType = await Appointment.aggregate([
      { $match: { doctor: new mongoose.Types.ObjectId(doctorId) } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    
    // Get appointments by day of week
    const appointmentsByDayOfWeek = await Appointment.aggregate([
      { $match: { doctor: new mongoose.Types.ObjectId(doctorId) } },
      { 
        $group: {
          _id: { $dayOfWeek: '$date' }, // 1 = Sunday, 2 = Monday, etc.
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Format the data
    const formattedStatusData = {};
    appointmentsByStatus.forEach(item => {
      formattedStatusData[item._id] = item.count;
    });
    
    const formattedTypeData = {};
    appointmentsByType.forEach(item => {
      formattedTypeData[item._id] = item.count;
    });
    
    // Format day of week data for a chart - map 1-7 to day names
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeekData = Array(7).fill(0); // Initialize array with 0s
    
    appointmentsByDayOfWeek.forEach(item => {
      // dayOfWeek is 1-based (1 = Sunday) but array is 0-based
      const index = item._id - 1;
      if (index >= 0 && index < 7) {
        dayOfWeekData[index] = item.count;
      }
    });
    
    // Calculate the total appointments
    const totalAppointments = Object.values(formattedStatusData).reduce((sum, count) => sum + count, 0);
    
    res.json({
      total: totalAppointments,
      byStatus: formattedStatusData,
      byType: formattedTypeData,
      byDayOfWeek: dayNames.map((day, index) => ({
        day,
        count: dayOfWeekData[index]
      }))
    });
  } catch (error) {
    console.error('Error fetching appointment statistics:', error);
    res.status(500).json({ message: 'Server error' });
  }
};