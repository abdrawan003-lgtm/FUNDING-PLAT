import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import "./auth.css";
import logo from "../../assets/logo.jpg";

function AuthPage() {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("supporter");
  const [verifiedMsg, setVerifiedMsg] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get("verified") === "true") {
      queueMicrotask(() => {
        setVerifiedMsg(
          "تم التحقق من بريدك الإلكتروني بنجاح! يمكنك الآن تسجيل الدخول."
        );
        setMode("login");
      });
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body =
      mode === "register"
        ? { username, email, password, accountType }
        : { email, password };

    try {
      const url =
        mode === "register"
          ? "http://localhost:5005/api/auth/register"
          : "http://localhost:5005/api/auth/login";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (res.ok) {
        if (data.token) {
          // ✅ تخزين المستخدم في localStorage
          const userData = {
            token: data.token,
            username: data.username,
            userId: data.userId,
            accountType: data.accountType,
          };

          localStorage.setItem("user", JSON.stringify(userData));

          // اختياري: Context
          login(userData);
        }

        navigate("/projects");
      } else {
        alert(data?.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <img src={logo} alt="Logo" />
      </div>

      <div className="auth-right">
        <div>
          {verifiedMsg && <p className="verify-msg">{verifiedMsg}</p>}

          <div className="auth-box">
            <h2 className="auth-title">
              {mode === "login" ? "Login" : "Create an Account"}
            </h2>

            <form onSubmit={handleSubmit} className="auth-form">
              {mode === "register" && (
                <input
                  type="text"
                  placeholder="Full Name"
                  className="auth-input"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              )}

              <input
                type="email"
                placeholder="Email Address"
                className="auth-input"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                className="auth-input"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {mode === "register" && (
                <div className="account-type">
                  <label>
                    <input
                      type="radio"
                      name="accountType"
                      value="supporter"
                      checked={accountType === "supporter"}
                      onChange={(e) => setAccountType(e.target.value)}
                    />
                    Supporter
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="accountType"
                      value="requester"
                      checked={accountType === "requester"}
                      onChange={(e) => setAccountType(e.target.value)}
                    />
                    Owner
                  </label>
                </div>
              )}

              <button type="submit" className="auth-btn">
                {mode === "login" ? "Login" : "Register"}
              </button>
            </form>

            <p className="auth-switch">
              {mode === "login" ? (
                <>
                  Don’t have an account?
                  <span onClick={() => setMode("register")}> Create one</span>
                </>
              ) : (
                <>
                  Already have an account?
                  <span onClick={() => setMode("login")}> Login</span>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
