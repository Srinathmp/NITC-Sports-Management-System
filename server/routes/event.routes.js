const express = require('express');
const router = express.Router();
const { createEvent, listEvents, validateEvent, listPendingEvents } = require('../controllers/event.controller');
const { protect, authorizeRoles } = require('../middleware/auth.middleware');

router.post('/', protect, authorizeRoles('NITAdmin'), createEvent);
router.get('/listevents', listEvents);
router.get('/listpendingevents', protect, authorizeRoles('CommonAdmin'), listPendingEvents);
router.patch('/:id/status-update', protect, authorizeRoles('CommonAdmin'), validateEvent);

module.exports = router;