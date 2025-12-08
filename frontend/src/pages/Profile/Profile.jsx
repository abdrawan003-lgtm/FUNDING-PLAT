import React, { useEffect, useState } from "react";
import axios from "axios";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import "./Profile.css"; // بعد فصل الـ CSS

export default function Profile() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const resUser = await axios.get("http://localhost:5005/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(resUser.data);

        const resProjects = await axios.get(
          `http://localhost:5005/api/projects?user=${resUser.data._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProjects(resProjects.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={user.profileImage || "/default-profile.png"}
          alt={user.username}
          className="profile-img"
        />
        <div>
          <h2>{user.username}</h2>
          <p>{user.bio || "No bio available"}</p>
        </div>
      </div>

      <h3>My Projects</h3>
      <div className="projects-grid">
        {projects.length === 0 ? (
          <p>No projects yet.</p>
        ) : (
          projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))
        )}
      </div>
    </div>
  );
}
