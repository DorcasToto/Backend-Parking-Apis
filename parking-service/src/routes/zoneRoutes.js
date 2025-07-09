const express = require("express");
const router = express.Router();
const { createZone, getAllZones } = require("../controllers/zoneController");

router.post("/zones", createZone);
router.get("/zones", getAllZones);

module.exports = router;