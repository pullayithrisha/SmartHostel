import express from "express";
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// ✅ Register route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, hostelName, location } = req.body;

    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Generate hostelId
    const hostelId = "HST-" + uuidv4().slice(0, 8);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const newAdmin = new Admin({
      hostelId,
      name,
      email,
      password: hashedPassword,
      hostelName,
      location,
    });

    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully", hostelId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
