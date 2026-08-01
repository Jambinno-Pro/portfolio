import "../../styles/projects/ProjectCard.css";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";

function ProjectCard({ project }) {
  return (
    <div className="project-card">

      {project.featured && (
        <span className="featured-badge">
          ★ Featured
        </span>
      )}

      {/* Browser Window */}
      <div className="browser-window">

        <div className="browser-header">

          <div className="browser-dots">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>

          <div className="browser-address">
            {project.website}
          </div>

        </div>

        <img
          src={project.image}
          alt={project.title}
          className="project-image"
        />

      </div>

      <div className="project-content">

        <h3>{project.title}</h3>

        <p>{project.description}</p>

        <div className="tech-stack">
          {project.technologies.map((tech, index) => (
            <span key={index}>
              {tech}
            </span>
          ))}
        </div>

        <div className="project-buttons">

          <a
            href={project.website}
            target="_blank"
            rel="noreferrer"
            className="visit-btn"
          >
            Visit Website
            <FaExternalLinkAlt />
          </a>

          {project.github && (

            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="github-btn"
            >
              <FaGithub />
              GitHub
            </a>

          )}

        </div>

      </div>

    </div>
  );
}

export default ProjectCard;