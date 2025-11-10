// services/authService.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async register(username, email, password) {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) throw new Error("Email already exists");

    const hash = await bcrypt.hash(password, 10);
    await this.userRepository.create({ username, email, password: hash });
    return { message: "User registered successfully" };
  }

  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role // 🧩 додай це
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    

    return token;
  }
  static isAdmin(user) {
    return user?.role === "admin";
  }
  
}
