import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.jpg"
import "./Navbar.css";
function Navbar() {
  return (
    <nav className="navbar">
      {/* جهة الشمال: لوغو + اسم المنصة */}
      <div >
        <img src={logo} alt="Logo" style={{  margin: "0 0px" ,width: "60px", height: "40px", objectFit: "contain" }} />
        <span style={{ fontSize: "1rem", margin: "0px" }}> GetChance </span>
      </div>
         
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/login" >Login</Link>
        <Link to="/register" >Register</Link>
       
        <Link to="/profile" >Profile</Link>
        <Link to="/create-project">Create Project</Link>
      </div>
 </nav>
  );
}


export default Navbar;
