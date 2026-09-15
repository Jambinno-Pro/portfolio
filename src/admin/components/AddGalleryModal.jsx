import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

import { createGallery, updateGallery } from "../../services/galleryService";

import { getProjects } from "../../services/projectService";

import "../../styles/AddGalleryModal.css";

function AddGalleryModal({
  closeModal,
  refreshGallery,
  isEditing,
  galleryData,
}) {
  const [loading, setLoading] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const [projects, setProjects] = useState([]);

  const [gallery, setGallery] = useState({
    project: "",
    title: "",
    description: "",
    category: "General",
    status: "Active",
    image: null,
  });

  // =====================================
  // LOAD PROJECTS
  // =====================================

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoadingProjects(true);

        const data = await getProjects();

        const projectList = Array.isArray(data) ? data : data?.projects || [];

        setProjects(projectList);
      } catch (error) {
        console.error("Failed to load projects:", error);

        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    };

    loadProjects();
  }, []);

  // =====================================
  // LOAD EDIT DATA
  // =====================================

  useEffect(() => {
    if (isEditing && galleryData) {
      setGallery({
        project: galleryData.project?._id || galleryData.project || "",

        title: galleryData.title || "",

        description: galleryData.description || "",

        category: galleryData.category || "General",

        status: galleryData.status || "Active",

        image: null,
      });
    } else {
      setGallery({
        project: "",
        title: "",
        description: "",
        category: "General",
        status: "Active",
        image: null,
      });
    }
  }, [isEditing, galleryData]);

  // =====================================
  // HANDLE INPUT
  // =====================================

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    setGallery((prev) => ({
      ...prev,

      [name]: type === "file" ? files?.[0] || null : value,
    }));
  };

  // =====================================
  // SUBMIT
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    if (!gallery.project) {
      alert("Please select a project.");
      return;
    }

    if (!isEditing && !gallery.image) {
      alert("Please select a gallery image.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // =====================================
      // PROJECT
      // =====================================

      formData.append("project", gallery.project);

      // =====================================
      // TEXT DATA
      // =====================================

      formData.append("title", gallery.title);

      formData.append("description", gallery.description);

      formData.append("category", gallery.category);

      formData.append("status", gallery.status);

      // =====================================
      // IMAGE
      // =====================================

      if (gallery.image) {
        formData.append("image", gallery.image);
      }

      console.log("=================================");

      console.log("SAVING PROJECT GALLERY");

      console.log("Project:", gallery.project);

      console.log("Title:", gallery.title);

      console.log(
        "Image:",
        gallery.image ? gallery.image.name : "No new image",
      );

      console.log("=================================");

      // =====================================
      // UPDATE
      // =====================================

      if (isEditing) {
        await updateGallery(galleryData._id, formData, token);

        alert("Gallery item updated successfully!");
      }

      // =====================================
      // CREATE
      // =====================================
      else {
        await createGallery(formData, token);

        alert("Gallery item created successfully!");
      }

      await refreshGallery();

      closeModal();
    } catch (error) {
      console.error("Gallery save error:", error);

      console.error("Server response:", error.response?.data);

      alert(error.response?.data?.message || "Unable to save gallery item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* =====================================
            HEADER
        ===================================== */}

        <div className="modal-header">
          <h2>{isEditing ? "Edit Gallery Item" : "Add Gallery Item"}</h2>

          <button type="button" className="close-btn" onClick={closeModal}>
            <FaTimes />
          </button>
        </div>

        {/* =====================================
            FORM
        ===================================== */}

        <form className="gallery-form" onSubmit={handleSubmit}>
          {/* =====================================
              PROJECT
          ===================================== */}

          <div className="form-group">
            <label htmlFor="gallery-project">Project</label>

            <select
              id="gallery-project"
              name="project"
              value={gallery.project}
              onChange={handleChange}
              required
              disabled={loadingProjects}
            >
              <option value="">
                {loadingProjects ? "Loading projects..." : "Select a project"}
              </option>

              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.title}
                </option>
              ))}
            </select>

            <small className="form-help">
              Select the project this screenshot belongs to.
            </small>
          </div>

          {/* =====================================
              TITLE
          ===================================== */}

          <div className="form-group">
            <label>Screenshot Title</label>

            <input
              type="text"
              name="title"
              placeholder="Homepage Screenshot"
              value={gallery.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* =====================================
              DESCRIPTION
          ===================================== */}

          <div className="form-group">
            <label>Description</label>

            <textarea
              rows="5"
              name="description"
              placeholder="Describe this screenshot..."
              value={gallery.description}
              onChange={handleChange}
            />
          </div>

          {/* =====================================
              CATEGORY
          ===================================== */}

          <div className="form-group">
            <label>Category</label>

            <input
              type="text"
              name="category"
              placeholder="General"
              value={gallery.category}
              onChange={handleChange}
            />
          </div>

          {/* =====================================
              STATUS
          ===================================== */}

          <div className="form-group">
            <label>Status</label>

            <select
              name="status"
              value={gallery.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>

              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* =====================================
              IMAGE
          ===================================== */}

          <div className="form-group">
            <label htmlFor="gallery-image">Project Screenshot</label>

            <input
              id="gallery-image"
              type="file"
              name="image"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={handleChange}
              required={!isEditing}
            />

            <small className="form-help">
              JPG, JPEG, PNG or WEBP. Maximum file size: 5 MB.
            </small>

            {isEditing && galleryData?.image && (
              <div className="image-source-note">
                <strong>Current screenshot</strong>

                <span>Select a new image only if you want to replace it.</span>
              </div>
            )}
          </div>

          {/* =====================================
              BUTTONS
          ===================================== */}

          <div className="modal-buttons">
            <button
              type="button"
              className="cancel-btn"
              onClick={closeModal}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-btn"
              disabled={loading || loadingProjects || projects.length === 0}
            >
              {loading
                ? isEditing
                  ? "Uploading & Updating..."
                  : "Uploading & Saving..."
                : isEditing
                  ? "Update Gallery"
                  : "Save Gallery"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddGalleryModal;
