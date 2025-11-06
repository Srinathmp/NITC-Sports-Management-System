const express = require('express');
const router = express.Router();
const {
    createEvent,
    listEvents,
    validateEvent,
    listPendingEvents,
    getAllEvents,
    getEventById,
    updateEvent,
    updateEventStatus,
    deleteEvent,
    validateEventByAdmin,
    getAllEventsPublic
} = require('../controllers/event.controller');
const { protect, authorizeRoles } = require('../middleware/auth.middleware');

// ✅ Existing routes (unchanged)
router.post('/', protect, authorizeRoles('NITAdmin'), createEvent);
router.get('/listevents', listEvents);
router.get('/listpendingevents', protect, authorizeRoles('CommonAdmin'), listPendingEvents);
router.patch('/:id/status-update', protect, authorizeRoles('CommonAdmin'), validateEvent);

// ✅ New/updated routes (frontend dependencies)
router.get('/allEvents', protect, getAllEvents);
router.get('/allEventsPublic', getAllEventsPublic);
router.get('/:id', getEventById);
router.put('/:id', protect, authorizeRoles('NITAdmin'), updateEvent);
router.patch('/:id/status', protect, authorizeRoles('NITAdmin'), updateEventStatus);
router.delete('/:id', protect, authorizeRoles('NITAdmin'), deleteEvent);

// ✅ New — for CommonAdmin approval workflow
router.patch('/:id/validate', protect, authorizeRoles('CommonAdmin'), validateEventByAdmin);

module.exports = router;