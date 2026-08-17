import { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaSignInAlt,
} from "react-icons/fa";

import "../styles/Navbar.css";
import logo from "../assets/innologo.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">

      <div className="container">

        {/* ==========================
            LOGO
        ========================== */}

        <a
          href="/#hero"
          className="logo"
          onClick={closeMenu}
        >
          <img
            src={logo}
            alt="Innocent Jambaya Logo"
          />
        </a>


        {/* ==========================
            CENTER NAVIGATION
        ========================== */}

        <ul
          className={
            menuOpen
              ? "nav-links active"
              : "nav-links"
          }
        >

          <li>
            <a
              href="/#hero"
              onClick={closeMenu}
            >
              Home
            </a>
          </li>

          <li>
            <a
              href="/#about"
              onClick={closeMenu}
            >
              About
            </a>
          </li>

          <li>
            <a
              href="/#skills"
              onClick={closeMenu}
            >
              Skills
            </a>
          </li>

          <li>
            <a
              href="/#services"
              onClick={closeMenu}
            >
              Services
            </a>
          </li>

          <li>
            <a
              href="/#projects"
              onClick={closeMenu}
            >
              Projects
            </a>
          </li>

          <li>
            <a
              href="/#contact"
              onClick={closeMenu}
            >
              Contact
            </a>
          </li>

        </ul>


        {/* ==========================
            LOGIN ICON
        ========================== */}

        <a
          href="/login"
          className="login-nav-link"
          aria-label="Login"
          title="Admin Login"
        >
          <FaSignInAlt />
        </a>


        {/* ==========================
            MOBILE MENU BUTTON
        ========================== */}

        <button
          type="button"
          className="menu-icon"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <FaTimes />
          ) : (
            <FaBars />
          )}
        </button>

      </div>

    </nav>
  );
}

export default Navbar;