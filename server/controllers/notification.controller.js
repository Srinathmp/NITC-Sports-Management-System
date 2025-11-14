const asyncHandler = require('express-async-handler');
const Notification = require('../models/notification.model');
const User = require('../models/user.model');
const auditLogModel = require('../models/auditLog.model');
const notificationModel = require('../models/notification.model');

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



const getAllUsers = asyncHandler(async (req, res) => {
  const { search = "", role = "", nit = "", page = 1, limit = 10 } = req.query;

  const filter = {};

  if (search) {
    filter.$or = [
      { name: new RegExp(search, "i") },
      { email: new RegExp(search, "i") }
    ];
  }

  if (role) filter.role = role;
  if (nit) filter.nit_id = nit;

  const skip = (page - 1) * limit;

  const users = await User.find(filter)
    .populate("nit_id", "name code")
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });
  console.log(users)
  const total = await User.countDocuments(filter);

  res.json({
    users,
    total,
    totalPages: Math.ceil(total / limit)
  });

});

const announcement = asyncHandler(async (req, res) => {
  const { title, message, target } = req.body;
  if (!title || !message) {
    res.status(400);
    throw new Error("Title and message are required");
  }

  /* ------------------ Select Target Audience ------------------ */
  let filter = {};

  if (target === "Admin") {
    filter.role = "NITAdmin";
  } else if (target === "Coach") {
    filter.role = "Coach";
  } else {
    filter.role = 'All';
  }
  const announcement = await notificationModel.create({
    type:'Announcement',
    title,
    message,
    target,
    createdBy: req.user._id,
    recipientsRole: filter.role,
  });
  res.json({
    message:"Uploaded message"
  })
})

module.exports = { createNotification, listNotifications, getAllUsers, announcement };