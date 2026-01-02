import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext.jsx";
import "./Notifications.css"
export default function Notifications() {
  const { user, token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  

  useEffect(() => {
    if (!user || !token) return;
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:5005/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("NOTIFICATIONS RESPONSE:", res.data);

        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    fetchNotifications();
  }, [user, token]);

  return (
    <div className="notifications-page">
      <h2>Notifications 🔔</h2>
      <div className="notifications-list">
        {notifications.map((n) => (
          <div key={n._id} className="notification-box">
            <p>{n.message}</p> <br/>
            {n.project && <span> <br/>Project name: {n.project.title}</span>}
            <br/>
            <small>{new Date(n.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
