const express = require('express');
const router = express.Router();
const { createEvent, listEvents, validateEvent } = require('../controllers/eventController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', protect, authorizeRoles('NITAdmin'), createEvent);
router.get('/', listEvents);
router.patch('/:id/status', protect, authorizeRoles('CommonAdmin'), validateEvent);

module.exports = router;
