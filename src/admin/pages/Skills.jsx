import { useState, useEffect } from "react";

import SkillTable from "../components/SkillTable";
import AddSkillModal from "../components/AddSkillModal";

import {
  getSkills,
  deleteSkill,
} from "../../services/skillService";

import "../styles/Skills.css";

function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  // ===============================
  // LOAD SKILLS
  // ===============================

  const loadSkills = async () => {
    try {
      setLoading(true);

      const data = await getSkills();

      const skillList = Array.isArray(data)
        ? data
        : data?.skills || [];

      setSkills(skillList);

    } catch (error) {
      console.error(
        "Error loading skills:",
        error
      );

      setSkills([]);

    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // LOAD SKILLS ON PAGE LOAD
  // ===============================

  useEffect(() => {
    loadSkills();
  }, []);

  // ===============================
  // ADD SKILL
  // ===============================

  const handleAddSkill = () => {
    setEditing(false);
    setSelectedSkill(null);
    setShowModal(true);
  };

  // ===============================
  // EDIT SKILL
  // ===============================

  const handleEditSkill = (skill) => {
    setEditing(true);
    setSelectedSkill(skill);
    setShowModal(true);
  };

  // ===============================
  // DELETE SKILL
  // ===============================

  const handleDeleteSkill = async (id) => {
    if (!id) {
      console.error("No skill ID provided.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this skill?"
    );

    if (!confirmed) {
      return;
    }

    try {
      console.log("Deleting skill:", id);

      await deleteSkill(id);

      console.log("Skill deleted successfully.");

      // Remove immediately from the screen
      setSkills((previousSkills) =>
        previousSkills.filter(
          (skill) => skill._id !== id
        )
      );

      // Reload from database
      await loadSkills();

    } catch (error) {
      console.error(
        "Failed to delete skill:",
        error
      );

      console.error(
        "Server response:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
        "Failed to delete skill. Please try again."
      );
    }
  };

  // ===============================
  // CLOSE MODAL
  // ===============================

  const handleCloseModal = () => {
    setShowModal(false);
    setEditing(false);
    setSelectedSkill(null);
  };

  // ===============================
  // RENDER
  // ===============================

  return (
    <div className="skills-page">

      {/* ===============================
          HEADER
      =============================== */}

      <div className="skills-header">

        <div>

          <h1>
            Skills
          </h1>

          <p>
            Manage all portfolio skills.
          </p>

        </div>

        <button
          className="add-skill-btn"
          onClick={handleAddSkill}
        >
          + Add Skill
        </button>

      </div>


      {/* ===============================
          SKILLS TABLE
      =============================== */}

      {loading ? (

        <div className="loading-skills">

          <h3>
            Loading Skills...
          </h3>

        </div>

      ) : (

        <SkillTable

          skills={skills}

          refreshSkills={loadSkills}

          editSkill={handleEditSkill}

          deleteSkill={handleDeleteSkill}

        />

      )}


      {/* ===============================
          ADD / EDIT MODAL
      =============================== */}

      {showModal && (

        <AddSkillModal

          closeModal={handleCloseModal}

          refreshSkills={loadSkills}

          isEditing={editing}

          skillData={selectedSkill}

        />

      )}

    </div>
  );
}

export default Skills;