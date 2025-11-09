import db from "../config/db.js";

export const RecommendationModel = {
  async getPlantsByUser(userId) {
    const [rows] = await db.execute(
      "SELECT * FROM plants WHERE user_id = ?",
      [userId]
    );
    return rows;
  },
};
