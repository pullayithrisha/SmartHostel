const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');
const {
  getDashboard,
  getAvailableRooms,
  requestRoom,
  getPayments,
  getComplaints,
  raiseComplaint,
  getProfile,
  updateProfile,
  uploadPhoto,
  changePassword
} = require('../controllers/studentController');

// Multer storage configuration
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only JPEG, JPG, and PNG image files are allowed.'));
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// All student routes require authentication and student role check
router.use(authMiddleware);
router.use(allowRoles('student'));

router.get('/dashboard', getDashboard);
router.get('/rooms/available', getAvailableRooms);
router.post('/rooms/request/:roomId', requestRoom);

router.get('/payments', getPayments);
router.get('/complaints', getComplaints);
router.post('/complaints', raiseComplaint);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/profile/photo', upload.single('photo'), uploadPhoto);
router.put('/change-password', changePassword);

module.exports = router;
