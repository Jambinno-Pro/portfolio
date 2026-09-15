import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

import { createProject, updateProject } from "../../services/projectService";

import "../styles/AddProjectModal.css";

function AddProjectModal({
  closeModal,
  refreshProjects,
  isEditing,
  projectData,
}) {
  const [loading, setLoading] = useState(false);

  const [project, setProject] = useState({
    name: "",
    category: "Web Development",
    description: "",
    technologies: "",
    github: "",
    website: "",
    status: "Active",
    featured: true,
    image: null,
  });

  // ======================================
  // LOAD PROJECT WHEN EDITING
  // ======================================

  useEffect(() => {
    if (isEditing && projectData) {
      setProject({
        name: projectData.title || "",
        category: projectData.category || "Web Development",

        description: projectData.description || "",

        technologies: Array.isArray(projectData.technologies)
          ? projectData.technologies.join(", ")
          : projectData.technologies || "",

        github: projectData.github || "",

        website: projectData.liveDemo || "",

        status: projectData.status || "Active",

        featured: projectData.featured ?? true,

        // Existing image is NOT downloaded.
        // A new image can be selected when updating.
        image: null,
      });
    }
  }, [isEditing, projectData]);

  // ======================================
  // HANDLE INPUT CHANGE
  // ======================================

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setProject((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
            ? files?.[0] || null
            : value,
    }));
  };

  // ======================================
  // SUBMIT PROJECT
  // ======================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      // ==================================
      // BASIC INFORMATION
      // ==================================

      data.append("title", project.name);

      data.append("description", project.description);

      data.append("category", project.category);

      // ==================================
      // TECHNOLOGIES
      // ==================================

      const technologies = project.technologies
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean);

      data.append("technologies", JSON.stringify(technologies));

      // ==================================
      // LINKS
      // ==================================

      data.append("github", project.github);

      data.append("liveDemo", project.website);

      // ==================================
      // STATUS
      // ==================================

      data.append("status", project.status);

      // ==================================
      // FEATURED
      // ==================================

      data.append("featured", project.featured);

      // ==================================
      // PROJECT IMAGE
      // ==================================

      if (project.image) {
        data.append("image", project.image);
      }

      // ==================================
      // DEBUG
      // ==================================

      console.log("Submitting project...");

      console.log(
        "Image:",
        project.image ? project.image.name : "No new image",
      );

      // ==================================
      // CREATE / UPDATE
      // ==================================

      if (isEditing) {
        await updateProject(projectData._id, data, token);

        alert("Project updated successfully!");
      } else {
        await createProject(data, token);

        alert("Project created successfully!");
      }

      // ==================================
      // REFRESH PROJECTS
      // ==================================

      await refreshProjects();

      closeModal();
    } catch (error) {
      console.error("Project save error:", error);

      console.error("Server response:", error.response?.data);

      alert(error.response?.data?.message || "Unable to save project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* ==================================
            HEADER
        ================================== */}

        <div className="modal-header">
          <h2>{isEditing ? "Edit Project" : "Add New Project"}</h2>

          <button type="button" className="close-btn" onClick={closeModal}>
            <FaTimes />
          </button>
        </div>

        {/* ==================================
            FORM
        ================================== */}

        <form className="project-form" onSubmit={handleSubmit}>
          {/* PROJECT NAME */}

          <div className="form-group">
            <label>Project Name</label>

            <input
              type="text"
              name="name"
              placeholder="Project Name"
              value={project.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* CATEGORY */}

          <div className="form-group">
            <label>Category</label>

            <select
              name="category"
              value={project.category}
              onChange={handleChange}
            >
              <option value="Web Development">Web Development</option>

              <option value="Graphic Design">Graphic Design</option>

              <option value="App Development">App Development</option>

              <option value="Database Development">Database Development</option>
            </select>
          </div>

          {/* DESCRIPTION */}

          <div className="form-group">
            <label>Project Description</label>

            <textarea
              rows="7"
              name="description"
              placeholder="Explain what you built, how you built it, the problems you solved and the technologies you used..."
              value={project.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* TECHNOLOGIES */}

          <div className="form-group">
            <label>Technologies Used</label>

            <input
              type="text"
              name="technologies"
              placeholder="React, Node.js, Express.js, MongoDB"
              value={project.technologies}
              onChange={handleChange}
            />

            <small className="form-help">
              Separate technologies with commas.
            </small>
          </div>

          {/* GITHUB */}

          <div className="form-group">
            <label>GitHub URL</label>

            <input
              type="url"
              name="github"
              placeholder="https://github.com/username/project"
              value={project.github}
              onChange={handleChange}
            />
          </div>

          {/* LIVE WEBSITE */}

          <div className="form-group">
            <label>Live Website</label>

            <input
              type="url"
              name="website"
              placeholder="https://example.com"
              value={project.website}
              onChange={handleChange}
            />
          </div>

          {/* STATUS */}

          <div className="form-group">
            <label>Status</label>

            <select
              name="status"
              value={project.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>

              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* FEATURED */}

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="featured"
                checked={project.featured}
                onChange={handleChange}
              />
              Featured Project
            </label>
          </div>

          {/* PROJECT IMAGE */}

          <div className="form-group">
            <label htmlFor="project-image">Project Image</label>

            <input
              id="project-image"
              type="file"
              name="image"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={handleChange}
            />

            <small className="form-help">
              JPG, JPEG, PNG or WEBP. Maximum file size: 5 MB.
            </small>

            {isEditing && projectData?.image && (
              <div className="image-source-note">
                <strong>Current image</strong>

                <span>
                  Select a new image only if you want to replace the current
                  one.
                </span>
              </div>
            )}
          </div>

          {/* BUTTONS */}

          <div className="modal-buttons">
            <button
              type="button"
              className="cancel-btn"
              onClick={closeModal}
              disabled={loading}
            >
              Cancel
            </button>

            <button type="submit" className="save-btn" disabled={loading}>
              {loading
                ? isEditing
                  ? "Uploading & Updating..."
                  : "Uploading & Saving..."
                : isEditing
                  ? "Update Project"
                  : "Save Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProjectModal;
