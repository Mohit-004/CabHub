const User = require('../models/User');
const Driver = require('../models/Driver');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc Register User
// @route POST /api/auth/user/register
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ name, email, password, phone });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Login User
// @route POST /api/auth/user/login
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Register Driver
// @route POST /api/auth/driver/register
exports.registerDriver = async (req, res) => {
    try {
        const { name, email, password, phone, vehicle } = req.body;
        const driverExists = await Driver.findOne({ email });

        if (driverExists) {
            return res.status(400).json({ message: 'Driver already exists' });
        }

        const driver = await Driver.create({ name, email, password, phone, vehicle });

        if (driver) {
            res.status(201).json({
                _id: driver._id,
                name: driver.name,
                email: driver.email,
                role: driver.role,
                token: generateToken(driver._id)
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Login Driver
// @route POST /api/auth/driver/login
exports.loginDriver = async (req, res) => {
    try {
        const { email, password } = req.body;
        const driver = await Driver.findOne({ email });

        if (driver && (await driver.comparePassword(password))) {
            res.json({
                _id: driver._id,
                name: driver.name,
                email: driver.email,
                role: driver.role,
                token: generateToken(driver._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
