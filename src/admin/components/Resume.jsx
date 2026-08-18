import { useEffect, useState } from "react";

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
  });

  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // =======================================
  // LOAD RESUME
  // =======================================

  useEffect(() => {

    const loadResume = async () => {

      try {

        const response = await fetch(
          "https://innocent-portfolio-api.onrender.com/api/resume"
        );

        const data = await response.json();

        if (data.success && data.resume) {

          setResume(data.resume);

        }

      } catch (error) {

        console.error(
          "Failed to load resume:",
          error
        );

      }

    };

    loadResume();

  }, []);


  // =======================================
  // HANDLE INPUT
  // =======================================

  const handleChange = (e) => {

    setResume((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  };


  // =======================================
  // HANDLE CV
  // =======================================

  const handleCvChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {

      alert("Only PDF files are allowed.");

      e.target.value = "";

      return;

    }

    setCvFile(file);

  };


  // =======================================
  // SAVE
  // =======================================

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
        resume.bio || ""
      );

      formData.append(
        "email",
        resume.email || ""
      );

      formData.append(
        "phone",
        resume.phone || ""
      );

      formData.append(
        "location",
        resume.location || ""
      );

      formData.append(
        "website",
        resume.website || ""
      );

      formData.append(
        "github",
        resume.github || ""
      );

      formData.append(
        "linkedin",
        resume.linkedin || ""
      );


      if (cvFile) {

        formData.append(
          "cv",
          cvFile
        );

      }


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
          data.message ||
          "Failed to save resume."
        );

      }


      setResume(data.resume);

      setCvFile(null);

      alert(
        "Resume saved successfully!"
      );

    } catch (error) {

      console.error(
        "SAVE RESUME ERROR:",
        error
      );

      alert(error.message);

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="admin-resume">

      <h1>Resume</h1>

      <p>
        Manage your CV and professional
        information.
      </p>


      <form onSubmit={handleSubmit}>

        <h2>
          Personal Information
        </h2>


        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={resume.fullName || ""}
          onChange={handleChange}
          required
        />


        <input
          type="text"
          name="title"
          placeholder="Professional Title"
          value={resume.title || ""}
          onChange={handleChange}
          required
        />


        <textarea
          name="bio"
          placeholder="Professional Bio"
          value={resume.bio || ""}
          onChange={handleChange}
        />


        <h2>
          Contact Information
        </h2>


        <input
          type="email"
          name="email"
          placeholder="Email"
          value={resume.email || ""}
          onChange={handleChange}
        />


        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={resume.phone || ""}
          onChange={handleChange}
        />


        <input
          type="text"
          name="location"
          placeholder="Location"
          value={resume.location || ""}
          onChange={handleChange}
        />


        <input
          type="text"
          name="website"
          placeholder="Website"
          value={resume.website || ""}
          onChange={handleChange}
        />


        <input
          type="text"
          name="github"
          placeholder="GitHub"
          value={resume.github || ""}
          onChange={handleChange}
        />


        <input
          type="text"
          name="linkedin"
          placeholder="LinkedIn"
          value={resume.linkedin || ""}
          onChange={handleChange}
        />


        <h2>
          Upload CV
        </h2>


        <input
          type="file"
          accept="application/pdf,.pdf"
          onChange={handleCvChange}
        />


        {cvFile && (
          <p>
            Selected: {cvFile.name}
          </p>
        )}


        {resume.cv && !cvFile && (

          <p>
            CV currently uploaded.
          </p>

        )}


        <button
          type="submit"
          disabled={loading}
        >

          {loading
            ? "Saving..."
            : "Save Resume"}

        </button>

      </form>

    </div>

  );

}

export default Resume;