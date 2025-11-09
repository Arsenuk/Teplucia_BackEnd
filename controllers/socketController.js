import db from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

const units = {
  temp: "°C",
  hum: "%",
  press: "hPa",
  light: "lx",
  soil: "%"
};

export const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`🟢 Клієнт підключився: ${socket.id}`);

    // 📩 Коли приходять дані від Arduino
    socket.on("sensor_data", async (data) => {
      try {
        if (!data || typeof data !== "object") {
          console.warn("⚠️ Некоректні дані від пристрою:", data);
          return;
        }

        for (const [sensorName, sensorData] of Object.entries(data)) {
          let property, value;

          // 🧠 Підтримуємо обидва формати:
          // { dht11: { property: "temp", value: 23.4 } }
          // або старий: { dht11: { temp: 23.4 } }
          if ("value" in sensorData && "property" in sensorData) {
            property = sensorData.property;
            value = parseFloat(sensorData.value);
          } else {
            const [propKey, propValue] = Object.entries(sensorData)[0];
            property = propKey;
            value = parseFloat(propValue);
          }

          const unit = units[property] || "";

          // ✅ Перевіряємо, чи є сенсор у БД
          const [existingSensor] = await db.execute(
            `SELECT id FROM sensors WHERE name = ?`,
            [sensorName]
          );

          if (existingSensor.length === 0) {
            await db.execute(`INSERT INTO sensors (name) VALUES (?)`, [
              sensorName
            ]);
          }

          // 💾 Записуємо нове вимірювання
          await db.execute(
            `INSERT INTO sensor_values (sensor_name, property_name, value, unit, created_at)
             VALUES (?, ?, ?, ?, NOW())`,
            [sensorName, property, value, unit]
          );
        }

        console.log("✅ Дані збережено через WebSocket");
        socket.emit("ack", { message: "✅ Sensor data saved via WebSocket" });
      } catch (err) {
        console.error("❌ Помилка при збереженні WS даних:", err);
        socket.emit("ack", { message: "❌ Server error" });
      }
    });

    socket.on("disconnect", () => {
      console.log(`🔴 Клієнт відключився: ${socket.id}`);
    });
  });
};
