import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, login, selectAuth } from '../../store/authSlice';
import { User, ShieldAlert, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(''); // 'owner' or 'student'
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    hostelName: '',
    hostelAddress: '',
    hostelId: ''
  });

  const [errors, setErrors] = useState({});
  const [isStudentRegistered, setIsStudentRegistered] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(selectAuth);

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear validation error on change
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.name.trim()) tempErrors.name = 'Name is required.';
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required.';
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.phone.trim()) {
      tempErrors.phone = 'Phone number is required.';
    } else if (formData.phone.length < 10) {
      tempErrors.phone = 'Please enter a valid phone number.';
    }

    // Password validation: minimum 8 characters, at least one uppercase, one number
    const password = formData.password;
    if (!password) {
      tempErrors.password = 'Password is required.';
    } else {
      if (password.length < 8) {
        tempErrors.password = 'Password must be at least 8 characters.';
      } else if (!/[A-Z]/.test(password)) {
        tempErrors.password = 'Password must contain at least one uppercase letter.';
      } else if (!/[0-9]/.test(password)) {
        tempErrors.password = 'Password must contain at least one number.';
      }
    }

    if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match.';
    }

    if (role === 'owner') {
      if (!formData.hostelName.trim()) tempErrors.hostelName = 'Hostel name is required.';
      if (!formData.hostelAddress.trim()) tempErrors.hostelAddress = 'Hostel address is required.';
    } else {
      if (!formData.hostelId.trim()) {
        tempErrors.hostelId = 'Hostel ID is required.';
      } else if (!/^SH-[A-Z0-9]{6}$/.test(formData.hostelId.trim().toUpperCase())) {
        tempErrors.hostelId = 'Hostel ID must be in format SH-XXXXXX.';
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form.');
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email.trim(),
      password: formData.password,
      phone: formData.phone,
      role
    };

    if (role === 'owner') {
      payload.hostelName = formData.hostelName;
      payload.hostelAddress = formData.hostelAddress;
    } else {
      payload.hostelId = formData.hostelId.trim().toUpperCase();
    }

    dispatch(registerUser(payload))
      .unwrap()
      .then((res) => {
        toast.success(res.message || 'Registered successfully.');
        if (role === 'owner') {
          // Auto log in owner since token is returned directly on register
          if (res.token) {
            dispatch(login.fulfilled(res));
            navigate('/owner/dashboard');
          } else {
            navigate('/login');
          }
        } else {
          // Show student success screen
          setIsStudentRegistered(true);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  if (isStudentRegistered) {
    return (
      <div className="min-h-screen bg-[#F8F7FF] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center animate-slide-in">
          <div className="mx-auto w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Registration Submitted!</h2>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Your registration request for <strong>{formData.hostelId.toUpperCase()}</strong> has been submitted.
            Your account is currently pending owner approval. You will receive an email notice once approved.
          </p>
          <Link
            to="/login"
            className="inline-block w-full py-3 bg-[#534AB7] text-white rounded-xl font-bold shadow-lg hover:shadow-purple-100 hover:bg-[#3C3489] transition-all text-sm"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7FF] flex items-center justify-center p-4 py-12">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8 animate-slide-in">
        {step === 2 && (
          <button
            onClick={() => setStep(1)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#534AB7] hover:text-[#3C3489] mb-6 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Role Selection
          </button>
        )}

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">SmartHostel Registration</h1>
          <p className="text-sm text-gray-500 mt-2">Manage hostels and student accommodation efficiently.</p>
        </div>

        {step === 1 ? (
          <div>
            <p className="text-sm font-semibold text-gray-700 text-center mb-6">Choose your account type:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Owner card */}
              <div
                onClick={() => handleRoleSelect('owner')}
                className="group border-2 border-dashed border-purple-200 hover:border-[#534AB7] hover:bg-purple-50/30 p-6 rounded-2xl cursor-pointer text-center transition-all duration-300"
              >
                <div className="mx-auto w-12 h-12 bg-purple-50 text-[#534AB7] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
                  <ShieldAlert size={24} />
                </div>
                <h3 className="font-bold text-gray-800">I am an Owner</h3>
                <p className="text-xs text-gray-500 mt-1.5">Register a new hostel, manage rooms, bills, and students.</p>
              </div>

              {/* Student card */}
              <div
                onClick={() => handleRoleSelect('student')}
                className="group border-2 border-dashed border-purple-200 hover:border-[#534AB7] hover:bg-purple-50/30 p-6 rounded-2xl cursor-pointer text-center transition-all duration-300"
              >
                <div className="mx-auto w-12 h-12 bg-purple-50 text-[#534AB7] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
                  <User size={24} />
                </div>
                <h3 className="font-bold text-gray-800">I am a Student</h3>
                <p className="text-xs text-gray-500 mt-1.5">Join a hostel using an ID, request rooms, and track fees.</p>
              </div>
            </div>
            <div className="text-center mt-8 text-xs text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#534AB7] hover:underline">
                Login here
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-bold text-sm text-[#534AB7] uppercase tracking-wider border-b border-gray-100 pb-2 mb-4">
              Creating {role === 'owner' ? 'Owner' : 'Student'} Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 ${
                    errors.name
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-gray-200 focus:border-[#534AB7] focus:ring-[#534AB7]'
                  }`}
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-red-500 text-[10px] mt-0.5">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 ${
                    errors.email
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-gray-200 focus:border-[#534AB7] focus:ring-[#534AB7]'
                  }`}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-red-500 text-[10px] mt-0.5">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 ${
                    errors.phone
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-gray-200 focus:border-[#534AB7] focus:ring-[#534AB7]'
                  }`}
                  placeholder="e.g. 9876543210"
                />
                {errors.phone && <p className="text-red-500 text-[10px] mt-0.5">{errors.phone}</p>}
              </div>

              {/* Conditional ID / Name */}
              {role === 'student' ? (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Hostel ID</label>
                  <input
                    type="text"
                    name="hostelId"
                    value={formData.hostelId}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm uppercase placeholder:normal-case focus:outline-none focus:ring-1 ${
                      errors.hostelId
                        ? 'border-red-400 focus:ring-red-400'
                        : 'border-gray-200 focus:border-[#534AB7] focus:ring-[#534AB7]'
                    }`}
                    placeholder="Enter ID (SH-XXXXXX)"
                  />
                  <p className="text-[10px] text-gray-400 mt-0.5">Enter the ID provided by your hostel owner.</p>
                  {errors.hostelId && <p className="text-red-500 text-[10px] mt-0.5">{errors.hostelId}</p>}
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Hostel Name</label>
                  <input
                    type="text"
                    name="hostelName"
                    value={formData.hostelName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 ${
                      errors.hostelName
                        ? 'border-red-400 focus:ring-red-400'
                        : 'border-gray-200 focus:border-[#534AB7] focus:ring-[#534AB7]'
                    }`}
                    placeholder="e.g. Green Valley Hostel"
                  />
                  {errors.hostelName && <p className="text-red-500 text-[10px] mt-0.5">{errors.hostelName}</p>}
                </div>
              )}
            </div>

            {/* Hostel Address for Owners */}
            {role === 'owner' && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Hostel Address</label>
                <input
                  type="text"
                  name="hostelAddress"
                  value={formData.hostelAddress}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 ${
                    errors.hostelAddress
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-gray-200 focus:border-[#534AB7] focus:ring-[#534AB7]'
                  }`}
                  placeholder="Enter full physical address"
                />
                {errors.hostelAddress && <p className="text-red-500 text-[10px] mt-0.5">{errors.hostelAddress}</p>}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 ${
                    errors.password
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-gray-200 focus:border-[#534AB7] focus:ring-[#534AB7]'
                    }`}
                  placeholder="Min 8 characters, 1 upper, 1 num"
                />
                {errors.password && <p className="text-red-500 text-[10px] mt-0.5">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 ${
                    errors.confirmPassword
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-gray-200 focus:border-[#534AB7] focus:ring-[#534AB7]'
                  }`}
                  placeholder="Verify password"
                />
                {errors.confirmPassword && <p className="text-red-500 text-[10px] mt-0.5">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3 bg-[#534AB7] hover:bg-[#3C3489] text-white font-bold rounded-xl shadow-md disabled:opacity-75 flex justify-center items-center gap-2 text-sm transition-all"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <span>Complete Registration</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
