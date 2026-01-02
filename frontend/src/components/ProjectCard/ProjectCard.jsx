import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./ProjectCard.css";

export default function ProjectCard({ project }) {
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);

  // ===== 🧠 استخراج آمن لبيانات صاحب المشروع =====
  const ownerId =
    typeof project.user === "object" ? project.user?._id : project.user;

  const ownerUsername =
    typeof project.user === "object"
      ? project.user?.username
      : "Unknown";

  // ===== Likes state =====
  const [likesCount, setLikesCount] = useState(project.likes?.length || 0);
  const [liked, setLiked] = useState(
    project.likes?.includes(currentUser?._id)
  );

  // ===== تحويل الصورة =====
  let imageSrc = null;
  if (project.image?.data?.data) {
    const base64String = btoa(
      new Uint8Array(project.image.data.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );
    imageSrc = `data:${project.image.contentType};base64,${base64String}`;
  }

  // ===== Like =====
  const handleLike = async (e) => {
    e.stopPropagation();
    if (!currentUser) return;

    try {
      const res = await axios.post(
        `http://localhost:5005/api/projects/${project._id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      setLikesCount(res.data.likesCount);
      setLiked(res.data.liked);
    } catch (err) {
      console.error("Like error", err);
    }
  };

  // ===== الانتقال لبروفايل صاحب المشروع =====
  const goToOwnerProfile = (e) => {
    e.stopPropagation();
    if (ownerId) {
      navigate(`/profile/${ownerId}`);
    }
  };

  return (
    <div
      className="project-card"
      onClick={() => navigate(`/project/${project._id}`)}
    >
      <div className="project-info">
        <h3>{project.title}</h3>

        {/* ✅ اسم صاحب المشروع (آمن 100%) */}
        <p className="project-owner">
          by{" "}
          <span className="owner-name" onClick={goToOwnerProfile}>
            {ownerUsername}
          </span>
        </p>

        {imageSrc && (
          <img
            src={imageSrc}
            alt={project.title}
            className="project-image"
          />
        )}

        <p className="desc">
          {project.description?.substring(0, 100)}...
        </p>

        <p className="goal">Goal: ${project.goal}</p>

        {/* Like Section */}
        {currentUser && (
          <div className="like-section">
            <button
              className={`like-btn ${liked ? "liked" : ""}`}
              onClick={handleLike}
            >
              ❤️
            </button>
            <span className="likes-count">{likesCount}</span>
          </div>
        )}
      </div>
    </div>
  );
}
