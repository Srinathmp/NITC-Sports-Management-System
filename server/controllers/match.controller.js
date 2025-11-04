const asyncHandler = require('express-async-handler');
const Match = require('../models/match.model');
const AuditLog = require('../models/auditLog.model');

const createFixture = asyncHandler(async (req, res) => {
  const { event_id, teamA_id, teamB_id, matchDateTime } = req.body;
  const fixture = await Match.create({ event_id, teamA_id, teamB_id, matchDateTime, status: 'Scheduled' });
  res.status(201).json(fixture);
});

const submitResult = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { scoreA, scoreB, remarks, action } = req.body;
  const match = await Match.findById(id);
  if (!match) { res.status(404); throw new Error('Match not found'); }

  if (req.user.role === 'CommonAdmin' && action === 'publish') {
    match.status = 'Completed';
    await match.save();
    await AuditLog.create({ action: 'Approve', user_id: req.user._id, entity: 'Match', entity_id: match._id, details: 'Result published' });
    return res.json(match);
  }

  match.scoreA = scoreA;
  match.scoreB = scoreB;
  if (scoreA != null && scoreB != null) {
    if (scoreA > scoreB) match.winner_id = match.teamA_id;
    else if (scoreB > scoreA) match.winner_id = match.teamB_id;
  }
  match.remarks = remarks;
  match.status = 'Scheduled';
  await match.save();
  await AuditLog.create({ action: 'Update', user_id: req.user._id, entity: 'Match', entity_id: match._id, details: 'Result submitted (pending)' });
  res.json(match);
});

const listMatches = asyncHandler(async (req, res) => {
  const matches = await Match.find({ status: 'Completed' }).populate('teamA_id teamB_id winner_id');
  res.json(matches);
});

module.exports = { createFixture, submitResult, listMatches };