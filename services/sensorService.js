import { SensorModel } from "../models/sensorModel.js";

export class SensorService {
  constructor() {
    this.model = new SensorModel();
  }

  async createFromPayload(payload, userId = null) {
    const saved = [];

    for (const [sensorName, properties] of Object.entries(payload)) {
      // ✅ знаходимо сенсор
      const existingSensor = userId
        ? await this.model.findByNameAndUser(sensorName, userId)
        : await this.model.findByName(sensorName);

      // ✅ якщо не існує — створюємо
      if (!existingSensor) {
        await this.model.create(sensorName, userId);
        console.log(`➕ Створено новий сенсор: ${sensorName}`);
      }

      // ✅ зберігаємо дані сенсора
      for (const [propertyName, propertyData] of Object.entries(properties)) {
        const value = parseFloat(propertyData);
        const unit = { temp: "°C", hum: "%", press: "hPa", lux: "lx" }[propertyName] || "";
        if (isNaN(value)) continue;

        const record = await this.model.saveValue(sensorName, propertyName, value, unit);
        saved.push(record);
      }
    }

    return saved;
  }

  async getAllByUser(userId) {
    return await this.model.getAllByUser(userId);
  }

  async getLatestByUser(userId) {
    return await this.model.getLatestByUser(userId);
  }

  async getAll() {
    return await this.model.getAll();
  }

  async getLatest() {
    return await this.model.getLatest();
  }
}
