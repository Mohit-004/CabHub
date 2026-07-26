const User = require('../models/User.model');
const DriverDetail = require('../models/DriverDetail.model');
const Ride = require('../models/Ride.model');
const Complaint = require('../models/Complaint.model');
const Coupon = require('../models/Coupon.model');
const SystemSetting = require('../models/SystemSetting.model');
const Notification = require('../models/Notification.model');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/dashboard/stats
// @access  Private (Admin only)
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPassengers = await User.countDocuments({ role: 'passenger' });
    const totalDriversCount = await User.countDocuments({ role: 'driver' });
    const totalRides = await Ride.countDocuments();
    const completedRides = await Ride.countDocuments({ status: 'completed' });
    const cancelledRides = await Ride.countDocuments({ status: 'cancelled' });
    
    // Count active online drivers
    const activeDrivers = await DriverDetail.countDocuments({ dutyStatus: { $in: ['active', 'on-ride'] } });
    
    // Revenue calculations (admin commission e.g. 15% of fare)
    const completedTrips = await Ride.find({ status: 'completed' });
    const totalRevenue = completedTrips.reduce((acc, curr) => acc + curr.fare, 0);
    const adminCommission = Number((totalRevenue * 0.15).toFixed(2));

    const pendingApprovals = await DriverDetail.countDocuments({ verificationStatus: 'pending' });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalPassengers,
        totalDrivers: totalDriversCount,
        totalRides,
        completedRides,
        cancelledRides,
        activeDrivers,
        revenue: totalRevenue,
        commission: adminCommission,
        pendingApprovals
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving admin stats' });
  }
};

// @desc    Get Admin Charts Data
// @route   GET /api/admin/dashboard/charts
// @access  Private (Admin only)
const getCharts = async (req, res) => {
  try {
    // Generate mock Pune/Mumbai charts (dynamic base)
    const dailyBookings = [
      { day: 'Mon', bookings: 12 },
      { day: 'Tue', bookings: 19 },
      { day: 'Wed', bookings: 15 },
      { day: 'Thu', bookings: 25 },
      { day: 'Fri', bookings: 32 },
      { day: 'Sat', bookings: 45 },
      { day: 'Sun', bookings: 38 }
    ];

    const monthlyRevenue = [
      { month: 'Jan', revenue: 15000 },
      { month: 'Feb', revenue: 18000 },
      { month: 'Mar', revenue: 22000 },
      { month: 'Apr', revenue: 29000 },
      { month: 'May', revenue: 35000 },
      { month: 'Jun', revenue: 42000 }
    ];

    res.json({
      success: true,
      dailyBookings,
      monthlyRevenue
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving chart data' });
  }
};

// @desc    Get All Users with search
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getUsers = async (req, res) => {
  const { search } = req.query;
  try {
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const users = await User.find(query).select('-password');
    res.json({
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching users' });
  }
};

// @desc    Suspend/Activate User
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin only)
const toggleUserStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.status = status;
    await user.save();

    res.json({ success: true, message: `User status changed to ${status}`, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error modifying user status' });
  }
};

// @desc    Get pending driver verifications
// @route   GET /api/admin/drivers/pending
// @access  Private (Admin only)
const getPendingDrivers = async (req, res) => {
  try {
    const pendingDrivers = await DriverDetail.find({ verificationStatus: 'pending' })
      .populate('userId', 'name email phone');
    res.json({
      success: true,
      pendingDrivers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving pending drivers' });
  }
};

// @desc    Verify Driver Documents (Approve/Reject)
// @route   POST /api/admin/drivers/verify
// @access  Private (Admin only)
const verifyDriver = async (req, res) => {
  const { driverId, status } = req.body;

  try {
    const driverDetail = await DriverDetail.findOne({ userId: driverId });
    if (!driverDetail) {
      return res.status(404).json({ success: false, message: 'Driver details not found.' });
    }

    driverDetail.verificationStatus = status;
    await driverDetail.save();

    await Notification.create({
      userId: driverId.toString(),
      message: `Your driver profile has been ${status} by Admin.`,
      type: status === 'approved' ? 'success' : 'error'
    });

    res.json({
      success: true,
      message: `Driver status successfully updated to ${status}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error verifying driver' });
  }
};

// @desc    Get all complaints
// @route   GET /api/admin/complaints
// @access  Private (Admin only)
const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('userId', 'name role email')
      .populate('rideId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      complaints
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching complaints' });
  }
};

// @desc    Resolve complaint
// @route   POST /api/admin/complaints/resolve
// @access  Private (Admin only)
const resolveComplaint = async (req, res) => {
  const { complaintId, resolution } = req.body;
  try {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    complaint.status = 'resolved';
    complaint.resolutionDetails = resolution;
    complaint.assignedStaff = req.user.name;
    await complaint.save();

    res.json({ success: true, message: 'Complaint marked as resolved.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error resolving complaint' });
  }
};

// @desc    Get all coupons
// @route   GET /api/admin/coupons
// @access  Private (Admin only)
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching coupons' });
  }
};

// @desc    Create new coupon
// @route   POST /api/admin/coupons
// @access  Private (Admin only)
const createCoupon = async (req, res) => {
  const { code, discountType, value, maxDiscount, description } = req.body;
  try {
    const exists = await Coupon.findOne({ code });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Coupon code already exists.' });
    }

    const coupon = await Coupon.create({
      code,
      discountType,
      value,
      maxDiscount: maxDiscount || 0,
      description
    });

    res.status(201).json({ success: true, coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error creating coupon' });
  }
};

// @desc    Get settings
// @route   GET /api/admin/settings
// @access  Private (Admin only)
const getSettings = async (req, res) => {
  try {
    const settings = await SystemSetting.find();
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving settings' });
  }
};

// @desc    Update system settings
// @route   PUT /api/admin/settings
// @access  Private (Admin only)
const updateSettings = async (req, res) => {
  const { settings } = req.body; // Array of { key, value }
  try {
    for (const item of settings) {
      await SystemSetting.findOneAndUpdate(
        { key: item.key },
        { value: item.value },
        { upsert: true, new: true }
      );
    }
    res.json({ success: true, message: 'System configurations updated successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating settings' });
  }
};

module.exports = {
  getStats,
  getCharts,
  getUsers,
  toggleUserStatus,
  getPendingDrivers,
  verifyDriver,
  getComplaints,
  resolveComplaint,
  getCoupons,
  createCoupon,
  getSettings,
  updateSettings
};
