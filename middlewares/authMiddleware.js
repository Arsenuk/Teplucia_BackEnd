// middlewares/AuthMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * 🧩 Патерн: Strategy
 * Дозволяє мати різні стратегії отримання токену (cookie, header, query).
 */
class TokenStrategy {
  getToken(req) {
    throw new Error("Method not implemented");
  }
}

class CookieTokenStrategy extends TokenStrategy {
  getToken(req) {
    return req.cookies.token;
  }
}

class HeaderTokenStrategy extends TokenStrategy {
  getToken(req) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7);
    }
    return null;
  }
}

/**
 * 🧩 Патерн: Dependency Injection
 * Ми можемо передавати будь-яку стратегію (cookie, header, etc.) у конструктор.
 */
class AuthMiddleware {
  constructor(tokenStrategy) {
    this.tokenStrategy = tokenStrategy;
  }

  verifyToken = (req, res, next) => {
    const token = this.tokenStrategy.getToken(req);

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token." });
      }

      req.user = user;
      next();
    });
  };
}

/**
 * Створюємо екземпляр middleware зі стратегією cookie.
 * Якщо захочеш — можна легко замінити на HeaderTokenStrategy.
 */
const authMiddleware = new AuthMiddleware(new CookieTokenStrategy());
export const verifyToken = authMiddleware.verifyToken;
