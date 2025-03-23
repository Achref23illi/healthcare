// models/Alert.js
const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'patients',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'doctors',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['vital_sign', 'custom']
  },
  message: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['New', 'Acknowledged', 'Resolved'],
    default: 'New'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Alert = mongoose.model('alerts', AlertSchema);
module.exports = Alert;