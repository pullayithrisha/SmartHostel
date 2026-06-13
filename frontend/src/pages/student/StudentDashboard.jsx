import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../store/authSlice';
import api from '../../api/axios';
import Badge from '../../components/Badge';
import {
  Home,
  DoorOpen,
  Calendar,
  AlertCircle,
  Bell,
  Activity,
  ChevronRight,
  Loader2,
  Inbox
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const { user } = useSelector(selectAuth);
  const [dashboardData, setDashboardData] = useState(null);
  const [paymentsList, setPaymentsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dashRes, paymentsRes] = await Promise.all([
        api.get('/student/dashboard'),
        api.get('/student/payments')
      ]);
      setDashboardData(dashRes.data.data);
      setPaymentsList(paymentsRes.data.data);
    } catch (error) {
      toast.error('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="animate-spin text-[#534AB7]" size={40} />
          <p className="text-sm text-gray-500 font-semibold">Loading student dashboard...</p>
        </div>
      </div>
    );
  }

  const { roomDetails, nextPayment, openComplaints, recentNotices } = dashboardData || {};
  const totalPaymentsMade = paymentsList.filter(p => p.status === 'paid').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Greetings Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">Welcome back, {user?.name}!</h2>
        <p className="text-xs text-gray-500 mt-1">Hostel: <strong className="text-gray-700">{user?.hostel?.name || 'SmartHostel'}</strong></p>
      </div>

      {/* Main Grid: Room Info & Payment Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Room Info Card (Purple Background) */}
        {roomDetails ? (
          <div className="bg-[#534AB7] text-white rounded-2xl shadow-lg p-5 flex flex-col justify-between relative overflow-hidden">
            {/* Background design */}
            <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
              <DoorOpen size={160} />
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 bg-white/20 rounded-full border border-white/10 inline-block mb-2">
                Assigned Room
              </span>
              <h3 className="text-2xl font-extrabold tracking-tight">Room {roomDetails.roomNumber}</h3>
              <p className="text-sm text-[#AFA9EC] font-semibold mt-0.5">
                {roomDetails.type.charAt(0).toUpperCase() + roomDetails.type.slice(1)} Sharing • Floor {roomDetails.floor}
              </p>

              {/* Amenities List */}
              {roomDetails.amenities?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {roomDetails.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-bold bg-white/10 px-2.5 py-1 rounded-lg border border-white/5"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-white/10 pt-3 mt-5 flex justify-between items-center text-xs">
              <span className="text-[#AFA9EC] font-semibold">Monthly rent:</span>
              <span className="text-lg font-extrabold">₹{roomDetails.rent}</span>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-purple-200 shadow-sm p-8 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-purple-50 text-[#534AB7] rounded-xl flex items-center justify-center mb-4">
              <DoorOpen size={24} />
            </div>
            <h3 className="font-bold text-gray-800 text-base">No Room Assigned Yet</h3>
            <p className="text-xs text-gray-500 max-w-sm mt-1.5 leading-relaxed">
              You have not been assigned to a room yet. Please contact your hostel owner to allocate a room.
            </p>
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-800 text-sm mb-4">Payment Due Status</h3>
            {nextPayment ? (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bill for {nextPayment.month}</p>
                  <p className="text-2xl font-extrabold text-gray-800 mt-1">₹{nextPayment.amount}</p>
                  <p className="text-[10px] font-semibold text-gray-500 mt-1">
                    Due Date: {new Date(nextPayment.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <Badge status={nextPayment.status} />
                  {nextPayment.status === 'overdue' && (
                    <span className="text-[10px] font-bold text-red-500 block mt-1.5">Please pay immediately</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-5 bg-green-50/50 rounded-xl border border-green-100 flex items-center gap-3">
                <span className="text-2xl">🎉</span>
                <div>
                  <p className="text-xs font-extrabold text-green-800">All fees paid!</p>
                  <p className="text-[10px] text-green-700 mt-0.5">You have no pending or overdue invoices.</p>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-50 pt-4 mt-6 flex justify-between items-center text-xs">
            <span className="text-gray-400 font-semibold">Total completed payments:</span>
            <Link
              to="/student/payments"
              className="font-bold text-[#534AB7] hover:underline flex items-center gap-0.5"
            >
              {totalPaymentsMade} paid records <ChevronRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Row: Quick Stats Counters */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
          <div className="p-2.5 bg-purple-50 text-[#534AB7] rounded-lg">
            <Activity size={18} />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold block">Open Complaints</span>
            <span className="text-lg font-extrabold text-gray-800">{openComplaints || 0} open</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
          <div className="p-2.5 bg-green-50 text-green-600 rounded-lg">
            <Calendar size={18} />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold block">Payments Logged</span>
            <span className="text-lg font-extrabold text-gray-800">{totalPaymentsMade} settled</span>
          </div>
        </div>
      </div>

      {/* Notice Board Preview */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-3">
          <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
            <span className="text-[#534AB7]"><Bell size={16} /></span>
            Recent Notices
          </h3>
          <Link
            to="/student/notices"
            className="text-xs font-bold text-[#534AB7] hover:underline flex items-center gap-0.5"
          >
            All Notices <ChevronRight size={12} />
          </Link>
        </div>

        <div className="space-y-4">
          {recentNotices?.length === 0 ? (
            <div className="py-6 text-center text-xs text-gray-400 flex flex-col items-center gap-1">
              <Inbox size={20} />
              <span>Notice board is currently empty.</span>
            </div>
          ) : (
            recentNotices?.map((notice) => (
              <div key={notice._id} className="relative pl-3 border-l-2 border-[#534AB7] py-0.5">
                <div className="flex justify-between items-baseline gap-4">
                  <h4 className="text-xs font-extrabold text-gray-800">{notice.title}</h4>
                  <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider shrink-0">
                    {new Date(notice.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">{notice.body}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
