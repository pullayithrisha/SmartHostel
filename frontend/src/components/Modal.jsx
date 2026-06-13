import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Dark backdrop blur */}
      <div
        className="fixed inset-0 bg-[#26215C]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="bg-white rounded-xl shadow-xl border border-gray-100 max-w-lg w-full z-10 overflow-hidden transform transition-all animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#F8F7FF]">
          <h3 className="font-bold text-gray-800 text-base">{title}</h3>
          <button
            onClick={onClose}
            className="text-[#AFA9EC] hover:text-[#534AB7] transition-colors p-1 rounded-lg hover:bg-purple-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
