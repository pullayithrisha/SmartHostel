import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, verifyOTP, selectAuth } from '../../store/authSlice';
import { Mail, KeyRound, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [otpError, setOtpError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(selectAuth);

  const handleSendOTP = (e) => {
    e.preventDefault();
    setEmailError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email address is required.');
      return;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    dispatch(forgotPassword({ email: email.trim() }))
      .unwrap()
      .then((res) => {
        toast.success(res.message || 'OTP sent to your email.');
        setOtpSent(true);
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    setOtpError('');

    if (!otp.trim() || otp.trim().length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP.');
      return;
    }

    dispatch(verifyOTP({ email: email.trim(), otp: otp.trim() }))
      .unwrap()
      .then((res) => {
        toast.success(res.message || 'OTP verified successfully.');
        // Navigate to reset password page passing the tempToken
        navigate('/reset-password', { state: { tempToken: res.tempToken } });
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  return (
    <div className="min-h-screen bg-[#F8F7FF] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8 animate-slide-in">
        
        {/* Back Link */}
        <Link
          to="/login"
          className="flex items-center gap-1.5 text-xs font-bold text-[#534AB7] hover:text-[#3C3489] mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Login
        </Link>

        {/* Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
          <p className="text-xs text-gray-500 mt-1">
            {!otpSent 
              ? 'Enter your registered email to receive a 6-digit verification code.'
              : 'Enter the 6-digit OTP code sent to your inbox.'}
          </p>
        </div>

        {!otpSent ? (
          /* Step 1: Send OTP */
          <form onSubmit={handleSendOTP} className="space-y-4">
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
                    if (emailError) setEmailError('');
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 ${
                    emailError
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-gray-200 focus:border-[#534AB7] focus:ring-[#534AB7]'
                  }`}
                  placeholder="john@example.com"
                />
              </div>
              {emailError && <p className="text-red-500 text-[10px] mt-0.5">{emailError}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#534AB7] hover:bg-[#3C3489] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Sending OTP...</span>
                </>
              ) : (
                <span>Request OTP Code</span>
              )}
            </button>
          </form>
        ) : (
          /* Step 2: Verify OTP */
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Enter 6-Digit OTP</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <KeyRound size={16} />
                </span>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    if (otpError) setOtpError('');
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm tracking-[6px] text-center font-bold focus:outline-none focus:ring-1 ${
                    otpError
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-gray-200 focus:border-[#534AB7] focus:ring-[#534AB7]'
                  }`}
                  placeholder="000000"
                />
              </div>
              {otpError && <p className="text-red-500 text-[10px] mt-0.5">{otpError}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#534AB7] hover:bg-[#3C3489] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Verifying OTP...</span>
                </>
              ) : (
                <span>Verify OTP & Proceed</span>
              )}
            </button>

            {/* Back to Email */}
            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="w-full text-center text-xs text-gray-500 hover:text-gray-700 font-medium py-1"
            >
              Change Email / Re-send OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
