import React, { useState, useMemo } from "react";
import useProjects from "../../hooks/useProjects";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import Button from "../../components/Button/Button";
import "./projects.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Project() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { projects, loading, error } = useProjects();

  // 🔹 حالات الفلترة
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");

  // الانتقال لصفحة إضافة مشروع
  const goToCreate = () => navigate("/create-project");

  // الانتقال إلى صفحة تفاصيل المشروع
  const goToProject = (id) => navigate(`/project/${id}`);

  // 🔹 تطبيق الفلترة (محسّن)
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const categoryMatch =
        categoryFilter === "all" || project.category === categoryFilter;

      let sizeMatch = true;
      if (sizeFilter === "small") sizeMatch = project.goal < 1000;
      if (sizeFilter === "medium")
        sizeMatch = project.goal >= 1000 && project.goal <= 10000;
      if (sizeFilter === "large") sizeMatch = project.goal > 10000;

      return categoryMatch && sizeMatch;
    });
  }, [projects, categoryFilter, sizeFilter]);

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>Error loading projects!</p>;

  return (
    <div className="project-page">
      {/* ===== Header ===== */}
      <div className="project-header">
        <h1>All Projects</h1>
         {user?.accountType === "requester" && (
        <Button text="Add Project" onClick={goToCreate} />)}
      </div>

      {/* ===== Filters ===== */}
      <div className="filters-box">
        {/* Category Filter */}
        <div className="filter-group">
          <span className="filter-title">Category</span>
          <div className="filter-buttons">
            {[
              { value: "all", label: "All" },
              { value: "Technology", label: "Technology" },
              { value: "education", label: "Education" },
              { value: "health", label: "Health" },
              { value: "business", label: "Business" },
              { value: "Art", label: "Art" },
              { value: "Handmade", label: "Handmade" },
            ].map((cat) => (
              <button
                key={cat.value}
                className={`filter-btn ${
                  categoryFilter === cat.value ? "active" : ""
                }`}
                onClick={() => setCategoryFilter(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Size Filter */}
        <div className="filter-group">
          <span className="filter-title">Project Size</span>
          <div className="filter-buttons">
            {[
              { value: "all", label: "All" },
              { value: "small", label: "Small" },
              { value: "medium", label: "Medium" },
              { value: "large", label: "Large" },
            ].map((size) => (
              <button
                key={size.value}
                className={`filter-btn ${
                  sizeFilter === size.value ? "active" : ""
                }`}
                onClick={() => setSizeFilter(size.value)}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Projects ===== */}
      <div className="project-container">
        {filteredProjects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                className="project-click-wrapper"
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
