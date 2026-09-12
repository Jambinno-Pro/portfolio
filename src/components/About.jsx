import { useEffect, useState } from "react";

import {
  FaBriefcase,
  FaPhone,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaCertificate,
  FaDownload,
  FaEye,
  FaTimes,
} from "react-icons/fa";

import { getAbout } from "../services/aboutService";
import { API_BASE_URL } from "../config";
import { downloadResumePdf } from "../utils/resumePdf";

import "../styles/About.css";

function About() {
  const [about, setAbout] = useState(null);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [showResume, setShowResume] = useState(false);

  const loadAbout = async () => {
    try {
      setLoading(true);
      const response = await getAbout();

      if (response?.about && Array.isArray(response.about)) {
        setAbout(response.about[0] || null);
      } else if (response?.about) {
        setAbout(response.about);
      } else {
        setAbout(null);
      }
    } catch (error) {
      console.error("Failed to load About information:", error);
      setAbout(null);
    } finally {
      setLoading(false);
    }
  };

  const loadResume = async () => {
    try {
      setResumeLoading(true);
      const response = await fetch(`${API_BASE_URL}/resume?ts=${Date.now()}`, {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Unable to load resume");
      const data = await response.json();
      setResume(data?.resume || null);
    } catch (error) {
      console.error("Failed to load Resume information:", error);
      setResume(null);
    } finally {
      setResumeLoading(false);
    }
  };

  useEffect(() => {
    loadAbout();
    loadResume();
  }, []);

  const toggleResume = () => {
    setShowResume((current) => !current);
  };

  const FormattedResumeText = ({ value, className = "" }) => (
    <div className={`resume-rich-text ${className}`.trim()}>
      {String(value || "").split(/\n{2,}/).map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );

  if (loading) {
    return (
      <section className="about-section" id="about">
        <div className="about-container">
          <h2 className="about-title">About Me</h2>
          <div className="about-loading">Loading...</div>
        </div>
      </section>
    );
  }

  if (!about) {
    return (
      <section className="about-section" id="about">
        <div className="about-container">
          <h2 className="about-title">About Me</h2>
          <div className="about-empty">
            <p>About information is currently unavailable.</p>
          </div>
        </div>
      </section>
    );
  }

  const currentResume = resume || {
    fullName: about.fullName || "",
    title: about.jobTitle || "",
    bio: about.bio || "",
    email: about.email || "",
    phone: about.phone || "",
    location: about.location || "",
    website: about.website || "",
    github: about.github || "",
    linkedin: about.linkedin || "",
    experience: [],
    education: [],
    certificates: [],
    languages: [],
  };

  const downloadResume = () => {
    // Generate the PDF directly in the browser from the dynamic resume data.
    // This keeps the download independent from Supabase and from a backend PDF route.
    downloadResumePdf(currentResume);
  };

  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <h2 className="about-title">About Me</h2>

        <div className="about-content">
          <div className="about-bio">
            <p>{about.bio}</p>
          </div>

          <div className="about-info">
            <div className="about-info-item">
              <div className="about-info-icon"><FaBriefcase /></div>
              <strong>{about.experience || 0} Years</strong>
            </div>

            <div className="about-info-item">
              <div className="about-info-icon"><FaPhone /></div>
              <a href={`tel:${about.phone}`}>{about.phone}</a>
            </div>

            <div className="about-info-item">
              <div className="about-info-icon"><FaEnvelope /></div>
              <a href={`mailto:${about.email}`}>{about.email}</a>
            </div>

            {about.github && (
              <div className="about-info-item">
                <div className="about-info-icon"><FaGithub /></div>
                <a
                  href={about.github.startsWith("http") ? about.github : `https://github.com/${about.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {about.github.replace("https://github.com/", "").replace("http://github.com/", "")}
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="about-resume-action">
          <div>
            <span className="about-resume-kicker">Professional Profile</span>
            <h3>Want to know more about my experience?</h3>
            <p>Explore my experience, education, certifications and professional skills.</p>
          </div>
          <button type="button" className="about-resume-button" onClick={toggleResume}>
            <FaEye />
            {showResume ? "Hide Resume" : "View Resume"}
          </button>
        </div>

        {showResume && (
          <div className="resume-preview" id="resume-preview">
            <div className="resume-preview-toolbar">
              <div>
                <span>MY RESUME</span>
                <small>Professional profile</small>
              </div>
              <div className="resume-toolbar-actions">
                <button type="button" onClick={downloadResume} className="resume-download-button">
                  <FaDownload /> Download PDF
                </button>
                <button type="button" onClick={toggleResume} className="resume-close-button" aria-label="Close resume">
                  <FaTimes />
                </button>
              </div>
            </div>

            {resumeLoading ? (
              <div className="resume-loading">Loading resume...</div>
            ) : (
              <article className="resume-document" aria-label="Professional resume">
                <header className="resume-header">
                  <div>
                    <span className="resume-eyebrow">PORTFOLIO / RESUME</span>
                    <h3>{currentResume.fullName || "Professional Resume"}</h3>
                    <p>{currentResume.title || "Creative Technology Professional"}</p>
                  </div>
                  <div className="resume-header-accent" />
                </header>

                <div className="resume-contact-row">
                  {currentResume.email && <span><FaEnvelope /> {currentResume.email}</span>}
                  {currentResume.phone && <span><FaPhone /> {currentResume.phone}</span>}
                  {currentResume.location && <span><FaMapMarkerAlt /> {currentResume.location}</span>}
                  {currentResume.website && <span><FaGlobe /> {currentResume.website}</span>}
                </div>

                {currentResume.bio && (
                  <section className="resume-section">
                    <div className="resume-section-title"><span>01</span><h4>Profile</h4></div>
                    <FormattedResumeText value={currentResume.bio} className="resume-profile-text" />
                  </section>
                )}

                <div className="resume-grid">
                  <div>
                    {currentResume.experience?.length > 0 && (
                      <section className="resume-section">
                        <div className="resume-section-title"><span>02</span><h4>Experience</h4></div>
                        <div className="resume-timeline">
                          {currentResume.experience.map((item, index) => (
                            <div className="resume-entry" key={`${item.company}-${index}`}>
                              <div className="resume-entry-dot" />
                              <div>
                                <div className="resume-entry-top">
                                  <h5>{item.position}</h5>
                                  <span>{item.period}</span>
                                </div>
                                <strong>{item.company}</strong>
                                {item.description && <FormattedResumeText value={item.description} />}
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                  </div>

                  <aside>
                    {currentResume.education?.length > 0 && (
                      <section className="resume-section resume-side-section">
                        <div className="resume-section-title"><span>03</span><h4>Education</h4></div>
                        {currentResume.education.map((item, index) => (
                          <div className="resume-simple-entry" key={`${item.school}-${index}`}>
                            <FaGraduationCap />
                            <div><h5>{item.qualification}</h5><strong>{item.school}</strong><span>{item.period}</span></div>
                          </div>
                        ))}
                      </section>
                    )}

                    {currentResume.certificates?.length > 0 && (
                      <section className="resume-section resume-side-section">
                        <div className="resume-section-title"><span>04</span><h4>Certificates</h4></div>
                        {currentResume.certificates.map((item, index) => (
                          <div className="resume-side-entry" key={`${item.name}-${index}`}>
                            <FaCertificate />
                            <div><h5>{item.name}</h5><span>{item.issuer}{item.year ? ` · ${item.year}` : ""}</span></div>
                          </div>
                        ))}
                      </section>
                    )}

                    {currentResume.languages?.length > 0 && (
                      <section className="resume-section resume-side-section">
                        <div className="resume-section-title"><span>05</span><h4>Languages</h4></div>
                        <div className="resume-language-list">
                          {currentResume.languages.map((item, index) => (
                            <div key={`${item.name}-${index}`}><span>{item.name}</span><strong>{item.level}</strong></div>
                          ))}
                        </div>
                      </section>
                    )}

                    <section className="resume-section resume-side-section">
                      <div className="resume-section-title"><span>06</span><h4>Connect</h4></div>
                      <div className="resume-socials">
                        {currentResume.github && <a href={currentResume.github.startsWith("http") ? currentResume.github : `https://github.com/${currentResume.github}`} target="_blank" rel="noopener noreferrer"><FaGithub /> GitHub</a>}
                        {currentResume.linkedin && <a href={currentResume.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedin /> LinkedIn</a>}
                      </div>
                    </section>
                  </aside>
                </div>

                <footer className="resume-footer">
                  <span>Available for creative technology opportunities</span>
                  {currentResume.website && <span>{currentResume.website}</span>}
                </footer>
              </article>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default About;
