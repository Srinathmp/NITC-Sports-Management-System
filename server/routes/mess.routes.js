const express = require("express");
const router = express.Router();
const { getAllMess, addMess, updateMess, } = require("../controllers/mess.controller");

router.get("/", getAllMess);
router.post("/", addMess);
router.put("/:id", updateMess);

module.exports = router;
