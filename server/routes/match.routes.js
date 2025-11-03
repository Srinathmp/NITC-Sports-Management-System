const express = require('express');
const router = express.Router();
const { createFixture, submitResult, listMatches } = require('../controllers/match.controller');
const { protect, authorizeRoles } = require('../middleware/auth.middleware');

router.post('/', protect, authorizeRoles('CommonAdmin'), createFixture);
router.get('/', listMatches);
router.post('/:id/result', protect, authorizeRoles('NITAdmin'), submitResult);
router.patch('/:id/status', protect, authorizeRoles('CommonAdmin'), submitResult);

module.exports = router;