import { io } from "socket.io-client";

console.log("🔌 Connecting to server...");

const socket = io("wss://litigable-sage-nabobish.ngrok-free.dev", {
  transports: ["websocket"],
  query: { token: "teplitsa_secret_2025" }
});

// коли успішно підключився
socket.on("connect", () => {
  console.log(`✅ Connected to server: ${socket.id}`);

  const payload = {
    DHT11: {
      temp: { value: 23.7, unit: "°C" }
    },
    SOIL: {
      hum: { value: 38.4, unit: "%" }
    }
  };

  console.log("📤 Sending payload:", payload);
  socket.emit("sensor_data", payload);
});

// якщо токен або адреса неправильні
socket.on("connect_error", (err) => {
  console.error("❌ Connection error:", err.message);
});

// якщо сервер недоступний або впав
socket.on("disconnect", () => {
  console.warn("🔴 Disconnected from server");
});

// відповідь від сервера
socket.on("ack", (msg) => {
  console.log("📩 Server ACK:", msg);
});
