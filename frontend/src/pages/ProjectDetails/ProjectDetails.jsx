"use client"
import { toast } from "react-toastify";

import { useState, useEffect, useRef, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import io from "socket.io-client"
import axios from "axios"
import { AuthContext } from "../../context/AuthContext.jsx"
import "./ProjectDetails.css"

export default function ProjectDetails() {
  const { id: projectId } = useParams()
  const { user: currentUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const token =
    currentUser?.token ||
    (() => {
      const storedUser = localStorage.getItem("user")
      return storedUser ? JSON.parse(storedUser).token : null
    })()

  const [project, setProject] = useState(null)
  const [loadingProject, setLoadingProject] = useState(true)
  const [openChat, setOpenChat] = useState(false)
  const [messages, setMessages] = useState([])
  const [msg, setMsg] = useState("")
  const [socketReady, setSocketReady] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    goal: "",
    location: "",
    status: "open",
  })

  const [isSaved, setIsSaved] = useState(false) // حالة حفظ المشروع

  const socketRef = useRef(null)
  const messagesEndRef = useRef(null)

  const getUsername = (user) => {
    if (!user) return "Unknown"
    if (typeof user === "string") return user
    return user.username || "Unknown"
  }

  const getUserEmail = (user) => {
    if (!user) return "No email"
    return user.email || "No email"
  }

  const getUserPhone = (user) => {
    if (!user) return "No phone"
    return user.phone || "No phone"
  }

  const getUserId = (user) => {
    if (!user) return null
    if (typeof user === "string") return user
    return user._id
  }

  // ===== تحميل المشروع =====
  useEffect(() => {
    const loadProject = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5005/api/projects/${projectId}`
        )
        setProject(res.data)
        setEditData({
          title: res.data.title,
          description: res.data.description,
          goal: res.data.goal,
          location: res.data.location,
          status: res.data.status,
        })

        // ===== تحقق من إذا المشروع محفوظ عند المستخدم الحالي =====
        if (currentUser && res.data._id) {
          setIsSaved(currentUser.savedProjects?.includes(res.data._id))
        }

      } catch (err) {
        console.error("Failed to load project:", err)
      } finally {
        setLoadingProject(false)
      }
    }
    loadProject()
  }, [projectId, currentUser])

  // ===== الرسائل + Socket =====
  useEffect(() => {
    if (!openChat || !currentUser || !token || !project) return

    const projectOwnerId = getUserId(project.user)
    const currentUserId = currentUser._id
    const otherUserId =
      String(currentUserId) === String(projectOwnerId)
        ? project.lastInterestedUser
        : projectOwnerId

    if (!otherUserId) return

    const loadMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5005/api/messages/project/${projectId}/${otherUserId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setMessages(
          res.data.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          )
        )
      } catch (err) {
        console.error("Load messages error:", err)
      }
    }
    loadMessages()

    socketRef.current = io("http://localhost:5005", { auth: { token } })

    socketRef.current.emit("joinProjectChat", { projectId, otherUserId }, () => {
      setSocketReady(true)
    })

    socketRef.current.on("newProjectMessage", (message) => {
      setMessages((prev) => [...prev, message])
    })

    return () => {
      socketRef.current?.disconnect()
      socketRef.current = null
      setSocketReady(false)
    }
  }, [openChat, currentUser, token, project, projectId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // ===== إرسال رسالة =====
  const sendMessage = () => {
    if (!msg.trim() || !socketRef.current || !socketReady) return

    socketRef.current.emit("sendProjectMessage", {
      projectId,
      content: msg,
    })

    setMessages((prev) => [
      ...prev,
      {
        project: projectId,
        sender: {
          _id: currentUser._id,
          username: currentUser.username,
        },
        content: msg,
        createdAt: new Date().toISOString(),
      },
    ])
    setMsg("")
  }

  // ===== حفظ التعديلات =====
  const handleSaveEdit = async () => {
    try {
      const payload = {
        ...editData,
        goal: Number(editData.goal),
      }

      console.log("🚀 Payload to save:", payload);
      console.log("Trying to save:", project?._id, editData)

      const res = await axios.put(
        `http://localhost:5005/api/projects/${project._id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      console.log("✅ Updated project:", res.data);
      setProject(res.data)
      setEditMode(false)
    } catch (err) {
      console.error("Failed to save edits:", err)
      alert("Failed to save edits. Check console.")
    }
  }

  // ===== حذف المشروع =====
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) return
    try {
      await axios.delete(
        `http://localhost:5005/api/projects/${project._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      navigate("/projects")
    } catch (err) {
      console.error("Delete project error:", err)
    }
  }

  // ===== الذهاب لملف صاحب المشروع =====
  const goToOwnerProfile = () => {
    const ownerId = getUserId(project.user)
    if (ownerId) navigate(`/profile/${ownerId}`)
  }

  // ===== دالة حفظ أو إزالة المشروع من المحفوظات =====
  const handleSaveProject = async () => {
    if (!currentUser || !token || !project) return;
    try {
      if (!isSaved) {
        await axios.post(
          `http://localhost:5005/api/users/save-project/${project._id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setIsSaved(true)
        toast.success("Project saved! Check your notifications.");
      } else {
        await axios.delete(
          `http://localhost:5005/api/users/save-project/${project._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
          toast.info("Project removed from saved.");
        setIsSaved(false)
      }
    } catch (err) {
      console.error("Save project error:", err)
          toast.error("Failed to save project.");
    }
  }

  let imageSrc = null
  if (project?.image?.data) {
    const base64String = btoa(
      new Uint8Array(project.image.data.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    )
    imageSrc = `data:${project.image.contentType};base64,${base64String}`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "open": return "#28a745"
      case "in_discussion": return "#ffc107"
      case "funded": return "#17a2b8"
      case "closed": return "#dc3545"
      default: return "#6c757d"
    }
  }

  return (
    <div className="project-details">
      {loadingProject ? (
        <p>Loading project...</p>
      ) : (
        <div className="rigth_side">
          <h2 className="title">{project.title}</h2>

          <p>
            <span className="detail-label">Owner:</span>{" "}
            <span className="owner-name" onClick={goToOwnerProfile}>
              {getUsername(project.user)}
            </span>
          </p>

          {!editMode ? (
            <>
              <p>
                <span className="detail-label">Description:</span>{" "}
                <span className="detail-value">{project.description}</span>
              </p>

              <p>
                <span className="detail-label">Goal:</span>{" "}
                <span className="detail-value">${project.goal}</span>
              </p>

              <p>
                <span className="detail-label">Location:</span>{" "}
                <span className="detail-value">{project.location}</span>
              </p>

              <p>
                <span className="detail-label">Created at:</span>{" "}
                <span className="detail-value">
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </p>

              <p>
                <span className="detail-label">Status:</span>{" "}
                <span
                  className="detail-value"
                  style={{ color: getStatusColor(project.status) }}
                >
                  {project.status}
                </span>
              </p>

              {/* ===== زر حفظ المشروع ===== */}
              {currentUser && (
                <button onClick={handleSaveProject} className="save-btn">
                  {isSaved ? "💾 Saved" : "💾 Save for later"}
                </button>
              )}

            </>
          ) : (
            // ===== فورم التعديل =====
            <div className="edit-form">
              <label>
                Title:
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </label>

              <label>
                Description:
                <textarea
                  value={editData.description}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, description: e.target.value }))
                  }
                />
              </label>

              <label>
                Goal:
                <input
                  type="number"
                  value={editData.goal}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, goal: e.target.value }))
                  }
                />
              </label>

              <label>
                Location:
                <input
                  type="text"
                  value={editData.location}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, location: e.target.value }))
                  }
                />
              </label>

              <label>
                Status:
                <select
                  value={editData.status}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, status: e.target.value }))
                  }
                >
                  <option value="open">Open</option>
                  <option value="in_discussion">In Discussion</option>
                  <option value="funded">Funded</option>
                  <option value="closed">Closed</option>
                </select>
              </label>

              <div className="edit-buttons">
                <button onClick={handleSaveEdit}>Save</button>
                <button onClick={() => setEditMode(false)}>Cancel</button>
              </div>
            </div>
          )}

          {/* ===== أزرار التعديل والحذف تظهر فقط لصاحب المشروع ===== */}
          {currentUser && !editMode && currentUser._id === getUserId(project.user) && (
            <div className="project-actions">
              <button onClick={() => setEditMode(true)}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          )}

          {imageSrc && (
            <img
              src={imageSrc}
              alt={project.title}
              className="project-details-image"
            />
          )}
          <h4 className="contact-info">
            For Contact : <br/>
            📧 {getUserEmail(project.user)} <br />
            📞 {getUserPhone(project.user)}
          </h4>
        </div>
      )}

      {currentUser && (
        <button className="chat-btn" onClick={() => setOpenChat(!openChat)}>
          💬
        </button>
      )}

      {openChat && (
        <div className="chat-box">
          <div className="chat-header">Chat</div>
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`chat-message ${
                  String(getUserId(m.sender)) === String(currentUser._id)
                    ? "me"
                    : ""
                }`}
              >
                <strong>{getUsername(m.sender)}</strong>: {m.content}
                <div className="chat-time">
                  {new Date(m.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input">
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Type message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>➤</button>
          </div>
        </div>
      )}
    </div>
  )
}
