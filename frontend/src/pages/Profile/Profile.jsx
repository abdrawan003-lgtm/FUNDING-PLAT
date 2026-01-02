import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import { AuthContext } from "../../context/AuthContext.jsx";
import "./Profile.css";

import defaultAvatar from "../../assets/default-avatar.png";

export default function Profile() {
  const { token } = useContext(AuthContext);
  const { id } = useParams(); // ⚡ جلب ID من URL (إذا موجود)

  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token && !id) {
          console.error("No token and no profile ID");
          setLoading(false);
          return;
        }

        // إذا في ID → جلب بروفايل شخص آخر
        // إذا لا → جلب بروفايل المستخدم الحالي
        const url = id ? `http://localhost:5005/api/profile/${id}`:`http://localhost:5005/api/profile`;

        const headers = id ? {} : { Authorization: `Bearer ${token}` };

        const resUser = await axios.get(url, { headers });
        setUser(resUser.data);

        // ===== Get projects if requester =====
        if (resUser.data.accountType === "requester") {
          const resProjects = await axios.get(
            `http://localhost:5005/api/projects?user=${resUser.data._id}`
          );
          setProjects(resProjects.data);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, id]);

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="profile-container">
      {/* ===== Header ===== */}
      <div className="profile-header">
        <img
          src={
            user.profileImage && user.profileImage.trim() !== ""
              ? user.profileImage
              : defaultAvatar
          }
          alt={user.username}
          className="profile-img"
        />

        <div className="profile-info">
          <h2>{user.username}</h2>
          <p>{user.email}</p>
          <p className="phone">{user.phoneNumber || "No phone number"}</p>

          {/* الدور يظهر للجميع */}
          <p className="role">
            {user.accountType === "requester" ? "Project Owner" : "Supporter"}
          </p>

          {/* نوع الدعم (إذا داعم) */}
          {user.accountType === "supporter" && user.type && (
            <p>
              Support type: <strong>{user.type}</strong>
            </p>
          )}
          </div>
<div>
    {/* الاهتمامات (إذا داعم) */}
          {user.accountType === "supporter" &&
            Array.isArray(user.interests) &&
            user.interests.length > 0 && (
              <>
                <h3>Interests:</h3>
                <ul>
                  {user.interests.map((i) => (
                    <li key={i.name}>
                      {i.name} 
                    </li>
                  ))}
                </ul>
              </>
              )}
</div>
        
            
        </div>
      

      {/* ===== Projects (if requester) ===== */}
      {user.accountType === "requester" && (
        <>
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
        </>
      )}

      {/* ===== Supporter note ===== */}
      {user.accountType === "supporter" && !id && (
        <div className="interests-section">
          <p>You are currently supporting projects on the platform.</p>
        </div>
      )}
    </div>
  );
}
