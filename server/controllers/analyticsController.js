// controllers/analyticsController.js
const Patient = require('../models/Patient');
const Alert = require('../models/Alert');

// Get dashboard summary statistics
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
    
    // Get alerts by status
    const alertsByStatus = await Alert.aggregate([
      { $match: { doctor: doctorId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Get critical patients
    const criticalPatients = await Patient.find({
      doctor: doctorId,
      status: 'Critical'
    }).select('firstName lastName age chronicDisease latestVitals').limit(5);
    
    // Format response data
    const formattedPatientsByStatus = {};
    patientsByStatus.forEach(item => {
      formattedPatientsByStatus[item._id] = item.count;
    });
    
    const formattedAlertsByStatus = {};
    alertsByStatus.forEach(item => {
      formattedAlertsByStatus[item._id] = item.count;
    });
    
    res.json({
      patientStats: {
        total: totalPatients,
        byStatus: formattedPatientsByStatus
      },
      alertStats: {
        byStatus: formattedAlertsByStatus
      },
      criticalPatients
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};