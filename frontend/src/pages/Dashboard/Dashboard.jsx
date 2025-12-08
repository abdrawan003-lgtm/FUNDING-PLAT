// src/pages/Dashboard/Dashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./Dashboard.css";

export default function Dashboard() {
  const { User } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:5005/api/projects/my-projects", {
          headers: { Authorization: `Bearer ${token}` }
        });

        setProjects(res.data);   // ← الآن بدون تحذير
        setLoading(false);
      } catch (error) {
        console.error("Error loading projects:", error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <p style={{textAlign:"center"}}>Loading Dashboard...</p>;

  return (
    <div className="dashboard-container">
      <h1 className="title">DashBoard</h1>

      <div className="stats">
        <div className="card">Projects {projects.length}</div>
        <div className="card"> Funding</div>
        <div className="card">New Messages</div>
      </div>

      <div className="actions">
        <Link to="/create-project" className="add-btn">Add New Project +</Link>
      </div>

      <h2 className="sub-title">Your Projects</h2>

      {projects.length === 0 && (
        <p style={{textAlign:"center", marginTop:"10px",}}>
          You have not project yet<Link to="/create-project">Add New Project </Link>
        </p>
      )}

      <div className="projects-list">
        {projects.map(p => (
          <div key={p._id} className="project-card">
            <h3>{p.title}</h3>
            <p>{p.shortDescription}</p>
            <Link to={`/project/${p._id}`} className="project-link">Show Project</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
