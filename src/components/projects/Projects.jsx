import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

import "../../styles/projects/Projects.css";
import ProjectCard from "./ProjectCard";
import useProjects from "../../hooks/useProjects";

function Projects() {
  const { projects, loading, error, loadProjects } = useProjects();
  const [showProgress, setShowProgress] = useState(false);

  const PROJECTS_IN_PROGRESS = [
    {
      title: "EventBook",
      category: "Web Application",
      status: "In Development",
      description:
        "A modern event management and booking platform currently being developed with a focus on a smooth user experience.",
      technologies: ["React", "Node.js", "MongoDB"],
    },
    {
      title: "Portfolio Platform",
      category: "Portfolio System",
      status: "In Development",
      description:
        "Continuous improvements to the portfolio platform, including dynamic content management, project galleries and administration tools.",
      technologies: ["React", "REST API", "Admin Dashboard"],
    },
  ];

  return (
    <motion.section
      className="projects-section"
      id="projects"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.6 }}
    >
      <div className="projects-container">
        <motion.div
          className="projects-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="projects-title">Featured Projects</h2>
          <p className="projects-description">
            A few things I&apos;ve built, improved, launched and occasionally
            rescued from a stubborn error message.
          </p>
        </motion.div>

        {loading && (
          <div className="projects-loading" role="status">
            Loading projects…
          </div>
        )}

        {!loading && error && (
          <div className="projects-error" role="alert">
            <span>{error}</span>
            <button type="button" onClick={loadProjects}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="projects-error" role="status">
            <span>No projects are available right now.</span>
            <button type="button" onClick={loadProjects}>
              Refresh
            </button>
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <motion.div
            className="projects-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.06 } },
            }}
          >
            {projects.map((project, index) => (
              <motion.div
                key={project._id || project.id || `${project.title}-${index}`}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="projects-progress-wrap">
          <button
            type="button"
            className={`projects-progress-button ${showProgress ? "active" : ""}`}
            onClick={() => setShowProgress((current) => !current)}
            aria-expanded={showProgress}
          >
            <span className="projects-progress-dot" />
            {showProgress
              ? "Hide Projects in Progress"
              : "View Projects in Progress"}
            {showProgress ? (
              <FaChevronUp className="projects-progress-arrow" />
            ) : (
              <FaChevronDown className="projects-progress-arrow" />
            )}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {showProgress && (
            <motion.div
              className="projects-in-progress"
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="progress-intro">
                <span className="progress-kicker">CURRENTLY BUILDING</span>
                <h3>Projects in Progress</h3>
                <p>
                  These projects are being designed, developed and prepared for
                  launch.
                </p>
              </div>

              <div className="progress-grid">
                {PROJECTS_IN_PROGRESS.map((item) => (
                  <motion.article
                    className="progress-card"
                    key={item.title}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="progress-card-top">
                      <span className="progress-status">{item.status}</span>
                      <span className="progress-category">{item.category}</span>
                    </div>
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                    <div className="progress-tech">
                      {item.technologies.map((tech) => (
                        <span key={tech}>{tech}</span>
                      ))}
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

export default Projects;
