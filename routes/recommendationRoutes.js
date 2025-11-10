// routes/recommendationRoutes.js
import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { RecommendationController } from "../controllers/recommendationController.js";

const router = express.Router();
const controller = new RecommendationController();

router.get("/", verifyToken, controller.getRecommendations);

export default router;
