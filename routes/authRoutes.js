import express from "express";
import { register, login, logout} from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { UserRepository } from "../models/userModel.js";
import db from "../config/db.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);  // Додаємо logout

const userModel = new UserRepository();

router.get("/me", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, username, email, role FROM users WHERE id = ?",
      [req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Помилка /me:", error);
    res.status(500).json({ message: "Server error" });
  }
});




export default router;
