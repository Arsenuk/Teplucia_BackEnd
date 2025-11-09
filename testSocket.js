// testSocket.js
import { io } from "socket.io-client";

const socket = io("wss://litigable-sage-nabobish.ngrok-free.dev", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("🟢 Підключено як тестовий Arduino:", socket.id);
  socket.emit("register_arduino");

  // симулюємо надсилання даних
  setInterval(() => {
    const fakeData = {
      DHT11: { temp: 23.5 },
      AHT20: { hum: 44.1 },
      BMP280: { press: 1012.5 },
      SOIL: { hum: 56.3 },
    };
    console.log("📤 Відправлено дані:", fakeData);
    socket.emit("sensor_data", fakeData);
  }, 5000);
});

socket.on("request_data", () => {
  console.log("📡 Отримано запит на оновлення!");
});

socket.on("ack", (msg) => console.log("✅ ACK:", msg));
socket.on("disconnect", () => console.log("🔴 Відключено"));
