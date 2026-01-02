import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔹 تحميل المستخدم من localStorage عند تشغيل التطبيق
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log("📦 storedUser from localStorage:", storedUser);

    if (storedUser) {
      queueMicrotask(() => {
        try {
          const parsedUser = JSON.parse(storedUser);

          console.log("✅ parsedUser:", parsedUser);
          console.log("🆔 parsedUser.userId:", parsedUser.userId);
          console.log("🆔 parsedUser._id (before fix):", parsedUser._id);

          // 🔥 التعديل المهم: توحيد الـ ID
          const fixedUser = {
            ...parsedUser,
            _id: parsedUser._id || parsedUser.userId, // ← الحل
          };

          console.log("🆔 fixedUser._id (after fix):", fixedUser._id);

          setUser(fixedUser);
        } catch (err) {
          console.error("❌ Failed to parse stored user:", err);
          setUser(null);
        }
      });
    }
  }, []);

  const login = (userData) => {
    console.log("🔐 login userData:", userData);

    const fixedUser = {
      ...userData,
      _id: userData._id || userData.userId,
    };

    localStorage.setItem("user", JSON.stringify(fixedUser));
    setUser(fixedUser);
  };

  const logout = () => {
    console.log("🚪 logout");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token: user?.token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
