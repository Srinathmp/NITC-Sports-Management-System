const asyncHandler = require('express-async-handler');
const Match = require('../models/match.model');
const AuditLog = require('../models/auditLog.model');


const Team = require("../models/team.model");
const NIT = require("../models/nit.model");

// const createFixture = asyncHandler(async (req, res) => {
//   const { event_id, teamA_id, teamB_id, matchDateTime } = req.body;
//   const fixture = await Match.create({ event_id, teamA_id, teamB_id, matchDateTime, status: 'Scheduled' });
//   res.status(201).json(fixture);
// });

// const submitResult = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const { scoreA, scoreB, remarks, action } = req.body;
//   const match = await Match.findById(id);
//   if (!match) { res.status(404); throw new Error('Match not found'); }

//   if (req.user.role === 'CommonAdmin' && action === 'publish') {
//     match.status = 'Completed';
//     await match.save();
//     await AuditLog.create({ action: 'Approve', user_id: req.user._id, entity: 'Match', entity_id: match._id, details: 'Result published' });
//     return res.json(match);
//   }

//   match.scoreA = scoreA;
//   match.scoreB = scoreB;
//   if (scoreA != null && scoreB != null) {
//     if (scoreA > scoreB) match.winner_id = match.teamA_id;
//     else if (scoreB > scoreA) match.winner_id = match.teamB_id;
//   }
//   match.remarks = remarks;
//   match.status = 'Scheduled';
//   await match.save();
//   await AuditLog.create({ action: 'Update', user_id: req.user._id, entity: 'Match', entity_id: match._id, details: 'Result submitted (pending)' });
//   res.json(match);
// });

// const listMatches = asyncHandler(async (req, res) => {
//   const matches = await Match.find({ status: 'Completed' }).populate('teamA_id teamB_id winner_id');
//   res.json(matches);
// });

// New functions
// 1. Create a new match (CommonAdmin)
const createMatch = async (req, res) => {
  try {
    const match = await Match.create(req.body);
    res.status(201).json(match);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 2. Get all matches
const getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find()
      .populate("event_id", "name sport venue datetime")
      .populate("teamA_id teamB_id winner_id", "name nit_id")
      .sort({ matchDateTime: -1 });
    res.status(200).json(matches);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch matches" });
  }
};

// 3. NIT Admin updates result
const updateMatchResult = async (req, res) => {
  try {
    const { scoreA, scoreB, remarks } = req.body;

    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ error: "Match not found" });

    // Determine winner
    let winner_id = null;
    if (scoreA > scoreB) winner_id = match.teamA_id;
    else if (scoreB > scoreA) winner_id = match.teamB_id;

    match.scoreA = scoreA;
    match.scoreB = scoreB;
    match.remarks = remarks || "";
    match.winner_id = winner_id;
    match.status = "Completed";
    match.pendingPublishing = true;

    await match.save();
    await AuditLog.create({ action: 'Update', user_id: req.user._id, entity: 'Match', entity_id: match._id, details: 'Result submitted (pending)' });
    // Update points for winner (20 win / 10 tie)
    if (winner_id) {
      const winningTeam = await Team.findById(winner_id).populate("nit_id");
      if (winningTeam && winningTeam.nit_id) {
        await NIT.findByIdAndUpdate(winningTeam.nit_id._id, {
          $inc: { points: 20 },
        });
      }
    } else {
      // Tie case → add 10 to both teams’ NITs
      const teamA = await Team.findById(match.teamA_id).populate("nit_id");
      const teamB = await Team.findById(match.teamB_id).populate("nit_id");
      if (teamA?.nit_id) await NIT.findByIdAndUpdate(teamA.nit_id._id, { $inc: { points: 10 } });
      if (teamB?.nit_id) await NIT.findByIdAndUpdate(teamB.nit_id._id, { $inc: { points: 10 } });
    }

    res.status(200).json(match);
  } catch (err) {
    console.error("Error updating match result:", err.message);
    res.status(500).json({ error: "Error updating match result" });
  }
};

// 4. CommonAdmin views pending results
const getPendingPublishingMatches = async (req, res) => {
  try {
    const pendingMatches = await Match.find({
      status: "Completed",
      pendingPublishing: true,
    })
      .populate("event_id", "name sport")
      .populate("teamA_id teamB_id winner_id", "name");
    res.status(200).json(pendingMatches);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pending matches" });
  }
};

// 5. CommonAdmin publishes result
const publishMatchResult = async (req, res) => {
  try {

    console.log("req.user in publishMatchResult:", req.user);

    // 1Find match
    const match = await Match.findById(req.params.id)
      .populate("teamA_id teamB_id event_id", "name sport");
    if (!match)
      return res.status(404).json({ error: "Match not found" });

    // Ensure it’s marked as completed before publishing
    if (match.status !== "Completed" || !match.pendingPublishing)
      return res.status(400).json({ error: "Match not ready for publishing" });

    // Update publishing flag
    match.pendingPublishing = false;
    await match.save();

    // Log the publishing action
    await AuditLog.create({
      action: "Publish",
      user_id: req.user._id,
      entity: "Match",
      entity_id: match._id,
      details: `Published result for match ${match.teamA_id?.name} vs ${match.teamB_id?.name} (${match.event_id?.sport || "Unknown Sport"})`
    });

    // Send success response
    res.status(200).json({
      message: "Match result published successfully",
      match
    });

  } catch (err) {
    console.error("Error publishing match result:", err.message);
    res.status(500).json({ error: "Failed to publish match result" });
  }
};



module.exports = { createMatch,getAllMatches,updateMatchResult,getPendingPublishingMatches,publishMatchResult };
// createFixture, submitResult, listMatches,