import db from "../config/db.js";
import { SensorModel } from "../models/sensorModel.js";

export class SensorService {
  constructor() {
    this.model = new SensorModel();
  }

  async createFromPayload(payload, userId) {
    const saved = [];

    for (const [sensorName, properties] of Object.entries(payload)) {
      const [sensorRows] = await db.execute(
        "SELECT * FROM sensors WHERE name = ? AND user_id = ?",
        [sensorName, userId]
      );

      if (sensorRows.length === 0) {
        await db.execute(
          "INSERT INTO sensors (name, user_id) VALUES (?, ?)",
          [sensorName, userId]
        );
      }

      for (const [propertyName, propertyData] of Object.entries(properties)) {
        const value = parseFloat(propertyData);
        const unit = { temp: "°C", hum: "%", press: "hPa" }[propertyName] || "";

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
