import express from "express";
import { SensorController } from "../controllers/sensorController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
const controller = new SensorController();

router.post("/", verifyToken, controller.createSensorData);
router.get("/", verifyToken, controller.getAllSensorData);
router.get("/latest", verifyToken, controller.getLatest);

export default router;
