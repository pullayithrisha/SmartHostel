import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";

dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// ✅ Admin Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, hostelName, location } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const hostelId = "HSTL-" + Math.floor(Math.random() * 100000);

    const admin = new Admin({ name, email, password: hashedPassword, hostelName, location, hostelId });
    await admin.save();

    res.json({ message: "Admin registered successfully", hostelId });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Admin Login
router.post("/login", async (req, res) => {
  try {
    const { hostelId, password } = req.body;

    const admin = await Admin.findOne({ hostelId }) || await Admin.findOne({ email: hostelId });
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id, role: "admin" }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
