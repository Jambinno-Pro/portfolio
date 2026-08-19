import {
  FaEdit,
  FaTrash,
  FaExternalLinkAlt,
} from "react-icons/fa";

import "../styles/ProjectTable.css";

function ProjectTable({

  projects = [],

  editProject,

  deleteProject,

}) {

  return (

    <div className="table-container">

      <table className="projects-table">

        <thead>

          <tr>

            <th>Image</th>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Preview</th>
            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {

            projects.length > 0 ? (

              projects.map((project) => (

                <tr key={project._id}>

                  <td>

<img
  src={
    project.image
      ? project.image.startsWith("http")
        ? project.image
        : `https://innocent-portfolio-api.onrender.com${project.image}`
      : "/no-image.png"
  }
  alt={project.title}
  className="project-thumb"
  onError={(e) => {
    e.target.style.display = "none";
  }}
/>

                  </td>

                  <td>

                    <div className="project-info">

                      <h4>{project.title}</h4>

                      <small>

                        {project.description}

                      </small>

                    </div>

                  </td>

                  <td>

                    {project.category}

                  </td>

                  <td>

                    <span
                      className={
                        project.status === "Active"
                          ? "status active"
                          : "status inactive"
                      }
                    >

                      {project.status}

                    </span>

                  </td>

                  <td>

                    {

                      project.liveDemo && (

                        <a
                          href={project.liveDemo}
                          target="_blank"
                          rel="noreferrer"
                        >

                          <FaExternalLinkAlt />

                        </a>

                      )

                    }

                  </td>

                  <td className="action-buttons">

                    <button

                      className="edit-btn"

                      onClick={() => editProject(project)}

                    >

                      <FaEdit />

                    </button>

                    <button

                      className="delete-btn"

                      onClick={() => deleteProject(project._id)}

                    >

                      <FaTrash />

                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                  }}
                >

                  No Projects Found

                </td>

              </tr>

            )

          }

        </tbody>

      </table>

    </div>

  );

}

export default ProjectTable;