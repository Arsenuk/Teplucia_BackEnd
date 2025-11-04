// src/routes/sensorRoutes.js
import express from "express";
import db from "../config/db.js"; // твій MySQL пул

const router = express.Router();

// POST /api/sensors
router.post("/", async (req, res) => {
  try {
    const { dhtTemp, dhtHum, ahtTemp, ahtHum, bmpTemp, bmpPress } = req.body;

    if (
      dhtTemp === undefined ||
      dhtHum === undefined ||
      ahtTemp === undefined ||
      ahtHum === undefined ||
      bmpTemp === undefined ||
      bmpPress === undefined
    ) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    // Збереження в MySQL
    const sql = `
      INSERT INTO sensor_data
      (dhtTemp, dhtHum, ahtTemp, ahtHum, bmpTemp, bmpPress, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    await db.execute(sql, [dhtTemp, dhtHum, ahtTemp, ahtHum, bmpTemp, bmpPress]);

    res.status(200).json({ message: "Data saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;