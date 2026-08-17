import { useEffect, useState } from "react";

import {
  getProjects,
  deleteProject,
} from "../../services/projectService";

import ProjectTable from "../components/ProjectTable";
import AddProjectModal from "../components/AddProjectModal";

import "../styles/Projects.css";


function Projects() {

  const [projects, setProjects] = useState([]);

  const [filteredProjects, setFilteredProjects] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingProject, setEditingProject] = useState(null);

  const [isEditing, setIsEditing] = useState(false);


  // =====================================
  // LOAD PROJECTS
  // =====================================

  const loadProjects = async () => {

    try {

      setLoading(true);

      const data = await getProjects();

      const projectList =
        Array.isArray(data)
          ? data
          : data?.projects || [];

      setProjects(projectList);

      setFilteredProjects(projectList);

    } catch (error) {

      console.error(
        "Failed to load projects:",
        error
      );

      setProjects([]);

      setFilteredProjects([]);

    } finally {

      setLoading(false);

    }

  };


  // =====================================
  // INITIAL LOAD
  // =====================================

  useEffect(() => {

    loadProjects();

  }, []);


  // =====================================
  // SEARCH PROJECTS
  // =====================================

  useEffect(() => {

    const searchValue =
      search.toLowerCase().trim();


    if (!searchValue) {

      setFilteredProjects(projects);

      return;

    }


    const results = projects.filter(
      (project) => {

        const title =
          project.title?.toLowerCase() || "";

        const category =
          project.category?.toLowerCase() || "";

        const description =
          project.description?.toLowerCase() || "";


        return (
          title.includes(searchValue) ||
          category.includes(searchValue) ||
          description.includes(searchValue)
        );

      }
    );


    setFilteredProjects(results);

  }, [search, projects]);


  // =====================================
  // DELETE PROJECT
  // =====================================

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );


    if (!confirmDelete) {
      return;
    }


    try {

      const token =
        localStorage.getItem("token");


      await deleteProject(
        id,
        token
      );


      alert(
        "Project deleted successfully!"
      );


      await loadProjects();

    } catch (error) {

      console.error(
        "Delete project error:",
        error
      );


      alert(
        error.response?.data?.message ||
        "Unable to delete project."
      );

    }

  };


  // =====================================
  // ADD PROJECT
  // =====================================

  const handleAddProject = () => {

    setEditingProject(null);

    setIsEditing(false);

    setShowModal(true);

  };


  // =====================================
  // EDIT PROJECT
  // =====================================

  const handleEditProject = (project) => {

    setEditingProject(project);

    setIsEditing(true);

    setShowModal(true);

  };


  // =====================================
  // CLOSE MODAL
  // =====================================

  const handleCloseModal = () => {

    setShowModal(false);

    setEditingProject(null);

    setIsEditing(false);

  };


  // =====================================
  // RENDER
  // =====================================

  return (

    <div className="projects-page">


      {/* =====================================
          HEADER
      ===================================== */}

      <div className="projects-header">

        <div>

          <h1>
            Projects
          </h1>

          <p>
            Manage all portfolio projects.
          </p>

        </div>


        <button
          className="add-project-btn"
          onClick={handleAddProject}
        >

          + Add Project

        </button>

      </div>


      {/* =====================================
          SEARCH
      ===================================== */}

      <div className="search-box">

        <input
          type="text"
          placeholder="Search Projects..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>


      {/* =====================================
          PROJECT TABLE
      ===================================== */}

      {loading ? (

        <div className="loading-projects">

          <h3>
            Loading Projects...
          </h3>

        </div>

      ) : (

        <ProjectTable

          projects={filteredProjects}

          editProject={handleEditProject}

          deleteProject={handleDelete}

        />

      )}


      {/* =====================================
          ADD / EDIT MODAL
      ===================================== */}

      {showModal && (

        <AddProjectModal

          closeModal={handleCloseModal}

          refreshProjects={loadProjects}

          isEditing={isEditing}

          projectData={editingProject}

        />

      )}

    </div>

  );

}


export default Projects;