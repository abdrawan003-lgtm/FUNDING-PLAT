// src/pages/CreateProject/CreateProject.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createProject } from "../../api/projectsApi";
import { AuthContext } from "../../context/AuthContext"; // أو المسار الصحيح عندك
import "./CreateProject.css";

export default function CreateProject() {
  const navigate = useNavigate();
  const { user :USER} = useContext(AuthContext); // نفترض user يحتوي token أو نتعامل مع interceptor
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    goal: "",
    owner:"",

  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // validation بسيطة
    if (!form.title.trim() || !form.description.trim() || !form.goal) {
      return alert("Please fill title, description and goal.");
    }

    try {
      setLoading(true);
      // createProject يجب أن يستخدم token داخلياً (interceptor) أو نرسله هنا
    const created = await createProject({
  ...form,
  owner: USER?._id,   // ← إضافة معرف صاحب المشروع
});

console.log("USER FROM CONTEXT:", USER);

 // ترجع المشروع الجديد
      alert("Project created successfully!");
      navigate(`/project/${created._id}`);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Error creating project");
    } finally {
      setLoading(false);
    }
  };

  return ( <div className="allpage">
    <div className="create-page">
      <h2>Create New Project</h2>

      <form className="create-form" onSubmit={handleSubmit}>
        <input name="title" placeholder="Project title" value={form.title} onChange={handleChange}className="auth-input"/>

        <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} className="auth-input" />

        <textarea
          name="description"
          placeholder="Project description"
          rows={4}
          value={form.description}
          onChange={handleChange}
          className="auth-input"
        />

        <input name="goal" type="number" placeholder="Funding goal (e.g., 1000)" value={form.goal} onChange={handleChange}className="auth-input" />
        <input name="owner"  placeholder="owner's name" value={form.owner} onChange={handleChange}className="auth-input" />
        <input name="Location" placeholder="Location" value={form.Location} onChange={handleChange}className="auth-input" />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </div>
    </div>
  );
}
