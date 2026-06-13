import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotices, selectNotice } from '../../store/noticeSlice';
import { Bell, Calendar, Inbox, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Notices = () => {
  const dispatch = useDispatch();
  const { data: notices, loading } = useSelector(selectNotice);

  useEffect(() => {
    dispatch(fetchNotices());
  }, [dispatch]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">Notice Board</h2>
        <p className="text-xs text-gray-500 mt-1">Read general updates, rules, scheduling, and notifications from management.</p>
      </div>

      {/* Notices Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-[#534AB7]" size={36} />
        </div>
      ) : notices.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
          <p className="text-3xl mb-3">📢</p>
          <p className="text-sm font-semibold">No announcements logged.</p>
          <p className="text-xs text-gray-400 mt-1">The notice board is currently clean. Check back later.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <div
              key={notice._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow relative overflow-hidden animate-slide-in"
            >
              {/* Left indicator accent */}
              <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-[#534AB7]" />

              <div className="pl-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-50 pb-2 mb-3">
                  <h3 className="font-extrabold text-gray-800 text-sm flex items-center gap-1.5">
                    <span className="text-[#534AB7]"><Bell size={14} /></span>
                    {notice.title}
                  </h3>
                  <span className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    <Calendar size={12} /> {new Date(notice.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-gray-600 font-medium leading-relaxed whitespace-pre-line">
                  {notice.body}
                </p>

                <div className="border-t border-gray-50 pt-3.5 mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Posted By: <span className="text-[#534AB7]">Management</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notices;
