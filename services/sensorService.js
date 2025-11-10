import db from "../config/db.js";
import { SensorModel } from "../models/sensorModel.js";

export class SensorService {
  constructor() {
    this.model = new SensorModel();
  }

  async createFromPayload(payload, userId = null) {
    const saved = [];

    for (const [sensorName, properties] of Object.entries(payload)) {
      let sensorRows;

      // Якщо userId не заданий (Arduino API)
      if (userId === null) {
        [sensorRows] = await db.execute(
          "SELECT * FROM sensors WHERE name = ?",
          [sensorName]
        );
      } else {
        [sensorRows] = await db.execute(
          "SELECT * FROM sensors WHERE name = ? AND user_id = ?",
          [sensorName, userId]
        );
      }

      // Якщо сенсор не знайдено — створюємо
      if (sensorRows.length === 0) {
        await db.execute(
          "INSERT INTO sensors (name, user_id) VALUES (?, ?)",
          [sensorName, userId]
        );
        console.log(`➕ Створено новий сенсор: ${sensorName}`);
      }

      // Зберігаємо значення для кожної властивості
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
