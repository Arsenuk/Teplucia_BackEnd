// server.js
import dotenv from "dotenv";
import http from "http";
import app from "./app.js";
import { initSocket } from "./services/socketService.js"; // ✅ ОНОВЛЕНО
import { Server } from "socket.io";

dotenv.config();

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// Ініціалізація Socket.IO з CORS
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      `https://${process.env.SERVER_HOST}` // ngrok-домен
    ],
    credentials: true
  }
});

// Ініціалізація WebSocket логіки
initSocket(io);

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
