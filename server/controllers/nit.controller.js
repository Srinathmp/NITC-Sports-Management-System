const asyncHandler = require('express-async-handler');
const NIT = require('../models/nit.model');
const AuditLog = require('../models/auditLog.model');

const registerNIT = asyncHandler(async (req, res) => {
  const { nitName, nitCode, nitLoc } = req.body;
  const exists = await NIT.findOne({ nitName });
  if (exists) {
    res.status(400);
    throw new Error('NIT already registered');
  }
  const nit = await NIT.create({ name: nitName, code: nitCode, location: nitLoc });
  res.status(201).json(nit);
});

const listPendingNITs = asyncHandler(async (req, res) => {
  const list = await NIT.find({ status: 'Pending' });
  res.json(list);
});

const updateNITStatus = asyncHandler(async (req, res) => {
  const { code } = req.params;
  const { status, isHost } = req.body;
  const nit = await NIT.find({ code: code });
  if (!nit) { res.status(404); throw new Error('NIT not found'); }
  nit[0].status = status;
  nit[0].isHost = isHost;
  await nit[0].save();
  await AuditLog.create({ action: 'Approve', user_id: req.user._id, entity: 'NIT', entity_id: nit[0]._id, details: `Status set to ${status}` });
  res.json(nit[0]);
});

module.exports = { registerNIT, listPendingNITs, updateNITStatus };