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

module.exports = { createEvent, listEvents, validateEvent, listPendingEvents };
