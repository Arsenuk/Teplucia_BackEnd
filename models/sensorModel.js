import db from "../config/db.js";

export const SensorModel = {
  async getAll() {
    const [rows] = await db.execute(`
      SELECT id, sensor_name, property_name AS property, value, unit, created_at
      FROM sensor_values
      ORDER BY created_at DESC
    `);
    return rows;
  },

  async getLatest() {
    const [rows] = await db.execute(`
      SELECT sv.*
      FROM sensor_values sv
      INNER JOIN (
        SELECT sensor_name, property_name, MAX(created_at) AS latest_time
        FROM sensor_values
        GROUP BY sensor_name, property_name
      ) latest
      ON sv.sensor_name = latest.sensor_name
      AND sv.property_name = latest.property_name
      AND sv.created_at = latest.latest_time
      ORDER BY sv.sensor_name, sv.property_name
    `);
    return rows;
  },

  async saveValue(sensor_name, property_name, value, unit) {
    const [result] = await db.execute(
      `INSERT INTO sensor_values (sensor_name, property_name, value, unit, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [sensor_name, property_name, value, unit]
    );

    return {
      id: result.insertId,
      sensor_name,
      property: property_name,
      value,
      unit,
      created_at: new Date(),
    };
  },
};
