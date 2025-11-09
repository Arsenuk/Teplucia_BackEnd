import express from "express";
import db from "../config/db.js";
import { getLatest } from "../controllers/sensorController.js";
import { getRecommendations } from "../controllers/recommendationController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const units = {
  temp: "°C",
  hum: "%",
  press: "hPa",
  light: "lx",
  soil: "%"
};

// ✅ middleware для перевірки API ключа
const verifyApiKey = (req, res, next) => {
  const key = req.headers["x-device-key"];
  if (!key || key !== process.env.API_KEY) {
    return res.status(401).json({ message: "Access denied: invalid API key" });
  }
  next();
};

// 🔒 приватні маршрути (через JWT)
router.get("/recommendations", verifyToken, getRecommendations);
router.get("/latest", verifyToken, getLatest);

// 🔐 Запис від користувача з токеном
router.post("/", verifyToken, async (req, res) => {
  try {
    const sensors = req.body;

    if (!sensors || typeof sensors !== "object") {
      return res.status(400).json({ message: "Invalid payload" });
    }

    for (const [sensorName, data] of Object.entries(sensors)) {
      // 🧠 Підтримка обох форматів: {"value": 22, "property": "temp"} або {"temp": 22}
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

      // 1️⃣ Перевіряємо сенсор користувача
      const [existingSensor] = await db.execute(
        `SELECT id FROM sensors WHERE name = ? AND user_id = ?`,
        [sensorName, req.user.id]
      );

      if (existingSensor.length === 0) {
        await db.execute(
          `INSERT INTO sensors (name, user_id) VALUES (?, ?)`,
          [sensorName, req.user.id]
        );
      }

      // 2️⃣ Записуємо вимірювання
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

// 🌱 відкритий варіант для Arduino — з API ключем
router.post("/api", verifyApiKey, async (req, res) => {
  try {
    const sensors = req.body;
    if (!sensors || typeof sensors !== "object") {
      return res.status(400).json({ message: "Invalid payload" });
    }

    for (const [sensorName, data] of Object.entries(sensors)) {
      // 🧠 Якщо приходить старий формат — { "temp": 22.5 } або { "hum": 65 }
      let property, value;

      if ("value" in data && "property" in data) {
        // новий формат
        value = parseFloat(data.value);
        property = data.property;
      } else {
        // старий формат: беремо перше ключ-значення
        const [propKey, propValue] = Object.entries(data)[0];
        property = propKey;
        value = parseFloat(propValue);
      }

      const unit =
        units[property] || ""; // автоматично визначаємо °C, %, hPa, lx тощо

      // ✅ створюємо сенсор, якщо ще не існує
      const [existingSensor] = await db.execute(
        `SELECT id FROM sensors WHERE name = ?`,
        [sensorName]
      );

      if (existingSensor.length === 0) {
        // ⚙️ сенсор не має user_id (бо Arduino не авторизується)
        await db.execute(`INSERT INTO sensors (name) VALUES (?)`, [sensorName]);
      }

      // 💾 записуємо вимірювання
      await db.execute(
        `INSERT INTO sensor_values (sensor_name, property_name, value, unit, created_at)
         VALUES (?, ?, ?, ?, NOW())`,
        [sensorName, property, value, unit]
      );
    }

    res.status(200).json({ message: "🌿 Data saved via API key" });
  } catch (err) {
    console.error("❌ API key insert error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
