import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getRecommendations } from "../controllers/recommendationController.js";

const router = express.Router();

router.get("/", verifyToken, getRecommendations);

export default router;
