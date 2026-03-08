const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Ride = require('../models/Ride');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc Create Razorpay Order
// @route POST /api/payments/create-order
exports.createOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR', rideId } = req.body;

        const options = {
            amount: amount * 100, // amount in the smallest currency unit
            currency,
            receipt: `receipt_${rideId}_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Verify Razorpay Payment
// @route POST /api/payments/verify
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, rideId } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Payment verified
            const payment = await Payment.create({
                ride: rideId,
                amount: req.body.amount, // Should be passed or fetched
                method: 'razorpay',
                transactionId: razorpay_payment_id,
                status: 'success'
            });

            await Ride.findByIdAndUpdate(rideId, { paymentStatus: 'paid' });
            return res.status(200).json({ message: "Payment verified successfully", payment });
        } else {
            return res.status(400).json({ message: "Invalid signature sent!" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPaymentByRide = async (req, res) => {
    try {
        const payment = await Payment.findOne({ ride: req.params.rideId });
        if (!payment) return res.status(404).json({ message: 'Payment not found' });
        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
