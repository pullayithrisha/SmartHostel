const Complaint = require('../models/Complaint');
const User = require('../models/User');

exports.getStudentComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ student: req.user.id })
      .populate('room', 'roomNumber')
      .sort({ createdAt: -1 });
    return res.json({ success: true, data: complaints });
  } catch (error) {
    next(error);
  }
};

exports.raiseComplaint = async (req, res, next) => {
  try {
    const { category, description } = req.body;
    if (!category || !description) {
      return res.status(400).json({ success: false, message: 'Please provide category and description.' });
    }

    const student = await User.findById(req.user.id);
    const complaint = new Complaint({
      student: req.user.id,
      room: student.room || null,
      hostel: req.user.hostel,
      category,
      description
    });

    await complaint.save();
    return res.status(201).json({ success: true, message: 'Complaint raised successfully.', data: complaint });
  } catch (error) {
    next(error);
  }
};

exports.getOwnerComplaints = async (req, res, next) => {
  try {
    const query = { hostel: req.user.hostel };
    if (req.query.status) {
      query.status = req.query.status;
    }
    const complaints = await Complaint.find(query)
      .populate('student', 'name email phone')
      .populate('room', 'roomNumber')
      .sort({ createdAt: -1 });
    return res.json({ success: true, data: complaints });
  } catch (error) {
    next(error);
  }
};

exports.updateComplaint = async (req, res, next) => {
  try {
    const { status, ownerNote } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    if (status) complaint.status = status;
    if (ownerNote !== undefined) complaint.ownerNote = ownerNote;

    await complaint.save();
    return res.json({ success: true, message: 'Complaint updated successfully.', data: complaint });
  } catch (error) {
    next(error);
  }
};
