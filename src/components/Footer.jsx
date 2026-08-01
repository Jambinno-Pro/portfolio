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
    <footer className="footer">

      <div className="container">

        <div className="footer-grid">

          {/* Logo */}

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

          {/* Navigation */}

          <div className="footer-links">

            <h3>Quick Links</h3>

            <a href="#hero">Home</a>

            <a href="#about">About</a>

            <a href="#skills">Skills</a>

            <a href="#projects">Projects</a>

            <a href="#contact">Contact</a>

          </div>

          {/* Contact */}

          <div className="footer-contact">

            <h3>Contact</h3>

            <p>
              <FaEnvelope />
              hello@inno.com
            </p>

            <p>
              <FaPhoneAlt />
              +27 61 421 7057
            </p>

            <p>
              <FaMapMarkerAlt />
              Cape Town, South Africa
            </p>

          </div>

        </div>

        {/* Social */}

        <div className="footer-social">

          <a href="#" aria-label="LinkedIn">
            <FaLinkedin />
          </a>

          <a href="#" aria-label="GitHub">
            <FaGithub />
          </a>

          <a href="#" aria-label="Facebook">
            <FaFacebookF />
          </a>

          <a href="#" aria-label="WhatsApp">
            <FaWhatsapp />
          </a>

        </div>

        {/* Bottom */}

        <div className="footer-bottom">

          <p>
            © {new Date().getFullYear()} Innocent Jambaya.
            All Rights Reserved.
          </p>

          <a href="#hero" className="back-top">
            <FaArrowUp />
          </a>

        </div>

      </div>

    </footer>
  );
}

export default Footer;