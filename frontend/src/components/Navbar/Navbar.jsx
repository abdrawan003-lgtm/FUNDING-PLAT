import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.jpg"
function Navbar() {
  return (
    <nav>
    
      {/* جهة الشمال: لوغو + اسم المنصة */}
      <div style={{ display: "flex", alignItems: "center", gap: "0px" }}>
        <img src={logo} alt="Logo" style={{  margin: "0 0px" ,width: "60px", height: "40px", objectFit: "contain" }} />
        <span style={{ fontSize: "1rem", margin: "0 0px" }}> GetChance </span>
      </div>
         
      <div>
        <Link to="/">Home</Link>
        <Link to="/login" >Login</Link>
        <Link to="/register" >Register</Link>
        <Link to="/dashboard" >Dashboard</Link>
        <Link to="/profile" >Profile</Link>
        <Link to="/create-project">Create Project</Link>
      </div>
 </nav>
  );
}


export default Navbar;
