import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("✅ Connected to server:", socket.id);

  socket.emit("sensor_data", {
    dht11: { property: "temp", value: 23.5 },
  });
});

socket.on("ack", (msg) => {
  console.log("📩 Server ACK:", msg);
});

socket.on("disconnect", (reason) => {
  console.log("❌ Disconnected:", reason);
});
