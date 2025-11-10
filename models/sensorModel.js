import db from "../config/db.js";

export const SensorModel = {
  // ✅ Отримати всі дані користувача
  async getAllByUser(user_id) {
    const [rows] = await db.execute(`
      SELECT sv.id, sv.sensor_name, sv.property_name AS property, sv.value, sv.unit, sv.created_at
      FROM sensor_values sv
      JOIN sensors s ON sv.sensor_name = s.name
      WHERE s.user_id = ?
      ORDER BY sv.created_at DESC
    `, [user_id]);

    return rows;
  },

  // ✅ Отримати останні дані користувача по кожному сенсору/властивості
  async getLatestByUser(user_id) {
    const [rows] = await db.execute(`
      SELECT sv.sensor_name, sv.property_name, sv.value, sv.unit, sv.created_at
      FROM sensor_values sv
      JOIN sensors s ON sv.sensor_name = s.name
      WHERE s.user_id = ?
        AND sv.created_at = (
          SELECT MAX(created_at)
          FROM sensor_values s2
          WHERE s2.sensor_name = sv.sensor_name
            AND s2.property_name = sv.property_name
        )
      ORDER BY sv.sensor_name, sv.property_name
    `, [user_id]);

    return rows;
  },

  // ✅ Зберегти дані (без user_id напряму)
  async saveValue(sensor_name, property_name, value, unit) {
    const [result] = await db.execute(`
      INSERT INTO sensor_values (sensor_name, property_name, value, unit, created_at)
      VALUES (?, ?, ?, ?, NOW())
    `, [sensor_name, property_name, value, unit]);

    return {
      id: result.insertId,
      sensor_name,
      property: property_name,
      value,
      unit,
      created_at: new Date(),
    };
  },


// у SensorService.js
async getAll() {
  const [rows] = await db.execute(`
    SELECT sv.*, s.user_id
    FROM sensor_values sv
    LEFT JOIN sensors s ON sv.sensor_name = s.name
    ORDER BY sv.created_at DESC
  `);
  return rows;
},

async getLatest() {
  const [rows] = await db.execute(`
    SELECT sv.sensor_name, sv.property_name, sv.value, sv.unit, sv.created_at, s.user_id
    FROM sensor_values sv
    LEFT JOIN sensors s ON sv.sensor_name = s.name
    WHERE sv.created_at = (
      SELECT MAX(created_at)
      FROM sensor_values s2
      WHERE s2.sensor_name = sv.sensor_name
        AND s2.property_name = sv.property_name
    )
    ORDER BY sv.sensor_name, sv.property_name
  `);
  return rows;
},

};