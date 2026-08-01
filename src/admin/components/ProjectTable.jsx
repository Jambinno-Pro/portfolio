import {
  FaEdit,
  FaTrash,
  FaExternalLinkAlt,
} from "react-icons/fa";

import "../styles/ProjectTable.css";

function ProjectTable({ projects }) {

  return (

    <div className="table-container">

      <table className="projects-table">

        <thead>

          <tr>

            <th>Image</th>

            <th>Project</th>

            <th>Category</th>

            <th>Status</th>

            <th>Preview</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {projects.map((project) => (

            <tr key={project.id}>

              <td>

                <img
                  src={project.image}
                  alt={project.name}
                  className="project-thumb"
                />

              </td>

              <td>

                <div className="project-info">

                  <h4>{project.name}</h4>

                  <small>ID #{project.id}</small>

                </div>

              </td>

              <td>

                <span className="category-badge">

                  {project.category}

                </span>

              </td>

              <td>

                <span className="status active">

                  {project.status}

                </span>

              </td>

              <td>

                <button className="preview-btn">

                  <FaExternalLinkAlt />

                </button>

              </td>

              <td>

                <div className="action-buttons">

                  <button className="edit-btn">

                    <FaEdit />

                  </button>

                  <button className="delete-btn">

                    <FaTrash />

                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default ProjectTable;