import { Link } from "react-router-dom";
import useProjects from "./hooks/useProjects";

const statusColors = {
  open: "#16a34a",
  in_discussion: "#f59e0b",
  funded: "#2563eb",
  closed: "#6b7280"
};

export default function ProjectsPage() {
  const { projects, loading } = useProjects();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="projects">
      {projects.map((p) => (
        <Link
          key={p._id}
          to={`/project/${p._id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="project-card">
            <img src={p.image} alt={p.title} />

            {/* حالة المشروع */}
            <span
              style={{
                background: statusColors[p.status],
                color: "white",
                padding: "4px 10px",
                borderRadius: "12px",
                fontSize: "12px",
                display: "inline-block",
                marginBottom: "6px"
              }}
            >
              {p.status.replace("_", " ")}
            </span>

            <h3>{p.title}</h3>
            <p>{p.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
