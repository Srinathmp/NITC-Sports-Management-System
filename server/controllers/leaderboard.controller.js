const asyncHandler = require('express-async-handler');
const NIT = require('../models/nit.model');

const getLeaderboard = asyncHandler(async (req, res) => {
  const page  = Math.max(1, Number(req.query.page || 1));
  const limit = Math.max(1, Math.min(50, Number(req.query.limit || 10)));

  const allNits = await NIT
    .find({})
    .select({ name: 1, points: 1 })
    .sort({ points: -1, _id: 1 })
    .lean();

  const totalInstitutes = allNits.length;
  const totalPages = Math.max(1, Math.ceil(totalInstitutes / limit));
  const start = (page - 1) * limit;
  const end = start + limit;

  const highestScore = totalInstitutes ? (allNits[0].points || 0) : 0;

  const topPerformers = allNits.slice(0, 3).map(n => ({
    nit_id: n._id,
    name: n.name,
    points: n.points || 0,
  }));

  const rankings = allNits.slice(start, end).map((n, idx) => ({
    rank: start + idx + 1,
    nit_id: n._id,
    name: n.name,
    points: n.points || 0,
  }));

  return res.json({
    topPerformers,
    rankings,
    totalInstitutes,
    totalPages,
    highestScore
  });
});

module.exports = { getLeaderboard };