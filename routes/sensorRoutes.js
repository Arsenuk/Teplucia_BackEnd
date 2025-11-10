import express from "express";
import { SensorController } from "../controllers/sensorController.js";
import { verifyToken } from "../middlewares/authMiddleware.js"; // ✅ ось цього не вистачало

const router = express.Router();

router.post("/", verifyToken,SensorController.createSensorData);
router.get("/", verifyToken,SensorController.getAllSensorData);
router.get("/latest", verifyToken, SensorController.getLatest);


export default router;
