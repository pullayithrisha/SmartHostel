import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuth, logout } from '../store/authSlice';
import { LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user } = useSelector(selectAuth);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully.');
    navigate('/login');
  };

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/owner/dashboard':
        return 'Owner Dashboard';
      case '/owner/rooms':
        return 'Room Management';
      case '/owner/students':
        return 'Students List';
      case '/owner/payments':
        return 'Payments Ledger';
      case '/owner/complaints':
        return 'Complaints Board';
      case '/owner/notices':
        return 'Notice Management';
      case '/student/dashboard':
        return 'Student Dashboard';
      case '/student/payments':
        return 'My Payments';
      case '/student/complaints':
        return 'My Complaints';
      case '/student/notices':
        return 'Notices';
      case '/student/profile':
        return 'My Profile';
      default:
        return 'SmartHostel';
    }
  };

  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const initials = getInitials(user.name);

  return (
    <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Title */}
      <h1 className="text-lg md:text-xl font-bold text-gray-800">
        {getPageTitle(location.pathname)}
      </h1>

      {/* User Info & Actions */}
      <div className="flex items-center gap-4">
        {/* User Details */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-800 leading-tight">{user.name}</p>
            <span className="text-[10px] uppercase font-bold tracking-wider text-primary px-2 py-0.5 bg-purple-50 rounded-full">
              {user.role}
            </span>
          </div>

          {/* Initials Avatar */}
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-inner border border-purple-200">
            {initials}
          </div>
        </div>

        {/* Mobile logout trigger (convenient) */}
        <button
          onClick={handleLogout}
          className="md:hidden p-2 text-gray-400 hover:text-red-500 hover:bg-gray-50 rounded-lg transition-colors"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
