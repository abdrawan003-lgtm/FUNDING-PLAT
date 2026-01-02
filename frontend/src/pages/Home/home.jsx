"use client"

import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";


export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* النجوم */}
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      <div className="home-content">
        {/* <div className="logo-container"> */}
          {/* <img src={logo} alt="Logo"  className="home-logo" /> */}
        {/* </div> */}
        <h1 className="home-slogan">Get your star ⭐</h1>
        <p className="home-subtext">Start your journey and shine with us!</p>
        <button className="home-btn" onClick={() => navigate("/AuthPage")}>
          Get Started
        </button>
      </div>
    </div>
  );
}
