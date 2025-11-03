const express = require('express');
const router = express.Router();
const { createTeam, getTeamsByNIT } = require('../controllers/team.controller');
const { protect, authorizeRoles } = require('../middleware/auth.middleware');

router.post('/', protect, authorizeRoles('Coach'), createTeam);
router.get('/nit/:code', getTeamsByNIT);

module.exports = router;