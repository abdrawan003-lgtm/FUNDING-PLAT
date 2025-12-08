import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProjectCard.css";

export default function ProjectCard({ project }) {
  const navigate = useNavigate();

  return (
    <div className="project-card" onClick={() => navigate(`/project/${project._id}`)}>
      <img src={project.image || "/placeholder.png"} alt={project.title} />
      <div className="project-info">
        <h3>{project.title}</h3>
        <p>{project.description.substring(0, 100)}...</p>
        <p className="goal">Goal: ${project.goal}</p>
      </div>
    </div>
  );
}
