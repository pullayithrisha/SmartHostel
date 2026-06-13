import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import api from '../../api/axios';
import StatCard from '../../components/StatCard';
import Badge from '../../components/Badge';
import {
  Users,
  DoorOpen,
  UserCheck,
  AlertCircle,
  Copy,
  Check,
  X,
  CreditCard,
  Building,
  Loader2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';

const OwnerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [hostel, setHostel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState({ pending: [], approved: [] });
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, hostelRes, roomsRes, paymentsRes, studentsRes, complaintsRes] = await Promise.all([
        api.get('/owner/dashboard'),
        api.get('/owner/hostel'),
        api.get('/owner/rooms'),
        api.get('/owner/payments'),
        api.get('/owner/students'),
        api.get('/owner/complaints')
      ]);

      setStats(statsRes.data.data);
      setHostel(hostelRes.data.data);
      setRooms(roomsRes.data.data);
      setPayments(paymentsRes.data.data);
      setStudents(studentsRes.data.data);
      setComplaints(complaintsRes.data.data);
    } catch (error) {
      toast.error('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await api.put(`/owner/students/${id}/approve`);
      toast.success(res.data.message || 'Student approved.');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Approval failed.');
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await api.delete(`/owner/students/${id}/reject`);
      toast.success(res.data.message || 'Student rejected.');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Rejection failed.');
    }
  };

  const copyToClipboard = () => {
    if (hostel?.hostelId) {
      navigator.clipboard.writeText(hostel.hostelId);
      setCopied(true);
      toast.success('Hostel ID copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="animate-spin text-[#534AB7]" size={40} />
          <p className="text-sm text-gray-500 font-semibold">Loading dashboard analytics...</p>
        </div>
      </div>
    );
  }

  // 1. Process Floor Occupancy Data for BarChart
  const floorMap = {};
  rooms.forEach((room) => {
    const fl = `Floor ${room.floor}`;
    if (!floorMap[fl]) {
      floorMap[fl] = { name: fl, Occupied: 0, Available: 0 };
    }
    if (room.status === 'occupied') {
      floorMap[fl].Occupied += 1;
    } else if (room.status === 'available') {
      floorMap[fl].Available += 1;
    }
  });
  const barChartData = Object.values(floorMap).sort((a, b) => a.name.localeCompare(b.name));

  // 2. Process Payments Data for Donut Chart
  let paidCount = 0;
  let pendingCount = 0;
  let overdueCount = 0;

  payments.forEach((p) => {
    if (p.status === 'paid') paidCount++;
    else if (p.status === 'pending') pendingCount++;
    else if (p.status === 'overdue') overdueCount++;
  });

  const donutChartData = [
    { name: 'Paid', value: paidCount, color: '#10B981' }, // emerald-500
    { name: 'Pending', value: pendingCount, color: '#F59E0B' }, // amber-500
    { name: 'Overdue', value: overdueCount, color: '#EF4444' } // red-500
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome & Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Students" value={stats?.totalStudents || 0} icon={Users} color="purple" />
        <StatCard title="Total Rooms" value={stats?.totalRooms || 0} icon={DoorOpen} color="green" />
        <StatCard title="Pending Approvals" value={stats?.pendingApprovals || 0} icon={UserCheck} color="amber" />
        <StatCard title="Open Complaints" value={stats?.openComplaints || 0} icon={AlertCircle} color="red" />
      </div>

      {/* Hostel Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 text-[#534AB7] rounded-xl">
            <Building size={22} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-800">{hostel?.name}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{hostel?.address}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-purple-50/50 border border-purple-100 px-3 py-2 rounded-xl">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Hostel ID</span>
            <span className="text-sm font-extrabold text-[#534AB7] tracking-wider">{hostel?.hostelId}</span>
          </div>
          <button
            onClick={copyToClipboard}
            className="p-1.5 bg-white hover:bg-purple-100 text-[#534AB7] rounded-lg transition-colors border border-purple-200"
            title="Copy Hostel ID"
          >
            {copied ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
          </button>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Occupancy Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="font-bold text-gray-800 text-sm mb-3">Occupancy (Floors)</h3>
          <div className="h-48">
            {barChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-gray-400">No room data to map</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} />
                  <YAxis allowDecimals={false} stroke="#9CA3AF" fontSize={11} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Occupied" fill="#534AB7" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Available" fill="#C4B5FD" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Payments Summary Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col justify-between">
          <h3 className="font-bold text-gray-800 text-sm mb-3">Fee Payments Overview</h3>
          <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-4 h-48">
            {donutChartData.length === 0 ? (
              <div className="text-xs text-gray-400">No payment logs created yet</div>
            ) : (
              <>
                <div className="w-36 h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donutChartData}
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {donutChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1.5">
                  {donutChartData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-semibold text-gray-600 w-16">{item.name}:</span>
                      <span className="font-bold text-gray-800">{item.value} record(s)</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center justify-between">
            <span>Pending Approvals</span>
            <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full font-bold">
              {students.pending.length} pending
            </span>
          </h3>
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {students.pending.length === 0 ? (
              <div className="py-5 text-center text-xs text-gray-400">
                <span>🎉</span> No registration approvals pending!
              </div>
            ) : (
              students.pending.slice(0, 5).map((student) => (
                <div
                  key={student._id}
                  className="flex items-center justify-between p-2.5 border border-gray-50 bg-gray-50/20 rounded-xl hover:border-purple-100 transition-colors"
                >
                  <div className="truncate pr-2">
                    <p className="text-sm font-semibold text-gray-800 truncate">{student.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 truncate">{student.email}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleApprove(student._id)}
                      className="p-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                      title="Approve"
                    >
                      <Check size={13} />
                    </button>
                    <button
                      onClick={() => handleReject(student._id)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                      title="Reject"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="font-bold text-gray-800 text-sm mb-3">Recent Complaints</h3>
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {complaints.length === 0 ? (
              <div className="py-5 text-center text-xs text-gray-400">
                <span>🍃</span> No student complaints logged.
              </div>
            ) : (
              complaints.slice(0, 5).map((comp) => (
                <div
                  key={comp._id}
                  className="p-2.5 border border-gray-50 bg-gray-50/20 rounded-xl hover:border-purple-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-700">{comp.student?.name || 'Unknown Student'}</span>
                    <Badge status={comp.status} />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#534AB7]">{comp.category}</p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{comp.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
