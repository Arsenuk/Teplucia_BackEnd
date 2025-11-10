// services/ArduinoService.js
import { SensorService } from "../services/sensorService.js";

export class ArduinoService {
  constructor() {
    this.sensorService = new SensorService();
  }

  async processPayload(payload) {
    const savedData = [];

    for (const [sensorName, data] of Object.entries(payload)) {
      // обробка одного сенсора
      let properties = {};

      if ("value" in data && "property" in data) {
        // Arduino надіслав у форматі { value, property }
        properties[data.property] = data.value;
      } else {
        // Arduino надіслав у форматі { temp: 25.3, hum: 60 }
        properties = data;
      }

      // і тепер просто передаємо в логіку сенсорів
      const saved = await this.sensorService.createFromPayload({
        [sensorName]: properties,
      }, null); // userId = null, бо API-ключ, не користувач

      savedData.push(...saved);
    }

    return savedData;
  }
}
