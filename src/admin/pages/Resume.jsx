import { API_BASE_URL } from "../../config";
import { downloadResumePdf } from "../../utils/resumePdf";
import { useEffect, useState } from "react";
import "../styles/Resume.css";

function Resume() {
  const [resume, setResume] = useState({
    fullName: "",
    title: "",
    bio: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    github: "",
    linkedin: "",

    // Professional Skills
    skills: [],

    // Resume sections
    experience: [],
    education: [],
    certificates: [],
    languages: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // =======================================
  // LOAD RESUME
  // =======================================

  useEffect(() => {
    const loadResume = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_BASE_URL}/resume?ts=${Date.now()}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load resume.");
        }

        const data = await response.json();

        if (data?.resume) {
          setResume({
            fullName: data.resume.fullName || "",
            title: data.resume.title || "",
            bio: data.resume.bio || "",
            email: data.resume.email || "",
            phone: data.resume.phone || "",
            location: data.resume.location || "",
            website: data.resume.website || "",
            github: data.resume.github || "",
            linkedin: data.resume.linkedin || "",

            skills: Array.isArray(data.resume.skills)
              ? data.resume.skills
              : [],

            experience: Array.isArray(data.resume.experience)
              ? data.resume.experience
              : [],

            education: Array.isArray(data.resume.education)
              ? data.resume.education
              : [],

            certificates: Array.isArray(data.resume.certificates)
              ? data.resume.certificates
              : [],

            languages: Array.isArray(data.resume.languages)
              ? data.resume.languages
              : [],
          });
        }
      } catch (error) {
        console.error("Error loading resume:", error);
        setMessage("Unable to load resume.");
      } finally {
        setLoading(false);
      }
    };

    loadResume();
  }, []);

  // =======================================
  // BASIC INFORMATION
  // =======================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setResume((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =======================================
  // PROFESSIONAL SKILLS
  // =======================================

  const addSkill = () => {
    setResume((previous) => ({
      ...previous,
      skills: [
        ...(previous.skills || []),
        {
          name: "",
          level: "",
        },
      ],
    }));
  };

  const updateSkill = (index, field, value) => {
    setResume((previous) => {
      const skills = [...(previous.skills || [])];

      skills[index] = {
        ...skills[index],
        [field]: value,
      };

      return {
        ...previous,
        skills,
      };
    });
  };

  const removeSkill = (index) => {
    setResume((previous) => ({
      ...previous,
      skills: (previous.skills || []).filter(
        (_, skillIndex) => skillIndex !== index
      ),
    }));
  };

  // =======================================
  // EXPERIENCE
  // =======================================

  const addExperience = () => {
    setResume((previous) => ({
      ...previous,
      experience: [
        ...(previous.experience || []),
        {
          company: "",
          position: "",
          period: "",
          description: "",
        },
      ],
    }));
  };

  const updateExperience = (index, field, value) => {
    setResume((previous) => {
      const experience = [...(previous.experience || [])];

      experience[index] = {
        ...experience[index],
        [field]: value,
      };

      return {
        ...previous,
        experience,
      };
    });
  };

  const removeExperience = (index) => {
    setResume((previous) => ({
      ...previous,
      experience: (previous.experience || []).filter(
        (_, experienceIndex) => experienceIndex !== index
      ),
    }));
  };

  // =======================================
  // EDUCATION
  // =======================================

  const addEducation = () => {
    setResume((previous) => ({
      ...previous,
      education: [
        ...(previous.education || []),
        {
          school: "",
          qualification: "",
          period: "",
        },
      ],
    }));
  };

  const updateEducation = (index, field, value) => {
    setResume((previous) => {
      const education = [...(previous.education || [])];

      education[index] = {
        ...education[index],
        [field]: value,
      };

      return {
        ...previous,
        education,
      };
    });
  };

  const removeEducation = (index) => {
    setResume((previous) => ({
      ...previous,
      education: (previous.education || []).filter(
        (_, educationIndex) => educationIndex !== index
      ),
    }));
  };

  // =======================================
  // CERTIFICATES
  // =======================================

  const addCertificate = () => {
    setResume((previous) => ({
      ...previous,
      certificates: [
        ...(previous.certificates || []),
        {
          name: "",
          issuer: "",
          year: "",
        },
      ],
    }));
  };

  const updateCertificate = (index, field, value) => {
    setResume((previous) => {
      const certificates = [...(previous.certificates || [])];

      certificates[index] = {
        ...certificates[index],
        [field]: value,
      };

      return {
        ...previous,
        certificates,
      };
    });
  };

  const removeCertificate = (index) => {
    setResume((previous) => ({
      ...previous,
      certificates: (previous.certificates || []).filter(
        (_, certificateIndex) => certificateIndex !== index
      ),
    }));
  };

  // =======================================
  // LANGUAGES
  // =======================================

  const addLanguage = () => {
    setResume((previous) => ({
      ...previous,
      languages: [
        ...(previous.languages || []),
        {
          name: "",
          level: "",
        },
      ],
    }));
  };

  const updateLanguage = (index, field, value) => {
    setResume((previous) => {
      const languages = [...(previous.languages || [])];

      languages[index] = {
        ...languages[index],
        [field]: value,
      };

      return {
        ...previous,
        languages,
      };
    });
  };

  const removeLanguage = (index) => {
    setResume((previous) => ({
      ...previous,
      languages: (previous.languages || []).filter(
        (_, languageIndex) => languageIndex !== index
      ),
    }));
  };

  // =======================================
  // SAVE RESUME
  // =======================================

  const saveResume = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("You are not logged in.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/resume`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(resume),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to save resume."
        );
      }

      if (data?.resume) {
        setResume({
          fullName: data.resume.fullName || "",
          title: data.resume.title || "",
          bio: data.resume.bio || "",
          email: data.resume.email || "",
          phone: data.resume.phone || "",
          location: data.resume.location || "",
          website: data.resume.website || "",
          github: data.resume.github || "",
          linkedin: data.resume.linkedin || "",

          skills: Array.isArray(data.resume.skills)
            ? data.resume.skills
            : [],

          experience: Array.isArray(data.resume.experience)
            ? data.resume.experience
            : [],

          education: Array.isArray(data.resume.education)
            ? data.resume.education
            : [],

          certificates: Array.isArray(data.resume.certificates)
            ? data.resume.certificates
            : [],

          languages: Array.isArray(data.resume.languages)
            ? data.resume.languages
            : [],
        });
      }

      setMessage("Resume saved successfully.");
    } catch (error) {
      console.error("Error saving resume:", error);
      setMessage(
        error.message || "Failed to save resume."
      );
    } finally {
      setSaving(false);
    }
  };

  // =======================================
  // LOADING
  // =======================================

  if (loading) {
    return (
      <div className="resume-page">
        <div className="resume-header">
          <div>
            <h1>Resume</h1>
            <p>Loading resume...</p>
          </div>
        </div>
      </div>
    );
  }

  // =======================================
  // PAGE
  // =======================================

  return (
    <div className="resume-page">

      {/* ===================================
          HEADER
      =================================== */}

      <div className="resume-header">
        <div>
          <h1>Resume</h1>
          <p>
            Manage the information displayed on your professional resume.
          </p>
        </div>

        <button
          type="button"
          className="download-resume-btn"
          onClick={() => downloadResumePdf(resume)}
        >
          Download PDF
        </button>
      </div>

      {/* ===================================
          MESSAGE
      =================================== */}

      {message && (
        <div className="resume-message">
          {message}
        </div>
      )}

      <form
        className="resume-form"
        onSubmit={saveResume}
      >

        {/* ===================================
            PERSONAL INFORMATION
        =================================== */}

        <div className="resume-section">

          <div className="section-heading">
            <div>
              <h2>Personal Information</h2>
              <p>
                Basic information shown at the top of your resume.
              </p>
            </div>
          </div>

          <div className="resume-grid">

            <div className="form-group">
              <label>Full Name</label>

              <input
                type="text"
                name="fullName"
                value={resume.fullName}
                onChange={handleChange}
                placeholder="Full Name"
              />
            </div>

            <div className="form-group">
              <label>Professional Title</label>

              <input
                type="text"
                name="title"
                value={resume.title}
                onChange={handleChange}
                placeholder="Professional Title"
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={resume.email}
                onChange={handleChange}
                placeholder="Email address"
              />
            </div>

            <div className="form-group">
              <label>Phone</label>

              <input
                type="text"
                name="phone"
                value={resume.phone}
                onChange={handleChange}
                placeholder="Phone number"
              />
            </div>

            <div className="form-group">
              <label>Location</label>

              <input
                type="text"
                name="location"
                value={resume.location}
                onChange={handleChange}
                placeholder="Location"
              />
            </div>

            <div className="form-group">
              <label>Website</label>

              <input
                type="text"
                name="website"
                value={resume.website}
                onChange={handleChange}
                placeholder="Website"
              />
            </div>

            <div className="form-group">
              <label>GitHub</label>

              <input
                type="text"
                name="github"
                value={resume.github}
                onChange={handleChange}
                placeholder="GitHub URL"
              />
            </div>

            <div className="form-group">
              <label>LinkedIn</label>

              <input
                type="text"
                name="linkedin"
                value={resume.linkedin}
                onChange={handleChange}
                placeholder="LinkedIn URL"
              />
            </div>

          </div>

          <div className="form-group">

            <label>Professional Profile</label>

            <textarea
              name="bio"
              value={resume.bio}
              onChange={handleChange}
              rows="6"
              placeholder="Write your professional profile..."
            />

          </div>

        </div>

        {/* ===================================
            PROFESSIONAL SKILLS
        =================================== */}

        <div className="resume-section">

          <div className="section-heading">

            <div>
              <h2>Professional Skills</h2>

              <p>
                Add the professional skills you want displayed on your resume.
              </p>
            </div>

            <button
              type="button"
              className="add-item-btn"
              onClick={addSkill}
            >
              + Add Skill
            </button>

          </div>

          {(resume.skills || []).length === 0 && (
            <div className="resume-empty">
              No professional skills added yet.
            </div>
          )}

          {(resume.skills || []).map((skill, index) => (

            <div
              className="resume-item"
              key={`skill-${index}`}
            >

              <div className="resume-grid">

                <div className="form-group">
                  <label>Skill</label>

                  <input
                    type="text"
                    value={skill.name || ""}
                    placeholder="e.g. WordPress"
                    onChange={(event) =>
                      updateSkill(
                        index,
                        "name",
                        event.target.value
                      )
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Level</label>

                  <input
                    type="text"
                    value={skill.level || ""}
                    placeholder="e.g. Advanced"
                    onChange={(event) =>
                      updateSkill(
                        index,
                        "level",
                        event.target.value
                      )
                    }
                  />
                </div>

              </div>

              <div className="resume-actions">

                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeSkill(index)}
                >
                  Remove Skill
                </button>

              </div>

            </div>

          ))}

        </div>

        {/* ===================================
            EXPERIENCE
        =================================== */}

        <div className="resume-section">

          <div className="section-heading">

            <div>
              <h2>Experience</h2>

              <p>
                Manage your professional work experience.
              </p>
            </div>

            <button
              type="button"
              className="add-item-btn"
              onClick={addExperience}
            >
              + Add Experience
            </button>

          </div>

          {(resume.experience || []).length === 0 && (
            <div className="resume-empty">
              No experience added yet.
            </div>
          )}

          {(resume.experience || []).map(
            (item, index) => (

              <div
                className="resume-item"
                key={`experience-${index}`}
              >

                <div className="resume-grid">

                  <div className="form-group">
                    <label>Company</label>

                    <input
                      type="text"
                      value={item.company || ""}
                      placeholder="Company"
                      onChange={(event) =>
                        updateExperience(
                          index,
                          "company",
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Position</label>

                    <input
                      type="text"
                      value={item.position || ""}
                      placeholder="Position"
                      onChange={(event) =>
                        updateExperience(
                          index,
                          "position",
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Period</label>

                    <input
                      type="text"
                      value={item.period || ""}
                      placeholder="e.g. 2023 - Present"
                      onChange={(event) =>
                        updateExperience(
                          index,
                          "period",
                          event.target.value
                        )
                      }
                    />
                  </div>

                </div>

                <div className="form-group">

                  <label>Description</label>

                  <textarea
                    name="description"
                    value={item.description || ""}
                    rows="5"
                    placeholder="Describe your responsibilities and achievements..."
                    onChange={(event) =>
                      updateExperience(
                        index,
                        "description",
                        event.target.value
                      )
                    }
                  />

                </div>

                <div className="resume-actions">

                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() =>
                      removeExperience(index)
                    }
                  >
                    Remove Experience
                  </button>

                </div>

              </div>

            )
          )}

        </div>

        {/* ===================================
            EDUCATION
        =================================== */}

        <div className="resume-section">

          <div className="section-heading">

            <div>
              <h2>Education</h2>

              <p>
                Manage your academic qualifications.
              </p>
            </div>

            <button
              type="button"
              className="add-item-btn"
              onClick={addEducation}
            >
              + Add Education
            </button>

          </div>

          {(resume.education || []).length === 0 && (
            <div className="resume-empty">
              No education added yet.
            </div>
          )}

          {(resume.education || []).map(
            (item, index) => (

              <div
                className="resume-item"
                key={`education-${index}`}
              >

                <div className="resume-grid">

                  <div className="form-group">
                    <label>School / Institution</label>

                    <input
                      type="text"
                      value={item.school || ""}
                      placeholder="School or institution"
                      onChange={(event) =>
                        updateEducation(
                          index,
                          "school",
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Qualification</label>

                    <input
                      type="text"
                      value={item.qualification || ""}
                      placeholder="Qualification"
                      onChange={(event) =>
                        updateEducation(
                          index,
                          "qualification",
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Period</label>

                    <input
                      type="text"
                      value={item.period || ""}
                      placeholder="e.g. 2020 - 2023"
                      onChange={(event) =>
                        updateEducation(
                          index,
                          "period",
                          event.target.value
                        )
                      }
                    />
                  </div>

                </div>

                <div className="resume-actions">

                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() =>
                      removeEducation(index)
                    }
                  >
                    Remove Education
                  </button>

                </div>

              </div>

            )
          )}

        </div>

        {/* ===================================
            CERTIFICATES
        =================================== */}

        <div className="resume-section">

          <div className="section-heading">

            <div>
              <h2>Certificates</h2>

              <p>
                Manage your professional certificates.
              </p>
            </div>

            <button
              type="button"
              className="add-item-btn"
              onClick={addCertificate}
            >
              + Add Certificate
            </button>

          </div>

          {(resume.certificates || []).length === 0 && (
            <div className="resume-empty">
              No certificates added yet.
            </div>
          )}

          {(resume.certificates || []).map(
            (item, index) => (

              <div
                className="resume-item"
                key={`certificate-${index}`}
              >

                <div className="resume-grid">

                  <div className="form-group">
                    <label>Certificate</label>

                    <input
                      type="text"
                      value={item.name || ""}
                      placeholder="Certificate name"
                      onChange={(event) =>
                        updateCertificate(
                          index,
                          "name",
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Issuer</label>

                    <input
                      type="text"
                      value={item.issuer || ""}
                      placeholder="Issuing organisation"
                      onChange={(event) =>
                        updateCertificate(
                          index,
                          "issuer",
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Year</label>

                    <input
                      type="text"
                      value={item.year || ""}
                      placeholder="Year"
                      onChange={(event) =>
                        updateCertificate(
                          index,
                          "year",
                          event.target.value
                        )
                      }
                    />
                  </div>

                </div>

                <div className="resume-actions">

                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() =>
                      removeCertificate(index)
                    }
                  >
                    Remove Certificate
                  </button>

                </div>

              </div>

            )
          )}

        </div>

        {/* ===================================
            LANGUAGES
        =================================== */}

        <div className="resume-section">

          <div className="section-heading">

            <div>
              <h2>Languages</h2>

              <p>
                Manage the languages displayed on your resume.
              </p>
            </div>

            <button
              type="button"
              className="add-item-btn"
              onClick={addLanguage}
            >
              + Add Language
            </button>

          </div>

          {(resume.languages || []).length === 0 && (
            <div className="resume-empty">
              No languages added yet.
            </div>
          )}

          {(resume.languages || []).map(
            (language, index) => (

              <div
                className="resume-item"
                key={`language-${index}`}
              >

                <div className="resume-grid">

                  <div className="form-group">
                    <label>Language</label>

                    <input
                      type="text"
                      value={language.name || ""}
                      placeholder="e.g. English"
                      onChange={(event) =>
                        updateLanguage(
                          index,
                          "name",
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Level</label>

                    <input
                      type="text"
                      value={language.level || ""}
                      placeholder="e.g. Fluent"
                      onChange={(event) =>
                        updateLanguage(
                          index,
                          "level",
                          event.target.value
                        )
                      }
                    />
                  </div>

                </div>

                <div className="resume-actions">

                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() =>
                      removeLanguage(index)
                    }
                  >
                    Remove Language
                  </button>

                </div>

              </div>

            )
          )}

        </div>

        {/* ===================================
            SAVE
        =================================== */}

        <div className="resume-save-area">

          <button
            type="submit"
            className="save-resume-btn"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Resume"}
          </button>

        </div>

      </form>
    </div>
  );
}

export default Resume;