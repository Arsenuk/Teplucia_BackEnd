import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import "./services/arduinoConnection.js";
import plantRoutes from "./routes/plantRoutes.js";


import authRoutes from "./routes/authRoutes.js";
import sensorRoutes from "./routes/sensorRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";

dotenv.config();

const app = express();

// дозволяємо доступ і з локального фронту, і з ngrok
app.use(cors({
  origin: [
    "http://localhost:5173",
    `https://${process.env.SERVER_HOST}`
  ],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// маршрути
app.use("/api/plants", plantRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("🌱 Greenhouse API is running (via ngrok tunnel)...");
});

export default app;
