const asyncHandler = require('express-async-handler');
const Team = require('../models/Team');

const createTeam = asyncHandler(async (req, res) => {
  const { name, sport, nit_id, players } = req.body;
  const exists = await Team.findOne({ name, sport, nit_id });
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
  const teams = await Team.find({ nit_id: req.params.id }).populate('coach_id','name');
  res.json(teams);
});

module.exports = { createTeam, getTeamsByNIT };
