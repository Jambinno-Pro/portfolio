import { useEffect, useState } from "react";

import {
  FaArrowRight,
  FaDownload,
} from "react-icons/fa";

import "../styles/Hero.css";

function Hero() {

  // ==========================================
  // HERO TITLES
  // ==========================================

  const titles = [
    "REACT DEVELOPER",
    "WEB DEVELOPER",
    "FULL STACK DEVELOPER",
    "UI/UX DEVELOPER",
    "AI ENTHUSIAST",
  ];


  // ==========================================
  // STATES
  // ==========================================

  const [titleIndex, setTitleIndex] = useState(0);

  const [displayText, setDisplayText] = useState("");

  const [isDeleting, setIsDeleting] = useState(false);

  const [resumeUrl, setResumeUrl] = useState("");


  // ==========================================
  // LOAD CV FROM RESUME API
  // ==========================================

  useEffect(() => {

    const loadResume = async () => {

      try {

        const response = await fetch(
          "https://innocent-portfolio-api.onrender.com/api/resume"
        );

        const data = await response.json();

        if (
          data.success &&
          data.resume &&
          data.resume.cv
        ) {

          const cvPath = data.resume.cv;

          // If backend returns a full URL
          if (cvPath.startsWith("http")) {

            setResumeUrl(cvPath);

          } else {

            // If backend returns something like:
            // /uploads/resume/my-cv.pdf

            setResumeUrl(
              `https://innocent-portfolio-api.onrender.com${cvPath}`
            );

          }

        }

      } catch (error) {

        console.error(
          "Failed to load CV:",
          error
        );

      }

    };


    loadResume();

  }, []);


  // ==========================================
  // TYPING ANIMATION
  // ==========================================

  useEffect(() => {

    const currentTitle = titles[titleIndex];

    const typingSpeed = isDeleting
      ? 45
      : 90;

    const timer = setTimeout(() => {

      if (!isDeleting) {

        setDisplayText(
          currentTitle.substring(
            0,
            displayText.length + 1
          )
        );


        if (
          displayText.length + 1 ===
          currentTitle.length
        ) {

          setTimeout(() => {

            setIsDeleting(true);

          }, 1800);

        }

      } else {

        setDisplayText(
          currentTitle.substring(
            0,
            displayText.length - 1
          )
        );


        if (displayText.length === 0) {

          setIsDeleting(false);

          setTitleIndex(
            (prev) =>
              (prev + 1) % titles.length
          );

        }

      }

    }, typingSpeed);


    return () => clearTimeout(timer);

  }, [
    displayText,
    isDeleting,
    titleIndex,
  ]);


  // ==========================================
  // DOWNLOAD RESUME
  // ==========================================

  const handleDownloadResume = () => {

    if (!resumeUrl) {

      alert(
        "CV is currently unavailable."
      );

      return;

    }

    const link =
      document.createElement("a");

    link.href = resumeUrl;

    link.setAttribute(
      "download",
      "Innocent-Jambaya-CV.pdf"
    );

    link.setAttribute(
      "target",
      "_blank"
    );

    link.setAttribute(
      "rel",
      "noopener noreferrer"
    );

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

  };


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <section
      id="hero"
      className="hero"
    >

      {/* =================================
          DIAMOND BACKGROUND
      ================================= */}

      <div className="diamond-field">

        <span className="diamond diamond-1"></span>

        <span className="diamond diamond-2"></span>

        <span className="diamond diamond-3"></span>

        <span className="diamond diamond-4"></span>

        <span className="diamond diamond-5"></span>

        <span className="diamond diamond-6"></span>

        <span className="diamond diamond-7"></span>

        <span className="diamond diamond-8"></span>

      </div>


      {/* =================================
          BACKGROUND GLOWS
      ================================= */}

      <div className="hero-glow hero-glow-one"></div>

      <div className="hero-glow hero-glow-two"></div>


      {/* =================================
          GRID
      ================================= */}

      <div className="hero-grid"></div>


      {/* =================================
          CONTENT
      ================================= */}

      <div className="hero-content">


        {/* =================================
            STATUS
        ================================= */}

        <div className="hero-status">

          <span className="status-dot"></span>

          AVAILABLE FOR WORK

        </div>


        {/* =================================
            NAME
        ================================= */}

        <h1 className="hero-title">

          Hi, I'm

          <span>
            Innocent Jambaya
          </span>

        </h1>


        {/* =================================
            TYPING TITLE
        ================================= */}

        <div className="hero-typing">

          <span className="typing-text">

            {displayText}

          </span>

          <span className="typing-cursor">

            |

          </span>

        </div>


        {/* =================================
            DESCRIPTION
        ================================= */}

        <p className="hero-description">

          I build modern websites and web
          applications that combine clean code,
          intuitive user experiences, and
          powerful technology.

        </p>


        {/* =================================
            BUTTONS
        ================================= */}

        <div className="hero-buttons">


          {/* PROJECTS */}

          <a
            href="#projects"
            className="hero-btn hero-btn-primary"
          >

            View My Projects

            <FaArrowRight />

          </a>


          {/* DOWNLOAD CV */}

          <button
            type="button"
            className="hero-btn hero-btn-secondary"
            onClick={handleDownloadResume}
            disabled={!resumeUrl}
          >

            {resumeUrl
              ? "Download Resume"
              : "Resume Unavailable"
            }

            <FaDownload />

          </button>


        </div>


        {/* =================================
            TECHNOLOGIES
        ================================= */}

        <div className="hero-stack">

          <span>React</span>

          <span>JavaScript</span>

          <span>Node.js</span>

          <span>PHP</span>

          <span>WordPress</span>

          <span>MongoDB</span>

          <span>Angular</span>

          <span>Express.js</span>

          <span>TypeScript</span>

          <span>HTML</span>

          <span>CSS</span>

          <span>Photoshop</span>

          <span>Illustrator</span>

          <span>Corel Draw</span>

          <span>Figma</span>

          <span>AI Tools</span>

        </div>


      </div>

    </section>

  );

}

export default Hero;