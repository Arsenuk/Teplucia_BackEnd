// middlewares/isAdmin.js
import { AuthService } from "../services/authService.js";

export const isAdmin = (req, res, next) => {
  if (!AuthService.isAdmin(req.user)) {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
};
