import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentComplaints, raiseComplaint, selectComplaint, clearComplaintErrors } from '../../store/complaintSlice';
import Badge from '../../components/Badge';
import { AlertCircle, Calendar, MessageSquare, ChevronDown, ChevronUp, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const MyComplaints = () => {
  const dispatch = useDispatch();
  const { data: complaints, loading } = useSelector(selectComplaint);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [category, setCategory] = useState('maintenance');
  const [description, setDescription] = useState('');

  useEffect(() => {
    dispatch(fetchStudentComplaints());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error('Please describe your complaint.');
      return;
    }

    dispatch(raiseComplaint({ category, description: description.trim() }))
      .unwrap()
      .then((res) => {
        toast.success(res.message || 'Complaint raised successfully.');
        setDescription('');
        setIsFormOpen(false);
        dispatch(fetchStudentComplaints());
      })
      .catch((err) => toast.error(err));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">My Complaints</h2>
        <p className="text-xs text-gray-500 mt-1">File tickets for repairs, maintenance, or utilities, and track progress.</p>
      </div>

      {/* Collapsible Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="w-full px-5 py-4 flex items-center justify-between text-sm font-bold text-gray-800 hover:bg-gray-50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <span className="text-[#534AB7]"><AlertCircle size={18} /></span>
            File a New Ticket
          </span>
          {isFormOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {isFormOpen && (
          <form onSubmit={handleSubmit} className="px-5 pb-5 pt-2 border-t border-gray-50 space-y-4 animate-slide-in">
            {/* Category selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Issue Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#534AB7] focus:ring-1 focus:ring-[#534AB7] bg-white font-medium text-gray-700"
              >
                <option value="maintenance">General Maintenance</option>
                <option value="plumbing">Plumbing issue</option>
                <option value="electricity">Electrical breakdown</option>
                <option value="wifi">WiFi / Connectivity issues</option>
                <option value="cleanliness">Mess & Room Cleanliness</option>
                <option value="other">Other issue</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Brief Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#534AB7] focus:ring-1 focus:ring-[#534AB7] min-h-[100px]"
                placeholder="Describe what needs fixing, include room details if applicable..."
              />
            </div>

            {/* Submit button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#534AB7] hover:bg-[#3C3489] text-white font-bold rounded-xl text-xs shadow-md transition-colors"
              >
                <Send size={12} /> Submit Ticket
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Complaints List Cards */}
      <div>
        <h3 className="font-bold text-gray-800 text-sm mb-4">Past Tickets</h3>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-[#534AB7]" size={36} />
          </div>
        ) : complaints.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
            <p className="text-3xl mb-3">🍃</p>
            <p className="text-sm font-semibold">No complaints logged.</p>
            <p className="text-xs text-gray-400 mt-1">If you have an issue in your room, use the form above to alert management.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {complaints.map((comp) => (
              <div
                key={comp._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {/* Status indicator bar */}
                <div
                  className={`absolute top-0 bottom-0 left-0 w-1.5 ${
                    comp.status === 'resolved'
                      ? 'bg-green-400'
                      : comp.status === 'in-progress'
                      ? 'bg-blue-400'
                      : 'bg-amber-400'
                  }`}
                />

                <div className="pl-2">
                  <div className="flex items-center justify-between mb-3 border-b border-gray-50 pb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#534AB7]">
                      {comp.category}
                    </span>
                    <Badge status={comp.status} />
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
                    <Calendar size={12} /> Filed {new Date(comp.createdAt).toLocaleDateString()}
                  </div>

                  <p className="text-xs text-gray-600 font-medium leading-relaxed bg-gray-50/50 p-3 rounded-lg border border-gray-50/50">
                    {comp.description}
                  </p>

                  {/* Owner Response */}
                  {comp.ownerNote ? (
                    <div className="mt-4 p-3 bg-purple-50/30 border border-purple-100/30 rounded-lg text-xs leading-relaxed">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <MessageSquare size={12} className="text-[#534AB7]" />
                        Management Resolution Note:
                      </span>
                      <p className="text-gray-700 font-semibold mt-1 italic">
                        "{comp.ownerNote}"
                      </p>
                    </div>
                  ) : (
                    <p className="text-[10px] text-gray-400 italic mt-3">Awaiting response from management.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyComplaints;
