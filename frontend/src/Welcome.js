import React, { useState, useEffect } from "react";
import {
  Users,
  Building,
  Shield,
  Sun,
  Moon,
  ChevronRight,
  ArrowRight,
  Star,
  CheckCircle
} from "lucide-react";

// Import components
import StudentRegister from './student/StudentRegister';
import AdminRegister from './admin/AdminRegister';
import StudentLogin from './student/StudentLogin';
import AdminLogin from './admin/AdminLogin';

// Updated color scheme with better shades
const lightColors = {
  primary: '#2563eb', // Blue-600
  primaryLight: '#3b82f6', // Blue-500
  primaryDark: '#1d4ed8', // Blue-700
  secondary: '#6366f1', // Indigo-500
  secondaryLight: '#818cf8', // Indigo-400
  secondaryDark: '#4f46e5', // Indigo-600
  background: '#f8fafc', // Slate-50
  card: '#ffffff',
  text: '#1e293b', // Slate-800
  textMuted: '#64748b', // Slate-600
  border: '#e2e8f0', // Gray-200
  success: '#22c55e', // Green-500
  btnText: '#ffffff'
};

const darkColors = {
  primary: '#3b82f6', // Blue-500
  primaryLight: '#60a5fa', // Blue-400
  primaryDark: '#2563eb', // Blue-600
  secondary: '#818cf8', // Indigo-400
  secondaryLight: '#a5b4fc', // Indigo-300
  secondaryDark: '#6366f1', // Indigo-500
  background: '#0f172a', // Slate-900
  card: '#1e293b', // Slate-800
  text: '#f1f5f9', // Slate-100
  textMuted: '#94a3b8', // Slate-400
  border: '#334155', // Slate-700
  success: '#4ade80', // Green-400
  btnText: '#ffffff'
};

const Welcome = () => {
  const [showStudentLogin, setShowStudentLogin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showStudentRegister, setShowStudentRegister] = useState(false);
  const [showAdminRegister, setShowAdminRegister] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const colors = darkMode ? darkColors : lightColors;

  // Handle scroll animation
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle fade-in animation
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Features data
  const features = [
    {
      icon: <Users size={28} />,
      title: "Student Management",
      description: "Easy registration and profile management for students"
    },
    {
      icon: <Building size={28} />,
      title: "Hostel Administration",
      description: "Complete tools for hostel administrators"
    },
    {
      icon: <Shield size={28} />,
      title: "Secure Access",
      description: "Role-based authentication and data protection"
    }
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: colors.background,
        position: 'relative',
        transition: 'all 0.4s ease',
        overflowX: 'hidden'
      }}
      className={isVisible ? 'fade-in' : ''}
    >
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: `${10 + scrollPosition * 0.02}%`,
        right: '5%',
        width: '200px',
        height: '200px',
        background: darkMode
          ? 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite',
        transition: 'top 0.1s ease-out'
      }} />
      <div style={{
        position: 'absolute',
        bottom: `${15 + scrollPosition * 0.01}%`,
        left: '8%',
        width: '150px',
        height: '150px',
        background: darkMode
          ? 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(96,165,250,0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse',
        transition: 'bottom 0.1s ease-out'
      }} />

      {/* Header */}
      <header style={{
        background: colors.card,
        borderBottom: `1px solid ${colors.border}`,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: darkMode ? '0 4px 20px rgba(0, 0, 0, 0.15)' : '0 4px 20px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)'
      }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center py-3 py-md-4">
            {/* Logo */}
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center justify-content-center me-2 me-md-3"
                style={{
                  width: '42px',
                  height: '42px',
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(59,130,246,0.2)',
                  transition: 'all 0.3s ease'
                }}>
                <Building size={20} style={{ color: '#fff' }} />
              </div>
              <div>
                <h1 className="h3 h-md-2 mb-0 fw-bold" style={{ color: colors.text }}>
                  SmartHostel
                </h1>
              </div>
            </div>
            
            {/* Buttons */}
            <div className="d-flex gap-2 gap-md-3 align-items-center">
              <button
                onClick={() => setShowStudentLogin(true)}
                className="btn d-flex align-items-center px-3 px-md-4 py-2"
                style={{
                  background: `linear-gradient(to right, ${colors.primary}, ${colors.primaryDark})`,
                  color: colors.btnText,
                  borderRadius: '12px',
                  fontWeight: '600',
                  border: 'none',
                  boxShadow: '0 6px 20px rgba(37,99,235,0.15)',
                  transition: 'all 0.3s ease',
                  fontSize: '14px'
                }}
                onMouseEnter={e => {
                  e.target.style.background = `linear-gradient(to right, ${colors.primaryLight}, ${colors.primary})`;
                  e.target.style.boxShadow = '0 8px 24px rgba(37,99,235,0.25)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.target.style.background = `linear-gradient(to right, ${colors.primary}, ${colors.primaryDark})`;
                  e.target.style.boxShadow = '0 6px 20px rgba(37,99,235,0.15)';
                  e.target.style.transform = 'translateY(0)';
                }}>
                <Users className="me-1 me-md-2" size={16} />
                <span className="d-none d-md-inline">Student</span>
              </button>
              
              <button
                onClick={() => setShowAdminLogin(true)}
                className="btn d-flex align-items-center px-3 px-md-4 py-2"
                style={{
                  background: `linear-gradient(to right, ${colors.secondary}, ${colors.secondaryDark})`,
                  border: 'none',
                  color: colors.btnText,
                  borderRadius: '12px',
                  fontWeight: '600',
                  boxShadow: '0 6px 20px rgba(99,102,241,0.15)',
                  transition: 'all 0.3s ease',
                  fontSize: '14px'
                }}
                onMouseEnter={e => {
                  e.target.style.background = `linear-gradient(to right, ${colors.secondaryLight}, ${colors.secondary})`;
                  e.target.style.boxShadow = '0 8px 24px rgba(99,102,241,0.25)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.target.style.background = `linear-gradient(to right, ${colors.secondary}, ${colors.secondaryDark})`;
                  e.target.style.boxShadow = '0 6px 20px rgba(99,102,241,0.15)';
                  e.target.style.transform = 'translateY(0)';
                }}>
                <Shield className="me-1 me-md-2" size={16} />
                <span className="d-none d-md-inline">Admin</span>
              </button>
              
              {/* Theme toggle button */}
              <button
                className="btn d-flex align-items-center justify-content-center p-2"
                style={{
                  background: 'transparent',
                  border: `1px solid ${colors.border}`,
                  color: colors.text,
                  borderRadius: '50%',
                  width: '38px',
                  height: '38px',
                  transition: 'all 0.3s'
                }}
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                onClick={() => setDarkMode(!darkMode)}
                onMouseEnter={e => {
                  e.target.style.backgroundColor = colors.border;
                }}
                onMouseLeave={e => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container py-4 py-md-5" style={{ flex: 1, position: 'relative', zIndex: 2 }}>
        <div className="text-center mb-4 mb-md-5">
          <span className="badge fw-semibold px-3 px-md-4 py-2 mb-3"
            style={{
              background: darkMode ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.10)',
              color: colors.primary,
              borderRadius: '50px',
              fontSize: '14px',
              border: `2px solid ${darkMode ? 'rgba(59,130,246,0.25)' : 'rgba(59,130,246,0.18)'}`,
              animation: 'pulse 2s infinite'
            }}>
            🚀 Student & Admin Registration Portal
          </span>
          
         <h1 className="display-4 display-md-3 fw-bold mb-3 mb-md-4">
  Welcome to{" "}
 <span
  style={{
    display: 'inline-block',
    background: darkMode
      ? 'linear-gradient(135deg, #60a5fa, #a5b4fc)' // Dark mode gradient
      : 'linear-gradient(135deg, #2563eb, #6366f1)', // Light mode gradient
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: 'inherit',
    fontWeight: 800,
  }}
>
  SmartHostel
</span>
</h1> 
         <p className="lead mx-auto mb-4 mb-md-5" style={{ 
            maxWidth: "650px", 
            fontSize: '1.1rem', 
            lineHeight: 1.6, 
            color: colors.textMuted 
          }}>
            Register as a student or hostel admin and get started. This portal is for all hostels and students.
          </p>
          
          <div className="d-flex gap-3 gap-md-4 justify-content-center flex-wrap mb-5">
            <button
              className="btn btn-lg px-4 px-md-5 py-2 py-md-3 d-flex align-items-center"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                color: colors.btnText,
                borderRadius: '14px',
                fontWeight: '700',
                border: 'none',
                boxShadow: '0 12px 32px rgba(37,99,235,0.18)',
                transition: 'all 0.3s ease',
                fontSize: '16px'
              }}
              onClick={() => setShowStudentRegister(true)}
              onMouseEnter={e => {
                e.target.style.background = `linear-gradient(135deg, ${colors.primaryLight}, ${colors.primary})`;
                e.target.style.boxShadow = '0 16px 40px rgba(29,78,216,0.25)';
                e.target.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={e => {
                e.target.style.background = `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`;
                e.target.style.boxShadow = '0 12px 32px rgba(37,99,235,0.18)';
                e.target.style.transform = 'translateY(0)';
              }}>
              Join as Student
              <ArrowRight className="ms-2" size={18} />
            </button>
            
            <button
              className="btn btn-lg px-4 px-md-5 py-2 py-md-3 d-flex align-items-center"
              style={{
                background: `linear-gradient(135deg, ${colors.secondary}, ${colors.secondaryDark})`,
                color: colors.btnText,
                borderRadius: '14px',
                fontWeight: '700',
                border: 'none',
                boxShadow: '0 12px 32px rgba(99,102,241,0.18)',
                transition: 'all 0.3s ease',
                fontSize: '16px'
              }}
              onClick={() => setShowAdminRegister(true)}
              onMouseEnter={e => {
                e.target.style.background = `linear-gradient(135deg, ${colors.secondaryLight}, ${colors.secondary})`;
                e.target.style.boxShadow = '0 16px 40px rgba(79,70,229,0.25)';
                e.target.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={e => {
                e.target.style.background = `linear-gradient(135deg, ${colors.secondary}, ${colors.secondaryDark})`;
                e.target.style.boxShadow = '0 12px 32px rgba(99,102,241,0.18)';
                e.target.style.transform = 'translateY(0)';
              }}>
              Register Hostel
              <ChevronRight className="ms-2" size={18} />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          background: colors.card,
          color: colors.text,
          width: "100%",
          marginTop: "auto",
          borderTop: `1px solid ${colors.border}`,
          boxShadow: "0 -4px 12px rgba(0,0,0,0.03)",
          padding: "0"
        }}
      >
        <div className="container py-3 py-md-4 text-center">
          <div className="small" style={{ color: colors.textMuted }}>
            &copy; 2025 SmartHostel. All rights reserved. |{" "}
            <a href="#" style={{ color: colors.primary, textDecoration: "none", opacity: 0.9 }}>
              Terms
            </a>{" "}
            &amp;{" "}
            <a href="#" style={{ color: colors.primary, textDecoration: "none", opacity: 0.9 }}>
              Policies
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <StudentRegister
        show={showStudentRegister}
        onClose={() => setShowStudentRegister(false)}
        onSwitchToLogin={() => setShowStudentLogin(true)}
      />
      <AdminRegister
        show={showAdminRegister}
        onClose={() => setShowAdminRegister(false)}
        onSwitchToLogin={() => setShowAdminLogin(true)}
      />
      <StudentLogin
        show={showStudentLogin}
        onClose={() => setShowStudentLogin(false)}
        onSwitchToRegister={() => setShowStudentRegister(true)}
      />
      <AdminLogin
        show={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onSwitchToRegister={() => setShowAdminRegister(true)}
      />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .fade-in {
          animation: fadeIn 0.8s ease forwards;
        }
        
        /* Mobile responsiveness */
        @media (max-width: 576px) {
          .display-4 { font-size: 2rem !important; }
          .display-md-3 { font-size: 2.2rem !important; }
          .lead { font-size: 1rem !important; }
          .btn-lg { padding: 12px 20px !important; font-size: 15px !important; }
          .h3 { font-size: 1.3rem !important; }
          .h-md-2 { font-size: 1.5rem !important; }
          .container { padding-left: 12px !important; padding-right: 12px !important; }
          footer .container { padding-top: 16px !important; padding-bottom: 16px !important; }
        }
        
        @media (max-width: 768px) {
          .container { padding-left: 15px !important; padding-right: 15px !important; }
          .py-5 { padding-top: 2rem !important; padding-bottom: 2rem !important; }
          .row { flex-direction: column !important; }
        }
        
        @media (min-width: 992px) {
          .display-md-3 { font-size: calc(1.8rem + 1.5vw) !important; }
        }
        
        .btn:active { transform: translateY(1px) !important; }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Selection color */
        ::selection {
          background: ${colors.primary}40;
        }
      `}</style>
    </div>
  );
};

export default Welcome;