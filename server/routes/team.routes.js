const express = require('express');
const router = express.Router();

const {
  createTeam,
  getTeamsByNIT,
  getAllNIT,
  getMyTeamBySport,
  addPlayerToMyTeamBySport,
  updatePlayerInMyTeamBySport,
  deletePlayerInMyTeamBySport,
  listTeamsPublic,
  listMyTeams
} = require('../controllers/team.controller');

const { protect, authorizeRoles } = require('../middleware/auth.middleware');

// Helper: run protect() only if Authorization header exists; otherwise continue
const optionalProtect = (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    return protect(req, res, next);
  }
  return next();
};

// Existing routes
router.post('/', protect, authorizeRoles('Coach'), createTeam);
router.get('/nit/:code', getTeamsByNIT);
router.get('/view', getAllNIT);

// Coach endpoints
router.get('/me/by-sport', protect, authorizeRoles('Coach'), getMyTeamBySport);
router.post('/me/by-sport/players', protect, authorizeRoles('Coach'), addPlayerToMyTeamBySport);
router.patch('/me/by-sport/players/:jerseyNo', protect, authorizeRoles('Coach'), updatePlayerInMyTeamBySport);
router.delete('/me/by-sport/players/:jerseyNo', protect, authorizeRoles('Coach'), deletePlayerInMyTeamBySport);

// NEW: public list (optionally marks isMyTeam if token present)
router.get('/public', optionalProtect, listTeamsPublic);

// NEW: coach’s own teams
router.get('/mine', protect, authorizeRoles('Coach'), listMyTeams);

module.exports = router;
