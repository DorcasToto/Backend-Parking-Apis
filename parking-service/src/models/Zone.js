const mongoose = require("mongoose");

const SlotSchema = new mongoose.Schema({
  slotId: { type: String, required: true },
  available: { type: Boolean, default: true },
});

const ZoneSchema = new mongoose.Schema(
  {
    zoneId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slots: [SlotSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Zone", ZoneSchema);
