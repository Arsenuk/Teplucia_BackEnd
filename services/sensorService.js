import db from "../config/db.js";
import { SensorModel } from "../models/sensorModel.js";

export const SensorService = {
  // ✅ Обробка payload від Arduino
  async createFromPayload(payload, userId) {
    const saved = [];

    for (const [sensorName, properties] of Object.entries(payload)) {
      // 1️⃣ Перевіряємо, чи сенсор належить цьому користувачу
      const [sensorRows] = await db.execute(
        "SELECT * FROM sensors WHERE name = ? AND user_id = ?",
        [sensorName, userId]
      );

      if (sensorRows.length === 0) {
        console.log(`➕ Створюємо новий сенсор '${sensorName}' для користувача ${userId}`);
        await db.execute(
          "INSERT INTO sensors (name, user_id) VALUES (?, ?)",
          [sensorName, userId]
        );
      }
      

      // 2️⃣ Проходимо всі властивості сенсора (temp, hum, press...)
      for (const [propertyName, propertyData] of Object.entries(properties)) {
        const value = parseFloat(propertyData.value);
        const unit = propertyData.unit || "";

        if (isNaN(value)) {
          console.warn(`⚠️ Некоректне значення для ${sensorName}.${propertyName}: ${propertyData.value}`);
          continue;
        }

        // 3️⃣ Зберігаємо у базу
        const record = await SensorModel.saveValue(sensorName, propertyName, value, unit);
        saved.push(record);
      }
    }

    return saved;
  },

  // ✅ Отримати всі дані користувача
  async getAllByUser(userId) {
    return await SensorModel.getAllByUser(userId);
  },

  // ✅ Отримати останні дані користувача
  async getLatestByUser(userId) {
    return await SensorModel.getLatestByUser(userId);
  },

  async getAll() {
    return await SensorModel.getAll();
  },

  async getLatest() {
    return await SensorModel.getLatest();
  },

};

