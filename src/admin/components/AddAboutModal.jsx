import { useState, useEffect } from "react";
import { FaTimes, FaUpload } from "react-icons/fa";

import {
  createAbout,
  updateAbout,
} from "../../services/aboutService";

import "../styles/AddProjectModal.css";

function AddAboutModal({

  closeModal,

  refreshAbout,

  isEditing,

  aboutData,

}) {

  const [loading, setLoading] = useState(false);

  const [about, setAbout] = useState({

    fullName: "",

    jobTitle: "",

    bio: "",

    experience: 0,

    location: "",

    email: "",

    phone: "",

    website: "",

    github: "",

    linkedin: "",

    facebook: "",

    instagram: "",

    twitter: "",

    status: "Active",

    image: null,

    resume: null,

  });

  useEffect(() => {

    if (isEditing && aboutData) {

      setAbout({

        fullName: aboutData.fullName || "",

        jobTitle: aboutData.jobTitle || "",

        bio: aboutData.bio || "",

        experience: aboutData.experience || 0,

        location: aboutData.location || "",

        email: aboutData.email || "",

        phone: aboutData.phone || "",

        website: aboutData.website || "",

        github: aboutData.github || "",

        linkedin: aboutData.linkedin || "",

        facebook: aboutData.facebook || "",

        instagram: aboutData.instagram || "",

        twitter: aboutData.twitter || "",

        status: aboutData.status || "Active",

        image: null,

        resume: null,

      });

    }

  }, [isEditing, aboutData]);

  const handleChange = (e) => {

    const {

      name,

      value,

    } = e.target;

    setAbout((prev) => ({

      ...prev,

      [name]: value,

    }));

  };

  const handleImage = (e) => {

    if (!e.target.files.length) return;

    setAbout((prev) => ({

      ...prev,

      image: e.target.files[0],

    }));

  };

  const handleResume = (e) => {

    if (!e.target.files.length) return;

    setAbout((prev) => ({

      ...prev,

      resume: e.target.files[0],

    }));

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {

      alert("Please login first.");

      return;

    }

    setLoading(true);

    try {

      const formData = new FormData();

      formData.append("fullName", about.fullName);
      formData.append("jobTitle", about.jobTitle);
      formData.append("bio", about.bio);
      formData.append("experience", about.experience);
      formData.append("location", about.location);
      formData.append("email", about.email);
      formData.append("phone", about.phone);
      formData.append("website", about.website);
      formData.append("github", about.github);
      formData.append("linkedin", about.linkedin);
      formData.append("facebook", about.facebook);
      formData.append("instagram", about.instagram);
      formData.append("twitter", about.twitter);
      formData.append("status", about.status);

      if (about.image) {

        formData.append("image", about.image);

      }

      if (about.resume) {

        formData.append("resume", about.resume);

      }

      if (isEditing) {

        await updateAbout(

          aboutData._id,

          formData,

          token

        );

        alert("Profile updated successfully!");

      } else {

        await createAbout(

          formData,

          token

        );

        alert("Profile created successfully!");

      }

      await refreshAbout();

      closeModal();

    } catch (error) {

      console.log(error);

      alert(

        error.response?.data?.message ||

        "Unable to save profile."

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

                ? "Edit About"

                : "Create About"

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

            <label>Full Name</label>

            <input

              type="text"

              name="fullName"

              value={about.fullName}

              onChange={handleChange}

              required

            />

          </div>

          <div className="form-group">

            <label>Professional Title</label>

            <input

              type="text"

              name="jobTitle"

              value={about.jobTitle}

              onChange={handleChange}

              required

            />

          </div>

          <div className="form-group">

            <label>Biography</label>

            <textarea

              rows="5"

              name="bio"

              value={about.bio}

              onChange={handleChange}

              required

            />

          </div>

          <div className="form-group">

            <label>Years of Experience</label>

            <input

              type="number"

              name="experience"

              value={about.experience}

              onChange={handleChange}

            />

          </div>

          <div className="form-group">

            <label>Location</label>

            <input

              type="text"

              name="location"

              value={about.location}

              onChange={handleChange}

            />

          </div>

          <div className="form-group">

            <label>Email</label>

            <input

              type="email"

              name="email"

              value={about.email}

              onChange={handleChange}

            />

          </div>

                    <div className="form-group">

            <label>Phone</label>

            <input

              type="text"

              name="phone"

              value={about.phone}

              onChange={handleChange}

            />

          </div>

          <div className="form-group">

            <label>Website</label>

            <input

              type="url"

              name="website"

              value={about.website}

              onChange={handleChange}

            />

          </div>

          <div className="form-group">

            <label>GitHub</label>

            <input

              type="url"

              name="github"

              value={about.github}

              onChange={handleChange}

            />

          </div>

          <div className="form-group">

            <label>LinkedIn</label>

            <input

              type="url"

              name="linkedin"

              value={about.linkedin}

              onChange={handleChange}

            />

          </div>

          <div className="form-group">

            <label>Facebook</label>

            <input

              type="url"

              name="facebook"

              value={about.facebook}

              onChange={handleChange}

            />

          </div>

          <div className="form-group">

            <label>Instagram</label>

            <input

              type="url"

              name="instagram"

              value={about.instagram}

              onChange={handleChange}

            />

          </div>

          <div className="form-group">

            <label>Twitter / X</label>

            <input

              type="url"

              name="twitter"

              value={about.twitter}

              onChange={handleChange}

            />

          </div>

          <div className="form-group">

            <label>Status</label>

            <select

              name="status"

              value={about.status}

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

          <div className="form-group">

            <label>Profile Image</label>

            <label className="upload-box">

              <FaUpload />

              <span>

                {

                  about.image

                    ? about.image.name

                    : "Choose Profile Image"

                }

              </span>

              <input

                type="file"

                hidden

                accept="image/*"

                onChange={handleImage}

              />

            </label>

          </div>

          <div className="form-group">

            <label>Resume (PDF)</label>

            <label className="upload-box">

              <FaUpload />

              <span>

                {

                  about.resume

                    ? about.resume.name

                    : "Choose Resume"

                }

              </span>

              <input

                type="file"

                hidden

                accept=".pdf"

                onChange={handleResume}

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

                      ? "Update Profile"

                      : "Create Profile"

                  )

              }

            </button>

          </div>

        </form>

      </div>

    </div>

  );

}

export default AddAboutModal;