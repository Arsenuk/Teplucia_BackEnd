import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { PlantController } from "../controllers/plantController.js";

const router = express.Router();
const plantController = new PlantController(); // ✅ створюємо екземпляр

// 🌿 Отримати всі рослини (доступно тільки для адмінів)
router.get("/", verifyToken, isAdmin, plantController.getAll.bind(plantController));

// 🌱 Отримати всі рослини поточного користувача
router.get("/my", verifyToken, plantController.getAllByUser.bind(plantController));

// 🔗 Прив’язати сенсори до конкретної рослини
router.post("/:id/assign-sensors", verifyToken, plantController.assignSensorsToPlant.bind(plantController));

export default router;
