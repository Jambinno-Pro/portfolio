import "../styles/Footer.css";

import {
  FaGithub,
  FaLinkedin,
  FaFacebookF,
  FaWhatsapp,
  FaArrowUp,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

import logo from "../assets/innologo.png";

function Footer() {
  return (
    <footer className="footer" id="footer">

      <div className="container">

        {/* ==========================================
            FOOTER GRID
        ========================================== */}

        <div className="footer-grid">

          {/* ==========================================
              ABOUT
          ========================================== */}

          <div className="footer-about">

            <img
              src={logo}
              alt="Innocent Jambaya"
              className="footer-logo"
            />

            <p>
              Front-End Developer, Graphic Designer and WordPress
              Developer passionate about building modern websites,
              React applications and digital experiences that help
              businesses grow.
            </p>

          </div>


          {/* ==========================================
              QUICK LINKS
          ========================================== */}

          <div className="footer-links">

            <h3>Quick Links</h3>

            <a href="#hero">Home</a>

            <a href="#about">About</a>

            <a href="#skills">Skills</a>

            <a href="#services">Services</a>

            <a href="#projects">Projects</a>

            <a href="#contact">Contact</a>

          </div>


          {/* ==========================================
              CONTACT
          ========================================== */}

          <div className="footer-contact">

            <h3>Contact</h3>

            <a href="mailto:jambinnocreations@gmail.com">
              <FaEnvelope />
              <span>jambinnocreations@gmail.com</span>
            </a>

            <a href="tel:+27614217057">
              <FaPhoneAlt />
              <span>+27 61 421 7057</span>
            </a>

            <div className="footer-location">
              <FaMapMarkerAlt />
              <span>Cape Town, South Africa</span>
            </div>

          </div>

        </div>


        {/* ==========================================
            SOCIAL MEDIA
        ========================================== */}

        <div className="footer-social">

          <a
            href="#"
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
          </a>

          <a
            href="#"
            aria-label="GitHub"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
          </a>

          <a
            href="#"
            aria-label="Facebook"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF />
          </a>

          <a
            href="#"
            aria-label="WhatsApp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp />
          </a>

        </div>


        {/* ==========================================
            FOOTER BOTTOM
        ========================================== */}

        <div className="footer-bottom">

          <p>
            © {new Date().getFullYear()} Innocent Jambaya.
            All Rights Reserved.
          </p>

          <a
            href="#hero"
            className="back-top"
            aria-label="Back to top"
          >
            <FaArrowUp />
          </a>

        </div>

      </div>

    </footer>
  );
}

export default Footer;