const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');
const {
  getNotices,
  createNotice,
  editNotice,
  deleteNotice
} = require('../controllers/noticeController');

// Ensure all notice routes require authentication
router.use(authMiddleware);

// Any authenticated and approved user (owner/student) can view notices
router.get('/', getNotices);

// Only owners can create, modify, or delete notices
router.post('/', allowRoles('owner'), createNotice);
router.put('/:id', allowRoles('owner'), editNotice);
router.delete('/:id', allowRoles('owner'), deleteNotice);

module.exports = router;
