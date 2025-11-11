// services/RecommendationService.js
import { SensorModel } from "../models/sensorModel.js";
import { RecommendationModel } from "../models/recommendationModel.js";

export class RecommendationService {
  constructor() {
    this.sensorModel = new SensorModel();
    this.recommendationModel = new RecommendationModel();
  }

  async generate(userId) {
    const sensors = await this.sensorModel.getLatestByUser(userId);
    const plants = await this.recommendationModel.getPlantsByUser(userId);
    const recommendations = [];

    for (const sensor of sensors) {
      const plant = plants.find((p) => p.sensor_name === sensor.sensor_name);
      if (!plant) continue;

      const val = parseFloat(sensor.value);
      let rec = null;

      if (sensor.property_name === "hum" && sensor.sensor_name === "SOIL") {
        if (val < plant.soil_hum_min) rec = "Полити рослину 💧";
        else if (val > plant.soil_hum_max) rec = "Надлишок вологи 🌊";
      }

      if (sensor.property_name === "temp") {
        if (val < plant.air_temp_min) rec = "Підвищити температуру 🌡️";
        else if (val > plant.air_temp_max) rec = "Знизити температуру ❄️";
      }

      if (sensor.property_name === "hum" && sensor.sensor_name === "AHT20") {
        if (val < plant.air_hum_min) rec = "Підвищити вологість 💦";
        else if (val > plant.air_hum_max) rec = "Зменшити вологість 🌬️";
      }

      if (sensor.property_name === "press" ) {
        if (val < plant.air_press_min) rec = "Позвоніть сонцю, я гіпотонік :)";
        else if (val > plant.air_hum_max) rec = "Позвоніть місяцю, я гіпертонік 🌑";
      }

      if (rec) {
        recommendations.push({
          sensor: sensor.sensor_name,
          property: sensor.property_name,
          value: sensor.value,
          recommendation: rec,
        });
      }
    }

    return recommendations.length
      ? recommendations
      : ["Усі показники в нормі 🌿"];
  }
}
