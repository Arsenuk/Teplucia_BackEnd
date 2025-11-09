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

// Зберігаємо підключених клієнтів (arduino, фронт)
export const connectedDevices = new Map();

export const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`🟢 Нове з'єднання: ${socket.id}`);
    console.log("✅ WebSocket connected:", socket.id);

    socket.on("register_device", (deviceName) => {
      connectedDevices.set(deviceName, socket.id);
      console.log(`📡 Зареєстровано пристрій: ${deviceName}`);
    });

    socket.on("sensor_data", async (data) => {
      try {
        if (!data || typeof data !== "object") return;

        for (const [sensorName, sensorData] of Object.entries(data)) {
          let property, value;

          if ("value" in sensorData && "property" in sensorData) {
            property = sensorData.property;
            value = parseFloat(sensorData.value);
          } else {
            const [key, val] = Object.entries(sensorData)[0];
            property = key;
            value = parseFloat(val);
          }

          const unit = units[property] || "";

          // створюємо сенсор, якщо ще не існує
          const [rows] = await db.execute(
            `SELECT id FROM sensors WHERE name = ?`,
            [sensorName]
          );

          if (rows.length === 0) {
            await db.execute(`INSERT INTO sensors (name) VALUES (?)`, [
              sensorName
            ]);
          }

          // додаємо вимір
          await db.execute(
            `INSERT INTO sensor_values (sensor_name, property_name, value, unit, created_at)
             VALUES (?, ?, ?, ?, NOW())`,
            [sensorName, property, value, unit]
          );
        }

        socket.emit("ack", { message: "✅ Data saved via WebSocket" });
        console.log("✅ Дані збережено через WS");
      } catch (err) {
        console.error("❌ Помилка при збереженні WS даних:", err);
        socket.emit("ack", { message: "❌ Server error" });
      }
    });

    socket.on("disconnect", () => {
      console.log(`🔴 Клієнт відключився: ${socket.id}`);
      for (const [name, id] of connectedDevices.entries()) {
        if (id === socket.id) {
          connectedDevices.delete(name);
          console.log(`❌ Пристрій ${name} видалено`);
          break;
        }
      }
    });
  });
};
