import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentPayments, selectPayment } from '../../store/paymentSlice';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';
import { CreditCard, AlertTriangle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const MyPayments = () => {
  const dispatch = useDispatch();
  const { data: payments, loading } = useSelector(selectPayment);
  const [expandedPaymentId, setExpandedPaymentId] = useState(null);

  useEffect(() => {
    dispatch(fetchStudentPayments());
  }, [dispatch]);

  const toggleExpand = (id) => {
    setExpandedPaymentId(prev => prev === id ? null : id);
  };

  // Find oldest unpaid invoice
  const activeBill = payments.slice().reverse().find(p => p.status !== 'paid');

  const columns = [
    {
      key: 'month',
      label: 'Billing Cycle',
      render: (row) => <span className="font-bold text-gray-800">{row.month}</span>
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (row) => <span className="font-extrabold text-gray-800">₹{row.amount}</span>
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (row) => <span className="text-gray-500 font-medium">{new Date(row.dueDate).toLocaleDateString()}</span>
    },
    {
      key: 'paidOn',
      label: 'Paid On',
      render: (row) => row.paidOn ? <span className="text-green-600 font-bold">{new Date(row.paidOn).toLocaleDateString()}</span> : <span className="text-gray-400">—</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge status={row.status} />
    },
    {
      key: 'note',
      label: 'Remarks/Note',
      render: (row) => <span className="text-gray-500 text-xs font-semibold">{row.note || <span className="text-gray-300 italic">None</span>}</span>
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">My Payments</h2>
        <p className="text-xs text-gray-500 mt-1">Review fee invoices, track settlement records, and view billing statements.</p>
      </div>

      {/* Due Card Block */}
      {activeBill ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Due Info */}
          <div className="bg-white border border-gray-100 shadow-sm p-5 rounded-2xl md:col-span-2 flex flex-col justify-between relative overflow-hidden">
            {activeBill.status === 'overdue' && (
              <div className="bg-red-50 text-red-600 border border-red-100 p-3 rounded-xl flex items-start gap-3 text-xs leading-relaxed mb-4">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <p className="font-semibold">
                  <strong>Your payment is overdue!</strong> Please complete your bank transfer and inform your hostel owner immediately.
                </p>
              </div>
            )}
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Current Cycle Due</span>
              <h3 className="text-2xl font-extrabold text-[#534AB7] mt-1">₹{activeBill.amount}</h3>
              <p className="text-xs text-gray-500 font-semibold mt-1">Month: {activeBill.month} • Due on {new Date(activeBill.dueDate).toLocaleDateString()}</p>
            </div>
            <div className="mt-3">
              <Badge status={activeBill.status} />
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-gradient-to-br from-[#26215C] to-[#3C3489] text-white p-5 rounded-2xl flex flex-col justify-between shadow-md">
            <div>
              <h4 className="font-bold text-sm flex items-center gap-1.5 text-white mb-3">
                <CreditCard size={16} /> How to Pay
              </h4>
              <ul className="text-xs text-[#AFA9EC] list-disc list-inside space-y-1.5 font-medium">
                <li>Transfer to management bank account.</li>
                <li>Submit cash directly to owner.</li>
                <li>Share proof/screenshot.</li>
              </ul>
            </div>
            <p className="text-[10px] text-[#AFA9EC]/80 mt-4 italic border-t border-white/10 pt-3">
              * The hostel owner will mark your payment as 'Paid' once verified.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-green-50/50 border border-green-100 rounded-2xl p-5 flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <h3 className="font-bold text-green-800 text-sm">No Pending Balances</h3>
            <p className="text-xs text-green-700 mt-0.5">Your accounts are fully settled. You have no due payments at this time.</p>
          </div>
        </div>
      )}

      {/* History Section */}
      <div>
        <h3 className="font-bold text-gray-800 text-sm mb-3">Payment History Ledger</h3>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="animate-spin text-[#534AB7]" size={36} />
          </div>
        ) : (
          <>
            {/* Mobile Accordion */}
            <div className="block md:hidden space-y-2">
              {payments.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-10 text-center text-gray-400">
                  <p className="text-sm font-semibold">No payment records yet.</p>
                </div>
              ) : (
                payments.map((pay) => {
                  const isOpen = expandedPaymentId === pay._id;
                  return (
                    <div key={pay._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                      <button
                        onClick={() => toggleExpand(pay._id)}
                        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                      >
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{pay.month}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">₹{pay.amount} • Due {new Date(pay.dueDate).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge status={pay.status} />
                          {isOpen ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
                        </div>
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-2 bg-gray-50/40 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-400 block text-[10px] uppercase font-bold">Paid On</span>
                            <span className="text-gray-700 font-medium">{pay.paidOn ? new Date(pay.paidOn).toLocaleDateString() : '—'}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[10px] uppercase font-bold">Remarks</span>
                            <span className="text-gray-700 font-medium">{pay.note || 'None'}</span>
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
              <DataTable columns={columns} rows={payments} loading={loading} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyPayments;
