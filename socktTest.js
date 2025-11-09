import { io } from "socket.io-client";

const socket = io("ws://localhost:3000", {
  transports: ["websocket"]
});

socket.on("connect", () => {
  console.log("✅ Connected to server:", socket.id);

  // надсилаємо тестові дані
  socket.emit("sensor_data", { temp: 23.5, hum: 45 });
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected");
});

socket.on("connect_error", (err) => {
  console.error("⚠️ Connection error:", err.message);
});
