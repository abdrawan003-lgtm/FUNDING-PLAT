import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function ProjectDetails() {
  const { id: projectId } = useParams();
  const { user } = useContext(AuthContext);

  const [project, setProject] = useState(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const messagesEndRef = useRef(null);
  const socketRef = useRef();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    // تحميل تفاصيل المشروع
    const fetchProject = async () => {
      try {
        const res = await axios.get(`http://localhost:5005/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProject(res.data);
      } catch (err) {
        console.error("Failed to fetch project:", err);
      } finally {
        setLoadingProject(false);
      }
    };

    fetchProject();

    // تحميل الرسائل في الخلفية
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:5005/api/messages/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt)));
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };

    fetchMessages();

    // إعداد WebSocket
    socketRef.current = io("http://localhost:5005", { auth: { token } });
    socketRef.current.emit("joinProject", projectId);
    socketRef.current.on("newProjectMessage", data => setMessages(prev => [...prev, data]));

    return () => {
      socketRef.current?.off("newProjectMessage");
      socketRef.current?.disconnect();
    };
  }, [projectId, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!msg.trim() || !socketRef.current) return;
    socketRef.current.emit("sendProjectMessage", { projectId, content: msg });
    setMsg("");
  };

  // Skeleton Loader بدل "Loading"
  const renderSkeleton = () => (
    <div style={{ padding: "20px" }}>
      <div style={{ background:"#ddd", height:"30px", width:"60%", marginBottom:"10px", borderRadius:"5px" }}></div>
      <div style={{ background:"#ddd", height:"20px", width:"80%", marginBottom:"5px", borderRadius:"5px" }}></div>
      <div style={{ background:"#ddd", height:"20px", width:"50%", marginBottom:"5px", borderRadius:"5px" }}></div>
      <div style={{ background:"#ddd", height:"20px", width:"40%", marginBottom:"5px", borderRadius:"5px" }}></div>
    </div>
  );

  return (
    <div style={{ padding: "20px" }}>
      {loadingProject ? renderSkeleton() : (
        <>
          <h2>{project.title}</h2>
          <p>{project.shortDescription}</p>
          <p><strong>Goal:</strong> {project.goal}</p>
          <p><strong>Category:</strong> {project.category}</p>
          <p><strong>Deadline:</strong> {project.deadline}</p>
          <p><strong>Location:</strong> {project.location}</p>
        </>
      )}
      /*
      {/* Chat Button & Box */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed", bottom: "25px", right: "25px",
          background:"#075E54", color:"#fff", borderRadius:"50%",
          width:"60px", height:"60px", fontSize:"28px", border:"none", cursor:"pointer",
        }}
      >💬</button>

      {open && (
        <div style={{
          position: "fixed", bottom:"95px", right:"25px",
          width:"320px", height:"420px",
          background:"#fff", boxShadow:"0 0 10px rgba(0,0,0,.2)",
          borderRadius:"12px", display:"flex", flexDirection:"column"
        }}>
          <div style={{
            background:"#128C7E", color:"#fff", padding:"12px",
            fontWeight:"bold", textAlign:"center", borderTopLeftRadius:"12px",
            borderTopRightRadius:"12px"
          }}>
            💬 دردشة المشروع
          </div>

          <div style={{
            flex:1, padding:"10px", overflowY:"auto", background:"#ECE5DD"
          }}>
            {messages.map((m,i)=>(
              <div key={i} style={{
                background:"#fff", padding:"8px 10px",
                borderRadius:"10px", marginBottom:"8px",
                alignSelf: m.sender?._id === user?._id ? "flex-end" : "flex-start",
                maxWidth:"85%"
              }}>
                <strong>{m.sender?.username || "Unknown"}</strong>: {m.content}
                <div style={{fontSize:"10px",textAlign:"right",opacity:.6}}>
                  {new Date(m.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>

          <div style={{ display:"flex",borderTop:"1px solid #ddd" }}>
            <input
              value={msg} onChange={e=>setMsg(e.target.value)}
              placeholder="اكتب رسالة..."
              style={{ flex:1, border:"none", padding:"10px" }}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} 
              style={{ background:"#128C7E", color:"#fff", padding:"0 15px", border:"none" }}
            >➤</button>
          </div>
        </div>
      )}
    </div>
  );
}
