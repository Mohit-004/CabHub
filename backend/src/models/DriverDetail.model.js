const mongoose = require('mongoose');

const driverDetailSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  documents: {
    drivingLicense: { type: String, default: '' },
    aadhaarCard: { type: String, default: '' },
    panCard: { type: String, default: '' },
    vehicleRC: { type: String, default: '' },
    insurance: { type: String, default: '' },
    pollutionCertificate: { type: String, default: '' },
    vehiclePhoto: { type: String, default: '' },
    selfieVerification: { type: String, default: '' }
  },
  vehicle: {
    model: { type: String, default: '' },
    number: { type: String, default: '' },
    type: {
      type: String,
      enum: ['Mini', 'Sedan', 'SUV', 'Auto', 'Bike'],
      default: 'Sedan'
    }
  },
  dutyStatus: {
    type: String,
    enum: ['active', 'inactive', 'on-ride'],
    default: 'inactive'
  },
  earnings: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 5.0
  },
  latitude: {
    type: Number,
    default: 18.5308 // Shivaji Nagar, Pune default
  },
  longitude: {
    type: Number,
    default: 73.8474
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DriverDetail', driverDetailSchema);
