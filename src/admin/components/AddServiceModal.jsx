import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

import {
  createService,
  updateService,
} from "../../services/serviceService";

import "../styles/AddProjectModal.css";

function AddServiceModal({

  closeModal,

  refreshServices,

  isEditing,

  serviceData,

}) {

  const [loading, setLoading] = useState(false);

  const [service, setService] = useState({

    title: "",

    description: "",

    icon: "",

    featured: false,

    status: "Active",

  });

  // ======================================
  // Load Service when Editing
  // ======================================

  useEffect(() => {

    if (isEditing && serviceData) {

      setService({

        title: serviceData.title,

        description: serviceData.description,

        icon: serviceData.icon,

        featured: serviceData.featured,

        status: serviceData.status,

      });

    }

  }, [isEditing, serviceData]);

  // ======================================
  // Handle Change
  // ======================================

  const handleChange = (e) => {

    const {

      name,

      value,

      checked,

      type,

    } = e.target;

    setService((prev) => ({

      ...prev,

      [name]:

        type === "checkbox"

          ? checked

          : value,

    }));

  };

  // ======================================
  // Submit
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

      if (isEditing) {

        await updateService(

          serviceData._id,

          service,

          token

        );

        alert("Service updated successfully!");

      } else {

        await createService(

          service,

          token

        );

        alert("Service created successfully!");

      }

      await refreshServices();

      closeModal();

    } catch (error) {

      console.log(error);

      alert(

        error.response?.data?.message ||

        "Unable to save service."

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

            {

              isEditing

                ? "Edit Service"

                : "Add Service"

            }

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

            <label>

              Service Title

            </label>

            <input

              type="text"

              name="title"

              value={service.title}

              onChange={handleChange}

              placeholder="Website Development"

              required

            />

          </div>

          <div className="form-group">

            <label>

              Description

            </label>

            <textarea

              rows="5"

              name="description"

              value={service.description}

              onChange={handleChange}

              placeholder="Describe your service..."

              required

            />

          </div>

          <div className="form-group">

            <label>

              Icon

            </label>

            <input

              type="text"

              name="icon"

              value={service.icon}

              onChange={handleChange}

              placeholder="FaLaptopCode"

            />

          </div>

          <div className="form-group checkbox-group">

            <label>

              <input

                type="checkbox"

                name="featured"

                checked={service.featured}

                onChange={handleChange}

              />

              Featured Service

            </label>

          </div>

          <div className="form-group">

            <label>

              Status

            </label>

            <select

              name="status"

              value={service.status}

              onChange={handleChange}

            >

              <option value="Active">

                Active

              </option>

              <option value="Inactive">

                Inactive

              </option>

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

              {

                loading

                  ? (

                    isEditing

                      ? "Updating..."

                      : "Saving..."

                  )

                  : (

                    isEditing

                      ? "Update Service"

                      : "Save Service"

                  )

              }

            </button>

          </div>

        </form>

      </div>

    </div>

  );

}

export default AddServiceModal;