// server/models/Appointment.js
const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'patients',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users', // Assuming doctors are stored in the users collection
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // Duration in minutes
    required: true,
    default: 30
  },
  status: {
    type: String,
    enum: ['confirmed', 'pending', 'cancelled'],
    default: 'pending'
  },
  type: {
    type: String,
    enum: ['check-up', 'consultation', 'follow-up', 'initial', 'emergency'],
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  
}, {
  timestamps: true
});

// Index for efficient queries
AppointmentSchema.index({ doctor: 1, date: 1 });
AppointmentSchema.index({ patient: 1, date: 1 });
AppointmentSchema.index({ status: 1 });
// Virtual field for end time (not stored in DB)
AppointmentSchema.virtual('endTime').get(function() {
    const endTime = new Date(this.date);
    endTime.setMinutes(endTime.getMinutes() + this.duration);
    return endTime;
  });
  
  // When doing queries for conflict checking, ensure virtuals are included
  AppointmentSchema.set('toObject', { virtuals: true });
  AppointmentSchema.set('toJSON', { virtuals: true });

const Appointment = mongoose.model('appointments', AppointmentSchema);
module.exports = Appointment;