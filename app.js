// src/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js"; // ← якщо вже зробив
import sensorRoutes from "./routes/sensorRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(cors({
    origin: "http://localhost:3000", // або твій фронт
    credentials: true,               // дозволяє передавати кукі
  }));
app.use(express.json());
app.use(cookieParser());
app.use("/api/sensors", sensorRoutes);

// Роути
app.use("/api/auth", authRoutes);

// Тест
app.get("/", (req, res) => {
  res.send("🌱 Greenhouse API is running...");
});



export default app;
