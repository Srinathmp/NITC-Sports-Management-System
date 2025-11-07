const express = require('express');
const router = express.Router();
// const { createFixture, submitResult, listMatches } = require('../controllers/match.controller');
const {
  createMatch,
  getAllMatches,
  getPendingPublishingMatches,
  updateMatchResult,
  publishMatchResult,
  getAllTeams
} = require("../controllers/match.controller");
const { protect, authorizeRoles } = require('../middleware/auth.middleware');


// router.post('/', protect, authorizeRoles('CommonAdmin'), createFixture);
// router.get('/', listMatches);
// router.post('/:id/result', protect, authorizeRoles('NITAdmin'), submitResult);
// router.patch('/:id/status', protect, authorizeRoles('CommonAdmin'), submitResult);

// CommonAdmin creates matches
router.post("/create", protect, authorizeRoles("CommonAdmin"), createMatch);
// All users can view all matches
router.get("/", getAllMatches);
// CommonAdmin sees pending results
router.get("/pending", protect, authorizeRoles("CommonAdmin"), getPendingPublishingMatches);
// NITAdmin updates result
router.patch("/:id/result", protect, authorizeRoles("NITAdmin"), updateMatchResult);
// CommonAdmin publishes result
router.patch("/:id/publish", protect, authorizeRoles("CommonAdmin"), publishMatchResult);

router.get("/teams", getAllTeams);

module.exports = router;