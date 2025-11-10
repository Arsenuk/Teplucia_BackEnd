import db from "../config/db.js";

export const PlantModel = {
  async getAll() {
    const [rows] = await db.execute("SELECT * FROM plants");
    return rows;
  },

  async getAllByUser(userId) {
    const [rows] = await db.execute("SELECT * FROM plants WHERE user_id = ?", [userId]);
    return rows;
  },

  async assignSensorsToPlant(userId, plantId, sensors) {
    for (const sensorName of sensors) {
      await db.execute(
        "UPDATE sensors SET plant_id = ? WHERE name = ? AND user_id = ?",
        [plantId, sensorName, userId]
      );
    }
  },
};
