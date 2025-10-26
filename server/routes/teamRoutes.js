const express = require('express');
const router = express.Router();
const { createTeam, getTeamsByNIT } = require('../controllers/teamController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', protect, authorizeRoles('Coach'), createTeam);
router.get('/nit/:id', getTeamsByNIT);

module.exports = router;
