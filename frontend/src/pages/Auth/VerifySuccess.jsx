import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function VerifySuccess() {
  const navigate = useNavigate();
console.log("VerifySuccess loaded");
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/"); // ارجاع لصفحة  بعد 3 ثواني
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>✅ Email Verified Successfully</h2>
      <p>You will be redirected to login shortly...</p>
    </div>
  );
}
