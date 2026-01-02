import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  // إذا ما في user، نتحقق من token في localStorage
  if (!user && !localStorage.getItem("token")) {
    return <Navigate to="/" replace />;
  }

  return children;
}
