const Zone = require("../models/Zone");

const createZone = async (req, res) => {
  try {
    const { zoneId, name, slots = [] } = req.body;

    const exists = await Zone.findOne({ zoneId }).lean();
    if (exists) {
      return res.status(409).json({ message: "Zone ID already exists" });
    }

    const uniqueSlots = slots.filter(
      (slot, index, self) =>
        index === self.findIndex(s => s.slotId === slot.slotId)
    );

    const zone = await Zone.create({ zoneId, name, slots: uniqueSlots });

    res.status(201).json({
      message: "Zone created successfully",
      zone: {
        _id: zone._id,
        zoneId: zone.zoneId,
        name: zone.name,
        slotsCount: zone.slots.length,
      },
    });
  } catch (error) {
    console.error("Zone creation failed:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getAllZones = async (req, res) => {
  try {
    const { page = 1, limit = 10, name } = req.query;
    const query = {};

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    const zones = await Zone.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Zone.countDocuments(query);

    res.status(200).json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      zones,
    });
  } catch (error) {
    console.error("Failed to fetch zones:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const bulkCreateZones = async (req, res) => {
  try {
    const zones = req.body;

    if (!Array.isArray(zones) || zones.length === 0) {
      return res.status(400).json({ message: "Request body must be a non-empty array of zones" });
    }

    // Remove duplicates by zoneId in the incoming request
    const uniqueZones = zones.filter(
      (zone, index, self) =>
        index === self.findIndex(z => z.zoneId === zone.zoneId)
    );

    // Insert many at once
    const result = await Zone.insertMany(uniqueZones, { ordered: false });

    res.status(201).json({
      message: `${result.length} zones inserted successfully`,
      insertedZones: result.map(z => ({ zoneId: z.zoneId, name: z.name }))
    });
  } catch (error) {
    console.error("Bulk insert error:", error.message);
    res.status(500).json({ message: "Bulk insert failed", error: error.message });
  }
};


const addSlotToZone = async (req, res) => {
  const { zoneId } = req.params;
  const { slotId, available = true } = req.body;

  try {
    // 1. Check if zone exists and slotId is unique
    const zone = await Zone.findOne({ zoneId });
    if (!zone) {
      return res.status(404).json({ message: "Zone not found" });
    }

    const slotExists = zone.slots.some(slot => slot.slotId === slotId);
    if (slotExists) {
      return res.status(409).json({ message: "Slot ID already exists in this zone" });
    }

    zone.slots.push({ slotId, available });
    await zone.save();

    res.status(200).json({
      message: `Slot ${slotId} added to zone ${zoneId}`,
      slot: { slotId, available },
      totalSlots: zone.slots.length,
    });
  } catch (error) {
    console.error("Error adding slot:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = { getAllZones, createZone,addSlotToZone, bulkCreateZones };
