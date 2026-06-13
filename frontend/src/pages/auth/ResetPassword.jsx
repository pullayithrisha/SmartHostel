import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { resetPassword, selectAuth } from '../../store/authSlice';
import { Lock, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading } = useSelector(selectAuth);

  const tempToken = location.state?.tempToken;

  useEffect(() => {
    if (!tempToken) {
      toast.error('Session expired or invalid. Please request a new OTP.');
      navigate('/forgot-password');
    }
  }, [tempToken, navigate]);

  const validateForm = () => {
    const tempErrors = {};

    if (!password) {
      tempErrors.password = 'New password is required.';
    } else {
      if (password.length < 8) {
        tempErrors.password = 'Password must be at least 8 characters.';
      } else if (!/[A-Z]/.test(password)) {
        tempErrors.password = 'Password must contain at least one uppercase letter.';
      } else if (!/[0-9]/.test(password)) {
        tempErrors.password = 'Password must contain at least one number.';
      }
    }

    if (password !== confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    dispatch(resetPassword({ tempToken, password }))
      .unwrap()
      .then((res) => {
        toast.success(res.message || 'Password reset successful. Please login.');
        navigate('/login');
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  if (!tempToken) return null;

  return (
    <div className="min-h-screen bg-[#F8F7FF] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8 animate-slide-in">
        
        {/* Back Link */}
        <Link
          to="/forgot-password"
          className="flex items-center gap-1.5 text-xs font-bold text-[#534AB7] hover:text-[#3C3489] mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Back to OTP Verification
        </Link>

        {/* Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Set New Password</h2>
          <p className="text-xs text-gray-500 mt-1">
            Choose a strong, secure password for your SmartHostel account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password field */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">New Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <Lock size={16} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 ${
                  errors.password
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-gray-200 focus:border-[#534AB7] focus:ring-[#534AB7]'
                }`}
                placeholder="Min 8 characters, 1 upper, 1 num"
              />
            </div>
            {errors.password && <p className="text-red-500 text-[10px] mt-0.5">{errors.password}</p>}
          </div>

          {/* Confirm Password field */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Confirm New Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <Lock size={16} />
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                }}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 ${
                  errors.confirmPassword
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-gray-200 focus:border-[#534AB7] focus:ring-[#534AB7]'
                }`}
                placeholder="Verify new password"
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-[10px] mt-0.5">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 bg-[#534AB7] hover:bg-[#3C3489] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saving Password...</span>
              </>
            ) : (
              <span>Save & Update Password</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
