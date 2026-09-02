const express = require('express');
const {
  getDashboard,
  updateProfile,
  rechargeWallet,
  requestRide,
  getActiveRide,
  cancelRide,
  rateRide,
  getRideHistory,
  sendRideMessage,
  triggerSOS,
  fileComplaint,
  getComplaints
} = require('../controllers/passenger.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);
router.use(authorize('passenger'));

router.get('/dashboard', getDashboard);
router.put('/profile', updateProfile);
router.post('/wallet/recharge', rechargeWallet);
router.post('/ride/request', requestRide);
router.get('/ride/active', getActiveRide);
router.post('/ride/cancel', cancelRide);
router.post('/ride/rate', rateRide);
router.get('/ride/history', getRideHistory);
router.post('/ride/message', sendRideMessage);
router.post('/ride/sos', triggerSOS);
router.post('/complaint', fileComplaint);
router.get('/complaints', getComplaints);

module.exports = router;
