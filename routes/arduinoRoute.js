import express from "express";
import db from "../config/db.js";

const router = express.Router();

const units = {
  temp: "°C",
  hum: "%",
  press: "hPa",
  lux: "lx",
};

// 🔐 Middleware перевірки API ключа
const verifyApiKey = (req, res, next) => {
  const key = req.headers["x-device-key"];
  if (!key || key !== process.env.API_KEY) {
    return res.status(401).json({ message: "Access denied: invalid API key" });
  }
  next();
};

// 🚀 Основний endpoint для Arduino
router.post("/", verifyApiKey, async (req, res) => {
  try {
    const sensors = req.body;
    if (!sensors || typeof sensors !== "object") {
      return res.status(400).json({ message: "Invalid payload" });
    }

    for (const [sensorName, data] of Object.entries(sensors)) {
      let property, value;

      if ("value" in data && "property" in data) {
        value = parseFloat(data.value);
        property = data.property;
      } else {
        const [propKey, propValue] = Object.entries(data)[0];
        property = propKey;
        value = parseFloat(propValue);
      }

      const unit = units[property] || "";

      const [existingSensor] = await db.execute(
        `SELECT id FROM sensors WHERE name = ?`,
        [sensorName]
      );

      if (existingSensor.length === 0) {
        await db.execute(`INSERT INTO sensors (name) VALUES (?)`, [sensorName]);
        console.log(`➕ Створено новий сенсор: ${sensorName}`);
      }

      await db.execute(
        `INSERT INTO sensor_values (sensor_name, property_name, value, unit, created_at)
         VALUES (?, ?, ?, ?, NOW())`,
        [sensorName, property, value, unit]
      );

      console.log(`📥 ${sensorName}.${property} = ${value}${unit}`);
    }

    res.status(200).json({ message: "🌿 Data saved via API key" });
  } catch (err) {
    console.error("❌ API key insert error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
