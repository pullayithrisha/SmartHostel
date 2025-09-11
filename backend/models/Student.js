const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roomNumber: { type: Number, required: true },
  hostelId: { type: Number, required: true },
  address: { type: String, required: true },
  phone: { type: Number, required: true },
  parentNames: { type: String, required: true },
  parentPhone: { type: String, required: true }
});

const Student = mongoose.model("Student", StudentSchema);
module.exports = Student;
