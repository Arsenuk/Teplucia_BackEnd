// src/controllers/sensorController.js
import { getLatestSensorData } from "../models/sensorModel.js";

export const getLatest = async (req, res) => {
  try {
    const data = await getLatestSensorData();

    // 🔹 Формуємо структуру типу:
    // {
    //   "DHT11": { "temp": 23.4 },
    //   "AHT20": { "hum": 45.1 },
    //   "BMP280": { "press": 1012.8 }
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
    console.error(err);
    res.status(500).json({ message: "Помилка сервера" });
  }
};
