const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const driverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, default: 'driver' },
    vehicle: {
        model: { type: String, required: true },
        number: { type: String, required: true },
        type: { type: String, enum: ['Mini', 'Sedan', 'SUV'], required: true }
    },
    status: { type: String, enum: ['active', 'inactive', 'on-ride'], default: 'inactive' },
    isVerified: { type: Boolean, default: false },
    currentLocation: {
        lat: { type: Number },
        lng: { type: Number }
    },
    avatar: { type: String },
    createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
driverSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
driverSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Driver', driverSchema);
