"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
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

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    category: "",
    deadline: "",
    location: "",
    notes: "",
  })

  const [loadingProject, setLoadingProject] = useState(true)
  const [imageFile, setImageFile] = useState(null)

  // ===== تحميل المشروع =====
  useEffect(() => {
    const loadProject = async () => {
      try {
        const res = await axios.get(`http://localhost:5005/api/projects/${projectId}`)
        const data = res.data
        setFormData({
          title: data.title || "",
          description: data.description || "",
          goal: data.goal || "",
          category: data.category || "",
          deadline: data.deadline || "",
          location: data.location || "",
          notes: data.notes || "",
        })
      } catch (err) {
        console.error("Failed to load project:", err)
      } finally {
        setLoadingProject(false)
      }
    }
    loadProject()
  }, [projectId])

  // ===== إرسال تعديل المشروع =====
  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const data = new FormData()
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key])
      })
      if (imageFile) data.append("image", imageFile)

      await axios.put(`http://localhost:5005/api/projects/${projectId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })

      alert("Project updated successfully!")
    } catch (err) {
      console.error("Update error:", err)
      alert("Failed to update project")
    }
  }

  // ===== حذف المشروع =====
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) return
    try {
      await axios.delete(`http://localhost:5005/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert("Project deleted successfully!")
      navigate("/projects")
    } catch (err) {
      console.error("Delete error:", err)
      alert("Failed to delete project")
    }
  }

  if (loadingProject) return <p>Loading project...</p>

  // ===== شرط عرض زر التعديل والحذف حسب نوع المستخدم =====
  const showActions = currentUser?.accountType === "requester"

  return (
    <div className="project-details">
      <h2>Edit Project</h2>
      <form onSubmit={handleUpdate} className="project-form">
        <label>
          Title:
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </label>

        <label>
          Description:
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </label>

        <label>
          Goal:
          <input
            type="number"
            value={formData.goal}
            onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
          />
        </label>

        <label>
          Category:
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
        </label>

        <label>
          Deadline:
          <input
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          />
        </label>

        <label>
          Location:
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </label>

        <label>
          Notes:
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </label>

        <label>
          Image:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </label>

        {showActions && (
          <div className="project-actions">
            <button type="submit">Update Project</button>
            <button type="button" onClick={handleDelete}>
              Delete Project
            </button>
          </div>
        )}
      </form>
    </div>
  )
}
