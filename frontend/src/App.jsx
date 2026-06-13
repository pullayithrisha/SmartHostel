import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Shared Components
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Owner Pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import RoomsManage from './pages/owner/RoomsManage';
import StudentsList from './pages/owner/StudentsList';
import PaymentsView from './pages/owner/PaymentsView';
import ComplaintsManage from './pages/owner/ComplaintsManage';
import NoticesManage from './pages/owner/NoticesManage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import MyPayments from './pages/student/MyPayments';
import MyComplaints from './pages/student/MyComplaints';
import Notices from './pages/student/Notices';
import Profile from './pages/student/Profile';

// Layout Wrapper for Dashboard Pages
const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8F7FF]">
      {/* Sidebar handles desktop left nav and mobile bottom nav */}
      <Sidebar />

      {/* Content wrapper */}
      <div className="flex-1 flex flex-col md:pl-[220px] pb-16 md:pb-0 min-h-screen">
        <Navbar />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {/* Toast Alert Provider */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'font-semibold text-xs rounded-xl shadow-md border border-gray-50',
          duration: 3000,
          success: {
            style: {
              background: '#ECFDF5',
              color: '#065F46',
              border: '1px solid #A7F3D0'
            }
          },
          error: {
            style: {
              background: '#FEF2F2',
              color: '#991B1B',
              border: '1px solid #FCA5A5'
            }
          }
        }}
      />

      <Routes>
        {/* Redirect / to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Owner Protected Routes */}
        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute role="owner">
              <DashboardLayout>
                <OwnerDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/rooms"
          element={
            <ProtectedRoute role="owner">
              <DashboardLayout>
                <RoomsManage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/students"
          element={
            <ProtectedRoute role="owner">
              <DashboardLayout>
                <StudentsList />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/payments"
          element={
            <ProtectedRoute role="owner">
              <DashboardLayout>
                <PaymentsView />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/complaints"
          element={
            <ProtectedRoute role="owner">
              <DashboardLayout>
                <ComplaintsManage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/notices"
          element={
            <ProtectedRoute role="owner">
              <DashboardLayout>
                <NoticesManage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Student Protected Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute role="student">
              <DashboardLayout>
                <StudentDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/payments"
          element={
            <ProtectedRoute role="student">
              <DashboardLayout>
                <MyPayments />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/complaints"
          element={
            <ProtectedRoute role="student">
              <DashboardLayout>
                <MyComplaints />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/notices"
          element={
            <ProtectedRoute role="student">
              <DashboardLayout>
                <Notices />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute role="student">
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
