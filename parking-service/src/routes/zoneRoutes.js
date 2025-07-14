const express = require("express");
const router = express.Router();
const { createZone, getAllZones, addSlotToZone, bulkCreateZones } = require("../controllers/zoneController");

router.post("/zones", createZone);
router.get("/zones", getAllZones);
router.post("/zones/:zoneId/slots", addSlotToZone);
router.post("/zones/bulk", bulkCreateZones);




module.exports = router;