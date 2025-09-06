import React, { useState } from "react";
import { KeyRound, Building, Eye, EyeOff } from "lucide-react";

const colors = {
  primary: '#7c3aed',
  card: '#fff',
  btnText: '#fff'
};

const AdminLogin = ({ show, onClose, onSwitchToRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ hostelId:"", password:"" });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.hostelId.trim()) return alert("Please enter Hostel ID or Email");
    if (!form.password.trim()) return alert("Please enter Password");

    try {
      const res = await fetch("http://localhost:5000/admin/login", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(form)
      });
      const data = await res.json();
      alert(data.message);  // Shows proper backend message

      if (data.message === "Login successful") onClose();
    } catch(err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  if (!show) return null;

  return (
    <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(30,41,59,0.25)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:colors.card, borderRadius:20, padding:"2.5rem", minWidth:400, maxWidth:480, position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute", top:18, right:18, background:"transparent", border:"none", fontSize:"1.5rem", cursor:"pointer" }}>&times;</button>
        <h2 style={{ color: colors.primary, textAlign:"center", marginBottom:"1.5rem" }}>Admin Login</h2>

        <form onSubmit={handleSubmit}>
          <InputField icon={Building} name="hostelId" placeholder="Hostel ID or Email" value={form.hostelId} onChange={handleChange} />
          <InputField icon={KeyRound} name="password" type={showPassword?"text":"password"} placeholder="Password" value={form.password} onChange={handleChange} showPassword={showPassword} togglePassword={() => setShowPassword(!showPassword)} />

          <button type="submit" style={{ width:"100%", background:colors.primary, color:colors.btnText, borderRadius:12, fontWeight:600, fontSize:"1.05rem", padding:"12px 0", border:"none", marginTop:10 }}>Login</button>
        </form>

        <div style={{ textAlign:"center", marginTop:"1rem" }}>
          <span style={{ color: colors.primary, textDecoration:"underline", cursor:"pointer" }}
                onClick={() => { onClose(); onSwitchToRegister(); }}>Register Hostel</span>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ icon: Icon, name, placeholder, type="text", value, onChange, showPassword, togglePassword }) => (
  <div style={{ position:"relative", marginBottom:"15px" }}>
    <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#7c3aed" }}>
      <Icon size={18}/>
    </span>
    <input type={type} name={name} placeholder={placeholder} value={value} onChange={onChange} style={{ width:"100%", padding:"10px 12px 10px 40px", border:"1px solid #e2e8f0", borderRadius:12, fontSize:"1rem", outline:"none" }} />
    {togglePassword && <button type="button" onClick={togglePassword} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer" }}>{showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}</button>}
  </div>
);

export default AdminLogin;
