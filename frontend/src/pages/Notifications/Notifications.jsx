import React, { useState } from "react";
import { FaBell, FaEnvelope } from "react-icons/fa";
import "./Notifications.css"; // ربط ملف التنسيقات

export default function Notifications() {
  const [tab, setTab] = useState("notifications");

  const notifications = [
    { id: 1, text: "تم قبول طلب انضمامك إلى المشروع", date: "منذ 2 ساعة" },
    { id: 2, text: "قام المستخدم علي بإرسال رسالة لك", date: "منذ 5 ساعات" },
    { id: 3, text: "تم تحديث حالة مشروعك", date: "أمس" },
  ];

  const messages = [
    { id: 1, user: "محمد", msg: "مرحبا، مهتم بالمشروع الخاص بك", time: "10:20AM" },
    { id: 2, user: "سارة", msg: "هل ما زال المشروع مفتوح للدعم؟", time: "أمس" },
    { id: 3, user: "أحمد", msg: "أرغب بالتعاون معك", time: "منذ يومين" },
  ];

  return (
    <div className="notifications-container">
      <h2 className="notifications-title">الإشعارات والمراسلات</h2>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={tab === "notifications" ? "tab-btn active" : "tab-btn"}
          onClick={() => setTab("notifications")}
        >
          <FaBell /> الإشعارات
        </button>

        <button
          className={tab === "messages" ? "tab-btn active" : "tab-btn"}
          onClick={() => setTab("messages")}
        >
          <FaEnvelope /> الرسائل
        </button>
      </div>

      {tab === "notifications" && (
        <div>
          {notifications.map(n => (
            <div key={n.id} className="card">
              <p>{n.text}</p>
              <span className="time">{n.date}</span>
            </div>
          ))}
        </div>
      )}

      {tab === "messages" && (
        <div>
          {messages.map(m => (
            <div key={m.id} className="card">
              <p><strong>{m.user}:</strong> {m.msg}</p>
              <span className="time">{m.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
