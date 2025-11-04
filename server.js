// server.js
import dotenv from "dotenv";
import app from "./app.js";
import "./config/db.js"; // просто імпортує, щоб виконалось підключення

dotenv.config();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
