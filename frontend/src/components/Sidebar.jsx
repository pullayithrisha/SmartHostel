import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuth, logout } from '../store/authSlice';
import {
  LayoutDashboard,
  DoorOpen,
  Users,
  CreditCard,
  AlertCircle,
  Bell,
  Home,
  User,
  LogOut
} from 'lucide-react';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const { user } = useSelector(selectAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully.');
    navigate('/login');
  };

  const ownerLinks = [
    { name: 'Dashboard', path: '/owner/dashboard', icon: LayoutDashboard },
    { name: 'Rooms', path: '/owner/rooms', icon: DoorOpen },
    { name: 'Students', path: '/owner/students', icon: Users },
    { name: 'Payments', path: '/owner/payments', icon: CreditCard },
    { name: 'Complaints', path: '/owner/complaints', icon: AlertCircle },
    { name: 'Notices', path: '/owner/notices', icon: Bell }
  ];

  const studentLinks = [
    { name: 'Home', path: '/student/dashboard', icon: Home },
    { name: 'Payments', path: '/student/payments', icon: CreditCard },
    { name: 'Complaints', path: '/student/complaints', icon: AlertCircle },
    { name: 'Notices', path: '/student/notices', icon: Bell },
    { name: 'Profile', path: '/student/profile', icon: User }
  ];

  const links = user.role === 'owner' ? ownerLinks : studentLinks;

  // Mobile navigation tabs (4 icons)
  const mobileLinks = user.role === 'owner' 
    ? [
        { name: 'Home', path: '/owner/dashboard', icon: LayoutDashboard },
        { name: 'Rooms', path: '/owner/rooms', icon: DoorOpen },
        { name: 'Students', path: '/owner/students', icon: Users },
        { name: 'Complaints', path: '/owner/complaints', icon: AlertCircle }
      ]
    : [
        { name: 'Home', path: '/student/dashboard', icon: Home },
        { name: 'Payments', path: '/student/payments', icon: CreditCard },
        { name: 'Complaints', path: '/student/complaints', icon: AlertCircle },
        { name: 'Profile', path: '/student/profile', icon: User }
      ];

  // Try to find hostel name
  const hostelName = user.hostel?.name || (user.role === 'owner' ? 'My Hostel' : 'SmartHostel');

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[220px] bg-[#26215C] text-white min-h-screen fixed left-0 top-0 z-40">
        {/* Logo Section */}
        <div className="p-6 border-b border-[#3C3489]/50">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>🏠</span> SmartHostel
          </h2>
          <p className="text-xs text-sidebar-text mt-1 truncate" title={hostelName}>
            {hostelName}
          </p>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#3C3489] text-white rounded-lg'
                      : 'text-[#AFA9EC] hover:bg-[#3C3489]/50 hover:text-white rounded-lg'
                  }`
                }
              >
                <Icon size={18} />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-[#3C3489]/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-300 hover:bg-red-900/30 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sticky Bottom Nav Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#26215C] text-[#AFA9EC] flex justify-around items-center h-16 border-t border-[#3C3489]/50 z-40">
        {mobileLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 h-full py-1 text-xs transition-colors ${
                  isActive ? 'text-white bg-[#3C3489]' : 'text-sidebar-text hover:text-white'
                }`
              }
            >
              <Icon size={20} className="mb-0.5" />
              <span className="text-[10px]">{link.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
};

export default Sidebar;
