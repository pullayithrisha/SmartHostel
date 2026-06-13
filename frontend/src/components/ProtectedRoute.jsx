import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuth, logout } from '../store/authSlice';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useSelector(selectAuth);
  const location = useLocation();
  const dispatch = useDispatch();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Double check approval for students
  if (user.role === 'student' && !user.isApproved) {
    dispatch(logout());
    toast.error('Your account is pending approval from the hostel owner. Please wait.');
    return <Navigate to="/login" replace />;
  }

  // If role does not match requirements, redirect to own dashboard
  if (role && user.role !== role) {
    const redirectPath = user.role === 'owner' ? '/owner/dashboard' : '/student/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
