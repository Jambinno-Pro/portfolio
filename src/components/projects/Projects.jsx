import { useState, useEffect } from "react";

import "../../styles/projects/Projects.css";

import { getProjects } from "../../services/projectService";
import ProjectCard from "./ProjectCard";
import ProjectFilter from "./ProjectFilter";

function Projects() {
  const [filter, setFilter] = useState("All");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================
  // LOAD PROJECTS
  // ==========================

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);

      const data = await getProjects();

      console.log("Projects:", data);

      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // FILTER PROJECTS
  // ==========================

  const filteredProjects =
    filter === "All"
      ? projects
      : projects.filter(
          (project) => project.category === filter
        );

  return (
    <section
      className="projects-section"
      id="projects"
    >
      <div className="projects-container">

        {/* ==========================
            HEADER
        ========================== */}

        <div className="projects-heading">

          <h2 className="projects-title">
            Featured Projects
          </h2>

          <p className="projects-description">
            Explore a collection of real-world projects
            showcasing my expertise in web development,
            graphic design, application development and
            database solutions.
          </p>

        </div>


        {/* ==========================
            FILTER
        ========================== */}

        <ProjectFilter
          filter={filter}
          setFilter={setFilter}
        />


        {/* ==========================
            PROJECT GRID
        ========================== */}

        <div className="projects-grid">

          {loading ? (

            <div className="projects-message">
              <h3>Loading Projects...</h3>
            </div>

          ) : filteredProjects.length > 0 ? (

            filteredProjects.map((project) => (

              <ProjectCard
                key={project._id}
                project={project}
              />

            ))

          ) : (

            <div className="projects-message">
              <h3>No Projects Found</h3>
            </div>

          )}

        </div>

      </div>
    </section>
  );
}

export default Projects;