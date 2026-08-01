import {
  FaTachometerAlt,
  FaProjectDiagram,
  FaCode,
  FaPaintBrush,
  FaBriefcase,
  FaEnvelope,
  FaFilePdf,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

import "../styles/Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">

        <h2>
          IJ<span>.</span>
        </h2>

      </div>

      <nav>

        <NavLink to="/admin">
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/projects">
          <FaProjectDiagram />
          <span>Projects</span>
        </NavLink>

        <NavLink to="/admin/skills">
          <FaCode />
          <span>Skills</span>
        </NavLink>

        <NavLink to="/admin/graphics">
          <FaPaintBrush />
          <span>Graphics</span>
        </NavLink>

        <NavLink to="/admin/services">
          <FaBriefcase />
          <span>Services</span>
        </NavLink>

        <NavLink to="/admin/messages">
          <FaEnvelope />
          <span>Messages</span>
        </NavLink>

        <NavLink to="/admin/resume">
          <FaFilePdf />
          <span>Resume</span>
        </NavLink>

        <NavLink to="/admin/settings">
          <FaCog />
          <span>Settings</span>
        </NavLink>

      </nav>

      <div className="logout">

        <NavLink to="/">
          <FaSignOutAlt />
          <span>Exit Admin</span>
        </NavLink>

      </div>

    </aside>
  );
}

export default Sidebar;