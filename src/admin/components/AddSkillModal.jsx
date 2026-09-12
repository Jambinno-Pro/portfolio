import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

import {
  createSkill,
  updateSkill,
} from "../../services/skillService";

import "../styles/AddProjectModal.css";

function AddSkillModal({

  closeModal,

  refreshSkills,

  isEditing,

  skillData,

}) {

  const [loading, setLoading] = useState(false);

  const [skill, setSkill] = useState({

    name: "",

    category: "Frontend",

    level: 80,

    icon: "",

    featured: false,

    status: "Active",

  });

  // ============================
  // Load Skill when Editing
  // ============================

  useEffect(() => {

    if (isEditing && skillData) {

      setSkill({

        name: skillData.name,

        category: skillData.category,

        level: skillData.level,

        icon: skillData.icon,

        featured: skillData.featured,

        status: skillData.status,

      });

    }

  }, [isEditing, skillData]);

  // ============================
  // Handle Change
  // ============================

  const handleChange = (e) => {

    const {

      name,

      value,

      checked,

      type,

    } = e.target;

    setSkill((prev) => ({

      ...prev,

      [name]:

        type === "checkbox"

          ? checked

          : value,

    }));

  };

  // ============================
  // Save Skill
  // ============================

  const handleSubmit = async (e) => {

    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {

      alert("Please login first.");

      return;

    }

    setLoading(true);

    try {

      if (isEditing) {

        await updateSkill(

          skillData._id,

          skill,

          token

        );

        alert("Skill updated successfully!");

      } else {

        await createSkill(

          skill,

          token

        );

        alert("Skill created successfully!");

      }

      await refreshSkills();

      closeModal();

    } catch (error) {

      console.log(error);

      alert(

        error.response?.data?.message ||

        "Unable to save skill."

      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="modal-overlay">

      <div className="modal">

        <div className="modal-header">

          <h2>

            {isEditing

              ? "Edit Skill"

              : "Add Skill"}

          </h2>

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

            <label>Skill Name</label>

            <input

              type="text"

              name="name"

              value={skill.name}

              onChange={handleChange}

              required

            />

          </div>

          <div className="form-group">

            <label>Category</label>

            <select

              name="category"

              value={skill.category}

              onChange={handleChange}

            >

              <option>Frontend</option>

              <option>Backend</option>

              <option>Database</option>

              <option>Mobile</option>

              <option>Design</option>

              <option>Tools</option>

              <option>DevOps</option>

              <option>Other</option>

            </select>

          </div>

          <div className="form-group">

            <label>

              Skill Level

            </label>

            <input

              type="range"

              min="1"

              max="100"

              name="level"

              value={skill.level}

              onChange={handleChange}

            />

            <strong>

              {skill.level}%

            </strong>

          </div>

          <div className="form-group">

            <label>

              Icon

            </label>

            <input

              type="text"

              name="icon"

              placeholder="FaReact"

              value={skill.icon}

              onChange={handleChange}

            />

          </div>

          <div className="form-group checkbox-group">

            <label>

              <input

                type="checkbox"

                name="featured"

                checked={skill.featured}

                onChange={handleChange}

              />

              Featured Skill

            </label>

          </div>

          <div className="form-group">

            <label>Status</label>

            <select

              name="status"

              value={skill.status}

              onChange={handleChange}

            >

              <option>Active</option>

              <option>Inactive</option>

            </select>

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

              disabled={loading}

            >

              {loading

                ? isEditing

                  ? "Updating..."

                  : "Saving..."

                : isEditing

                ? "Update Skill"

                : "Save Skill"}

            </button>

          </div>

        </form>

      </div>

    </div>

  );

}

export default AddSkillModal;