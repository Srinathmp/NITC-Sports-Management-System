const asyncHandler = require('express-async-handler');
const Match = require('../models/match.model');
const AuditLog = require('../models/auditLog.model');
const Team = require('../models/team.model');
const NIT = require('../models/nit.model');

/* -------------------------------------------------------------
   1. Create a new match (CommonAdmin)
------------------------------------------------------------- */
const createMatch = asyncHandler(async (req, res) => {
  try {
    const match = await Match.create(req.body);
    res.status(201).json(match);
  } catch (err) {
    console.error("Error creating match:", err.message);
    res.status(400).json({ error: err.message });
  }
});

/* -------------------------------------------------------------
   2. Get all matches (public / logged-in)
------------------------------------------------------------- */
const getAllMatches = asyncHandler(async (req, res) => {
  try {
    const matches = await Match.find()
      .populate("event_id", "name sport venue datetime")
      .populate("teamA_id teamB_id winner_id", "name nit_id")
      .sort({ matchDateTime: -1 });
    res.status(200).json(matches);
  } catch (err) {
    console.error("Error fetching matches:", err.message);
    res.status(500).json({ error: "Failed to fetch matches" });
  }
});

/* -------------------------------------------------------------
   3. NIT Admin updates match result (score, remarks, etc.)
------------------------------------------------------------- */
const updateMatchResult = asyncHandler(async (req, res) => {
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

    await AuditLog.create({
      action: 'Update',
      user_id: req.user._id,
      entity: 'Match',
      entity_id: match._id,
      details: 'Result submitted (pending publishing)',
    });

    // Update NIT points
    if (winner_id) {
      const winningTeam = await Team.findById(winner_id).populate("nit_id");
      if (winningTeam && winningTeam.nit_id) {
        await NIT.findByIdAndUpdate(winningTeam.nit_id._id, {
          $inc: { points: 20 },
        });
      }
    } else {
      // Tie → both get 10 points
      const teamA = await Team.findById(match.teamA_id).populate("nit_id");
      const teamB = await Team.findById(match.teamB_id).populate("nit_id");
      if (teamA?.nit_id)
        await NIT.findByIdAndUpdate(teamA.nit_id._id, { $inc: { points: 10 } });
      if (teamB?.nit_id)
        await NIT.findByIdAndUpdate(teamB.nit_id._id, { $inc: { points: 10 } });
    }

    res.status(200).json(match);
  } catch (err) {
    console.error("Error updating match result:", err.message);
    res.status(500).json({ error: "Error updating match result" });
  }
});

/* -------------------------------------------------------------
   4. CommonAdmin - get all matches pending publishing
------------------------------------------------------------- */
const getPendingPublishingMatches = asyncHandler(async (req, res) => {
  try {
    const pendingMatches = await Match.find({
      status: "Completed",
      pendingPublishing: true,
    })
      .populate("event_id", "name sport")
      .populate("teamA_id teamB_id winner_id", "name");
    res.status(200).json(pendingMatches);
  } catch (err) {
    console.error("Error fetching pending matches:", err.message);
    res.status(500).json({ error: "Failed to fetch pending matches" });
  }
});

/* -------------------------------------------------------------
   5. CommonAdmin - publish match result
------------------------------------------------------------- */
const publishMatchResult = asyncHandler(async (req, res) => {
  try {
    console.log("req.user in publishMatchResult:", req.user);

    const match = await Match.findById(req.params.id)
      .populate("teamA_id teamB_id event_id", "name sport");
    if (!match)
      return res.status(404).json({ error: "Match not found" });

    if (match.status !== "Completed" || !match.pendingPublishing)
      return res.status(400).json({ error: "Match not ready for publishing" });

    match.pendingPublishing = false;
    await match.save();

    await AuditLog.create({
      action: "Publish",
      user_id: req.user._id,
      entity: "Match",
      entity_id: match._id,
      details: `Published result for match ${match.teamA_id?.name} vs ${match.teamB_id?.name} (${match.event_id?.sport || "Unknown Sport"})`,
    });

    res.status(200).json({
      message: "Match result published successfully",
      match,
    });
  } catch (err) {
    console.error("Error publishing match result:", err.message);
    res.status(500).json({ error: "Failed to publish match result" });
  }
});

/* -------------------------------------------------------------
   6. Get all teams (for dropdowns in frontend)
------------------------------------------------------------- */
const getAllTeams = asyncHandler(async (req, res) => {
  try {
    const teams = await Team.find().select("_id name sport nit_id");
    res.status(200).json(teams);
  } catch (err) {
    console.error("Error fetching teams:", err.message);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
});

/* -------------------------------------------------------------
   EXPORTS
------------------------------------------------------------- */
module.exports = {
  createMatch,
  getAllMatches,
  updateMatchResult,
  getPendingPublishingMatches,
  publishMatchResult,
  getAllTeams
};