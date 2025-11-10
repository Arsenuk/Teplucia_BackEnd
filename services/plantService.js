// services/PlantService.js
import { PlantModel } from "../models/plantModel.js";

export class PlantService {
  constructor() {
    this.model = new PlantModel();
  }

  async getAll() {
    return await this.model.getAll();
  }

  async getAllByUser(userId) {
    return await this.model.getAllByUser(userId);
  }

  async assignSensorsToPlant(userId, plantId, sensors) {
    await this.model.assignSensorsToPlant(userId, plantId, sensors);
    return { plant_id: plantId, sensors };
  }
}
