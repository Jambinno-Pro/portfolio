import { useState, useEffect, useCallback } from "react";
import { getProjects } from "../services/projectService";

/**
 * Projects are loaded exclusively from the backend API.
 * No hard-coded project data or localStorage cache is used.
 */
export default function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProjects();

      const freshProjects = Array.isArray(data)
        ? data.filter((project) => project?.status !== "Inactive")
        : [];

      setProjects(freshProjects);
    } catch (err) {
      console.error("Failed to load projects:", err);
      setProjects([]);
      setError(
        err.response?.data?.message ||
        "Projects are temporarily unavailable. Please try again shortly."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return { projects, loading, error, loadProjects };
}
