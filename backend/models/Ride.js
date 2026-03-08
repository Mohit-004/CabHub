const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    passenger: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    pickupLocation: {
        address: { type: String, required: true },
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    dropLocation: {
        address: { type: String, required: true },
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    fare: { type: Number, required: true },
    distance: { type: Number }, // in km
    duration: { type: Number }, // in minutes
    vehicleType: { type: String, enum: ['Mini', 'Sedan', 'SUV'] },
    status: {
        type: String,
        enum: ['requested', 'accepted', 'arriving', 'started', 'completed', 'cancelled'],
        default: 'requested'
    },
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    startTime: { type: Date },
    endTime: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ride', rideSchema);
