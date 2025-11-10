import { PlantModel } from "../models/plantModel.js";

export const PlantController = {
  async getAll(req, res) {
    try {
      const plants = await PlantModel.getAll();
      res.json(plants);
    } catch (err) {
      res.status(500).json({ message: "Помилка при отриманні рослин", error: err.message });
    }
  },

  async getAllByUser(req, res) {
    try {
      const userId = req.user.id;
      const plants = await PlantModel.getAllByUser(userId);
      res.json(plants);
    } catch (err) {
      res.status(500).json({ message: "Помилка при отриманні рослин користувача", error: err.message });
    }
  },

  async assignSensorsToPlant(req, res) {
    try {
      const { id } = req.params;
      const { sensors } = req.body;
      const userId = req.user.id;

      await PlantModel.assignSensorsToPlant(userId, id, sensors);

      res.json({
        message: "✅ Сенсори успішно прив'язані до рослини",
        plant_id: id,
        sensors,
      });
    } catch (err) {
      res.status(500).json({ message: "Помилка при прив’язці сенсорів", error: err.message });
    }
  },
};
