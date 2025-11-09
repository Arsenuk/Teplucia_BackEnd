import dotenv from "dotenv";
import http from "http";
import app from "./app.js";
import { initSocket } from "./controllers/socketController.js";
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

// Передаємо io в socketController
initSocket(io);

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
