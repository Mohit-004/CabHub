const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const DriverDetail = require('../models/DriverDetail.model');

// Helper to sign JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'cabhub_premium_jwt_secret_key_9988', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, phone, password, role, vehicleModel, vehicleNumber, vehicleType, licenseNumber } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: role || 'passenger'
    });

    if (user) {
      // If user is a driver, initialize their DriverDetail
      if (user.role === 'driver') {
        await DriverDetail.create({
          userId: user._id,
          vehicle: {
            model: vehicleModel || 'Maruti Suzuki Dzire',
            number: vehicleNumber || 'MH 12 ZZ 9999',
            type: vehicleType || 'Sedan'
          },
          documents: {
            drivingLicense: licenseNumber || ''
          }
        });
      }

      res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          walletBalance: user.walletBalance
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      if (role && user.role !== role) {
        return res.status(403).json({ success: false, message: `Access denied. Authorized role is ${user.role}.` });
      }

      if (user.status === 'suspended') {
        return res.status(403).json({ success: false, message: 'Account is suspended' });
      }

      // Fetch driver detail if driver
      let driverDetail = null;
      if (user.role === 'driver') {
        driverDetail = await DriverDetail.findOne({ userId: user._id });
      }

      res.json({
        success: true,
        token: generateToken(user._id),
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
          preferredPaymentMethod: user.preferredPaymentMethod,
          driverDetail
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let driverDetail = null;
    if (user.role === 'driver') {
      driverDetail = await DriverDetail.findOne({ userId: user._id });
    }

    res.json({
      success: true,
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
        preferredPaymentMethod: user.preferredPaymentMethod,
        driverDetail
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Mock Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found with this email' });
    }
    // Return mock success token/link
    res.json({
      success: true,
      message: 'Password reset link sent to registered email address (simulation)',
      resetToken: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  forgotPassword
};
