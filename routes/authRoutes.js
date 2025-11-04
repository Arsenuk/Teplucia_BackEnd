import express from "express";
import { register, login } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", verifyToken, (req, res) => {
    res.json({
      id: req.user.id,
      email: req.user.email
    });
  });

export default router;
