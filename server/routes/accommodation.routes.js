const express = require("express");
const router = express.Router();
const { getAllAccommodations, addAccommodation, updateAccommodation, } = require("../controllers/accommodation.controller");

router.get("/", getAllAccommodations);
router.post("/", addAccommodation);
router.put("/:id", updateAccommodation);

module.exports = router;
