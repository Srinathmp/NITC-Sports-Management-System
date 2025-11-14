const express = require('express');
const router = express.Router();
const { createNotification, listNotifications, getAllUsers,announcement } = require('../controllers/notification.controller');
const { protect, authorizeRoles } = require('../middleware/auth.middleware');

router.post('/', protect, authorizeRoles('CommonAdmin','NITAdmin'), createNotification);
router.get('/', listNotifications);
router.get('/users',protect, authorizeRoles("CommonAdmin"), getAllUsers)
router.post('/announcement',protect, authorizeRoles("CommonAdmin"), announcement)

module.exports = router;