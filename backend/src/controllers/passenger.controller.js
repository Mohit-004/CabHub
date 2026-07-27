const User = require('../models/User.model');
const DriverDetail = require('../models/DriverDetail.model');
const Ride = require('../models/Ride.model');
const Coupon = require('../models/Coupon.model');
const Notification = require('../models/Notification.model');

// Helper to seed notification
const addNotification = async (userId, message, type = 'info') => {
  try {
    await Notification.create({ userId, message, type });
  } catch (err) {
    console.error('Notification seeding failed:', err.message);
  }
};

// @desc    Get Passenger Dashboard Data
// @route   GET /api/passenger/dashboard
// @access  Private (Passenger only)
const getDashboard = async (req, res) => {
  try {
    // 1. Get active drivers
    const onlineDrivers = await DriverDetail.find({ dutyStatus: 'active' })
      .populate('userId', 'name phone rating profilePhoto')
      .limit(10);

    // 2. Get active coupons
    const activeCoupons = await Coupon.find({ active: true });

    // 3. Get recent rides
    const recentRides = await Ride.find({ passengerId: req.user._id })
      .populate('driverId', 'name phone')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      onlineDrivers: onlineDrivers.map(d => ({
        id: d.userId._id,
        name: d.userId.name,
        vehicle: `${d.vehicle.model} (${d.vehicle.type})`,
        lat: d.latitude,
        lng: d.longitude,
        rating: d.rating
      })),
      activeCoupons,
      recentRides
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error fetching dashboard' });
  }
};

// @desc    Update Passenger Profile Details
// @route   PUT /api/passenger/profile
// @access  Private (Passenger only)
const updateProfile = async (req, res) => {
  const { name, phone, emergencyContact, savedAddresses, preferredPaymentMethod, profilePhoto } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (emergencyContact !== undefined) user.emergencyContact = emergencyContact;
    if (savedAddresses !== undefined) user.savedAddresses = savedAddresses;
    if (preferredPaymentMethod) user.preferredPaymentMethod = preferredPaymentMethod;
    if (profilePhoto) user.profilePhoto = profilePhoto;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        walletBalance: user.walletBalance,
        profilePhoto: user.profilePhoto,
        emergencyContact: user.emergencyContact,
        savedAddresses: user.savedAddresses,
        preferredPaymentMethod: user.preferredPaymentMethod
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
};

// @desc    Recharge Passenger Wallet
// @route   POST /api/passenger/wallet/recharge
// @access  Private (Passenger only)
const rechargeWallet = async (req, res) => {
  const { amount } = req.body;

  try {
    const numAmt = parseFloat(amount);
    if (isNaN(numAmt) || numAmt <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid recharge amount' });
    }

    const user = await User.findById(req.user._id);
    user.walletBalance += numAmt;
    await user.save();

    await addNotification(user._id.toString(), `Wallet recharged with ₹${numAmt} successfully 💳`, 'success');

    res.json({
      success: true,
      walletBalance: user.walletBalance,
      message: `Recharged ₹${numAmt} successfully.`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error recharging wallet' });
  }
};

// @desc    Request a ride
// @route   POST /api/passenger/ride/request
// @access  Private (Passenger only)
const requestRide = async (req, res) => {
  const { pickup, drop, fare, vehicleType, distance, duration, promoCode } = req.body;

  try {
    // Check if passenger has active ride
    const currentActive = await Ride.findOne({
      passengerId: req.user._id,
      status: { $nin: ['completed', 'cancelled'] }
    });

    if (currentActive) {
      return res.status(400).json({ success: false, message: 'You already have an active ride request or booking.' });
    }

    let discount = 0;
    if (promoCode) {
      const coupon = await Coupon.findOne({ code: promoCode, active: true });
      if (coupon) {
        if (coupon.discountType === 'fixed') {
          discount = coupon.value;
        } else {
          discount = Math.min(coupon.maxDiscount, (fare * coupon.value) / 100);
        }
      }
    }

    const finalFare = Math.max(0, fare - discount);

    const newRide = await Ride.create({
      passengerId: req.user._id,
      pickup,
      drop,
      originalFare: fare,
      fare: finalFare,
      discount,
      promoCode: promoCode || '',
      vehicleType,
      distance,
      duration,
      driverLat: pickup.lat - 0.012,
      driverLng: pickup.lng - 0.012,
      messages: [{ sender: 'system', text: `Searching for ${vehicleType} drivers near you...` }]
    });

    await addNotification(req.user._id.toString(), `Searching for a ${vehicleType} ride 🔍`, 'info');

    res.status(201).json({
      success: true,
      ride: newRide
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error requesting ride' });
  }
};

// @desc    Get Passenger Active Ride
// @route   GET /api/passenger/ride/active
// @access  Private (Passenger only)
const getActiveRide = async (req, res) => {
  try {
    const activeRide = await Ride.findOne({
      passengerId: req.user._id,
      status: { $nin: ['completed', 'cancelled'] }
    }).populate('driverId', 'name phone profilePhoto');

    if (!activeRide) {
      return res.json({ success: true, ride: null });
    }

    // Populate driver ratings and vehicle if available
    let responseRide = activeRide.toObject();
    if (activeRide.driverId) {
      const driverDetail = await DriverDetail.findOne({ userId: activeRide.driverId._id });
      if (driverDetail) {
        responseRide.driver = {
          id: activeRide.driverId._id,
          name: activeRide.driverId.name,
          phone: activeRide.driverId.phone,
          profilePhoto: activeRide.driverId.profilePhoto,
          vehicle: driverDetail.vehicle,
          rating: driverDetail.rating
        };
      }
    }

    res.json({
      success: true,
      ride: responseRide
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error fetching active ride' });
  }
};

// @desc    Cancel Ride
// @route   POST /api/passenger/ride/cancel
// @access  Private (Passenger only)
const cancelRide = async (req, res) => {
  try {
    const ride = await Ride.findOne({
      passengerId: req.user._id,
      status: { $nin: ['completed', 'cancelled'] }
    });

    if (!ride) {
      return res.status(404).json({ success: false, message: 'No active ride found to cancel' });
    }

    ride.status = 'cancelled';
    ride.endTime = new Date();
    await ride.save();

    if (ride.driverId) {
      // Free driver back to active
      await DriverDetail.findOneAndUpdate(
        { userId: ride.driverId },
        { dutyStatus: 'active' }
      );
      await addNotification(ride.driverId.toString(), 'Your ride request has been cancelled by the passenger.', 'warning');
    }

    await addNotification(req.user._id.toString(), 'Ride cancelled successfully.', 'info');

    res.json({ success: true, message: 'Ride cancelled.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error cancelling ride' });
  }
};

// @desc    Rate Ride and Add Tip
// @route   POST /api/passenger/ride/rate
// @access  Private (Passenger only)
const rateRide = async (req, res) => {
  const { rideId, stars, feedback, tip } = req.body;

  try {
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }

    const tipAmt = parseFloat(tip) || 0;
    ride.rated = true;
    ride.passengerRating = parseInt(stars);
    ride.passengerFeedback = feedback || '';
    ride.tipAmount = tipAmt;

    await ride.save();

    // Update driver rating & earnings
    if (ride.driverId) {
      const driverDetail = await DriverDetail.findOne({ userId: ride.driverId });
      if (driverDetail) {
        // Recalculate average rating
        const ratingsCount = await Ride.countDocuments({ driverId: ride.driverId, rated: true });
        const allRatedRides = await Ride.find({ driverId: ride.driverId, rated: true });
        const totalStars = allRatedRides.reduce((acc, curr) => acc + curr.passengerRating, 0);

        driverDetail.rating = Number((totalStars / ratingsCount).toFixed(1));
        // Add tip & fare to driver earnings
        driverDetail.earnings += (ride.fare + tipAmt);
        await driverDetail.save();

        await addNotification(ride.driverId.toString(), `You received a ${stars} ⭐ rating and a ₹${tipAmt} tip!`, 'success');
      }
    }

    res.json({ success: true, message: 'Feedback and rating submitted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error rating ride' });
  }
};

// @desc    Get Passenger Ride History
// @route   GET /api/passenger/ride/history
// @access  Private (Passenger only)
const getRideHistory = async (req, res) => {
  try {
    const history = await Ride.find({ passengerId: req.user._id })
      .populate('driverId', 'name phone profilePhoto')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      history
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving ride history' });
  }
};

module.exports = {
  getDashboard,
  updateProfile,
  rechargeWallet,
  requestRide,
  getActiveRide,
  cancelRide,
  rateRide,
  getRideHistory
};
