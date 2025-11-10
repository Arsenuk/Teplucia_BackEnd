import dotenv from "dotenv";
import http from "http";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Створюємо звичайний HTTP сервер без Socket.IO
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🌐 Server running on http://localhost:${PORT}`);
});
