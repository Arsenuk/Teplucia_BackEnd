import { io as Client } from "socket.io-client";
import { connectedDevices } from "./socketService.js";
import dotenv from "dotenv";

dotenv.config();

let arduinoSocket;

// 🔌 Функція для підключення до Arduino через ngrok
export const connectArduino = () => {
  const ARDUINO_URL = process.env.ARDUINO_URL; // наприклад "wss://your-ngrok-url.ngrok-free.app"
  const DEVICE_NAME = process.env.ARDUINO_NAME || "Greenhouse_01";

  console.log(`🔗 Підключення до Arduino (${DEVICE_NAME}) за адресою ${ARDUINO_URL}...`);

  arduinoSocket = Client(ARDUINO_URL, {
    transports: ["websocket"],
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
  });

  arduinoSocket.on("connect", () => {
    console.log("🟢 Arduino підключено!");
    arduinoSocket.emit("register_device", DEVICE_NAME);
  });

  arduinoSocket.on("disconnect", () => {
    console.log("🔴 Arduino відключено");
  });

  // Отримує дані з Arduino
  arduinoSocket.on("sensor_data", (data) => {
    console.log("📥 Дані від Arduino:", data);
  });

  // 🔄 Відповідь на refresh (для тесту)
  arduinoSocket.on("refresh_sensors", () => {
    console.log("🔁 Arduino отримало команду refresh_sensors");
  });

  return arduinoSocket;
};

// 💥 Надіслати команду оновлення
export const refreshArduino = (deviceName) => {
  if (!arduinoSocket || !arduinoSocket.connected) {
    console.warn("⚠️ Arduino не підключено");
    return;
  }

  arduinoSocket.emit("manual_refresh", deviceName);
  console.log(`📤 Надіслано команду оновлення для ${deviceName}`);
};
