import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchOwnerComplaints,
  updateComplaint,
  selectComplaint
} from '../../store/complaintSlice';
import Badge from '../../components/Badge';
import { Filter, Calendar, MessageSquare, Save, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

const ComplaintsManage = () => {
  const dispatch = useDispatch();
  const { data: complaints, loading } = useSelector(selectComplaint);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Local state to keep track of text inputs for owner notes on cards
  const [notes, setNotes] = useState({});
  const [expandedComplaints, setExpandedComplaints] = useState({});

  const toggleExpand = (id) => {
    setExpandedComplaints(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  useEffect(() => {
    dispatch(fetchOwnerComplaints(statusFilter));
  }, [dispatch, statusFilter]);

  // Sync loaded complaints notes to state
  useEffect(() => {
    if (complaints) {
      const notesObj = {};
      complaints.forEach((c) => {
        notesObj[c._id] = c.ownerNote || '';
      });
      setNotes(notesObj);
    }
  }, [complaints]);

  const handleNoteChange = (id, text) => {
    setNotes({
      ...notes,
      [id]: text
    });
  };

  const handleSave = (id, status) => {
    const ownerNote = notes[id] || '';
    dispatch(updateComplaint({ id, status, ownerNote }))
      .unwrap()
      .then((res) => {
        toast.success(res.message || 'Complaint updated successfully.');
        dispatch(fetchOwnerComplaints(statusFilter));
      })
      .catch((err) => toast.error(err));
  };

  const handleStatusChangeOnCard = (id, status) => {
    const ownerNote = notes[id] || '';
    dispatch(updateComplaint({ id, status, ownerNote }))
      .unwrap()
      .then((res) => {
        toast.success(`Complaint status set to ${status}.`);
        dispatch(fetchOwnerComplaints(statusFilter));
      })
      .catch((err) => toast.error(err));
  };

  const filteredComplaints = complaints.filter((c) => {
    return categoryFilter ? c.category === categoryFilter : true;
  });

  const activeComplaints = filteredComplaints.filter(c => c.status !== 'resolved');
  const resolvedComplaints = filteredComplaints.filter(c => c.status === 'resolved');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">Complaints Board</h2>
        <p className="text-xs text-gray-500 mt-1">Review student issues, update statuses, and log audit notes.</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row items-center gap-4">
        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
            <Filter size={12} /> Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#534AB7] focus:ring-1 focus:ring-[#534AB7] bg-white font-medium"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
            <Filter size={12} /> Category:
          </span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#534AB7] focus:ring-1 focus:ring-[#534AB7] bg-white font-medium"
          >
            <option value="">All Categories</option>
            <option value="maintenance">Maintenance</option>
            <option value="plumbing">Plumbing</option>
            <option value="electricity">Electricity</option>
            <option value="wifi">WiFi</option>
            <option value="cleanliness">Cleanliness</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Complaints Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-[#534AB7]" size={36} />
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
          <p className="text-3xl mb-3">🍃</p>
          <p className="text-sm font-semibold">No complaints logged.</p>
          <p className="text-xs text-gray-400 mt-1">Students have not filed complaints matching these filters.</p>
        </div>
      ) : (
        <>
          {activeComplaints.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeComplaints.map((comp) => (
                <div
                  key={comp._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between hover:shadow-md transition-shadow relative"
                >
                  <div>
                    {/* Meta details */}
                    <div className="flex items-start justify-between border-b border-gray-50 pb-3 mb-3">
                      <div>
                        <h3 className="font-bold text-gray-800 text-sm leading-snug">{comp.student?.name || 'Unknown Student'}</h3>
                        <span className="text-[10px] text-gray-400 mt-0.5 block">
                          {comp.room ? `Room ${comp.room.roomNumber}` : 'Room unassigned'}
                        </span>
                      </div>
                      <Badge status={comp.status} />
                    </div>

                    {/* Category & Date */}
                    <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
                      <span className="text-[#534AB7]">{comp.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 lowercase normal-case font-medium">
                        <Calendar size={12} /> {new Date(comp.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-600 font-medium bg-gray-50/50 p-3 rounded-lg border border-gray-50/50 leading-relaxed mb-4">
                      {comp.description}
                    </p>
                  </div>

                  {/* Resolution Controls */}
                  <div className="space-y-3 pt-3 border-t border-gray-50">
                    {/* Status Dropdown */}
                    <div className="flex items-center justify-between gap-4 text-xs font-semibold text-gray-500">
                      <span>Change Status:</span>
                      <select
                        value={comp.status}
                        onChange={(e) => handleStatusChangeOnCard(comp._id, e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#534AB7] focus:ring-1 focus:ring-[#534AB7] bg-white font-semibold text-gray-700"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>

                    {/* Notes Input & Save */}
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute top-2.5 left-3 text-gray-400">
                          <MessageSquare size={14} />
                        </span>
                        <input
                          type="text"
                          value={notes[comp._id] || ''}
                          onChange={(e) => handleNoteChange(comp._id, e.target.value)}
                          placeholder="Add owner resolution note..."
                          className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#534AB7] focus:ring-1 focus:ring-[#534AB7]"
                        />
                      </div>
                      <button
                        onClick={() => handleSave(comp._id, comp.status)}
                        className="px-3.5 bg-[#534AB7] hover:bg-[#3C3489] text-white rounded-lg transition-colors flex items-center justify-center"
                        title="Save Note"
                      >
                        <Save size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {resolvedComplaints.length > 0 && (
            <div className="mt-8 space-y-4">
              <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">Resolved Complaints History</h3>
              {resolvedComplaints.map(comp => {
                const isExpanded = expandedComplaints[comp._id];
                return (
                  <div key={comp._id} className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col relative overflow-hidden">
                    <button
                      onClick={() => toggleExpand(comp._id)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <Badge status={comp.status} />
                        <div>
                          <h3 className="font-bold text-gray-800 text-sm">
                            {comp.student?.name || 'Unknown Student'}
                            <span className="text-gray-400 font-normal ml-2">({comp.room ? `Room ${comp.room.roomNumber}` : 'Room unassigned'})</span>
                          </h3>
                          <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">
                            <span className="text-[#534AB7]">{comp.category}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 lowercase normal-case font-medium">
                              <Calendar size={12} /> {new Date(comp.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-gray-400 flex items-center gap-2">
                         <span className="text-[10px] font-bold uppercase tracking-wider">Details</span>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </button>
                    
                    {isExpanded && (
                      <div className="px-5 pb-5 border-t border-gray-50 animate-slide-in pt-4 bg-gray-50/30">
                        <p className="text-xs text-gray-600 font-medium bg-white p-3 rounded-lg border border-gray-100 leading-relaxed mb-4">
                          {comp.description}
                        </p>
                        {comp.ownerNote && (
                          <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-lg text-xs leading-relaxed">
                            <span className="text-[10px] text-[#534AB7] font-bold uppercase tracking-wider flex items-center gap-1 mb-1">
                              <MessageSquare size={12} /> Resolution Note
                            </span>
                            <p className="text-gray-700 font-semibold">{comp.ownerNote}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ComplaintsManage;
