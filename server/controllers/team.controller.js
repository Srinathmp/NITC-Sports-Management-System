const asyncHandler = require('express-async-handler');
const Team = require('../models/team.model');
const NIT = require('../models/nit.model');

const createTeam = asyncHandler(async (req, res) => {
  const { name, sport, nit_code, players } = req.body;
  const exists = await Team.findOne({ name, sport, nit_code });
  const nit = await NIT.find({ code: nit_code });
  if (!nit) { res.status(404); throw new Error('NIT not found'); }
  const nit_id = nit[0]._id
  if (exists) {
    res.status(400);
    throw new Error('Team already registered for this sport in the NIT');
  }
  const team = await Team.create({
    name, sport, nit_id, players, coach_id: req.user._id
  });
  res.status(201).json(team);
});

const getTeamsByNIT = asyncHandler(async (req, res) => {
  const { code } = req.params;
  const nit = await NIT.find({ code: code });
  if (!nit) { res.status(404); throw new Error('NIT not found'); }
  const nit_id = nit[0]._id
  const teams = await Team.find({ nit_id: nit_id }).populate('coach_id', 'name');
  res.json(teams);
});

module.exports = { createTeam, getTeamsByNIT };