import { SensorModel } from "../models/sensorModel.js";

export const SensorService = {
  // 🔹 створює записи з формату типу { DHT11: { temp: {...} }, SOIL: {...} }
  async createFromPayload(data) {
    const saved = [];

    for (const [sensorName, sensorObj] of Object.entries(data)) {
      const [property, propertyData] = Object.entries(sensorObj)[0];

      if (!propertyData?.value) {
        throw new Error(`Missing value for ${sensorName}.${property}`);
      }

      const record = await SensorModel.saveValue(
        sensorName,
        property,
        propertyData.value,
        propertyData.unit || null
      );

      saved.push(record);
    }

    return saved;
  },

  // 🔹 просто бере з моделі всі записи
  async getAll() {
    return await SensorModel.getAll();
  },

  // 🔹 останні записи для кожного сенсора
  async getLatest() {
    return await SensorModel.getLatest();
  },
};
