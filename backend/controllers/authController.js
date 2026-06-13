const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Hostel = require('../models/Hostel');
const generateHostelId = require('../utils/generateHostelId');
const sendEmail = require('../utils/sendEmail');

const validatePassword = (password) => {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return password.length >= minLength && hasUppercase && hasNumber;
};

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const generateToken = (id, role, hostel, isApproved) => {
  return jwt.sign(
    { id, role, hostel, isApproved },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, hostelName, hostelAddress, hostelId } = req.body;

    if (!name || !email || !password || !phone || !role) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long, contain at least one uppercase letter, and one number.'
      });
    }

    // Check if email already registered
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already exists.' });
    }

    if (role === 'owner') {
      if (!hostelName || !hostelAddress) {
        return res.status(400).json({ success: false, message: 'Hostel name and address are required for owners.' });
      }

      // Create owner user
      const user = new User({
        name,
        email,
        password,
        phone,
        role: 'owner',
        isApproved: true
      });

      const generatedId = await generateHostelId();
      const hostel = new Hostel({
        hostelId: generatedId,
        name: hostelName,
        address: hostelAddress,
        owner: user._id
      });

      user.hostel = hostel._id;
      
      await hostel.save();
      await user.save();

      // Send Welcome Email
      try {
        await sendEmail({
          to: user.email,
          subject: 'Welcome to SmartHostel — Your Hostel ID',
          html: `
            <h3>Dear ${user.name},</h3>
            <p>Your hostel "<strong>${hostel.name}</strong>" has been registered successfully on SmartHostel.</p>
            <div style="background-color: #F3F4F6; border: 1px dashed #534AB7; padding: 16px; text-align: center; margin: 20px 0; border-radius: 8px;">
              <span style="font-size: 20px; font-weight: bold; color: #534AB7; letter-spacing: 2px;">${hostel.hostelId}</span>
            </div>
            <p>Share this ID with your students so they can register and join your hostel.</p>
            <p>Keep this ID safe. It identifies your hostel on the platform.</p>
            <p>Regards,<br>SmartHostel Team</p>
          `
        });
      } catch (err) {
        // Log locally or handle transport error silently to not block registration
      }

      const token = generateToken(user._id, user.role, user.hostel, user.isApproved);
      return res.status(201).json({
        success: true,
        message: 'Owner registration successful.',
        token,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          hostel: user.hostel,
          isApproved: user.isApproved
        }
      });

    } else if (role === 'student') {
      if (!hostelId) {
        return res.status(400).json({ success: false, message: 'Hostel ID is required for students.' });
      }

      const foundHostel = await Hostel.findOne({ hostelId }).populate('owner');
      if (!foundHostel) {
        return res.status(400).json({ success: false, message: 'Invalid Hostel ID. Please check with your hostel owner.' });
      }

      const user = new User({
        name,
        email,
        password,
        phone,
        role: 'student',
        hostel: foundHostel._id,
        isApproved: false
      });

      await user.save();

      // Send email to owner of that hostel
      if (foundHostel.owner) {
        try {
          await sendEmail({
            to: foundHostel.owner.email,
            subject: 'New Student Registration — Approval Required',
            html: `
              <h3>Dear ${foundHostel.owner.name},</h3>
              <p>A new student has registered to join <strong>${foundHostel.name}</strong>:</p>
              <ul>
                <li><strong>Name:</strong> ${user.name}</li>
                <li><strong>Email:</strong> ${user.email}</li>
                <li><strong>Phone:</strong> ${user.phone}</li>
              </ul>
              <p>Please log in to SmartHostel and approve or reject this student from the Students section.</p>
              <p>Regards,<br>SmartHostel Team</p>
            `
          });
        } catch (err) {
          // ignore mail error
        }
      }

      // Send email to student
      try {
        await sendEmail({
          to: user.email,
          subject: 'Registration Received — Awaiting Approval',
          html: `
            <h3>Dear ${user.name},</h3>
            <p>Your registration for <strong>${foundHostel.name}</strong> has been received.</p>
            <p>Your account is currently pending approval from the hostel owner. You will be able to log in once approved.</p>
            <p>Regards,<br>SmartHostel Team</p>
          `
        });
      } catch (err) {
        // ignore mail error
      }

      return res.status(201).json({
        success: true,
        message: 'Registration successful. Please wait for owner approval before logging in.'
      });

    } else {
      return res.status(400).json({ success: false, message: 'Invalid role.' });
    }

  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Please provide email, password and role.' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || user.role !== role) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    if (!user.isApproved) {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending approval from the hostel owner. Please wait.'
      });
    }

    const token = generateToken(user._id, user.role, user.hostel, user.isApproved);
    
    return res.json({
      success: true,
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        hostel: user.hostel,
        isApproved: user.isApproved
      }
    });

  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No user registered with this email.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);

    user.resetOTP = hashedOTP;
    user.resetOTPExpiry = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    try {
      await sendEmail({
        to: user.email,
        subject: 'SmartHostel — Reset Password OTP',
        html: `
          <h3>Dear ${user.name},</h3>
          <p>You requested a password reset. Use the following 6-digit OTP code to proceed:</p>
          <div style="background-color: #F3F4F6; border: 1px dashed #534AB7; padding: 16px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <span style="font-size: 24px; font-weight: bold; color: #534AB7; letter-spacing: 4px;">${otp}</span>
          </div>
          <p>This OTP will expire in 15 minutes. If you did not request this, please ignore this email.</p>
          <p>Regards,<br>SmartHostel Team</p>
        `
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Error sending email. Please try again.' });
    }

    return res.json({ success: true, message: 'OTP code sent to email.' });

  } catch (error) {
    next(error);
  }
};

exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Please provide email and OTP.' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.resetOTP || Date.now() > user.resetOTPExpiry) {
      return res.status(400).json({ success: false, message: 'OTP has expired or is invalid.' });
    }

    const isMatch = await bcrypt.compare(otp, user.resetOTP);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }

    // Generate brief single-use token for reset
    const tempToken = jwt.sign(
      { id: user._id, isTemp: true },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    return res.json({
      success: true,
      message: 'OTP verified successfully.',
      tempToken
    });

  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { tempToken, password } = req.body;
    if (!tempToken || !password) {
      return res.status(400).json({ success: false, message: 'Token and new password are required.' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long, contain at least one uppercase letter, and one number.'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ success: false, message: 'Reset session expired. Request a new OTP.' });
    }

    if (!decoded.isTemp) {
      return res.status(400).json({ success: false, message: 'Invalid authorization token.' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.password = password;
    user.resetOTP = null;
    user.resetOTPExpiry = null;
    await user.save();

    return res.json({ success: true, message: 'Password reset successful. You can now login.' });

  } catch (error) {
    next(error);
  }
};
