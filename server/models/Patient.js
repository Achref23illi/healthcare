// models/Patient.js
const mongoose = require('mongoose');

const VitalSignSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['temperature', 'heartRate', 'oxygenSaturation', 'bloodPressure', 'respiratoryRate']
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isAlert: {
    type: Boolean,
    default: false
  }
});

const PatientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  chronicDisease: {
    type: String,
    default: '',
  },
  temperature: {
    type: Number,
    default: null,
  },
  heartRate: {
    type: Number,
    default: null,
  },
  oxygenSaturation: {
    type: Number,
    default: null,
  },
  bloodPressure: {
    type: String,
    default: '',
  },
  vitalSigns: [VitalSignSchema],
  latestVitals: {
    temperature: Number,
    heartRate: Number,
    oxygenSaturation: Number,
    bloodPressure: String,
    updatedAt: Date
  },
  status: {
    type: String,
    enum: ['Stable', 'Critical', 'Moderate', 'Under Observation', 'Discharged'],
    default: 'Stable'
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'doctors', 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Method to update latest vitals
PatientSchema.methods.updateLatestVitals = function(vitalSign) {
  if (!this.latestVitals) {
    this.latestVitals = {};
  }
  
  if (vitalSign.type === 'temperature' || 
      vitalSign.type === 'heartRate' || 
      vitalSign.type === 'oxygenSaturation' ||
      vitalSign.type === 'bloodPressure' ||
      vitalSign.type === 'respiratoryRate') {
    
    this.latestVitals[vitalSign.type] = vitalSign.value;
    this.latestVitals.updatedAt = new Date();
  }
  
  return this.save();
};

const Patient = mongoose.model('patients', PatientSchema);
module.exports = Patient;