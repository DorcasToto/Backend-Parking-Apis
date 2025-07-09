const Zone = require("../models/Zone");

exports.createZone = async (req, res) => {
  try {
    const { zoneId, name, slots } = req.body;

    const zone = new Zone({ zoneId, name, slots });
    await zone.save();

    res.status(201).json({ message: "Zone created successfully", zone });
  } catch (error) {
    console.error("Zone creation failed:", error);
    res.status(500).json({ message: "Error creating zone", error });
  }
};

exports.getAllZones = async (req, res) => {
  try {
    const zones = await Zone.find();
    res.status(200).json(zones);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch zones", error });
  }
};
