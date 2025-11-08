import bcrypt from "bcryptjs";
import db from "./config/db.js";

const email = "admin2@gmail.com";
const password = "123456";
const name = "Admin2";
const role = "admin";

const run = async () => {
  const hashed = await bcrypt.hash(password, 10);
  await db.execute(
    `INSERT INTO users (name, email, password, role)
     VALUES (?, ?, ?, ?)`,
    [name, email, hashed, role]
  );
  console.log("✅ Admin created successfully");
};

run();
