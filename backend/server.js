import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());

// ✅ Allow React frontend (http://localhost:3000)
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Routes
app.use("/admin", adminRoutes);

// DB + Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
