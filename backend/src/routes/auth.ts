import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Pool } from "pg";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const router = Router();
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:XkSSGOybkcMWgXTXqoefPKPzzozBrsOn@metro.proxy.rlwy.net:46631/railway";

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 🔑 Secret for JWT (use env variable later)
const JWT_SECRET = "supersecretkey";

// ------------------- SIGNUP -------------------
router.post("/signup", async (req, res) => {
  try {
    console.log('📝 Signup request received:', req.body);
    const { name, email, password, role } = req.body;

    // check if user already exists
    const userCheck = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (userCheck.rows.length > 0) {
      console.log('⚠️ User already exists:', email);
      return res.status(400).json({ error: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert user
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4) RETURNING id, name, email, role",
      [name, email, hashedPassword, role || "citizen"]
    );

    console.log('✅ User registered successfully:', newUser.rows[0]);
    res.status(201).json({ message: "User registered successfully", user: newUser.rows[0] });
  } catch (err) {
    console.error('❌ Signup error:', err);
    res.status(500).json({ error: "Server error" });
  }
});

// ------------------- LOGIN -------------------
router.post("/login", async (req, res) => {
  try {
    console.log('🔐 Login request received:', req.body);
    const { email, password } = req.body;

    // find user
    const userCheck = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (userCheck.rows.length === 0) {
      console.log('⚠️ User not found:', email);
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const user = userCheck.rows[0];
    console.log('👤 User found:', user.email);

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('⚠️ Password mismatch for:', email);
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // create token
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log('✅ Login successful for:', email);
    res.json({ message: "Login successful", token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
