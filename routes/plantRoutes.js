import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { PlantController } from "../controllers/plantController.js";

const router = express.Router();

// 🌿 Отримати всі рослини (усіх користувачів — тільки для тестів / адмінки)
router.get("/", PlantController.getAll);

// 🌱 Отримати всі рослини поточного користувача
router.get("/my", verifyToken, PlantController.getAllByUser);

// 🔗 Прив’язати сенсори до конкретної рослини
router.post("/:id/assign-sensors", verifyToken, PlantController.assignSensorsToPlant);

export default router;
