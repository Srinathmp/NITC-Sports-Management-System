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
  listMyTeams,
  getMyTeams
} = require('../controllers/team.controller');

const { protect, authorizeRoles } = require('../middleware/auth.middleware');

const optionalProtect = (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    return protect(req, res, next);
  }
  return next();
};

router.post('/create', protect, authorizeRoles('Coach'), createTeam);
router.get('/nit/:code', getTeamsByNIT);
router.get('/view', getAllNIT);
router.get('/me/by-sport', protect, authorizeRoles('Coach'), getMyTeamBySport);
router.post('/me/by-sport/players', protect, authorizeRoles('Coach'), addPlayerToMyTeamBySport);
router.patch('/me/by-sport/players/:jerseyNo', protect, authorizeRoles('Coach'), updatePlayerInMyTeamBySport);
router.delete('/me/by-sport/players/:jerseyNo', protect, authorizeRoles('Coach'), deletePlayerInMyTeamBySport);
router.get('/public', optionalProtect, listTeamsPublic);
router.get('/mine', protect, authorizeRoles('Coach'), listMyTeams);
router.get("/my-teams", protect, authorizeRoles("Coach"), getMyTeams);

module.exports = router;