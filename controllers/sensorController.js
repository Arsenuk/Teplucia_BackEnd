// src/controllers/sensorController.js
import { getLatestSensorData } from "../models/sensorModel.js";

export const getLatest = async (req, res) => {
  try {
    // ✅ Отримуємо лише дані користувача
    const data = await getLatestSensorData(req.user.id);

    // 🔹 Формуємо структуру:
    // {
    //   "DHT11": { "temp": { value: 23.4, unit: "°C", time: "..." } },
    //   "AHT20": { "hum": { value: 45.1, unit: "%", time: "..." } }
    // }
    const formatted = {};
    data.forEach((row) => {
      if (!formatted[row.sensor_name]) formatted[row.sensor_name] = {};
      formatted[row.sensor_name][row.property_name] = {
        value: row.value,
        unit: row.unit || "",
        time: row.created_at,
      };
    });

    

    res.json(formatted);
  } catch (err) {
    console.error("❌ Error in getLatest:", err);
    res.status(500).json({ message: "Помилка сервера" });
  }
};
