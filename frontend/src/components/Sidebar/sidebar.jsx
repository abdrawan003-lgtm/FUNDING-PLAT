import { NavLink,  } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import "./Sidebar.css";

export default function Sidebar({ isOpen, onClose }) {
 const { user} = useContext(AuthContext);

  return (
    <>
      {/* overlay فقط يغطي عند فتح السايد بار */}
      {isOpen && <div className="overlay" onClick={onClose}></div>}

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* قائمة الروابط */}
        <nav className="menu" onClick={onClose}>
          <NavLink to="/home" className="link">🏠 Home</NavLink>
          <NavLink to="/projects" className="link">📁 Projects</NavLink>
          <NavLink to={`/profile/${user?._id}`} className="link">👤 Profile</NavLink>
          {user?.accountType === "requester" && (<NavLink to="/create-project" className="link">➕ CreateProject</NavLink>)}
          <NavLink to="/notifications" className="link">📩 Notifications</NavLink>
          <NavLink to="/AuthPage" className="link">🚪 Logout</NavLink>
         
        </nav>
      </div>
    </>
  );
}
