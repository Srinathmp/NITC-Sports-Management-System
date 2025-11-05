const express = require('express');
const router = express.Router();
const { createEvent, listEvents, validateEvent, listPendingEvents, getAllEvents, getEventById, updateEvent, updateEventStatus, deleteEvent} = require('../controllers/event.controller');
const { protect, authorizeRoles } = require('../middleware/auth.middleware');

router.post('/', protect, authorizeRoles('NITAdmin'), createEvent);
router.get('/listevents', listEvents);
router.get('/listpendingevents', protect, authorizeRoles('CommonAdmin'), listPendingEvents);
router.patch('/:id/status-update', protect, authorizeRoles('CommonAdmin'), validateEvent);
//new routes
router.get('/allEvents',  getAllEvents);
router.get('/:id',  getEventById);
router.put('/:id', protect, authorizeRoles('NITAdmin'),  updateEvent);
router.patch('/:id/status', protect, authorizeRoles('NITAdmin') , updateEventStatus);
router.delete('/:id', protect, authorizeRoles('NITAdmin'), deleteEvent);

module.exports = router;