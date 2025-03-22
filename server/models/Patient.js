const mongoose = require('mongoose');

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
  allergies: {
    type: String,
    default: '',
  },
  medicalHistory: {
    type: String,
    default: '',
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

const Patient = mongoose.model('patients', PatientSchema);
module.exports = Patient;