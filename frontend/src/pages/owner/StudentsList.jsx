import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchStudents,
  approveStudent,
  rejectStudent,
  assignRoom,
  removeRoom,
  fetchRooms,
  selectRoom,
  deleteStudent
} from '../../store/roomSlice';
import api from '../../api/axios';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import { Check, X, ShieldAlert, User, ChevronDown, ChevronUp, Loader2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const StudentsList = () => {
  const dispatch = useDispatch();
  const { students, data: rooms, loading } = useSelector(selectRoom);

  // UI Tabs
  const [activeTab, setActiveTab] = useState('active'); // 'pending' or 'active'

  // Modal control
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

  // Focus targets
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [approveRoomId, setApproveRoomId] = useState('');
  
  // Local cache for detail modal checks
  const [studentPayments, setStudentPayments] = useState([]);
  const [studentComplaints, setStudentComplaints] = useState([]);
  const [allPayments, setAllPayments] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]);
  const [showDropdownId, setShowDropdownId] = useState(null);
  const [expandedStudentId, setExpandedStudentId] = useState(null);

  const toggleStudentExpand = (id) => {
    setExpandedStudentId(prev => prev === id ? null : id);
  };

  const loadStudentDetails = async (studentId) => {
    try {
      const [paymentsRes, complaintsRes] = await Promise.all([
        api.get('/owner/payments'),
        api.get('/owner/complaints')
      ]);
      setAllPayments(paymentsRes.data.data);
      setAllComplaints(complaintsRes.data.data);
    } catch (err) {
      // ignore silently
    }
  };

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchRooms());
    loadStudentDetails();
  }, [dispatch]);

  const handleApprove = (id, roomId) => {
    dispatch(approveStudent({ id, roomId }))
      .unwrap()
      .then((res) => {
        toast.success(res.message || 'Student approved successfully.');
        dispatch(fetchStudents());
        dispatch(fetchRooms());
      })
      .catch((err) => toast.error(err));
  };

  const handleOpenApproveModal = (student) => {
    setSelectedStudent(student);
    setApproveRoomId('');
    setIsApproveModalOpen(true);
  };

  const handleApproveSubmit = (e) => {
    e.preventDefault();
    handleApprove(selectedStudent._id, approveRoomId || null);
    setIsApproveModalOpen(false);
  };

  const handleReject = (id) => {
    if (window.confirm('Are you sure you want to reject and delete this registration?')) {
      dispatch(rejectStudent(id))
        .unwrap()
        .then((res) => {
          toast.success(res.message || 'Registration rejected.');
          dispatch(fetchStudents());
        })
        .catch((err) => toast.error(err));
    }
  };

  const handleDeleteActiveStudent = (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.name}? This will free up their room if assigned.`)) {
      dispatch(deleteStudent(student._id))
        .unwrap()
        .then((res) => {
          toast.success(res.message || 'Student deleted successfully.');
          dispatch(fetchStudents());
          dispatch(fetchRooms());
        })
        .catch((err) => toast.error(err));
    }
  };

  const handleOpenAssignModal = (student) => {
    setSelectedStudent(student);
    setSelectedRoomId('');
    setIsAssignModalOpen(true);
    setShowDropdownId(null);
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!selectedRoomId) {
      toast.error('Please select a room.');
      return;
    }

    dispatch(assignRoom({ studentId: selectedStudent._id, roomId: selectedRoomId }))
      .unwrap()
      .then((res) => {
        toast.success(res.message || 'Room assigned successfully.');
        dispatch(fetchStudents());
        dispatch(fetchRooms());
        setIsAssignModalOpen(false);
      })
      .catch((err) => toast.error(err));
  };

  const handleRemoveRoom = (student) => {
    if (window.confirm(`Remove Room Assignment for ${student.name}?`)) {
      dispatch(removeRoom(student._id))
        .unwrap()
        .then((res) => {
          toast.success(res.message || 'Room assignment removed.');
          dispatch(fetchStudents());
          dispatch(fetchRooms());
        })
        .catch((err) => toast.error(err));
    }
    setShowDropdownId(null);
  };

  const handleOpenProfileModal = (student) => {
    setSelectedStudent(student);
    // Filter payments & complaints for this specific student
    const filteredPayments = allPayments.filter(p => p.student?._id === student._id);
    const filteredComplaints = allComplaints.filter(c => c.student?._id === student._id);
    setStudentPayments(filteredPayments);
    setStudentComplaints(filteredComplaints);
    setIsProfileModalOpen(true);
    setShowDropdownId(null);
  };

  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  // Build list of available rooms for assign selector
  const availableRooms = rooms.filter(r => r.status === 'available');

  const columns = [
    {
      key: 'avatar',
      label: '',
      render: (row) => (
        row.profilePhoto ? (
          <img
            src={`http://localhost:5000/uploads/${row.profilePhoto}`}
            alt={row.name}
            className="w-9 h-9 rounded-full object-cover border border-purple-100 shadow-sm"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-purple-50 text-[#534AB7] border border-purple-100 flex items-center justify-center font-bold text-xs uppercase shadow-sm">
            {getInitials(row.name)}
          </div>
        )
      )
    },
    {
      key: 'name',
      label: 'Name',
      render: (row) => (
        <div>
          <button
            onClick={() => handleOpenProfileModal(row)}
            className="font-bold text-gray-800 hover:text-[#534AB7] transition-colors hover:underline text-left block"
          >
            {row.name}
          </button>
          <span className="text-[10px] text-gray-400 block mt-0.5">{row.email}</span>
        </div>
      )
    },
    {
      key: 'room',
      label: 'Room',
      render: (row) => (
        row.room ? (
          <div>
            <span className="font-semibold text-gray-700">Room {row.room.roomNumber}</span>
            <span className="text-[10px] text-gray-400 block">{row.room.type} sharing</span>
          </div>
        ) : (
          <span className="text-xs text-gray-400 italic font-medium">Not assigned</span>
        )
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (row) => <span className="font-medium text-gray-600">{row.phone}</span>
    },
    {
      key: 'feeStatus',
      label: 'Payment Status',
      render: (row) => {
        // Find if this student has any overdue or pending payments
        const unpaid = allPayments.filter(p => p.student?._id === row._id && p.status !== 'paid');
        if (unpaid.some(p => p.status === 'overdue')) {
          return <Badge status="overdue" />;
        }
        if (unpaid.some(p => p.status === 'pending')) {
          return <Badge status="pending" />;
        }
        return <Badge status="paid" />;
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenProfileModal(row)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-[11px] font-bold text-[#534AB7] rounded-lg transition-colors border border-purple-200"
            title="View Profile"
          >
            <User size={12} /> Profile
          </button>
          {row.room ? (
            <button
              onClick={() => handleRemoveRoom(row)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-[11px] font-bold text-red-600 rounded-lg transition-colors border border-red-200"
              title="Remove Room"
            >
              <X size={12} /> Remove Room
            </button>
          ) : (
            <button
              onClick={() => handleOpenAssignModal(row)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-green-50 hover:bg-green-100 text-[11px] font-bold text-green-700 rounded-lg transition-colors border border-green-200"
              title="Assign Room"
            >
              <Plus size={12} /> Assign Room
            </button>
          )}
          <button
            onClick={() => handleDeleteActiveStudent(row)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-[11px] font-bold text-red-600 rounded-lg transition-colors border border-red-200"
            title="Delete Student"
          >
            <X size={12} /> Delete
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">Students</h2>
        <p className="text-xs text-gray-500 mt-1">Manage registration approvals, room placements, and profiles.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-6">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'active'
              ? 'border-[#534AB7] text-[#534AB7]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Active Students ({students?.approved?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'pending'
              ? 'border-[#534AB7] text-[#534AB7]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Pending Approvals ({students?.pending?.length || 0})
        </button>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-[#534AB7]" size={36} />
        </div>
      ) : activeTab === 'active' ? (
        <>
          {/* Mobile Accordion List */}
          <div className="block md:hidden space-y-2">
            {(students?.approved || []).length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center text-gray-400">
                <p className="text-sm font-semibold">No active students yet.</p>
              </div>
            ) : (
              (students?.approved || []).map((row) => {
                const isOpen = expandedStudentId === row._id;
                return (
                  <div key={row._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <button
                      onClick={() => toggleStudentExpand(row._id)}
                      className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {row.profilePhoto ? (
                          <img src={`http://localhost:5000/uploads/${row.profilePhoto}`} alt={row.name} className="w-8 h-8 rounded-full object-cover border border-purple-100" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-purple-50 text-[#534AB7] border border-purple-100 flex items-center justify-center font-bold text-xs uppercase">{getInitials(row.name)}</div>
                        )}
                        <div>
                          <p className="font-bold text-gray-800 text-sm leading-tight">{row.name}</p>
                          <p className="text-[10px] text-gray-400">{row.room ? `Room ${row.room.roomNumber}` : 'No room'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {(() => { const unpaid = allPayments.filter(p => p.student?._id === row._id && p.status !== 'paid'); if (unpaid.some(p => p.status === 'overdue')) return <Badge status="overdue" />; if (unpaid.some(p => p.status === 'pending')) return <Badge status="pending" />; return <Badge status="paid" />; })()}
                        {isOpen ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-2 bg-gray-50/40 border-t border-gray-100 space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div><span className="text-gray-400 block text-[10px] uppercase font-bold">Email</span><span className="text-gray-700 font-medium break-all">{row.email}</span></div>
                          <div><span className="text-gray-400 block text-[10px] uppercase font-bold">Phone</span><span className="text-gray-700 font-medium">{row.phone}</span></div>
                          <div><span className="text-gray-400 block text-[10px] uppercase font-bold">Room</span><span className="text-gray-700 font-medium">{row.room ? `Room ${row.room.roomNumber} (${row.room.type})` : 'Unassigned'}</span></div>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <button onClick={() => handleOpenProfileModal(row)} className="flex items-center gap-1 px-2.5 py-1.5 bg-purple-50 text-[11px] font-bold text-[#534AB7] rounded-lg border border-purple-200"><User size={12} /> Profile</button>
                          {row.room ? (
                            <button onClick={() => handleRemoveRoom(row)} className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 text-[11px] font-bold text-red-600 rounded-lg border border-red-200"><X size={12} /> Remove Room</button>
                          ) : (
                            <button onClick={() => handleOpenAssignModal(row)} className="flex items-center gap-1 px-2.5 py-1.5 bg-green-50 text-[11px] font-bold text-green-700 rounded-lg border border-green-200"><Plus size={12} /> Assign Room</button>
                          )}
                          <button onClick={() => handleDeleteActiveStudent(row)} className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 text-[11px] font-bold text-red-600 rounded-lg border border-red-200"><X size={12} /> Delete</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block">
            <DataTable
              columns={columns}
              rows={students?.approved || []}
              loading={loading}
            />
          </div>
        </>
      ) : (
        /* Pending Registration Approvals Grid */
        students?.pending?.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
            <p className="text-3xl mb-3">🤝</p>
            <p className="text-sm font-semibold">No pending approvals.</p>
            <p className="text-xs text-gray-400 mt-1">All registered students have been processed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.pending.map((student) => (
              <div
                key={student._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {/* Yellow status bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-400" />
                
                <div className="mt-1">
                  <div className="flex items-center gap-3">
                    {student.profilePhoto ? (
                      <img
                        src={`http://localhost:5000/uploads/${student.profilePhoto}`}
                        alt={student.name}
                        className="w-10 h-10 rounded-full object-cover shadow-inner border border-amber-100"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs uppercase shadow-inner border border-amber-100">
                        {getInitials(student.name)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm leading-snug">{student.name}</h3>
                      <span className="text-[10px] text-gray-400 block mt-0.5">Registered: {new Date(student.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1 text-xs text-gray-500 font-medium">
                    <p className="truncate"><strong className="text-gray-700">Email:</strong> {student.email}</p>
                    <p><strong className="text-gray-700">Phone:</strong> {student.phone}</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-gray-50 pt-3 mt-4">
                  <button
                    onClick={() => handleReject(student._id)}
                    className="flex items-center gap-1.5 px-3.5 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-colors"
                  >
                    <X size={12} /> Reject
                  </button>
                  <button
                    onClick={() => handleOpenApproveModal(student)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#10B981] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    <Check size={12} /> Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Approve Student Registration Modal */}
      <Modal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        title={selectedStudent ? `Approve Registration: ${selectedStudent.name}` : 'Approve Student'}
      >
        <form onSubmit={handleApproveSubmit} className="space-y-4">
          <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-xl text-xs text-[#534AB7] leading-relaxed">
            <p className="font-semibold">
              You are approving registration for <strong>{selectedStudent?.name}</strong>.
              Select an available room below to allocate it immediately, or approve without assigning a room (you can assign it later).
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Allocate Available Room (Optional)</label>
            <select
              value={approveRoomId}
              onChange={(e) => setApproveRoomId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#534AB7] focus:ring-1 focus:ring-[#534AB7] bg-white font-medium text-gray-700"
            >
              <option value="">-- No Room / Assign Later --</option>
              {availableRooms.map((room) => (
                <option key={room._id} value={room._id}>
                  Room {room.roomNumber} ({room.type} sharing - Floor {room.floor} - ₹{room.rent}/mo)
                </option>
              ))}
            </select>
            {availableRooms.length === 0 && (
              <p className="text-[10px] text-amber-500 mt-2 font-medium">⚠️ No rooms are currently available in the hostel.</p>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4 mt-6">
            <button
              type="button"
              onClick={() => setIsApproveModalOpen(false)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-gray-500 font-bold hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#10B981] hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md transition-colors text-sm"
            >
              Confirm Approval
            </button>
          </div>
        </form>
      </Modal>

      {/* Assign Room Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title={selectedStudent ? `Assign Room to ${selectedStudent.name}` : 'Assign Room'}
      >
        <form onSubmit={handleAssignSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Select Available Room</label>
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#534AB7] focus:ring-1 focus:ring-[#534AB7] bg-white font-medium text-gray-700"
            >
              <option value="">-- Choose a Room --</option>
              {availableRooms.map((room) => (
                <option key={room._id} value={room._id}>
                  Room {room.roomNumber} ({room.type} sharing - Floor {room.floor} - ₹{room.rent}/mo)
                </option>
              ))}
            </select>
            {availableRooms.length === 0 && (
              <p className="text-[10px] text-red-500 mt-2 font-medium">⚠️ No rooms are currently marked as available.</p>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4 mt-6">
            <button
              type="button"
              onClick={() => setIsAssignModalOpen(false)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-gray-500 font-bold hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={availableRooms.length === 0}
              className="px-4 py-2 bg-[#534AB7] hover:bg-[#3C3489] text-white font-bold rounded-xl shadow-md transition-colors text-sm disabled:opacity-50"
            >
              Assign Room
            </button>
          </div>
        </form>
      </Modal>

      {/* Profile Detail Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title={selectedStudent ? `${selectedStudent.name}'s Profile` : 'Student Profile'}
      >
        {selectedStudent && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
              {selectedStudent.profilePhoto ? (
                <img
                  src={`http://localhost:5000/uploads/${selectedStudent.profilePhoto}`}
                  alt={`${selectedStudent.name} Profile`}
                  className="w-14 h-14 rounded-full object-cover border border-purple-100 shadow-sm"
                />
              ) : (
                <div className="w-14 h-14 bg-purple-50 text-[#534AB7] border border-purple-100 rounded-full flex items-center justify-center font-extrabold text-xl shadow-inner uppercase">
                  {getInitials(selectedStudent.name)}
                </div>
              )}
              <div>
                <h3 className="font-extrabold text-gray-800 text-lg leading-tight">{selectedStudent.name}</h3>
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Approved Student</span>
              </div>
            </div>

            {/* Profile fields */}
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-gray-500">
              <div>
                <span className="text-gray-400 block text-[9px] uppercase font-extrabold tracking-wider">Email Address</span>
                <span className="text-gray-800 text-xs block mt-0.5 truncate">{selectedStudent.email}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[9px] uppercase font-extrabold tracking-wider">Phone Number</span>
                <span className="text-gray-800 text-xs block mt-0.5">{selectedStudent.phone}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[9px] uppercase font-extrabold tracking-wider">Emergency Contact</span>
                <span className="text-gray-800 text-xs block mt-0.5">{selectedStudent.emergencyContact || 'Not Provided'}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[9px] uppercase font-extrabold tracking-wider">Assigned Room</span>
                <span className="text-gray-800 text-xs block mt-0.5">
                  {selectedStudent.room ? `Room ${selectedStudent.room.roomNumber} (${selectedStudent.room.type})` : 'Unassigned'}
                </span>
              </div>
            </div>

            {/* Payments list */}
            <div>
              <h4 className="font-bold text-gray-800 text-sm mb-2.5 pb-1 border-b border-gray-100">Fee Payment History</h4>
              <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                {studentPayments.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No payments logged yet.</p>
                ) : (
                  studentPayments.map((pay) => (
                    <div key={pay._id} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg text-xs">
                      <div>
                        <span className="font-bold text-gray-700">{pay.month}</span>
                        <span className="text-[10px] text-gray-400 block">Due: {new Date(pay.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-gray-700">₹{pay.amount}</span>
                        <Badge status={pay.status} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Complaints raised */}
            <div>
              <h4 className="font-bold text-gray-800 text-sm mb-2.5 pb-1 border-b border-gray-100">Complaints Summary</h4>
              <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                {studentComplaints.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No complaints filed yet.</p>
                ) : (
                  studentComplaints.map((comp) => (
                    <div key={comp._id} className="p-2.5 bg-gray-50 rounded-lg text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-[#534AB7] uppercase tracking-wider text-[9px]">{comp.category}</span>
                        <Badge status={comp.status} />
                      </div>
                      <p className="text-gray-600 font-medium text-[11px] leading-relaxed line-clamp-2">{comp.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex justify-end border-t border-gray-100 pt-4 mt-6">
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentsList;
