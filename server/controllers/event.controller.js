const asyncHandler = require('express-async-handler');
const Event = require('../models/event.model');
const AuditLog = require('../models/auditLog.model');

const createEvent = asyncHandler(async (req, res) => {
  const { name, sport, venue, datetime, tournamentYear, stage } = req.body;
  const ev = await Event.create({ name, sport, venue, datetime, created_by: req.user._id, tournamentYear, stage, status: 'PendingValidation' });
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
  const { status } = req.body; // 'Scheduled' or 'Rejected'
  const ev = await Event.findById(id);
  if (!ev) { res.status(404); throw new Error('Event not found'); }
  ev.status = status;
  await ev.save();
  await AuditLog.create({ action: 'Approve', user_id: req.user._id, entity: 'Event', entity_id: ev._id, details: `status=${status}` });
  res.json(ev);
});


// New Controllers

async function isHostNITAdmin(userId) {
  const user = await User.findById(userId);
  if (!user || user.role !== "NITAdmin") return false;
  const nit = await NIT.findById(user.nit_id);
  return nit?.isHost === true;
}

// Get all events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('created_by', 'name role email').sort({ datetime: 1 });
    res.status(200).json(events);
  } catch (err) {
    console.error('Error fetching events:', err.message);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// Get event by ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('created_by', 'name role email');
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.status(200).json(event);
  } catch (err) {
    console.error('Error fetching event:', err.message);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
};

// Create event
// const createEvent = async (req, res) => {
//   try {
//     const newEvent = new Event({
//       ...req.body,
//       created_by: req.user?._id || req.body.created_by // fallback if no auth middleware
//     });
//     await newEvent.save();
//     res.status(201).json(newEvent);
//   } catch (err) {
//     console.error('Error creating event:', err.message);
//     res.status(400).json({ error: err.message });
//   }
// };

// Update event (for host NIT admin)
const updateEvent = async (req, res) => {

  if (!(await isHostNITAdmin(req.user._id))) {
  return res.status(403).json({ message: "Only host NIT admins can perform this action" });
  }

  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Event not found' });
    res.status(200).json(updated);
  } catch (err) {
    console.error('Error updating event:', err.message);
    res.status(400).json({ error: err.message });
  }
};

// Update event status (for common admin)
const updateEventStatus = async (req, res) => {

  if (!(await isHostNITAdmin(req.user._id))) {
  return res.status(403).json({ message: "Only host NIT admins can perform this action" });
  }

  try {
    const { status } = req.body;
    const updated = await Event.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Event not found' });
    res.status(200).json(updated);
  } catch (err) {
    console.error('Error updating event status:', err.message);
    res.status(400).json({ error: err.message });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Event not found' });
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Error deleting event:', err.message);
    res.status(400).json({ error: err.message });
  }
};
module.exports = { createEvent, listEvents, validateEvent, listPendingEvents, getAllEvents, getEventById, updateEvent, updateEventStatus, deleteEvent };
