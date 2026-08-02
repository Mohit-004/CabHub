const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  discountType: {
    type: String,
    enum: ['fixed', 'percent'],
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  maxDiscount: {
    type: Number,
    default: 0 // For percentage-based discounts
  },
  description: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  expiryDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Coupon', couponSchema);
