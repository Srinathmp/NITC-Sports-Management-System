const asyncHandler = require('express-async-handler');
const Event = require('../models/event.model');
const AuditLog = require('../models/auditLog.model');
const User = require('../models/user.model');
const NIT = require('../models/nit.model');

/* ------------------ Existing Controllers ------------------ */

const createEvent = asyncHandler(async (req, res) => {
  const { name, sport, venue, datetime, tournamentYear, stage } = req.body;
  const ev = await Event.create({
    name,
    sport,
    venue,
    datetime,
    created_by: req.user._id,
    tournamentYear,
    stage,
    status: 'PendingValidation'
  });
  res.status(201).json(ev);
});

const listEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ status: 'Scheduled' }).sort({ datetime: 1 });
  res.json(events);
});

const listPendingEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ status: 'PendingValidation' }).sort({ datetime: 1 });
  res.json(events);
});

const validateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'Scheduled' or 'Cancelled'
  const ev = await Event.findById(id);
  if (!ev) {
    res.status(404);
    throw new Error('Event not found');
  }
  ev.status = status;
  await ev.save();
  await AuditLog.create({
    action: 'Approve',
    user_id: req.user._id,
    entity: 'Event',
    entity_id: ev._id,
    details: `status=${status}`,
  });
  res.json(ev);
});

/* ------------------ Helper ------------------ */
async function isHostNITAdmin(userId) {
  const user = await User.findById(userId);
  if (!user || user.role !== 'NITAdmin') return false;
  const nit = await NIT.findById(user.nit_id);
  return nit?.isHost === true;
}

/* ------------------ New / Updated Controllers ------------------ */

// Get all events (dynamic visibility)
const getAllEvents = asyncHandler(async (req, res) => {
  try {
    let filter = {};

    // NITAdmin & CommonAdmin can see everything (including pending)
    if (req.user?.role === 'NITAdmin' || req.user?.role === 'CommonAdmin') {
      filter = {};
    } else {
      // Other users cannot see pending events
      filter = { status: { $ne: 'PendingValidation' } };
    }
    const events = await Event.find(filter)
      .populate('created_by', 'name role email')
      .sort({ datetime: 1 });
    res.status(200).json(events);
  } catch (err) {
    console.error('Error fetching events:', err.message);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

const getAllEventsPublic = asyncHandler(async (req, res) => {
  try {
    let filter = { status: { $ne: 'PendingValidation' } };
    const events = await Event.find(filter)
      .populate('created_by', 'name role email')
      .sort({ datetime: 1 });
    res.status(200).json(events);
  } catch (err) {
    console.error('Error fetching events:', err.message);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get single event
const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate('created_by', 'name role email');
  if (!event) return res.status(404).json({ error: 'Event not found' });
  res.status(200).json(event);
});

// Update event by NIT admin
const updateEvent = asyncHandler(async (req, res) => {
  if (!(await isHostNITAdmin(req.user._id))) {
    return res.status(403).json({ message: 'Only host NIT admins can perform this action' });
  }

  const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ error: 'Event not found' });
  res.status(200).json(updated);
});

// Update event status (by NIT admin)
const updateEventStatus = asyncHandler(async (req, res) => {
  if (!(await isHostNITAdmin(req.user._id))) {
    return res.status(403).json({ message: 'Only host NIT admins can perform this action' });
  }

  const { status } = req.body;
  const updated = await Event.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!updated) return res.status(404).json({ error: 'Event not found' });
  res.status(200).json(updated);
});

// Delete event
const deleteEvent = asyncHandler(async (req, res) => {
  const deleted = await Event.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Event not found' });
  res.status(200).json({ message: 'Event deleted successfully' });
});

/* ------------------ NEW FEATURE ------------------ */
// CommonAdmin Approve / Reject Pending Event
const validateEventByAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'Scheduled' or 'Cancelled'

  if (req.user.role !== 'CommonAdmin') {
    return res.status(403).json({ message: 'Only Common Admins can validate events' });
  }

  const ev = await Event.findById(id);
  if (!ev) return res.status(404).json({ message: 'Event not found' });

  if (ev.status !== 'PendingValidation') {
    return res.status(400).json({ message: 'Event is not pending validation' });
  }

  ev.status = status;
  await ev.save();

  await AuditLog.create({
    action: status === 'Scheduled' ? 'Approve' : 'Reject',
    user_id: req.user._id,
    entity: 'Event',
    entity_id: ev._id,
    details: `Event ${status}`,
  });

  res.status(200).json({ message: `Event ${status}`, event: ev });
});

module.exports = {
  createEvent,
  listEvents,
  listPendingEvents,
  validateEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  updateEventStatus,
  deleteEvent,
  getAllEventsPublic,
  validateEventByAdmin, // new controller
};
