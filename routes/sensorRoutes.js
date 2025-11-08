import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const sensors = req.body;
    if (!sensors || typeof sensors !== "object") {
      return res.status(400).json({ message: "Invalid payload" });
    }

    // обходимо всі сенсори
    for (const [sensorName, props] of Object.entries(sensors)) {
      // і всі властивості кожного сенсора
      for (const [property, value] of Object.entries(props)) {
        const sql = `
          INSERT INTO sensor_values (sensor_name, property_name, value, created_at)
          VALUES (?, ?, ?, NOW())
        `;
        await db.execute(sql, [sensorName, property, value]);
      }
    }

    res.status(200).json({ message: "Data saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/", async (req, res) => {
  console.log("Отримано:", req.body); // <--- додай це

  const data = req.body;
  const sql = `
    INSERT INTO sensor_values (sensor_name, property_name, value, created_at)
    VALUES (?, ?, ?, NOW())
  `;

  for (const [sensor, props] of Object.entries(data)) {
    for (const [property, value] of Object.entries(props)) {
      await db.execute(sql, [sensor, property, value]);
    }
  }

  res.status(200).json({ message: "Data saved" });
});


export default router;
