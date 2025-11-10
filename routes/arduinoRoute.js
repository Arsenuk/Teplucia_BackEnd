// routes/arduinoRoute.js
import express from "express";
import dotenv from "dotenv";
import { ArduinoController } from "../controllers/ArduinoController.js";

dotenv.config();
const router = express.Router();
const controller = new ArduinoController();

// Middleware перевірки API ключа
const verifyApiKey = (req, res, next) => {
  const key = req.headers["x-device-key"];
  if (!key || key !== process.env.API_KEY) {
    return res.status(401).json({ message: "Access denied: invalid API key" });
  }
  next();
};

router.post("/", verifyApiKey, (req, res) => controller.receiveData(req, res));

export default router;
