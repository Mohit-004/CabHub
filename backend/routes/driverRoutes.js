const express = require('express');
const router = express.Router();
const { getAvailableRides, acceptRide, updateRideStatus } = require('../controllers/driverController');
const { protect } = require('../middleware/authMiddleware');

router.get('/available-rides', protect, getAvailableRides);
router.put('/accept-ride/:rideId', protect, acceptRide);
router.put('/update-ride/:rideId', protect, updateRideStatus);

module.exports = router;
