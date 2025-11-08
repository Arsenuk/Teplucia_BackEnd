import express from "express";
import db from "../config/db.js";
import { getLatest } from "../controllers/sensorController.js";

const router = express.Router();

// Одиниці вимірювання для кожного типу властивості
const units = {
  temp: "°C",
  hum: "%",
  press: "hPa",
  light: "lx",
  soil: "%"
};

router.get("/latest", getLatest);

router.post("/", async (req, res) => {
  try {
    const sensors = req.body;

    if (!sensors || typeof sensors !== "object") {
      return res.status(400).json({ message: "Invalid payload" });
    }

    // Проходимо по кожному сенсору
    for (const [sensorName, props] of Object.entries(sensors)) {
      // І по кожній властивості
      for (const [property, propData] of Object.entries(props)) {
        // propData може бути або об’єктом, або просто значенням
        const value =
          typeof propData === "object" && propData.value !== undefined
            ? propData.value
            : propData;

        const unit = units[property] || "";

        const sql = `
          INSERT INTO sensor_values (sensor_name, property_name, value, unit, created_at)
          VALUES (?, ?, ?, ?, NOW())
        `;

        await db.execute(sql, [sensorName, property, value, unit]);
      }
    }

    res.status(200).json({ message: "✅ Sensor data saved successfully" });
  } catch (err) {
    console.error("❌ Error saving sensor data:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
