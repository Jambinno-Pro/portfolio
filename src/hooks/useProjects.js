import { useState, useEffect } from "react";
import { getProjects } from "../services/projectService";

export default function useProjects() {
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await getProjects();

      setProjects(data.projects);

    } catch (err) {

      setError("Failed to load projects.");

    } finally {

      setLoading(false);

    }
  };

  return {
    projects,
    loading,
    error,
    loadProjects,
  };
}