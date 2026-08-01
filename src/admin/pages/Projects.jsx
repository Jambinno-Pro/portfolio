import { useState } from "react";

import AdminLayout from "../components/AdminLayout";
import ProjectTable from "../components/ProjectTable";
import AddProjectModal from "../components/AddProjectModal";

import "../styles/Projects.css";

function Projects() {

  const [showModal, setShowModal] = useState(false);

  const projects = [

    {
      id:1,
      image:"https://placehold.co/120x80",
      name:"3B Luxury Coaches",
      category:"Web Development",
      status:"Active"
    },

    {
      id:2,
      image:"https://placehold.co/120x80",
      name:"Afrika Energy",
      category:"Web Development",
      status:"Active"
    },

    {
      id:3,
      image:"https://placehold.co/120x80",
      name:"AES Zimbabwe",
      category:"Web Development",
      status:"Active"
    },

    {
      id:4,
      image:"https://placehold.co/120x80",
      name:"Greens Shuttle",
      category:"Web Development",
      status:"Active"
    },

    {
      id:5,
      image:"https://placehold.co/120x80",
      name:"Tabby Hair Academy",
      category:"Web Development",
      status:"Active"
    },

    {
      id:6,
      image:"https://placehold.co/120x80",
      name:"Weather App",
      category:"Application",
      status:"Active"
    },

    {
      id:7,
      image:"https://placehold.co/120x80",
      name:"Calculator",
      category:"Application",
      status:"Active"
    },

    {
      id:8,
      image:"https://placehold.co/120x80",
      name:"Student Database",
      category:"Database",
      status:"Active"
    }

  ];

  return (

    <AdminLayout>

      <div className="projects-page">

        <div className="projects-header">

          <div>

            <h1>Projects</h1>

            <p>
              Manage all portfolio projects.
            </p>

          </div>

          <button
            className="add-project-btn"
            onClick={() => setShowModal(true)}
          >
            + Add Project
          </button>

        </div>

        <div className="search-box">

          <input
            type="text"
            placeholder="Search Projects..."
          />

        </div>

        <ProjectTable projects={projects} />

        {
          showModal &&

          <AddProjectModal

            closeModal={() => setShowModal(false)}

          />

        }

      </div>

    </AdminLayout>

  );

}

export default Projects;