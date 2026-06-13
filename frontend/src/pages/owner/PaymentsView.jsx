import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchOwnerPayments,
  createPayment,
  updatePaymentStatus,
  selectPayment
} from '../../store/paymentSlice';
import { fetchStudents, selectRoom } from '../../store/roomSlice';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import StatCard from '../../components/StatCard';
import { CreditCard, DollarSign, CalendarCheck, AlertTriangle, Plus, Search, Filter, CheckCircle2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const PaymentsView = () => {
  const dispatch = useDispatch();
  const { data: payments, loading } = useSelector(selectPayment);
  const { students } = useSelector(selectRoom);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [targetPayment, setTargetPayment] = useState(null);

  // Add Form State
  const [formData, setFormData] = useState({
    studentId: '',
    month: '',
    amount: '',
    dueDate: ''
  });

  // Note State
  const [noteText, setNoteText] = useState('');

  const monthsList = [
    'January 2026', 'February 2026', 'March 2026', 'April 2026', 'May 2026', 'June 2026',
    'July 2026', 'August 2026', 'September 2026', 'October 2026', 'November 2026', 'December 2026'
  ];

  useEffect(() => {
    dispatch(fetchOwnerPayments(statusFilter));
    dispatch(fetchStudents());
  }, [dispatch, statusFilter]);

  const handleOpenAddModal = () => {
    setFormData({
      studentId: '',
      month: 'June 2026',
      amount: '',
      dueDate: new Date().toISOString().split('T')[0]
    });
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const { studentId, month, amount, dueDate } = formData;
    if (!studentId || !month || !amount || !dueDate) {
      toast.error('All fields are required.');
      return;
    }

    dispatch(createPayment({
      studentId,
      month,
      amount: Number(amount),
      dueDate
    }))
      .unwrap()
      .then((res) => {
        toast.success(res.message || 'Payment record created successfully.');
        dispatch(fetchOwnerPayments(statusFilter));
        setIsAddModalOpen(false);
      })
      .catch((err) => toast.error(err));
  };

  const handleStatusChange = (id, status, currentNote = '') => {
    dispatch(updatePaymentStatus({ id, status, note: currentNote }))
      .unwrap()
      .then((res) => {
        toast.success(`Record updated to ${status}.`);
        dispatch(fetchOwnerPayments(statusFilter));
      })
      .catch((err) => toast.error(err));
  };

  const handleOpenNoteModal = (payment) => {
    setTargetPayment(payment);
    setNoteText(payment.note || '');
    setIsNoteModalOpen(true);
  };

  const handleNoteSubmit = (e) => {
    e.preventDefault();
    dispatch(updatePaymentStatus({
      id: targetPayment._id,
      status: targetPayment.status,
      note: noteText.trim()
    }))
      .unwrap()
      .then((res) => {
        toast.success('Note updated successfully.');
        dispatch(fetchOwnerPayments(statusFilter));
        setIsNoteModalOpen(false);
      })
      .catch((err) => toast.error(err));
  };

  // Summaries calculation (filters out by month if specified)
  const currentMonth = "June 2026";
  const matchingPayments = payments.filter(p => monthFilter ? p.month === monthFilter : true);

  const activePayments = matchingPayments.filter(p => p.status !== 'paid');
  const paidPayments = matchingPayments.filter(p => p.status === 'paid');

  const totalCollected = matchingPayments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = matchingPayments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalOverdue = matchingPayments
    .filter(p => p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0);

  const columns = [
    {
      key: 'student',
      label: 'Student',
      render: (row) => (
        <div>
          <p className="font-bold text-gray-800">{row.student?.name || 'Unknown'}</p>
          <span className="text-[10px] text-gray-400 block">{row.student?.email}</span>
        </div>
      )
    },
    {
      key: 'room',
      label: 'Room',
      render: (row) => row.room ? `Room ${row.room.roomNumber}` : <span className="text-gray-400 italic">Unassigned</span>
    },
    {
      key: 'month',
      label: 'Billing Cycle',
      render: (row) => <span className="font-semibold text-gray-700">{row.month}</span>
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (row) => <span className="font-extrabold text-gray-800">₹{row.amount}</span>
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (row) => <span className="text-gray-600 font-medium">{new Date(row.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
    },
    {
      key: 'paidOn',
      label: 'Paid On',
      render: (row) => row.paidOn ? <span className="text-green-600 font-bold">{new Date(row.paidOn).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}</span> : <span className="text-gray-400">—</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge status={row.status} />
    },
    {
      key: 'note',
      label: 'Remarks/Note',
      render: (row) => (
        <div className="max-w-[140px] truncate" title={row.note}>
          <span className="text-xs text-gray-500 font-medium">{row.note || <span className="text-gray-300 italic">None</span>}</span>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          {row.status !== 'paid' && (
            <button
              onClick={() => handleStatusChange(row._id, 'paid', row.note)}
              className="px-2 py-1 bg-green-50 hover:bg-green-100 text-green-600 text-[10px] font-bold rounded-lg border border-green-200 transition-colors"
            >
              Set Paid
            </button>
          )}
          {row.status !== 'overdue' && (
            <button
              onClick={() => handleStatusChange(row._id, 'overdue', row.note)}
              className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-bold rounded-lg border border-red-200 transition-colors"
            >
              Overdue
            </button>
          )}
          <button
            onClick={() => handleOpenNoteModal(row)}
            className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-[#534AB7] text-[10px] font-bold rounded-lg border border-purple-200 transition-colors"
          >
            Note
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Add Payment */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Payments Ledger</h2>
          <p className="text-xs text-gray-500 mt-1">Invoice fees, track payment dates, and manage transaction logs.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#534AB7] hover:bg-[#3C3489] text-white text-sm font-bold rounded-xl shadow-md transition-all shrink-0"
        >
          <Plus size={16} /> Bill Student
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Collected (INR)" value={`₹${totalCollected}`} icon={DollarSign} color="green" />
        <StatCard title="Total Pending (INR)" value={`₹${totalPending}`} icon={CalendarCheck} color="amber" />
        <StatCard title="Total Overdue (INR)" value={`₹${totalOverdue}`} icon={AlertTriangle} color="red" />
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col md:flex-row items-center gap-4">
        {/* Month Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
            <Filter size={12} /> Billing Month:
          </span>
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="w-full md:w-44 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#534AB7] focus:ring-1 focus:ring-[#534AB7] bg-white font-medium"
          >
            <option value="">All Months</option>
            {monthsList.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
            <Filter size={12} /> Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-44 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#534AB7] focus:ring-1 focus:ring-[#534AB7] bg-white font-medium"
          >
            <option value="">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Payments Logs List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-[#534AB7]" size={36} />
        </div>
      ) : (
        <>
          {activePayments.length === 0 && paidPayments.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
              <p className="text-3xl mb-3">🍃</p>
              <p className="text-sm font-semibold">No payments found.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {activePayments.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">Pending & Overdue Bills</h3>
                  <DataTable
                    columns={columns}
                    rows={activePayments}
                    loading={loading}
                  />
                </div>
              )}

              {paidPayments.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">Paid Payments History</h3>
                  <DataTable
                    columns={columns.filter(col => col.key !== 'actions')}
                    rows={paidPayments}
                    loading={loading}
                  />
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Bill Student Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Monthly Fee Record"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          {/* Select Student */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Select Student</label>
            <select
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#534AB7] focus:ring-1 focus:ring-[#534AB7] bg-white font-medium"
            >
              <option value="">-- Choose Student --</option>
              {students?.approved?.map(s => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.room ? `Room ${s.room.roomNumber}` : 'Room unassigned'})
                </option>
              ))}
            </select>
          </div>

          {/* Billing Cycle */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Billing Month</label>
            <select
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#534AB7] focus:ring-1 focus:ring-[#534AB7] bg-white font-medium"
            >
              {monthsList.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Amount (INR)</label>
              <input
                type="text"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#534AB7] focus:ring-1 focus:ring-[#534AB7]"
                placeholder="e.g. 5000"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#534AB7] focus:ring-1 focus:ring-[#534AB7]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4 mt-6">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-gray-500 font-bold hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#534AB7] hover:bg-[#3C3489] text-white font-bold rounded-xl shadow-md transition-colors text-sm"
            >
              Generate Bill
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Note Modal */}
      <Modal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        title="Edit Payment Note"
      >
        <form onSubmit={handleNoteSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Audit Remark / Note</label>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#534AB7] focus:ring-1 focus:ring-[#534AB7] min-h-[100px]"
              placeholder="e.g. Received via Bank Transfer / Checked with receipt"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4 mt-6">
            <button
              type="button"
              onClick={() => setIsNoteModalOpen(false)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-gray-500 font-bold hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#534AB7] hover:bg-[#3C3489] text-white font-bold rounded-xl shadow-md transition-colors text-sm"
            >
              Save Remark
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PaymentsView;
