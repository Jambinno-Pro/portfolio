import { useEffect, useState } from "react";

import {
  FaBriefcase,
  FaPhone,
  FaEnvelope,
  FaGithub,
} from "react-icons/fa";

import { getAbout } from "../services/aboutService";

import "../styles/About.css";


function About() {

  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);


  // ==========================================
  // LOAD ABOUT INFORMATION
  // ==========================================

  const loadAbout = async () => {

    try {

      setLoading(true);

      const response = await getAbout();

      console.log("About API response:", response);


      // API RETURNS ARRAY
      if (
        response?.about &&
        Array.isArray(response.about)
      ) {

        setAbout(
          response.about[0] || null
        );

      }

      // API RETURNS OBJECT
      else if (response?.about) {

        setAbout(response.about);

      }

      // NO DATA
      else {

        setAbout(null);

      }

    } catch (error) {

      console.error(
        "Failed to load About information:",
        error
      );

      setAbout(null);

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // LOAD ON PAGE START
  // ==========================================

  useEffect(() => {

    loadAbout();

  }, []);


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <section
        className="about-section"
        id="about"
      >

        <div className="about-container">

          <h2 className="about-title">
            About Me
          </h2>

          <div className="about-loading">
            Loading...
          </div>

        </div>

      </section>

    );

  }


  // ==========================================
  // NO ABOUT INFORMATION
  // ==========================================

  if (!about) {

    return (

      <section
        className="about-section"
        id="about"
      >

        <div className="about-container">

          <h2 className="about-title">
            About Me
          </h2>

          <div className="about-empty">

            <p>
              About information is currently
              unavailable.
            </p>

          </div>

        </div>

      </section>

    );

  }


  // ==========================================
  // ABOUT SECTION
  // ==========================================

  return (

    <section
      className="about-section"
      id="about"
    >

      <div className="about-container">


        {/* ==================================
            TITLE
        ================================== */}

        <h2 className="about-title">
          About Me
        </h2>


        {/* ==================================
            BIO + INFORMATION
        ================================== */}

        <div className="about-content">


          {/* ==================================
              BIO
          ================================== */}

          <div className="about-bio">

            <p>
              {about.bio}
            </p>

          </div>


          {/* ==================================
              CONTACT INFORMATION
          ================================== */}

          <div className="about-info">


            {/* EXPERIENCE */}

            <div className="about-info-item">

              <div className="about-info-icon">
                <FaBriefcase />
              </div>

              <strong>
                {about.experience || 0} Years
              </strong>

            </div>


            {/* PHONE */}

            <div className="about-info-item">

              <div className="about-info-icon">
                <FaPhone />
              </div>

              <a
                href={`tel:${about.phone}`}
              >
                {about.phone}
              </a>

            </div>


            {/* EMAIL */}

            <div className="about-info-item">

              <div className="about-info-icon">
                <FaEnvelope />
              </div>

              <a
                href={`mailto:${about.email}`}
              >
                {about.email}
              </a>

            </div>


            {/* GITHUB */}

            {about.github && (

              <div className="about-info-item">

                <div className="about-info-icon">
                  <FaGithub />
                </div>

                <a
                  href={
                    about.github.startsWith("http")
                      ? about.github
                      : `https://github.com/${about.github}`
                  }

                  target="_blank"

                  rel="noopener noreferrer"
                >

                  {about.github
                    .replace(
                      "https://github.com/",
                      ""
                    )
                    .replace(
                      "http://github.com/",
                      ""
                    )}

                </a>

              </div>

            )}

          </div>

        </div>

      </div>

    </section>

  );

}


export default About;