import { useState, useEffect } from "react";
import { getAllProjects } from "../api/projectsApi";

export default function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getAllProjects();

        // ✅ حماية من اختلاف شكل الداتا
        if (Array.isArray(data)) {
          setProjects(data);
        } else if (data?.projects && Array.isArray(data.projects)) {
          setProjects(data.projects);
        } else {
          setProjects([]);
        }
      } catch (err) {
        console.error("Fetch projects error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading, error };
}
