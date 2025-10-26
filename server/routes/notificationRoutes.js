const express = require('express');
const router = express.Router();
const { createNotification, listNotifications } = require('../controllers/notificationController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', protect, authorizeRoles('CommonAdmin','NITAdmin'), createNotification);
router.get('/', listNotifications);

module.exports = router;