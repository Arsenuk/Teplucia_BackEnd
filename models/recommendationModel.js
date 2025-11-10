import db from "../config/db.js";

export const RecommendationModel = {
  async getPlantsByUser(userId) {
    const [rows] = await db.execute(
      `SELECT 
         p.id,
         p.name,
         p.user_id,
         p.soil_hum_min,
         p.soil_hum_max,
         p.air_temp_min,
         p.air_temp_max,
         p.air_hum_min,
         p.air_hum_max,
         s.name AS sensor_name
       FROM plants p
       JOIN sensors s ON s.plant_id = p.id
       WHERE p.user_id = ?`,
      [userId]
    );
    return rows;
  },
};
