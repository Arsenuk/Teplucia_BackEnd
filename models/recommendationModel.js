import db from "../config/db.js";

export const getRecommendations = async (plantId) => {
  // Отримуємо параметри рослини
  const [plants] = await db.execute(
    "SELECT * FROM plants WHERE id = ?",
    [plantId]
  );

  if (plants.length === 0) {
    throw new Error("Plant not found");
  }

  const plant = plants[0];

  // Отримуємо останні показники сенсорів
  const [sensors] = await db.execute(`
    SELECT sensor_name, property_name, value, unit, created_at
    FROM sensor_values sv
    INNER JOIN (
      SELECT sensor_name, property_name, MAX(created_at) AS latest
      FROM sensor_values
      GROUP BY sensor_name, property_name
    ) latest_data
    ON sv.sensor_name = latest_data.sensor_name
    AND sv.property_name = latest_data.property_name
    AND sv.created_at = latest_data.latest
  `);

  const recommendations = [];

  // Аналізуємо дані сенсорів відносно параметрів рослини
  sensors.forEach(s => {
    if (s.property_name === "hum") {
      if (s.value < plant.humidity_min) recommendations.push("💧 Полити рослину");
      else if (s.value > plant.humidity_max) recommendations.push("💨 Знизити вологість (вентиляція)");
    }

    if (s.property_name === "temp") {
      if (s.value < plant.temp_min) recommendations.push("🔥 Підігріти теплицю");
      else if (s.value > plant.temp_max) recommendations.push("❄️ Охолодити теплицю");
    }

    if (s.property_name === "press") {
      if (s.value < plant.press_min) recommendations.push("⚠️ Атмосферний тиск низький");
      else if (s.value > plant.press_max) recommendations.push("⚠️ Атмосферний тиск високий");
    }
  });

  return { plant, sensors, recommendations };
};
