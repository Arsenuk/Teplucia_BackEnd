// src/models/sensorModel.js
import db from "../config/db.js";

export async function getLatestSensorData() {
    const [rows] = await db.execute(`
      SELECT sv.sensor_name, sv.property_name, sv.value, sv.unit, sv.created_at
      FROM sensor_values sv
      INNER JOIN (
        SELECT sensor_name, property_name, MAX(created_at) AS latest
        FROM sensor_values
        GROUP BY sensor_name, property_name
      ) latest_data
      ON sv.sensor_name = latest_data.sensor_name
      AND sv.property_name = latest_data.property_name
      AND sv.created_at = latest_data.latest
      ORDER BY sv.sensor_name, sv.property_name
    `);
    return rows;
  }
  