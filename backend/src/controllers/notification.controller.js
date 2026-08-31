const Notification = require('../models/Notification.model');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [
        { userId: req.user._id.toString() },
        { userId: 'all' }
      ]
    }).sort({ createdAt: -1 });

    const unreadCount = notifications.filter(n => !n.read).length;

    res.json({
      success: true,
      unreadCount,
      notifications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving notifications' });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();

    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating notification' });
  }
};

// @desc    Clear all user notifications
// @route   DELETE /api/notifications
// @access  Private
const clearNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({
      $or: [
        { userId: req.user._id.toString() }
      ]
    });

    res.json({ success: true, message: 'Notifications cleared successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error clearing notifications' });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  clearNotifications
};
