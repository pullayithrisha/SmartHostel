import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login, selectAuth, clearAuthError } from '../../store/authSlice';
import { Mail, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [role, setRole] = useState('student'); // 'student' or 'owner'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(selectAuth);

  const validateForm = () => {
    const tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      tempErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(email)) {
      tempErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      tempErrors.password = 'Password is required.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    dispatch(clearAuthError());

    dispatch(login({ email: email.trim(), password, role }))
      .unwrap()
      .then((res) => {
        toast.success(`Welcome back, ${res.data.name}!`);
        if (role === 'owner') {
          navigate('/owner/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  return (
    <div className="min-h-screen bg-[#F8F7FF] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8 animate-slide-in">
        
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">🏠 SmartHostel</h2>
          <p className="text-sm text-gray-500 mt-2">Sign in to manage your room and accommodation.</p>
        </div>

        {/* Role Toggles */}
        <div className="flex border-b border-gray-100 mb-6 bg-gray-50 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setRole('student');
              dispatch(clearAuthError());
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              role === 'student'
                ? 'bg-[#534AB7] text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Student LogIn
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('owner');
              dispatch(clearAuthError());
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              role === 'owner'
                ? 'bg-[#534AB7] text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Hostel Owner LogIn
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email field */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 ${
                  errors.email
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-gray-200 focus:border-[#534AB7] focus:ring-[#534AB7]'
                }`}
                placeholder="john@example.com"
              />
            </div>
            {errors.email && <p className="text-red-500 text-[10px] mt-0.5">{errors.email}</p>}
          </div>

          {/* Password field */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-600">Password</label>
              <Link
                to="/forgot-password"
                className="text-[10px] font-bold text-[#534AB7] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
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
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-red-500 text-[10px] mt-0.5">{errors.password}</p>}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 bg-[#534AB7] hover:bg-[#3C3489] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-[#534AB7] hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
