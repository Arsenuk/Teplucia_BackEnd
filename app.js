// src/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import sensorRoutes from "./routes/sensorRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";

dotenv.config();

const app = express();

// Дозвіл CORS для фронту
app.use(cors({
  origin: "http://localhost:5173", // або "*", якщо треба дозволити
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/recommendations", recommendationRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("🌱 Greenhouse API is running...");
});

export default app;
