import React from "react";
import useProjects from "../../hooks/useProjects";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import Button from "../../components/Button/Button";
import "./Home.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const { projects, loading, error } = useProjects();

  // الانتقال لصفحة إضافة مشروع CreateProject
  const goToCreate = () => navigate("/create-project");

  // الانتقال إلى صفحة تفاصيل المشروع
  const goToProject = (id) => navigate(`/project/${id}`);

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>Error loading projects!</p>;

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>Projects</h1>

        {/* زر الانتقال إلى صفحة إضافة مشروع */}
        <Button text="Add Project" onClick={goToCreate} />
      </div>

      <div className="home-container">
        {projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <div
                key={project._id}
                style={{ cursor: "pointer" }}
                onClick={() => goToProject(project._id)}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
