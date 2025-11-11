const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/auth.middleware");
const {
  bookAccommodation,
  myAccommodationBookings,
  bookMess,
  myMessBookings,
} = require("../controllers/booking.controller");

// Coach-only
router.post("/accommodation", protect, authorizeRoles("Coach"), bookAccommodation);
router.get("/accommodation/my", protect, authorizeRoles("Coach"), myAccommodationBookings);

router.post("/mess", protect, authorizeRoles("Coach"), bookMess);
router.get("/mess/my", protect, authorizeRoles("Coach"), myMessBookings);

module.exports = router;
