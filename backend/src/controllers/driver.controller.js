const User = require('../models/User.model');
const DriverDetail = require('../models/DriverDetail.model');
const Ride = require('../models/Ride.model');
const Notification = require('../models/Notification.model');
const Complaint = require('../models/Complaint.model');

// Helper to seed notification
const addNotification = async (userId, message, type = 'info') => {
  try {
    await Notification.create({ userId, message, type });
  } catch (err) {
    console.error('Notification seeding failed:', err.message);
  }
};

// @desc    Get Driver Dashboard
// @route   GET /api/driver/dashboard
// @access  Private (Driver only)
const getDashboard = async (req, res) => {
  try {
    const driverDetail = await DriverDetail.findOne({ userId: req.user._id });
    if (!driverDetail) {
      return res.status(404).json({ success: false, message: 'Driver details not found' });
    }

    // Find available ride requests matching vehicle type and status 'requested'
    const availableRequests = await Ride.find({
      status: 'requested',
      vehicleType: driverDetail.vehicle.type
    }).populate('passengerId', 'name phone profilePhoto');

    // Find if current driver has an active assigned ride
    const activeRide = await Ride.findOne({
      driverId: req.user._id,
      status: { $nin: ['completed', 'cancelled'] }
    }).populate('passengerId', 'name phone profilePhoto');

    res.json({
      success: true,
      driverDetail,
      availableRequests,
      activeRide
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error loading driver dashboard' });
  }
};

// @desc    Toggle Online/Offline Duty Status
// @route   POST /api/driver/duty/toggle
// @access  Private (Driver only)
const toggleDuty = async (req, res) => {
  try {
    const driverDetail = await DriverDetail.findOne({ userId: req.user._id });
    if (!driverDetail) {
      return res.status(404).json({ success: false, message: 'Driver detail profile not found.' });
    }

    if (driverDetail.verificationStatus !== 'approved') {
      return res.status(403).json({
        success: false,
        message: `Verification ${driverDetail.verificationStatus}. You must be approved by administration to toggle duty.`
      });
    }

    const newStatus = driverDetail.dutyStatus === 'inactive' ? 'active' : 'inactive';
    driverDetail.dutyStatus = newStatus;
    await driverDetail.save();

    await addNotification(
      req.user._id.toString(),
      newStatus === 'active' ? 'You are now Online! Awaiting dispatch 📡' : 'You went Offline.',
      newStatus === 'active' ? 'success' : 'info'
    );

    res.json({
      success: true,
      dutyStatus: newStatus,
      message: `Duty status updated to ${newStatus}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error toggling duty status' });
  }
};

// @desc    Accept Ride Request
// @route   POST /api/driver/ride/accept
// @access  Private (Driver only)
const acceptRide = async (req, res) => {
  const { rideId } = req.body;

  try {
    const driverDetail = await DriverDetail.findOne({ userId: req.user._id });
    if (driverDetail.dutyStatus !== 'active') {
      return res.status(400).json({ success: false, message: 'You must be online/active to accept rides.' });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride request not found.' });
    }

    if (ride.status !== 'requested') {
      return res.status(400).json({ success: false, message: 'This ride has already been accepted or cancelled.' });
    }

    ride.driverId = req.user._id;
    ride.status = 'accepted';
    ride.driverLat = driverDetail.latitude;
    ride.driverLng = driverDetail.longitude;
    ride.messages.push({ sender: 'system', text: `Pilot ${req.user.name} accepted your ride!` });
    await ride.save();

    // Set driver status to on-ride
    driverDetail.dutyStatus = 'on-ride';
    await driverDetail.save();

    await addNotification(ride.passengerId.toString(), `Driver ${req.user.name} accepted your ride request! 🚗`, 'success');
    await addNotification(req.user._id.toString(), 'Ride request accepted. Head to pickup location.', 'success');

    res.json({
      success: true,
      ride
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error accepting ride' });
  }
};

// @desc    Update Active Ride Status
// @route   POST /api/driver/ride/status
// @access  Private (Driver only)
const updateRideStatus = async (req, res) => {
  const { rideId, status, otp } = req.body;

  try {
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found.' });
    }

    if (ride.driverId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized status update.' });
    }

    ride.status = status;

    if (status === 'started') {
      if (ride.otp && otp !== ride.otp) {
        return res.status(400).json({ success: false, message: 'Invalid OTP. Please ask the passenger for the correct 4-digit code.' });
      }
      ride.startTime = new Date();
      ride.messages.push({ sender: 'system', text: 'Ride started. OTP verified. Enjoy your journey!' });
      await addNotification(ride.passengerId.toString(), 'Your ride has started! Enjoy the trip 🛣️', 'info');
    } else if (status === 'completed') {
      ride.endTime = new Date();
      ride.messages.push({ sender: 'system', text: 'Ride completed successfully. Thank you!' });

      // Deduct passenger balance
      const passenger = await User.findById(ride.passengerId);
      if (passenger) {
        passenger.walletBalance = Math.max(0, passenger.walletBalance - ride.fare);
        await passenger.save();
      }

      // Add to driver earnings
      const driverDetail = await DriverDetail.findOne({ userId: req.user._id });
      if (driverDetail) {
        driverDetail.earnings += ride.fare;
        driverDetail.dutyStatus = 'active'; // back to active
        await driverDetail.save();
      }

      await addNotification(ride.passengerId.toString(), `Ride completed. ₹${ride.fare} paid from wallet.`, 'success');
      await addNotification(req.user._id.toString(), `Trip complete! ₹${ride.fare} added to earnings.`, 'success');
    }

    await ride.save();

    res.json({
      success: true,
      ride
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error updating ride status' });
  }
};

// @desc    Get Detailed Earnings
// @route   GET /api/driver/earnings
// @access  Private (Driver only)
const getEarnings = async (req, res) => {
  try {
    const driverDetail = await DriverDetail.findOne({ userId: req.user._id });
    const completedRides = await Ride.find({ driverId: req.user._id, status: 'completed' });

    res.json({
      success: true,
      totalEarnings: driverDetail.earnings,
      tripsCount: completedRides.length,
      rides: completedRides
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving earnings' });
  }
};

// @desc    Get Driver Trip History
// @route   GET /api/driver/trips
// @access  Private (Driver only)
const getTrips = async (req, res) => {
  try {
    const trips = await Ride.find({ driverId: req.user._id })
      .populate('passengerId', 'name phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      trips
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching trips' });
  }
};

// @desc    Update Driver Vehicle Details
// @route   PUT /api/driver/vehicle
// @access  Private (Driver only)
const updateVehicle = async (req, res) => {
  const { model, number, type } = req.body;

  try {
    const driverDetail = await DriverDetail.findOne({ userId: req.user._id });
    if (!driverDetail) {
      return res.status(404).json({ success: false, message: 'Driver detail profile not found.' });
    }

    if (model) driverDetail.vehicle.model = model;
    if (number) driverDetail.vehicle.number = number;
    if (type) driverDetail.vehicle.type = type;

    await driverDetail.save();

    res.json({
      success: true,
      message: 'Vehicle information updated successfully.',
      vehicle: driverDetail.vehicle
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating vehicle' });
  }
};
// @desc    Update Driver Real-time GPS Location
// @route   POST /api/driver/location
// @access  Private (Driver only)
const updateLocation = async (req, res) => {
  const { latitude, longitude } = req.body;
  try {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ success: false, message: 'Invalid coordinates provided' });
    }

    const driverDetail = await DriverDetail.findOne({ userId: req.user._id });
    if (!driverDetail) {
      return res.status(404).json({ success: false, message: 'Driver profile not found' });
    }

    driverDetail.latitude = lat;
    driverDetail.longitude = lng;
    await driverDetail.save();

    // If driver is currently on an active ride, update ride driverLat / driverLng
    const activeRide = await Ride.findOne({
      driverId: req.user._id,
      status: { $in: ['accepted', 'arriving', 'arrived', 'started'] }
    });

    if (activeRide) {
      activeRide.driverLat = lat;
      activeRide.driverLng = lng;
      await activeRide.save();
    }

    res.json({ success: true, latitude: lat, longitude: lng });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating location' });
  }
};

// @desc    Send Driver In-Ride Chat Message
// @route   POST /api/driver/ride/message
// @access  Private (Driver only)
const sendRideMessage = async (req, res) => {
  const { rideId, text } = req.body;
  try {
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }
    if (ride.driverId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    ride.messages.push({ sender: 'driver', text });
    await ride.save();

    res.json({ success: true, messages: ride.messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error sending message' });
  }
};

// @desc    File a Driver Complaint
// @route   POST /api/driver/complaints
// @access  Private (Driver only)
const fileComplaint = async (req, res) => {
  const { rideId, description } = req.body;
  try {
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }

    const complaint = await Complaint.create({
      userId: req.user._id,
      rideId,
      description
    });

    await addNotification('all', `Driver complaint filed by ${req.user.name} for ride #${rideId}`, 'warning');

    res.status(201).json({ success: true, complaint, message: 'Complaint filed successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error filing complaint' });
  }
};

// @desc    Get Driver Complaints
// @route   GET /api/driver/complaints
// @access  Private (Driver only)
const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user._id })
      .populate('rideId')
      .sort({ createdAt: -1 });

    res.json({ success: true, complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching complaints' });
  }
};

module.exports = {
  getDashboard,
  toggleDuty,
  acceptRide,
  updateRideStatus,
  getEarnings,
  getTrips,
  updateVehicle,
  updateLocation,
  sendRideMessage,
  fileComplaint,
  getComplaints
};
