// server/controllers/doctorController.js
exports.getMyPatients = async (req, res) => {
    try {
      // Ensure the user is a doctor
      if (req.user.role !== 'doctor') {
        return res.status(403).json({ message: 'Access denied: Only doctors can view their patients' });
      }
  
      const patients = await User.find({ 
        role: 'patient', 
        assignedDoctor: req.user._id 
      }).select('-password');
  
      res.json(patients);
    } catch (error) {
      console.error('Error fetching patients:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  exports.assignPatient = async (req, res) => {
    try {
      const { patientId } = req.body;
  
      // Ensure the user is a doctor
      if (req.user.role !== 'doctor') {
        return res.status(403).json({ message: 'Access denied: Only doctors can assign patients' });
      }
  
      // Check if patient exists
      const patient = await User.findOne({ _id: patientId, role: 'patient' });
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
  
      // Update patient's assigned doctor
      patient.assignedDoctor = req.user._id;
      await patient.save();
  
      res.json({ message: 'Patient assigned successfully' });
    } catch (error) {
      console.error('Error assigning patient:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };