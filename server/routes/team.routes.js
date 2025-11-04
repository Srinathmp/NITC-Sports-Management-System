const express = require('express');
const router = express.Router();
const { createTeam, getTeamsByNIT, getAllNIT } = require('../controllers/team.controller');
const { protect, authorizeRoles } = require('../middleware/auth.middleware');

router.post('/', protect, authorizeRoles('Coach'), createTeam);
router.get('/nit/:code', getTeamsByNIT);
router.get('/view', getAllNIT);

module.exports = router;