import React, { useState } from "react";
import { User, Mail, Lock, Home, MapPin } from "lucide-react";
import axios from "axios";

const colors = {
  primary: '#7c3aed',
  card: '#fff',
  textMuted: '#64748b',
  border: '#e2e8f0',
  btnText: '#fff'
};

const AdminRegister = ({ show, onClose, onSwitchToLogin }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    hostelName: "",
    location: ""
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const key in form) {
      if (!form[key].trim()) {
        alert("Please fill all fields.");
        return;
      }
    }

    try {
      const response = await axios.post("http://localhost:5000/admin/register", form);
      alert(`Registration successful! Your Hostel ID: ${response.data.hostelId}`);
      onClose();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("Something went wrong");
      }
      console.error("Registration error:", error);
    }
  };

  if (!show) return null;

  return (
    <div style={{
      position: "fixed", top:0, left:0, right:0, bottom:0,
      background:"rgba(30,41,59,0.25)", zIndex:9999,
      display:"flex", alignItems:"center", justifyContent:"center"
    }}>
      <div style={{
        background: colors.card, borderRadius:20, padding:"2.5rem",
        minWidth:400, maxWidth:480, border:`1px solid ${colors.border}`, position:"relative"
      }}>
        <button onClick={onClose} style={{
          position:"absolute", top:18, right:18, background:"transparent",
          border:"none", fontSize:"1.5rem", color:colors.textMuted, cursor:"pointer"
        }}>&times;</button>

        <h2 style={{ color: colors.primary, textAlign:"center", marginBottom:"1.5rem" }}>Admin Registration</h2>

        <form onSubmit={handleSubmit}>
          <InputField icon={User} name="name" placeholder="Name" value={form.name} onChange={handleChange} />
          <InputField icon={Mail} name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <InputField icon={Home} name="hostelName" placeholder="Hostel Name" value={form.hostelName} onChange={handleChange} />
          <InputField icon={MapPin} name="location" placeholder="Location" value={form.location} onChange={handleChange} />
          <InputField icon={Lock} name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />

          <button type="submit" style={{
            width:"100%", background:colors.primary, color:colors.btnText,
            borderRadius:12, fontWeight:600, fontSize:"1.05rem", padding:"12px 0",
            border:"none", marginTop:10, cursor:"pointer"
          }}>Register</button>
        </form>

        <div style={{ textAlign:"center", marginTop:"1rem" }}>
          <span style={{ color: colors.primary, textDecoration:"underline", cursor:"pointer" }}
                onClick={() => { onClose(); onSwitchToLogin(); }}>Already have an account? Sign In</span>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ icon: Icon, name, placeholder, type="text", value, onChange }) => (
  <div style={{ position:"relative", marginBottom:"15px" }}>
    <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#7c3aed" }}>
      <Icon size={18} />
    </span>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{ width:"100%", padding:"10px 12px 10px 40px", border:"1px solid #e2e8f0", borderRadius:12, fontSize:"1rem", outline:"none" }}
    />
  </div>
);

export default AdminRegister;
