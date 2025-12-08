import { useState, useEffect, useRef, useContext } from "react";
import io from "socket.io-client";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function ProjectChat({ projectId }) {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const messagesEndRef = useRef(null);

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io("http://localhost:5005", {
      auth: { token: localStorage.getItem("token") }
    });

    socketRef.current.emit("joinProject", projectId);

    const handleNewMessage = (data) => {
      setMessages(prev => [...prev, data]);
    };
    socketRef.current.on("newProjectMessage", handleNewMessage);

    axios.get(`http://localhost:5005/api/messages/${projectId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => {
      // ترتيب الرسائل حسب الوقت
      const sorted = res.data.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
      setMessages(sorted);
    });

    return () => {
      socketRef.current.off("newProjectMessage", handleNewMessage);
      socketRef.current.disconnect();
    };
  }, [projectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!msg.trim()) return;
    socketRef.current.emit("sendProjectMessage", { projectId, content: msg });
    setMsg("");
  };

  return (
    <>
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
            {messages.map((m,i) => (
              <div key={i} style={{
                background:"#fff", padding:"8px 10px",
                borderRadius:"10px", marginBottom:"8px",
                alignSelf: (m.sender?._id === user._id) ? "flex-end" : "flex-start",
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
    </>
  );
}
