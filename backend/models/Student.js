import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roomNumber: { type: String, required: true },
  hostelId: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  parentNames: { type: String, required: true },
  parentPhone: { type: String, required: true }
});

const Student = mongoose.model("Student", StudentSchema);
export default Student;   // ✅ ESM export
