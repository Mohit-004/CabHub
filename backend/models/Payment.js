const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    ride: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['card', 'upi', 'wallet'], required: true },
    transactionId: { type: String, required: true, unique: true },
    status: { type: String, enum: ['success', 'failed', 'pending'], default: 'pending' },
    paidAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
