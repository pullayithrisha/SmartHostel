const allowRoles = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Access denied. Not authenticated.' });
  }
  
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Access denied. Unauthorized role.' });
  }

  if (req.user.role === 'student' && !req.user.isApproved) {
    return res.status(403).json({ success: false, message: 'Your account is pending approval from the hostel owner. Please wait.' });
  }

  next();
};

module.exports = { allowRoles };
