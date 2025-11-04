const asyncHandler = require('express-async-handler');
const Notification = require('../models/notification.model');

const createNotification = asyncHandler(async (req, res) => {
  const { recipientRole, message, type } = req.body;
  const note = await Notification.create({ created_by: req.user._id, recipientRole, message, type });
  res.status(201).json(note);
});

const listNotifications = asyncHandler(async (req, res) => {
  const { recipientRole } = req.query;
  if (recipientRole) {
    const list = await Notification.find({ recipientRole }).sort({ createdAt: -1 });
    return res.json(list);
  }
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    const token = req.headers.authorization.split(' ')[1];
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const list = await Notification.find({ $or: [{ user_id: userId }, { recipientRole: 'All' }] }).sort({ createdAt: -1 });
    return res.json(list);
  }
  const publicList = await Notification.find({ recipientRole: 'All' }).sort({ created_at: -1 });
  res.json(publicList);
});

module.exports = { createNotification, listNotifications };