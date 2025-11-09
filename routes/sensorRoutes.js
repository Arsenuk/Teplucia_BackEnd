import express from "express";
import { SensorController } from "../controllers/sensorController.js";

const router = express.Router();

router.post("/", SensorController.createSensorData);
router.get("/", SensorController.getAllSensorData);
router.get("/latest", SensorController.getLatest);

export default router;
