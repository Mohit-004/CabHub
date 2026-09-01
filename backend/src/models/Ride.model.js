const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['passenger', 'driver', 'system'],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const rideSchema = new mongoose.Schema({
  passengerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  pickup: {
    name: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  drop: {
    name: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  originalFare: {
    type: Number,
    required: true
  },
  fare: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  promoCode: {
    type: String,
    default: ''
  },
  vehicleType: {
    type: String,
    enum: ['Mini', 'Sedan', 'SUV', 'Auto', 'Bike'],
    required: true
  },
  distance: {
    type: Number, // in km
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'arriving', 'arrived', 'started', 'completed', 'cancelled'],
    default: 'requested'
  },
  startTime: {
    type: Date,
    default: null
  },
  endTime: {
    type: Date,
    default: null
  },
  driverLat: {
    type: Number,
    default: null
  },
  driverLng: {
    type: Number,
    default: null
  },
  rated: {
    type: Boolean,
    default: false
  },
  passengerRating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  passengerFeedback: {
    type: String,
    default: ''
  },
  tipAmount: {
    type: Number,
    default: 0
  },
  messages: [messageSchema],
  sosTriggered: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String,
    default: '1234'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Ride', rideSchema);
