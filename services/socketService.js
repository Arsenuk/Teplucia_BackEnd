import dotenv from "dotenv";
import { SensorService } from "../services/sensorService.js"; // ✅ додаємо
dotenv.config();

console.log("🔍 ARDUINO_TOKEN із .env:", process.env.ARDUINO_TOKEN);


export const connectedDevices = new Map();

export const initSocket = (io) => {
  io.on("connection", (socket) => {
    const token = socket.handshake.query.token;
    console.log("🧩 Отримано токен від клієнта:", token);
    console.log("🧩 Очікуваний токен:", `"${process.env.ARDUINO_TOKEN}"`);

    if (token !== process.env.ARDUINO_TOKEN) {
      console.log(`❌ Відхилено неавторизоване підключення (${socket.id})`);
      socket.disconnect(true);
      return;
    }

    console.log(`🟢 Нове з'єднання: ${socket.id}`);
    socket.on("register_device", (deviceName) => {
      connectedDevices.set(deviceName, socket.id);
      console.log(`📡 Зареєстровано пристрій: ${deviceName}`);
    });

    // 🔹 Отримання даних від Arduino
    socket.on("sensor_data", async (data) => {
      try {
        if (!data || typeof data !== "object") return;

        // ⚠️ Поки що фіксований userId (для MVP)
        const userId = 1;

        const saved = await SensorService.createFromPayload(data, userId);

        socket.emit("ack", { message: `✅ Збережено ${saved.length} показників` });
        console.log(`✅ Збережено ${saved.length} показників через WebSocket`);
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
