import React, { useState } from 'react';
import { UserPlus, Eye, EyeOff, User, Mail, Lock, Home, Phone, Users, X } from 'lucide-react';
import axios from "axios";

const StudentRegister = ({ show, onClose, onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    roomNumber: '',
    hostelId: '',
    address: '',
    phone: '',
    parentNames: '',
    parentPhone: ''
  });

  const colors = {
    primary: '#2563eb',
    primaryDark: '#1d4ed8',
    gradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    background: '#f8fafc',
    card: '#ffffff',
    text: '#1e293b',
    textMuted: '#64748b',
    border: '#e2e8f0'
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const key in formData) {
      if (!formData[key]) {
        alert("Please fill all fields.");
        return;
      }
    }

    try {
      const response = await axios.post("http://localhost:5000/students/register", formData);
      alert("Student registration successful!");
      console.log("Register response:", response.data);
      onClose();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("Server error during registration");
      }
      console.error("Registration error:", error);
    }
  };

  if (!show) return null;

  return (
    <>
      <div 
        className="modal-overlay"
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(8px)',
          zIndex: 1050,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4px'
        }}
      >
        <div 
          className="modal-container"
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '400px', // Slightly increased width
            minWidth: '320px',
            maxHeight: '92vh',
            background: colors.card,
            borderRadius: '16px',
            boxShadow: '0 4px 24px rgba(37,99,235,0.10)',
            border: `1px solid ${colors.border}`,
            overflow: 'hidden',
            animation: 'modalSlide 0.3s ease-out',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Compact Header */}
          <div 
            style={{
              background: colors.gradient,
              color: '#fff',
              padding: '14px 18px 10px', // Increased padding
              position: 'relative'
            }}
          >
            <button 
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '8px',
                padding: '4px',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              <X size={14} />
            </button>
            
            <div className="d-flex align-items-center">
              <div 
                style={{
                  width: '28px',
                  height: '28px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '8px'
                }}
              >
                <UserPlus size={13} />
              </div>
              <div>
                <h4 className="mb-0 fw-bold" style={{ fontSize: '1rem' }}>Join SmartHostel</h4>
                <p className="mb-0 opacity-90 small" style={{ fontSize: '0.8rem' }}>Create your account</p>
              </div>
            </div>
          </div>

          {/* Form Body */}
          <div 
            style={{
              padding: '16px', // Increased padding
              background: colors.background,
              maxHeight: 'calc(92vh - 70px)',
              overflowY: 'auto'
            }}
          >
            <form onSubmit={handleSubmit}>
              <div className="row g-1">
                <div className="col-12">
                  <div className="input-group">
                    <span className="input-icon">
                      <User size={13} style={{ color: colors.textMuted }} />
                    </span>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="col-12">
                  <div className="input-group">
                    <span className="input-icon">
                      <Mail size={13} style={{ color: colors.textMuted }} />
                    </span>
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="col-12">
                  <div className="input-group">
                    <span className="input-icon">
                      <Lock size={13} style={{ color: colors.textMuted }} />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="form-input"
                      style={{ paddingRight: '28px' }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle"
                    >
                      {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                </div>

                <div className="col-6">
                  <div className="input-group">
                    <span className="input-icon">
                      <Home size={13} style={{ color: colors.textMuted }} />
                    </span>
                    <input
                      type="text"
                      placeholder="Room No."
                      value={formData.roomNumber}
                      onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="col-6">
                  <div className="input-group">
                    <span className="input-icon">
                      <Users size={13} style={{ color: colors.textMuted }} />
                    </span>
                    <input
                      type="text"
                      placeholder="Hostel ID"
                      value={formData.hostelId}
                      onChange={(e) => handleInputChange('hostelId', e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="col-12">
                  <div className="input-group">
                    <span className="input-icon">
                      <Home size={13} style={{ color: colors.textMuted }} />
                    </span>
                    <input
                      type="text"
                      placeholder="Home Address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="col-12">
                  <div className="input-group">
                    <span className="input-icon">
                      <Phone size={13} style={{ color: colors.textMuted }} />
                    </span>
                    <input
                      type="tel"
                      placeholder="Your Phone Number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="col-12">
                  <div className="input-group">
                    <span className="input-icon">
                      <Users size={13} style={{ color: colors.textMuted }} />
                    </span>
                    <input
                      type="text"
                      placeholder="Parent Names"
                      value={formData.parentNames}
                      onChange={(e) => handleInputChange('parentNames', e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="col-12">
                  <div className="input-group">
                    <span className="input-icon">
                      <Phone size={13} style={{ color: colors.textMuted }} />
                    </span>
                    <input
                      type="tel"
                      placeholder="Parent Phone Numbers"
                      value={formData.parentPhone}
                      onChange={(e) => handleInputChange('parentPhone', e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="submit-btn"
                style={{
                  width: '100%',
                  background: colors.primary,
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#fff',
                  marginTop: '10px',
                  boxShadow: '0 2px 8px rgba(37,99,235,0.13)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => {
                  e.target.style.background = colors.primaryDark;
                }}
                onMouseLeave={e => {
                  e.target.style.background = colors.primary;
                }}
              >
                Create Account
              </button>

              {/* Footer */}
              <div className="text-center mt-2">
                <p className="text-muted small mb-2" style={{ fontSize: '0.8rem' }}>Already have an account?</p>
                <span
                  onClick={() => {
                    onClose();
                    onSwitchToLogin();
                  }}
                  style={{
                    color: colors.primary,
                    textDecoration: 'underline',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'color 0.2s'
                  }}
                  className="switch-link"
                >
                  Sign In Instead
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .input-group {
          position: relative;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 2;
          pointer-events: none;
          color: ${colors.textMuted};
        }
        .form-input {
          width: 100%;
          padding: 8px 12px 8px 36px;
          border: none;
          border-radius: 10px;
          background: ${colors.card};
          font-size: 13px;
          font-weight: 500;
          color: ${colors.text};
          transition: box-shadow 0.2s;
          outline: none;
          box-shadow: 0 0 0 1.5px ${colors.border};
        }
        .form-input:focus {
          box-shadow: 0 0 0 2px ${colors.primary};
        }
        .form-input::placeholder {
          color: ${colors.textMuted};
          font-weight: 400;
        }
        .password-toggle {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: ${colors.textMuted};
          cursor: pointer;
          padding: 2px;
          border-radius: 5px;
          transition: background 0.2s, color 0.2s;
        }
        .password-toggle:hover {
          background: rgba(37,99,235,0.08);
          color: ${colors.primary};
        }
        .submit-btn {
          padding: 10px;
          font-size: 14px;
          border-radius: 10px;
          border: none;
          background: ${colors.primary};
          color: #fff;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(37,99,235,0.13);
          cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s;
        }
        .submit-btn:hover {
          background: ${colors.primaryDark};
          box-shadow: 0 6px 16px rgba(37,99,235,0.18);
        }
        .switch-link {
          border: none;
          background: none;
          color: ${colors.primary};
          text-decoration: underline;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.2s;
        }
        .switch-link:hover {
          color: ${colors.primaryDark};
        }
        @media (max-width: 480px) {
          .modal-container {
            max-width: calc(100vw - 12px) !important;
            margin: 4px;
            min-width: 0;
          }
          .form-input {
            padding: 8px 8px 8px 32px !important;
            font-size: 12px !important;
          }
          .input-icon {
            left: 7px !important;
          }
        }
        @media (min-width: 768px) {
          .modal-container {
            max-width: 420px;
          }
        }
      `}</style>
    </>
  );
};

export default StudentRegister;