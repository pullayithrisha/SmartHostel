const User = require('../models/User');
const Room = require('../models/Room');
const Payment = require('../models/Payment');
const Complaint = require('../models/Complaint');
const Notice = require('../models/Notice');
const bcrypt = require('bcryptjs');

const validatePassword = (password) => {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return password.length >= minLength && hasUppercase && hasNumber;
};

exports.getDashboard = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const student = await User.findById(studentId).populate('room');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    const roomDetails = student.room || null;

    const nextPayment = await Payment.findOne({
      student: studentId,
      status: { $in: ['pending', 'overdue'] }
    }).sort({ dueDate: 1 });

    const openComplaints = await Complaint.countDocuments({
      student: studentId,
      status: { $in: ['pending', 'in-progress'] }
    });

    const recentNotices = await Notice.find({ hostel: req.user.hostel })
      .sort({ createdAt: -1 })
      .limit(3);

    return res.json({
      success: true,
      data: {
        roomDetails,
        nextPayment,
        openComplaints,
        recentNotices
      }
    });

  } catch (error) {
    next(error);
  }
};

exports.getAvailableRooms = async (req, res, next) => {
  try {
    const filter = {
      hostel: req.user.hostel,
      status: 'available'
    };

    if (req.query.type) {
      filter.type = req.query.type;
    }
    if (req.query.floor) {
      filter.floor = Number(req.query.floor);
    }
    if (req.query.maxRent) {
      filter.rent = { $lte: Number(req.query.maxRent) };
    }

    const rooms = await Room.find(filter);
    return res.json({ success: true, data: rooms });

  } catch (error) {
    next(error);
  }
};

exports.requestRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const studentId = req.user.id;

    const student = await User.findById(studentId);
    if (student.room) {
      return res.status(400).json({ success: false, message: 'You already have a room assigned.' });
    }

    const room = await Room.findById(roomId);
    if (!room || room.status !== 'available') {
      return res.status(400).json({ success: false, message: 'Room is not available.' });
    }

    // Create a notice/request indicating room requested
    const notice = new Notice({
      title: `Room Request: Room ${room.roomNumber}`,
      body: `Student ${student.name} (${student.email}) has requested Room ${room.roomNumber} (${room.type} sharing on Floor ${room.floor}).`,
      hostel: req.user.hostel,
      postedBy: studentId
    });

    await notice.save();
    return res.json({ success: true, message: 'Room request sent to owner.' });

  } catch (error) {
    next(error);
  }
};

exports.getPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ student: req.user.id })
      .populate('room', 'roomNumber')
      .sort({ dueDate: -1 });

    return res.json({ success: true, data: payments });
  } catch (error) {
    next(error);
  }
};

exports.getComplaints = async (req, res, next) => {
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

exports.getProfile = async (req, res, next) => {
  try {
    const student = await User.findById(req.user.id)
      .populate('room')
      .populate('hostel', 'name hostelId address')
      .select('-password');

    return res.json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, emergencyContact } = req.body;
    const student = await User.findById(req.user.id);

    if (name) student.name = name;
    if (phone) student.phone = phone;
    if (emergencyContact !== undefined) student.emergencyContact = emergencyContact;

    await student.save();
    
    // Return updated profile details
    const updated = await User.findById(req.user.id)
      .populate('room')
      .populate('hostel', 'name hostelId address')
      .select('-password');

    return res.json({ success: true, message: 'Profile updated successfully.', data: updated });
  } catch (error) {
    next(error);
  }
};

exports.uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a photo file.' });
    }

    const student = await User.findById(req.user.id);
    student.profilePhoto = req.file.filename;
    await student.save();

    return res.json({
      success: true,
      message: 'Profile photo uploaded successfully.',
      filename: req.file.filename
    });

  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide both current and new passwords.' });
    }

    if (!validatePassword(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long, contain at least one uppercase letter, and one number.'
      });
    }

    const student = await User.findById(req.user.id).select('+password');
    const isMatch = await student.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password.' });
    }

    student.password = newPassword;
    await student.save();

    return res.json({ success: true, message: 'Password updated successfully.' });

  } catch (error) {
    next(error);
  }
};
