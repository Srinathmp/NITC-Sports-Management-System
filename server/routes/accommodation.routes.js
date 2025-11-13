const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/auth.middleware');
const { getAllAccommodations, addAccommodation, updateAccommodation,getAccommodationSummary } = require("../controllers/accommodation.controller");

router.get("/", getAllAccommodations);
router.post("/", addAccommodation);
router.put("/:id", updateAccommodation);
router.get("/accommodation-summary",protect,authorizeRoles("NITAdmin"),getAccommodationSummary);
module.exports = router;
