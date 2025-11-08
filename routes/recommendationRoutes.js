import express from "express";
import { getRecommendations } from "../controllers/recommendationController.js";

const router = express.Router();

// Наприклад: GET /api/recommendations/1
router.get("/:plantId", getRecommendations);

export default router;
