import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

export const AuthService = {
  async register(username, email, password) {
    const existing = await User.findByEmail(email);
    if (existing) throw new Error("Email already exists");

    const hash = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hash });
    return { message: "User registered successfully" };
  },

  async login(email, password) {
    const user = await User.findByEmail(email);
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return token;
  },
};
