const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');
const {
  getDashboard,
  getHostel,
  updateHostel,
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  getStudents,
  approveStudent,
  rejectStudent,
  assignRoom,
  removeRoom,
  getPayments,
  createPayment,
  updatePayment,
  getComplaints,
  updateComplaint,
  deleteStudent
} = require('../controllers/ownerController');

// All owner routes require authentication and owner role check
router.use(authMiddleware);
router.use(allowRoles('owner'));

router.get('/dashboard', getDashboard);
router.get('/hostel', getHostel);
router.put('/hostel', updateHostel);

router.get('/rooms', getRooms);
router.post('/rooms', createRoom);
router.put('/rooms/:id', updateRoom);
router.delete('/rooms/:id', deleteRoom);

router.get('/students', getStudents);
router.put('/students/:id/approve', approveStudent);
router.delete('/students/:id/reject', rejectStudent);
router.put('/students/:id/assign-room', assignRoom);
router.put('/students/:id/remove-room', removeRoom);
router.delete('/students/:id', deleteStudent);

router.get('/payments', getPayments);
router.post('/payments', createPayment);
router.put('/payments/:id', updatePayment);

router.get('/complaints', getComplaints);
router.put('/complaints/:id', updateComplaint);

module.exports = router;
