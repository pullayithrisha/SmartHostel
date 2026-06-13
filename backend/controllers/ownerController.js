const Hostel = require('../models/Hostel');
const User = require('../models/User');
const Room = require('../models/Room');
const Payment = require('../models/Payment');
const Complaint = require('../models/Complaint');
const sendEmail = require('../utils/sendEmail');

exports.getDashboard = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const hostel = await Hostel.findOne({ owner: ownerId });
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found.' });
    }

    const totalRooms = await Room.countDocuments({ hostel: hostel._id });
    const occupied = await Room.countDocuments({ hostel: hostel._id, status: 'occupied' });
    const available = await Room.countDocuments({ hostel: hostel._id, status: 'available' });
    const maintenance = await Room.countDocuments({ hostel: hostel._id, status: 'maintenance' });

    const pendingPayments = await Payment.countDocuments({ hostel: hostel._id, status: 'pending' });
    const overduePayments = await Payment.countDocuments({ hostel: hostel._id, status: 'overdue' });

    const openComplaints = await Complaint.countDocuments({
      hostel: hostel._id,
      status: { $in: ['pending', 'in-progress'] }
    });

    const totalStudents = await User.countDocuments({ hostel: hostel._id, role: 'student', isApproved: true });
    const pendingApprovals = await User.countDocuments({ hostel: hostel._id, role: 'student', isApproved: false });

    return res.json({
      success: true,
      data: {
        totalRooms,
        occupied,
        available,
        maintenance,
        pendingPayments,
        overduePayments,
        openComplaints,
        totalStudents,
        pendingApprovals
      }
    });

  } catch (error) {
    next(error);
  }
};

exports.getHostel = async (req, res, next) => {
  try {
    const hostel = await Hostel.findOne({ owner: req.user.id });
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found.' });
    }
    return res.json({ success: true, data: hostel });
  } catch (error) {
    next(error);
  }
};

exports.updateHostel = async (req, res, next) => {
  try {
    const { name, address } = req.body;
    const hostel = await Hostel.findOne({ owner: req.user.id });
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found.' });
    }

    if (name) hostel.name = name;
    if (address) hostel.address = address;

    await hostel.save();
    return res.json({ success: true, message: 'Hostel updated successfully.', data: hostel });
  } catch (error) {
    next(error);
  }
};

exports.getRooms = async (req, res, next) => {
  try {
    const hostel = await Hostel.findOne({ owner: req.user.id });
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found.' });
    }

    const rooms = await Room.find({ hostel: hostel._id }).populate('occupants', 'name email phone');
    return res.json({ success: true, data: rooms });
  } catch (error) {
    next(error);
  }
};

exports.createRoom = async (req, res, next) => {
  try {
    const { roomNumber, type, floor, rent, amenities } = req.body;
    
    if (!roomNumber || !type || !floor || !rent) {
      return res.status(400).json({ success: false, message: 'Please provide roomNumber, type, floor and rent.' });
    }

    const hostel = await Hostel.findOne({ owner: req.user.id });
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found.' });
    }

    // Check if roomNumber already exists in this hostel
    const roomExists = await Room.findOne({ hostel: hostel._id, roomNumber });
    if (roomExists) {
      return res.status(400).json({ success: false, message: 'Room number already exists in this hostel.' });
    }

    const room = new Room({
      roomNumber,
      type,
      floor,
      rent,
      amenities: amenities || [],
      hostel: hostel._id
    });

    await room.save();

    hostel.totalRooms += 1;
    await hostel.save();

    return res.status(201).json({ success: true, message: 'Room created successfully.', data: room });
  } catch (error) {
    next(error);
  }
};

exports.updateRoom = async (req, res, next) => {
  try {
    const { roomNumber, type, floor, rent, amenities, status } = req.body;
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found.' });
    }

    if (roomNumber) room.roomNumber = roomNumber;
    if (type) room.type = type;
    if (floor) room.floor = floor;
    if (rent) room.rent = rent;
    if (amenities) room.amenities = amenities;
    if (status) {
      // If status is changed to available, make sure occupants are removed
      if (status === 'available' || status === 'maintenance') {
        if (room.occupants && room.occupants.length > 0) {
          await User.updateMany({ _id: { $in: room.occupants } }, { room: null });
          room.occupants = [];
        }
      }
      room.status = status;
    }

    await room.save();
    return res.json({ success: true, message: 'Room updated successfully.', data: room });
  } catch (error) {
    next(error);
  }
};

exports.deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found.' });
    }

    if (room.status !== 'available') {
      return res.status(400).json({ success: false, message: 'Cannot delete an occupied or maintenance room.' });
    }

    await Room.findByIdAndDelete(req.params.id);

    const hostel = await Hostel.findById(room.hostel);
    if (hostel) {
      hostel.totalRooms = Math.max(0, hostel.totalRooms - 1);
      await hostel.save();
    }

    return res.json({ success: true, message: 'Room deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

exports.getStudents = async (req, res, next) => {
  try {
    const hostel = await Hostel.findOne({ owner: req.user.id });
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found.' });
    }

    const students = await User.find({ hostel: hostel._id, role: 'student' })
      .populate('room', 'roomNumber type floor rent')
      .select('-password');

    const pending = students.filter(s => !s.isApproved);
    const approved = students.filter(s => s.isApproved);

    return res.json({
      success: true,
      data: {
        pending,
        approved
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.approveStudent = async (req, res, next) => {
  try {
    const { roomId } = req.body;
    const student = await User.findById(req.params.id).populate('hostel');
    if (!student || student.role !== 'student') {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    if (roomId) {
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ success: false, message: 'Room not found.' });
      }
      let capacity = room.type === 'triple' ? 3 : (room.type === 'double' ? 2 : 1);
      if (room.status === 'maintenance' || room.occupants.length >= capacity) {
        return res.status(400).json({ success: false, message: 'Room is not available or fully occupied.' });
      }

      // Assign student to room
      room.occupants.push(student._id);
      if (room.occupants.length >= capacity) room.status = 'occupied';
      else room.status = 'available';
      await room.save();

      student.room = room._id;
    }

    student.isApproved = true;
    await student.save();

    try {
      await sendEmail({
        to: student.email,
        subject: 'Account Approved — Welcome to SmartHostel',
        html: `
          <h3>Dear ${student.name},</h3>
          <p>Great news! Your account for <strong>${student.hostel.name}</strong> has been approved by the owner.</p>
          <p>You can now log in at: <a href="http://localhost:3000/login">http://localhost:3000/login</a></p>
          <p>Regards,<br>SmartHostel Team</p>
        `
      });
    } catch (err) {
      // Ignore mail transport errors
    }

    return res.json({ success: true, message: roomId ? 'Student approved and room assigned successfully.' : 'Student approved successfully.' });
  } catch (error) {
    next(error);
  }
};

exports.rejectStudent = async (req, res, next) => {
  try {
    const student = await User.findById(req.params.id).populate('hostel');
    if (!student || student.role !== 'student') {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    const email = student.email;
    const name = student.name;
    const hostelName = student.hostel.name;

    await User.findByIdAndDelete(req.params.id);

    try {
      await sendEmail({
        to: email,
        subject: 'Registration Update — SmartHostel',
        html: `
          <h3>Dear ${name},</h3>
          <p>Unfortunately, your registration for <strong>${hostelName}</strong> has not been approved.</p>
          <p>Please contact your hostel owner for more information.</p>
          <p>Regards,<br>SmartHostel Team</p>
        `
      });
    } catch (err) {
      // Ignore mail transport errors
    }

    return res.json({ success: true, message: 'Student rejected and record deleted.' });
  } catch (error) {
    next(error);
  }
};

exports.assignRoom = async (req, res, next) => {
  try {
    const { roomId } = req.body;
    const studentId = req.params.id;

    if (!roomId) {
      return res.status(400).json({ success: false, message: 'Room ID is required.' });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found.' });
    }

    let capacity = room.type === 'triple' ? 3 : (room.type === 'double' ? 2 : 1);
    if (room.status === 'maintenance' || room.occupants.length >= capacity) {
      return res.status(400).json({ success: false, message: 'Room is not available (fully occupied or in maintenance).' });
    }

    // Free student's previous room if they had one
    if (student.room) {
      const prevRoom = await Room.findById(student.room);
      if (prevRoom) {
        prevRoom.occupants = prevRoom.occupants.filter(id => id.toString() !== student._id.toString());
        prevRoom.status = 'available';
        await prevRoom.save();
      }
    }

    // Set new room details
    room.occupants.push(student._id);
    if (room.occupants.length >= capacity) room.status = 'occupied';
    else room.status = 'available';
    await room.save();

    student.room = room._id;
    await student.save();

    return res.json({ success: true, message: 'Room assigned successfully.', data: { student, room } });
  } catch (error) {
    next(error);
  }
};

exports.removeRoom = async (req, res, next) => {
  try {
    const studentId = req.params.id;
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    if (!student.room) {
      return res.status(400).json({ success: false, message: 'Student is not assigned to any room.' });
    }

    const room = await Room.findById(student.room);
    if (room) {
      room.occupants = room.occupants.filter(id => id.toString() !== student._id.toString());
      room.status = 'available';
      await room.save();
    }

    student.room = null;
    await student.save();

    return res.json({ success: true, message: 'Room assignment removed successfully.' });
  } catch (error) {
    next(error);
  }
};

exports.getPayments = async (req, res, next) => {
  try {
    const hostel = await Hostel.findOne({ owner: req.user.id });
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found.' });
    }

    const query = { hostel: hostel._id };
    if (req.query.status) {
      query.status = req.query.status;
    }

    const payments = await Payment.find(query)
      .populate('student', 'name email phone')
      .populate('room', 'roomNumber');

    return res.json({ success: true, data: payments });
  } catch (error) {
    next(error);
  }
};

exports.createPayment = async (req, res, next) => {
  try {
    const { studentId, month, amount, dueDate } = req.body;
    if (!studentId || !month || !amount || !dueDate) {
      return res.status(400).json({ success: false, message: 'Please provide studentId, month, amount and dueDate.' });
    }

    const hostel = await Hostel.findOne({ owner: req.user.id });
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found.' });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== 'student' || !student.isApproved) {
      return res.status(400).json({ success: false, message: 'Invalid or unapproved student.' });
    }

    const payment = new Payment({
      student: student._id,
      room: student.room || null,
      hostel: hostel._id,
      amount,
      month,
      dueDate,
      status: 'pending',
      markedBy: req.user.id
    });

    await payment.save();
    return res.status(201).json({ success: true, message: 'Payment record created successfully.', data: payment });
  } catch (error) {
    next(error);
  }
};

exports.updatePayment = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found.' });
    }

    if (status) {
      payment.status = status;
      if (status === 'paid') {
        payment.paidOn = Date.now();
      } else {
        payment.paidOn = null;
      }
    }
    if (note !== undefined) {
      payment.note = note;
    }
    payment.markedBy = req.user.id;

    await payment.save();
    return res.json({ success: true, message: 'Payment record updated successfully.', data: payment });
  } catch (error) {
    next(error);
  }
};

exports.getComplaints = async (req, res, next) => {
  try {
    const hostel = await Hostel.findOne({ owner: req.user.id });
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found.' });
    }

    const query = { hostel: hostel._id };
    if (req.query.status) {
      query.status = req.query.status;
    }

    const complaints = await Complaint.find(query)
      .populate('student', 'name email phone')
      .populate('room', 'roomNumber');

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

exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    if (student.room) {
      const room = await Room.findById(student.room);
      if (room) {
        room.occupants = room.occupants.filter(id => id.toString() !== student._id.toString());
        room.status = 'available';
        await room.save();
      }
    }

    await User.findByIdAndDelete(req.params.id);

    return res.json({ success: true, message: 'Student deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
