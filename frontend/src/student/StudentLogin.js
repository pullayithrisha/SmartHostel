import React, { useState } from 'react';
import { Users, Eye, EyeOff, Mail, Lock, LogIn, X } from 'lucide-react';

const StudentLogin = ({ show, onClose, onSwitchToRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const colors = {
    primary: '#3b82f6',
    primaryDark: '#2563eb',
    secondary: '#8b5cf6',
    background: '#f8fafc',
    card: '#ffffff',
    text: '#1e293b',
    textMuted: '#64748b',
    border: '#e2e8f0',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Student login data:', formData);
    alert('Student login successful!');
    onClose();
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
          padding: '16px'
        }}
      >
        <div 
          className="modal-container"
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '400px',
            background: colors.card,
            borderRadius: '20px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            overflow: 'hidden',
            animation: 'modalSlide 0.3s ease-out'
          }}
        >
          {/* Compact Header */}
          <div 
            style={{
              background: colors.gradient,
              color: '#fff',
              padding: '24px 24px 20px',
              position: 'relative',
              textAlign: 'center'
            }}
          >
            <button 
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
            
            <div 
              style={{
                width: '56px',
                height: '56px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}
            >
              <Users size={28} />
            </div>
            <h3 className="mb-1 fw-bold">Welcome Back</h3>
            <p className="mb-0 opacity-90 small">Sign in to continue</p>
          </div>

          {/* Form Body */}
          <div 
            style={{
              padding: '32px 24px 24px',
              background: colors.background
            }}
          >
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <span className="input-icon">
                  <Mail size={16} style={{ color: colors.textMuted }} />
                </span>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="input-group">
                <span className="input-icon">
                  <Lock size={16} style={{ color: colors.textMuted }} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="form-input"
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Remember & Forgot */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <label className="d-flex align-items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="form-check-input me-2"
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px'
                    }}
                  />
                  <span className="small fw-medium" style={{ color: colors.text }}>Remember me</span>
                </label>
                <button
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: colors.primary,
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="submit-btn"
                style={{
                  width: '100%',
                  background: colors.gradient,
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#fff',
                  boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  marginBottom: '20px'
                }}
              >
                <LogIn size={18} className="me-2" />
                Sign In
              </button>

              {/* Register Link */}
              <div className="text-center">
                <p className="text-muted small mb-2">New to SmartHostel?</p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSwitchToRegister();
                  }}
                  style={{
                    background: 'none',
                    border: `2px solid ${colors.primary}`,
                    color: colors.primary,
                    borderRadius: '10px',
                    padding: '8px 20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  className="switch-btn"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalSlide {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .input-group {
          position: relative;
          margin-bottom: 20px;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 2;
          pointer-events: none;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px 12px 44px;
          border: 2px solid ${colors.border};
          border-radius: 12px;
          background: ${colors.card};
          font-size: 15px;
          font-weight: 500;
          color: ${colors.text};
          transition: all 0.3s ease;
          outline: none;
        }

        .form-input:focus {
          border-color: ${colors.primary};
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          transform: translateY(-1px);
        }

        .form-input::placeholder {
          color: ${colors.textMuted};
          font-weight: 400;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: ${colors.textMuted};
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .password-toggle:hover {
          background: rgba(59, 130, 246, 0.1);
          color: ${colors.primary};
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(59, 130, 246, 0.4) !important;
        }

        .switch-btn:hover {
          background: ${colors.primary} !important;
          color: #fff !important;
          transform: translateY(-1px);
        }

        .cursor-pointer {
          cursor: pointer;
        }

        /* Mobile Responsive */
        @media (max-width: 480px) {
          .modal-container {
            max-width: calc(100vw - 24px) !important;
            margin: 12px;
          }
          
          .modal-body {
            padding: 24px 16px 20px !important;
          }
          
          .modal-header {
            padding: 20px 16px 16px !important;
          }

          .form-input {
            padding: 11px 14px 11px 40px !important;
            font-size: 14px !important;
          }

          .input-icon {
            left: 12px !important;
          }

          .submit-btn {
            padding: 12px !important;
            font-size: 15px !important;
          }
        }

        @media (max-width: 320px) {
          .modal-container {
            max-width: calc(100vw - 16px) !important;
            margin: 8px;
          }
        }
      `}</style>
    </>
  );
};

export default StudentLogin;