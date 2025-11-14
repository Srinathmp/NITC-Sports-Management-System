const express = require('express');
const router = express.Router();
const {
  createMatch,
  getAllMatches,
  getPendingPublishingMatches,
  updateMatchResult,
  publishMatchResult,
  getAllTeams
} = require("../controllers/match.controller");
const { protect, authorizeRoles } = require('../middleware/auth.middleware');

router.post("/create", protect, authorizeRoles("CommonAdmin"), createMatch);
router.get("/", getAllMatches);
router.get("/pending", protect, authorizeRoles("CommonAdmin"), getPendingPublishingMatches);
router.patch("/:id/result", protect, authorizeRoles("NITAdmin"), updateMatchResult);
router.patch("/:id/publish", protect, authorizeRoles("CommonAdmin"), publishMatchResult);
router.get("/teams", getAllTeams);

module.exports = router;