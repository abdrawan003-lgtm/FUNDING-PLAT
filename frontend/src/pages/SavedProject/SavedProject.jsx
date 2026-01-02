// pages/SavedProjects/SavedProjects.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import axios from "axios";

export default function SavedProjects() {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (!user?.token) return;

    const fetchSaved = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5005/api/users/saved-projects",
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setProjects(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSaved();
  }, [user]);

  return (
    <div>
      <h2>Saved Projects</h2>
      {projects.length === 0 ? (
        <p>No saved projects.</p>
      ) : (
        <ul>
          {projects.map(p => (
            <li key={p._id}>{p.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
