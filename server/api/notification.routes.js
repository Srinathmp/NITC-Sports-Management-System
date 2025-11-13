const express = require('express');
const router = express.Router();
const { createNotification, listNotifications } = require('../controllers/notification.controller');
const { protect, authorizeRoles } = require('../middleware/auth.middleware');

router.post('/', protect, authorizeRoles('CommonAdmin','NITAdmin'), createNotification);
router.get('/', listNotifications);

module.exports = router;