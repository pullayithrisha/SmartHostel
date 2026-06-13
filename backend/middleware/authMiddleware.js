const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }

      req.user = {
        id: user._id.toString(),
        role: user.role,
        hostel: user.hostel ? user.hostel.toString() : null,
        isApproved: user.isApproved
      };

      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = authMiddleware;
