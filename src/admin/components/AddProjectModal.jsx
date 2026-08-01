import { useState } from "react";
import { FaTimes, FaUpload } from "react-icons/fa";

import "../styles/AddProjectModal.css";

function AddProjectModal({ closeModal }) {

  const [project, setProject] = useState({
    name: "",
    category: "Web Development",
    description: "",
    github: "",
    website: "",
    status: "Active",
    image: null,
  });

  const handleChange = (e) => {

    const { name, value } = e.target;

    setProject({
      ...project,
      [name]: value,
    });

  };

  const handleImage = (e) => {

    setProject({
      ...project,
      image: e.target.files[0],
    });

  };

  const handleSubmit = (e) => {

    e.preventDefault();

    console.log(project);

    closeModal();

  };

  return (

    <div className="modal-overlay">

      <div className="modal">

        <div className="modal-header">

          <h2>Add New Project</h2>

          <button
            className="close-btn"
            onClick={closeModal}
          >
            <FaTimes />
          </button>

        </div>

        <form
          className="project-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label>Project Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter project name"
              value={project.name}
              onChange={handleChange}
            />

          </div>

          <div className="form-group">

            <label>Category</label>

            <select
              name="category"
              value={project.category}
              onChange={handleChange}
            >

              <option>Web Development</option>

              <option>Graphic Design</option>

              <option>Application</option>

              <option>Database</option>

            </select>

          </div>

          <div className="form-group">

            <label>Description</label>

            <textarea
              rows="5"
              name="description"
              placeholder="Write project description..."
              value={project.description}
              onChange={handleChange}
            />

          </div>

          <div className="form-group">

            <label>GitHub URL</label>

            <input
              type="text"
              name="github"
              placeholder="https://github.com/..."
              value={project.github}
              onChange={handleChange}
            />

          </div>

          <div className="form-group">

            <label>Live Website</label>

            <input
              type="text"
              name="website"
              placeholder="https://example.com"
              value={project.website}
              onChange={handleChange}
            />

          </div>

          <div className="form-group">

            <label>Status</label>

            <select
              name="status"
              value={project.status}
              onChange={handleChange}
            >

              <option>Active</option>

              <option>Inactive</option>

            </select>

          </div>

          <div className="form-group">

            <label>Project Image</label>

            <label className="upload-box">

              <FaUpload />

              <span>

                {project.image
                  ? project.image.name
                  : "Choose Image"}

              </span>

              <input
                type="file"
                hidden
                onChange={handleImage}
              />

            </label>

          </div>

          <div className="modal-buttons">

            <button
              type="button"
              className="cancel-btn"
              onClick={closeModal}
            >

              Cancel

            </button>

            <button
              type="submit"
              className="save-btn"
            >

              Save Project

            </button>

          </div>

        </form>

      </div>

    </div>

  );

}

export default AddProjectModal;