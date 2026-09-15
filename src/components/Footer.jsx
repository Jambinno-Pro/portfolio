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
            <img src={logo} alt="Innocent Jambaya" className="footer-logo" />

            <p>
              I'm a Web Developer passionate about building modern web
              applications, scalable software solutions, and responsive digital
              experiences. Skilled in developing with React, JavaScript,
              Node.js, APIs, databases, and WordPress, with a strong focus on
              creating reliable, user-friendly solutions that help businesses
              grow.
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
              WHAT I DO
          ========================================== */}

          <div className="footer-focus">
            <h3>What I Do</h3>

            <a href="#services">Web Development</a>
            <a href="#projects">Software Development</a>
            <a href="#projects">React Applications</a>
            <a href="#projects">Database Management System (DBMS)</a>
            <a href="#services">WordPress Development</a>
          </div>

          {/* ==========================================
              CONTACT
          ========================================== */}

          <div className="footer-contact">
            <h3>Contact</h3>

            <a href="mailto:hello@iaminno.com">
              <FaEnvelope />
              <span>hello@iaminno.com</span>
            </a>

            <a href="tel:+27766300517">
              <FaPhoneAlt />
              <span>0766300517</span>
            </a>

            <div className="footer-location">
              <FaMapMarkerAlt />
              <span>Cape Town, South Africa</span>
            </div>

            <a href="#contact" className="footer-cta">
              Let&apos;s work together <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        {/* ==========================================
            SOCIAL MEDIA
        ========================================== */}

        <div className="footer-social">
          <a
            href="https://www.linkedin.com/in/innocent-jambaya-93a64b189/"
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
          </a>

          <a
            href="https://github.com/Jambinno-Pro"
            aria-label="GitHub"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
          </a>

          <a
            href="https://www.facebook.com/inno.jambaya/"
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
            © {new Date().getFullYear()} Innocent Jambaya. All Rights Reserved.
          </p>

          <a href="#hero" className="back-top" aria-label="Back to top">
            <FaArrowUp />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
