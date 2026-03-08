const express = require('express');
const router = express.Router();
const { requestRide, getRide, getUserHistory, estimateRide } = require('../controllers/rideController');
const { protect } = require('../middleware/authMiddleware');

router.post('/request', protect, requestRide);
router.post('/estimate', protect, estimateRide);
router.get('/history/user', protect, getUserHistory);
router.get('/:id', protect, getRide);

module.exports = router;
