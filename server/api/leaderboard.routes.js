const express = require('express');
const router = express.Router();
const { getLeaderboard } = require('../controllers/leaderboard.controller');

// Public leaderboard (no auth). Add protect() if needed.
router.get('/', getLeaderboard);

module.exports = router;
