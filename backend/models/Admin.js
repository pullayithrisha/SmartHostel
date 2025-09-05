import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  hostelId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  hostelName: { type: String, required: true },
  location: { type: String, required: true },
}, { timestamps: true });

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
