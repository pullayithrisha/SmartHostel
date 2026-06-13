import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProfile,
  updateProfile,
  uploadPhoto,
  changePassword,
  selectAuth
} from '../../store/authSlice';
import { User, Phone, ShieldAlert, KeyRound, Building, DoorOpen, Upload, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector(selectAuth);
  const fileInputRef = useRef(null);

  // Profile Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  // Password State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Sync loaded user profile details to local input states
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setEmergencyContact(user.emergencyContact || '');
    }
  }, [user]);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error('Name and Phone are required.');
      return;
    }

    dispatch(updateProfile({
      name: name.trim(),
      phone: phone.trim(),
      emergencyContact: emergencyContact.trim()
    }))
      .unwrap()
      .then((res) => {
        toast.success(res.message || 'Profile details updated.');
        dispatch(fetchProfile());
      })
      .catch((err) => toast.error(err));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      toast.error('Please fill in password fields.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      toast.error('Password must be 8+ chars with 1 uppercase and 1 number.');
      return;
    }

    dispatch(changePassword({ oldPassword, newPassword }))
      .unwrap()
      .then((res) => {
        toast.success(res.message || 'Password updated successfully.');
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      })
      .catch((err) => toast.error(err));
  };

  const handlePhotoUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    dispatch(uploadPhoto(formData))
      .unwrap()
      .then((res) => {
        toast.success(res.message || 'Profile photo uploaded.');
        dispatch(fetchProfile());
      })
      .catch((err) => toast.error(err));
  };

  const getInitials = (nameStr) => {
    if (!nameStr) return '';
    const parts = nameStr.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return nameStr[0].toUpperCase();
  };

  const initials = getInitials(user?.name);
  const photoUrl = user?.profilePhoto 
    ? `http://localhost:5000/uploads/${user.profilePhoto}` 
    : null;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">My Profile</h2>
        <p className="text-xs text-gray-500 mt-1">Manage personal contact info, profile photos, and account security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Photo Upload & Read-only Hostel/Room details */}
        <div className="space-y-6 lg:col-span-1">
          {/* Avatar card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
            <div className="relative group cursor-pointer" onClick={handlePhotoUploadClick}>
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-purple-100 shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-purple-50 text-[#534AB7] border-2 border-purple-100 flex items-center justify-center font-extrabold text-3xl shadow-inner uppercase">
                  {initials}
                </div>
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200">
                <Upload size={18} />
              </div>
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            
            <button
              onClick={handlePhotoUploadClick}
              className="mt-4 flex items-center gap-1 px-3 py-1.5 border border-purple-200 hover:bg-purple-50 text-xs font-bold text-[#534AB7] rounded-xl transition-colors bg-white shadow-sm"
            >
              Change Photo
            </button>
          </div>

          {/* Hostel info read-only */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
            <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-50 pb-2.5">
              <Building size={14} className="text-[#534AB7]" /> Hostel Info
            </h3>
            <div className="text-xs space-y-2.5 font-semibold text-gray-500">
              <div>
                <span className="text-gray-400 block text-[9px] uppercase font-extrabold tracking-wider">Hostel Name</span>
                <span className="text-gray-800 block mt-0.5">{user?.hostel?.name || 'Unlinked'}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[9px] uppercase font-extrabold tracking-wider">Hostel ID</span>
                <span className="text-[#534AB7] font-extrabold tracking-wider block mt-0.5">{user?.hostel?.hostelId || '—'}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[9px] uppercase font-extrabold tracking-wider">Physical Address</span>
                <span className="text-gray-800 block mt-0.5 font-medium leading-relaxed">{user?.hostel?.address || '—'}</span>
              </div>
            </div>
          </div>

          {/* Room info read-only */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
            <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-50 pb-2.5">
              <DoorOpen size={14} className="text-[#534AB7]" /> Assigned Room Details
            </h3>
            {user?.room ? (
              <div className="text-xs space-y-2.5 font-semibold text-gray-500">
                <div>
                  <span className="text-gray-400 block text-[9px] uppercase font-extrabold tracking-wider">Room Placement</span>
                  <span className="text-gray-800 block mt-0.5">Room {user.room.roomNumber} ({user.room.type} sharing)</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[9px] uppercase font-extrabold tracking-wider">Floor Level</span>
                  <span className="text-gray-800 block mt-0.5">Floor {user.room.floor}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[9px] uppercase font-extrabold tracking-wider">Monthly Rent</span>
                  <span className="text-gray-800 block mt-0.5">₹{user.room.rent}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">No room assigned yet.</p>
            )}
          </div>
        </div>

        {/* Right column: Editable profile contact details & Change Password */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile fields card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 text-sm mb-4 pb-2 border-b border-gray-100">
              Personal Information
            </h3>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#534AB7] focus:ring-1 focus:ring-[#534AB7]"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#534AB7] focus:ring-1 focus:ring-[#534AB7]"
                  />
                </div>
              </div>

              {/* Emergency contact */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Emergency Contact Number</label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#534AB7] focus:ring-1 focus:ring-[#534AB7]"
                  placeholder="e.g. Guardian's or Parent's Phone"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-[#534AB7] hover:bg-[#3C3489] text-white font-bold rounded-xl text-xs shadow-md transition-all disabled:opacity-50"
                >
                  Save Information
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 text-sm mb-4 pb-2 border-b border-gray-100 flex items-center gap-1.5">
              <KeyRound size={16} className="text-[#534AB7]" />
              Account Password Security
            </h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {/* Old password */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Current Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#534AB7] focus:ring-1 focus:ring-[#534AB7]"
                  placeholder="Enter current password"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* New Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#534AB7] focus:ring-1 focus:ring-[#534AB7]"
                    placeholder="Min 8 characters, 1 upper, 1 number"
                  />
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#534AB7] focus:ring-1 focus:ring-[#534AB7]"
                    placeholder="Re-type new password"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-[#534AB7] hover:bg-[#3C3489] text-white font-bold rounded-xl text-xs shadow-md transition-all disabled:opacity-50"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;
