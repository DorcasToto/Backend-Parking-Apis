require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const zoneRoutes = require("./routes/zoneRoutes");


const app = express();
const PORT = process.env.PORT || 5002;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send(" Parking Service is alive!");
});
app.use("/api", zoneRoutes);
// MongoDB connection
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB...");
    app.listen(PORT, () => {
      console.log(`Parking Service running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });


