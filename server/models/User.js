const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['doctor', 'patient'],
    default: 'patient'
  },
  profilePicture: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  // Additional fields for patients
  age: {
    type: Number,
    required: function() { return this.role === 'patient'; }
  },
  chronicDisease: {
    type: String,
    default: '',
  },
  // For patients: their assigned doctor
  assignedDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: function() { return this.role === 'patient'; }
  },
  // For doctors: their specialization
  specialization: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, {
  timestamps: true,
});

const User = mongoose.model('users', UserSchema);
module.exports = User;