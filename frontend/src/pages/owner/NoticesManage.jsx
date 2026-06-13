import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNotices,
  createNotice,
  deleteNotice,
  selectNotice,
  clearNoticeErrors
} from '../../store/noticeSlice';
import Modal from '../../components/Modal';
import { Bell, Calendar, Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const NoticesManage = () => {
  const dispatch = useDispatch();
  const { data: notices, loading } = useSelector(selectNotice);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    dispatch(fetchNotices());
  }, [dispatch]);

  const handleOpenModal = () => {
    setTitle('');
    setBody('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error('Please fill in all fields.');
      return;
    }

    const payload = { title: title.trim(), body: body.trim() };

    dispatch(createNotice(payload))
      .unwrap()
      .then((res) => {
        toast.success(res.message || 'Notice posted successfully.');
        dispatch(fetchNotices());
        handleCloseModal();
      })
      .catch((err) => toast.error(err));
  };

  const handleDelete = (id, noticeTitle) => {
    if (window.confirm(`Are you sure you want to delete notice "${noticeTitle}"?`)) {
      dispatch(deleteNotice(id))
        .unwrap()
        .then((res) => {
          toast.success(res.message || 'Notice deleted successfully.');
          dispatch(fetchNotices());
        })
        .catch((err) => toast.error(err));
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Post Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Notice Management</h2>
          <p className="text-xs text-gray-500 mt-1">Post updates, reminders, and mess board notices for residents.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#534AB7] hover:bg-[#3C3489] text-white text-sm font-bold rounded-xl shadow-md transition-all shrink-0"
        >
          <Plus size={16} /> Post Notice
        </button>
      </div>

      {/* Notices List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-[#534AB7]" size={36} />
        </div>
      ) : notices.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
          <p className="text-3xl mb-3">📢</p>
          <p className="text-sm font-semibold">No notices posted.</p>
          <p className="text-xs text-gray-400 mt-1">Click "Post Notice" to share announcements with your residents.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notices.map((notice) => (
            <div
              key={notice._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow relative overflow-hidden"
            >
              {/* Purple left border indicator */}
              <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-[#534AB7]" />
              
              <div className="pl-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="font-extrabold text-gray-800 text-base flex items-center gap-2">
                    <span className="text-[#534AB7]"><Bell size={16} /></span>
                    {notice.title}
                  </h3>
                  <span className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                    <Calendar size={12} /> {new Date(notice.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}
                  </span>
                </div>

                <p className="text-xs text-gray-600 mt-2 leading-snug font-medium whitespace-pre-line">
                  {notice.body}
                </p>

                {/* Poster and Actions Row */}
                <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-3 text-xs font-semibold text-gray-400">
                  <span>Posted By: <strong className="text-gray-600">Management</strong></span>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(notice._id, notice.title)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Notice"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Notice Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Post New Notice Announcement"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Notice Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#534AB7] focus:ring-1 focus:ring-[#534AB7] font-medium text-gray-700"
              placeholder="e.g. Water Supply Interruption / Maintenance Reminder"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Notice Description / Details</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#534AB7] focus:ring-1 focus:ring-[#534AB7] min-h-[160px]"
              placeholder="Write the details here..."
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4 mt-6">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 border border-gray-200 rounded-xl text-gray-500 font-bold hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#534AB7] hover:bg-[#3C3489] text-white font-bold rounded-xl shadow-md transition-colors text-sm"
            >
              Post Announcement
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default NoticesManage;
