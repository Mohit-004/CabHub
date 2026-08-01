const express = require('express');
const {
  getDashboard,
  toggleDuty,
  acceptRide,
  updateRideStatus,
  getEarnings,
  getTrips,
  updateVehicle
} = require('../controllers/driver.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);
router.use(authorize('driver'));

router.get('/dashboard', getDashboard);
router.post('/duty/toggle', toggleDuty);
router.post('/ride/accept', acceptRide);
router.post('/ride/status', updateRideStatus);
router.get('/earnings', getEarnings);
router.get('/trips', getTrips);
router.put('/vehicle', updateVehicle);

module.exports = router;
