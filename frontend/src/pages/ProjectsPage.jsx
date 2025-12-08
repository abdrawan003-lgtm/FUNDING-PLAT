import useProjects from "./hooks/useProjects";

export default function ProjectsPage() {
  const { projects, loading } = useProjects();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="projects">
      {projects.map((p) => (
        <div key={p._id} className="project-card">
          <img src={p.image} alt={p.title} />
          <h3>{p.title}</h3>
          <p>{p.description}</p>
        </div>
      ))}
    </div>
  );
}
