import { useEffect, useState } from "react";

function Resume() {
  // ==========================================
  // RESUME STATE
  // ==========================================

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
    experience: [],
    education: [],
    certificates: [],
    languages: [],
  });

  const [cvFile, setCvFile] = useState(null);
  const [cvName, setCvName] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // ==========================================
  // LOAD RESUME
  // ==========================================

  useEffect(() => {
    loadResume();
  }, []);

  const loadResume = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://innocent-portfolio-api.onrender.com/api/resume"
      );

      const data = await response.json();

      if (data.success && data.resume) {
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
          experience: data.resume.experience || [],
          education: data.resume.education || [],
          certificates: data.resume.certificates || [],
          languages: data.resume.languages || [],
        });

        setCvName(data.resume.cv || "");
      }
    } catch (error) {
      console.error("Failed to load resume:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setResume((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // CV FILE
  // ==========================================

  const handleCvChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }

    setCvFile(file);
  };

  // ==========================================
  // EXPERIENCE
  // ==========================================

  const addExperience = () => {
    setResume((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
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
    setResume((prev) => {
      const updated = [...prev.experience];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return {
        ...prev,
        experience: updated,
      };
    });
  };

  const removeExperience = (index) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.filter(
        (_, i) => i !== index
      ),
    }));
  };

  // ==========================================
  // EDUCATION
  // ==========================================

  const addEducation = () => {
    setResume((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          school: "",
          qualification: "",
          period: "",
        },
      ],
    }));
  };

  const updateEducation = (index, field, value) => {
    setResume((prev) => {
      const updated = [...prev.education];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return {
        ...prev,
        education: updated,
      };
    });
  };

  const removeEducation = (index) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.filter(
        (_, i) => i !== index
      ),
    }));
  };

  // ==========================================
  // CERTIFICATES
  // ==========================================

  const addCertificate = () => {
    setResume((prev) => ({
      ...prev,
      certificates: [
        ...prev.certificates,
        {
          name: "",
          issuer: "",
          year: "",
        },
      ],
    }));
  };

  const updateCertificate = (index, field, value) => {
    setResume((prev) => {
      const updated = [...prev.certificates];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return {
        ...prev,
        certificates: updated,
      };
    });
  };

  const removeCertificate = (index) => {
    setResume((prev) => ({
      ...prev,
      certificates: prev.certificates.filter(
        (_, i) => i !== index
      ),
    }));
  };

  // ==========================================
  // LANGUAGES
  // ==========================================

  const addLanguage = () => {
    setResume((prev) => ({
      ...prev,
      languages: [
        ...prev.languages,
        {
          name: "",
          level: "",
        },
      ],
    }));
  };

  const updateLanguage = (index, field, value) => {
    setResume((prev) => {
      const updated = [...prev.languages];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return {
        ...prev,
        languages: updated,
      };
    });
  };

  const removeLanguage = (index) => {
    setResume((prev) => ({
      ...prev,
      languages: prev.languages.filter(
        (_, i) => i !== index
      ),
    }));
  };

  // ==========================================
  // SAVE RESUME
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");

      const formData = new FormData();

      formData.append(
        "fullName",
        resume.fullName
      );

      formData.append(
        "title",
        resume.title
      );

      formData.append(
        "bio",
        resume.bio
      );

      formData.append(
        "email",
        resume.email
      );

      formData.append(
        "phone",
        resume.phone
      );

      formData.append(
        "location",
        resume.location
      );

      formData.append(
        "website",
        resume.website
      );

      formData.append(
        "github",
        resume.github
      );

      formData.append(
        "linkedin",
        resume.linkedin
      );

      formData.append(
        "experience",
        JSON.stringify(resume.experience)
      );

      formData.append(
        "education",
        JSON.stringify(resume.education)
      );

      formData.append(
        "certificates",
        JSON.stringify(resume.certificates)
      );

      formData.append(
        "languages",
        JSON.stringify(resume.languages)
      );

      if (cvFile) {
  formData.append("resume", cvFile);
}

      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://innocent-portfolio-api.onrender.com/api/resume",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save resume"
        );
      }

      if (data.success) {
        setMessage(
          "Resume saved successfully."
        );

        setCvFile(null);

        setCvName(data.resume?.cv || cvName);
      }
    } catch (error) {
      console.error(
        "SAVE RESUME ERROR:",
        error
      );

      setMessage(
        error.message ||
          "Failed to save resume."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="resume-page">
        <h2>Loading Resume...</h2>
      </div>
    );
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="resume-page">

      <div className="resume-header">

        <div>
          <h1>Resume Management</h1>

          <p>
            Manage your professional resume,
            experience, education and CV.
          </p>
        </div>

      </div>

      <form
        onSubmit={handleSubmit}
        className="resume-form"
      >

        {/* ==================================
            PERSONAL INFORMATION
        ================================== */}

        <section className="resume-section">

          <h2>Personal Information</h2>

          <div className="resume-grid">

            <div className="form-group">

              <label>
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                value={resume.fullName}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group">

              <label>
                Professional Title
              </label>

              <input
                type="text"
                name="title"
                value={resume.title}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group">

              <label>
                Email
              </label>

              <input
                type="email"
                name="email"
                value={resume.email}
                onChange={handleChange}
              />

            </div>

            <div className="form-group">

              <label>
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={resume.phone}
                onChange={handleChange}
              />

            </div>

            <div className="form-group">

              <label>
                Location
              </label>

              <input
                type="text"
                name="location"
                value={resume.location}
                onChange={handleChange}
              />

            </div>

            <div className="form-group">

              <label>
                Website
              </label>

              <input
                type="text"
                name="website"
                value={resume.website}
                onChange={handleChange}
              />

            </div>

            <div className="form-group">

              <label>
                GitHub
              </label>

              <input
                type="text"
                name="github"
                value={resume.github}
                onChange={handleChange}
              />

            </div>

            <div className="form-group">

              <label>
                LinkedIn
              </label>

              <input
                type="text"
                name="linkedin"
                value={resume.linkedin}
                onChange={handleChange}
              />

            </div>

          </div>

          <div className="form-group">

            <label>
              Professional Bio
            </label>

            <textarea
              name="bio"
              value={resume.bio}
              onChange={handleChange}
              rows="6"
            />

          </div>

        </section>


        {/* ==================================
            CV
        ================================== */}

        <section className="resume-section">

          <h2>CV / Resume</h2>

         {cvName && (

  <div className="current-cv">

    <strong>
      Current CV:
    </strong>

    <a
      href={`https://innocent-portfolio-api.onrender.com${cvName}`}
      target="_blank"
      rel="noreferrer"
    >
      View Current CV
    </a>

  </div>

)}

          <div className="form-group">

            <label>
              Upload CV
            </label>

            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleCvChange}
            />

            <small>
              PDF files only. Maximum size:
              10MB.
            </small>

          </div>

          {cvFile && (

            <p>
              Selected file:{" "}
              <strong>
                {cvFile.name}
              </strong>
            </p>

          )}

        </section>


        {/* ==================================
            EXPERIENCE
        ================================== */}

        <section className="resume-section">

          <div className="section-heading">

            <h2>
              Experience
            </h2>

            <button
              type="button"
              onClick={addExperience}
            >
              + Add Experience
            </button>

          </div>

          {resume.experience.map(
            (item, index) => (

              <div
                className="resume-item"
                key={index}
              >

                <input
                  type="text"
                  placeholder="Company"
                  value={item.company}
                  onChange={(e) =>
                    updateExperience(
                      index,
                      "company",
                      e.target.value
                    )
                  }
                />

                <input
                  type="text"
                  placeholder="Position"
                  value={item.position}
                  onChange={(e) =>
                    updateExperience(
                      index,
                      "position",
                      e.target.value
                    )
                  }
                />

                <input
                  type="text"
                  placeholder="Period"
                  value={item.period}
                  onChange={(e) =>
                    updateExperience(
                      index,
                      "period",
                      e.target.value
                    )
                  }
                />

                <textarea
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) =>
                    updateExperience(
                      index,
                      "description",
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    removeExperience(index)
                  }
                >
                  Remove
                </button>

              </div>

            )
          )}

        </section>


        {/* ==================================
            EDUCATION
        ================================== */}

        <section className="resume-section">

          <div className="section-heading">

            <h2>
              Education
            </h2>

            <button
              type="button"
              onClick={addEducation}
            >
              + Add Education
            </button>

          </div>

          {resume.education.map(
            (item, index) => (

              <div
                className="resume-item"
                key={index}
              >

                <input
                  type="text"
                  placeholder="School"
                  value={item.school}
                  onChange={(e) =>
                    updateEducation(
                      index,
                      "school",
                      e.target.value
                    )
                  }
                />

                <input
                  type="text"
                  placeholder="Qualification"
                  value={
                    item.qualification
                  }
                  onChange={(e) =>
                    updateEducation(
                      index,
                      "qualification",
                      e.target.value
                    )
                  }
                />

                <input
                  type="text"
                  placeholder="Period"
                  value={item.period}
                  onChange={(e) =>
                    updateEducation(
                      index,
                      "period",
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    removeEducation(index)
                  }
                >
                  Remove
                </button>

              </div>

            )
          )}

        </section>


        {/* ==================================
            CERTIFICATES
        ================================== */}

        <section className="resume-section">

          <div className="section-heading">

            <h2>
              Certificates
            </h2>

            <button
              type="button"
              onClick={addCertificate}
            >
              + Add Certificate
            </button>

          </div>

          {resume.certificates.map(
            (item, index) => (

              <div
                className="resume-item"
                key={index}
              >

                <input
                  type="text"
                  placeholder="Certificate Name"
                  value={item.name}
                  onChange={(e) =>
                    updateCertificate(
                      index,
                      "name",
                      e.target.value
                    )
                  }
                />

                <input
                  type="text"
                  placeholder="Issuer"
                  value={item.issuer}
                  onChange={(e) =>
                    updateCertificate(
                      index,
                      "issuer",
                      e.target.value
                    )
                  }
                />

                <input
                  type="text"
                  placeholder="Year"
                  value={item.year}
                  onChange={(e) =>
                    updateCertificate(
                      index,
                      "year",
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    removeCertificate(index)
                  }
                >
                  Remove
                </button>

              </div>

            )
          )}

        </section>


        {/* ==================================
            LANGUAGES
        ================================== */}

        <section className="resume-section">

          <div className="section-heading">

            <h2>
              Languages
            </h2>

            <button
              type="button"
              onClick={addLanguage}
            >
              + Add Language
            </button>

          </div>

          {resume.languages.map(
            (item, index) => (

              <div
                className="resume-item"
                key={index}
              >

                <input
                  type="text"
                  placeholder="Language"
                  value={item.name}
                  onChange={(e) =>
                    updateLanguage(
                      index,
                      "name",
                      e.target.value
                    )
                  }
                />

                <input
                  type="text"
                  placeholder="Level"
                  value={item.level}
                  onChange={(e) =>
                    updateLanguage(
                      index,
                      "level",
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    removeLanguage(index)
                  }
                >
                  Remove
                </button>

              </div>

            )
          )}

        </section>


        {/* ==================================
            SAVE
        ================================== */}

        <div className="resume-actions">

          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Resume"}
          </button>

        </div>


        {message && (

          <div className="resume-message">

            {message}

          </div>

        )}

      </form>

    </div>
  );
}

export default Resume;