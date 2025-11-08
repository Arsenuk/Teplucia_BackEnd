import express from "express";
import db from "../config/db.js";
import { getLatest } from "../controllers/sensorController.js";
import { getRecommendations } from "../controllers/recommendationController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// одиниці вимірювання — запасні, якщо не передані
const units = {
  temp: "°C",
  hum: "%",
  press: "hPa",
  light: "lx",
  soil: "%"
};

// ✅ тепер усі запити через verifyToken
router.get("/recommendations", verifyToken, getRecommendations);
router.get("/latest", verifyToken, getLatest);

router.post("/", verifyToken, async (req, res) => {
  try {
    const sensors = req.body;

    if (!sensors || typeof sensors !== "object") {
      return res.status(400).json({ message: "Invalid payload" });
    }

    // кожен сенсор = один запис
    for (const [sensorName, data] of Object.entries(sensors)) {
      const value = parseFloat(data.value);
      const property = data.property ?? "value"; // наприклад "temp" або "hum"
      const unit = data.unit || units[property] || "";

      // 1️⃣ перевіряємо, чи є сенсор, який належить цьому користувачу
      const [existingSensor] = await db.execute(
        `SELECT id FROM sensors WHERE name = ? AND user_id = ?`,
        [sensorName, req.user.id]
      );

      // 2️⃣ якщо нема — додаємо
      if (existingSensor.length === 0) {
        await db.execute(
          `INSERT INTO sensors (name, user_id)
           VALUES (?, ?)`,
          [sensorName, req.user.id]
        );
        console.log(`🆕 Added new sensor for user ${req.user.id}: ${sensorName}`);
      }

      // 3️⃣ записуємо нове значення
      await db.execute(
        `INSERT INTO sensor_values (sensor_name, property_name, value, unit, created_at)
         VALUES (?, ?, ?, ?, NOW())`,
        [sensorName, property, value, unit]
      );
    }

    res.status(200).json({ message: "✅ Sensor data saved successfully" });
  } catch (err) {
    console.error("❌ Error saving sensor data:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
