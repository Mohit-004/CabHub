const express = require('express');
const {
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
  getComplaints,
  uploadDocuments
} = require('../controllers/driver.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

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
router.post('/location', updateLocation);
router.post('/ride/message', sendRideMessage);
router.post('/complaint', fileComplaint);
router.get('/complaints', getComplaints);
router.post('/documents', upload.fields([
  { name: 'drivingLicense', maxCount: 1 },
  { name: 'aadhaarCard', maxCount: 1 },
  { name: 'panCard', maxCount: 1 },
  { name: 'vehicleRC', maxCount: 1 },
  { name: 'insurance', maxCount: 1 },
  { name: 'pollutionCertificate', maxCount: 1 },
  { name: 'vehiclePhoto', maxCount: 1 },
  { name: 'selfieVerification', maxCount: 1 }
]), uploadDocuments);

module.exports = router;
