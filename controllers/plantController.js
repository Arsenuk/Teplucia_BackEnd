// controllers/PlantController.js
import { PlantService } from "../services/plantService.js";

export class PlantController {
  constructor() {
    this.service = new PlantService();

    // Прив'язка контексту для Express
    this.getAll = this.getAll.bind(this);
    this.getAllByUser = this.getAllByUser.bind(this);
    this.assignSensorsToPlant = this.assignSensorsToPlant.bind(this);
  }

  async getAll(req, res) {
    try {
      const plants = await this.service.getAll();
      res.json(plants);
    } catch (err) {
      res.status(500).json({ message: "Помилка при отриманні рослин", error: err.message });
    }
  }

  async getAllByUser(req, res) {
    try {
      const userId = req.user.id;
      const plants = await this.service.getAllByUser(userId);
      res.json(plants);
    } catch (err) {
      res.status(500).json({ message: "Помилка при отриманні рослин користувача", error: err.message });
    }
  }

  async assignSensorsToPlant(req, res) {
    try {
      const { id } = req.params;
      const { sensors } = req.body;
      const userId = req.user.id;

      const result = await this.service.assignSensorsToPlant(userId, id, sensors);

      res.json({
        message: "✅ Сенсори успішно прив'язані до рослини",
        ...result,
      });
    } catch (err) {
      res.status(500).json({ message: "Помилка при прив’язці сенсорів", error: err.message });
    }
  }
}
