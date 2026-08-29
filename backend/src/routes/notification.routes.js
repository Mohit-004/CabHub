const express = require('express');
const { getNotifications, markAsRead, clearNotifications } = require('../controllers/notification.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);
router.put('/:id/read', markAsRead);
router.delete('/', clearNotifications);

module.exports = router;
