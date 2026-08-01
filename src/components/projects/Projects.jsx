import { useState } from "react";

import "../../styles/projects/Projects.css";

import ProjectCard from "./ProjectCard";
import ProjectFilter from "./ProjectFilter";

import projects from "../../data/projectsData";

function Projects() {

  const [filter, setFilter] = useState("All");

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

      <div className="container">

        <h2 className="section-title">

          Featured Projects

        </h2>

        <p className="section-description">

          Explore a collection of real-world projects showcasing
          my expertise in web development, graphic design,
          application development and database solutions.

        </p>

        <ProjectFilter

          filter={filter}

          setFilter={setFilter}

        />

        <div className="projects-grid">

          {filteredProjects.map((project) => (

            <ProjectCard

              key={project.id}

              project={project}

            />

          ))}

        </div>

      </div>

    </section>

  );

}

export default Projects;