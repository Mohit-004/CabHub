const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['passenger', 'driver', 'admin'],
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'suspended'],
    default: 'active',
  },
  walletBalance: {
    type: Number,
    default: 0,
  },
  profilePhoto: {
    type: String,
    default: '',
  },
  emergencyContact: {
    type: String,
    default: '',
  },
  savedAddresses: [
    {
      label: { type: String, required: true }, // e.g. 'Home', 'Work'
      address: { type: String, required: true }
    }
  ],
  preferredPaymentMethod: {
    type: String,
    enum: ['UPI', 'Credit Card', 'Debit Card', 'Cash', 'Wallet'],
    default: 'Wallet',
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
