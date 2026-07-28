const express = require('express');
const {
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
} = require('../controllers/admin.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard/stats', getStats);
router.get('/dashboard/charts', getCharts);
router.get('/users', getUsers);
router.put('/users/:id/status', toggleUserStatus);
router.get('/drivers/pending', getPendingDrivers);
router.post('/drivers/verify', verifyDriver);
router.get('/complaints', getComplaints);
router.post('/complaints/resolve', resolveComplaint);
router.get('/coupons', getCoupons);
router.post('/coupons', createCoupon);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

module.exports = router;
