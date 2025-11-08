import db from "../config/db.js";

export const getRecommendations = async (req, res) => {
  try {
    // 1. Отримуємо останні дані з сенсорів
   const [sensors] = await db.query(`
  SELECT sensor_name, property_name, value
  FROM sensor_values
  WHERE sensor_name IN (
    SELECT name FROM sensors WHERE user_id = ?
  )
  AND created_at = (
    SELECT MAX(created_at) FROM sensor_values s2 WHERE s2.sensor_name = sensor_values.sensor_name
  )
`, [req.user.id]);


    // 2. Отримуємо інформацію про прив'язку до рослин
    const [plants] = await db.query(`
      SELECT s.name AS sensor_name, p.*
      FROM sensors s
      JOIN plants p ON s.plant_id = p.id
    `);

    const recommendations = [];

    for (const sensor of sensors) {
      const plant = plants.find(p => p.sensor_name === sensor.sensor_name);
      if (!plant) continue;

      const val = parseFloat(sensor.value);
      let rec = null;

      if (sensor.property_name === "hum" && sensor.sensor_name === "SOIL") {
        if (val < plant.soil_hum_min) rec = "Полити рослину 💧";
        else if (val > plant.soil_hum_max) rec = "Надлишок вологи! 🌊";
      }
      else if (sensor.property_name === "temp") {
        if (val < plant.air_temp_min) rec = "Підвищити температуру 🔥";
        else if (val > plant.air_temp_max) rec = "Провітрити теплицю 🌬️";
      }
      else if (sensor.property_name === "hum" && sensor.sensor_name !== "SOIL") {
        if (val < plant.air_hum_min) rec = "Збільшити вологість повітря 💦";
        else if (val > plant.air_hum_max) rec = "Зменшити вологість 🌤️";
      }
      
      if (rec) {
        recommendations.push({
          sensor: sensor.sensor_name,
          property: sensor.property_name,
          value: val,
          recommendation: rec
        });
      }
    }
    
    if (recommendations.length === 0) {
      recommendations.push("Усі показники в нормі 🌿");
    }
    

    res.json(recommendations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
