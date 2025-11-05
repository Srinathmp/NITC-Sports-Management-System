const express = require('express');
const router = express.Router();

const {
  createTeam,
  getTeamsByNIT,
  getAllNIT,
  getMyTeamBySport,
  addPlayerToMyTeamBySport,
  updatePlayerInMyTeamBySport,   // ✅
  deletePlayerInMyTeamBySport    // ✅
} = require('../controllers/team.controller');

const { protect, authorizeRoles } = require('../middleware/auth.middleware');

// Existing routes
router.post('/', protect, authorizeRoles('Coach'), createTeam);
router.get('/nit/:code', getTeamsByNIT);
router.get('/view', getAllNIT);

// Coach endpoints
router.get('/me/by-sport', protect, authorizeRoles('Coach'), getMyTeamBySport);
router.post('/me/by-sport/players', protect, authorizeRoles('Coach'), addPlayerToMyTeamBySport);

// NEW: edit + delete by jerseyNo (stable key since subdoc _id is disabled)
router.patch('/me/by-sport/players/:jerseyNo', protect, authorizeRoles('Coach'), updatePlayerInMyTeamBySport);
router.delete('/me/by-sport/players/:jerseyNo', protect, authorizeRoles('Coach'), deletePlayerInMyTeamBySport);

module.exports = router;
