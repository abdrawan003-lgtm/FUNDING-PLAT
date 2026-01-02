// src/pages/CreateProject/CreateProject.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import axios from "axios";
import "./CreateProject.css";

export default function CreateProject() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext); // لم نعد نحتاج user._id هنا

  const [form, setForm] = useState({
    title: "",
    description: "",
    goal: "",
    location: "",
    category: "",
    deadline: "",
    notes: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) return alert("❌ User not logged in");

    if (!form.title.trim() || !form.description.trim() || !imageFile || !form.goal || !form.location.trim()) {
      return alert("Please fill all required fields.");
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("goal", form.goal);
      formData.append("location", form.location);
      formData.append("category", form.category);
      formData.append("deadline", form.deadline);
      formData.append("notes", form.notes);
      formData.append("image", imageFile);

      const res = await axios.post(
        "http://localhost:5005/api/projects",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Project created successfully!");
      navigate(`/project/${res.data._id}`);
    } catch (err) {
      console.error("CREATE PROJECT ERROR:", err);
      alert(err?.response?.data?.message || "Error creating project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="allpage">
      <div className="create-page">
        <h2>Create New Project</h2>
        <form className="create-form" onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Project title"
            value={form.title}
            onChange={handleChange}
            className="auth-input"
          />
          <input
            name="notes"
            placeholder="Type a note!"
            value={form.notes}
            onChange={handleChange}
            className="auth-input"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="auth-input"
          />
          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="auth-input"
          />
          <input
            name="deadline"
            type="date"
            value={form.deadline}
            onChange={handleChange}
            placeholder="Deadline"
            className="auth-input"
          />
          <textarea
            name="description"
            placeholder="Project description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            className="auth-input"
          />
          <input
            name="goal"
            type="number"
            placeholder="Funding goal (e.g., 1000)"
            value={form.goal}
            onChange={handleChange}
            className="auth-input"
          />
          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="auth-input"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Project"}
          </button>
        </form>
      </div>
    </div>
  );
}
