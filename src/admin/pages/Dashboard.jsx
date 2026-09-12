import { useEffect, useMemo, useState } from "react";
import {
  FaProjectDiagram,
  FaEnvelope,
  FaCode,
  FaBriefcase,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";

import { getProjects } from "../../services/projectService";
import { getSkills } from "../../services/skillService";
import { getServices } from "../../services/serviceService";
import { getMessages } from "../../services/messageService";
import "../styles/Dashboard.css";

function Dashboard() {
  const [data, setData] = useState({
    projects: [],
    skills: [],
    services: [],
    messages: [],
  });
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      setLoading(true);
      setHasError(false);

      const token = localStorage.getItem("token");
      const results = await Promise.allSettled([
        getProjects(),
        getSkills(),
        getServices(),
        getMessages(token),
      ]);

      if (!mounted) return;

      const [projects, skills, services, messages] = results;
      const next = {
        projects: projects.status === "fulfilled" && Array.isArray(projects.value) ? projects.value : [],
        skills: skills.status === "fulfilled" && Array.isArray(skills.value) ? skills.value : [],
        services: services.status === "fulfilled" && Array.isArray(services.value) ? services.value : [],
        messages:
          messages.status === "fulfilled"
            ? Array.isArray(messages.value) ? messages.value : messages.value?.messages || []
            : [],
      };

      setData(next);
      setHasError(results.some((result) => result.status === "rejected"));
      setLoading(false);
    };

    loadDashboard();
    return () => { mounted = false; };
  }, []);

  const unreadMessages = useMemo(
    () => data.messages.filter((message) => String(message.status || "").toLowerCase() !== "read").length,
    [data.messages]
  );

  const stats = [
    { title: "Projects", number: data.projects.length, icon: <FaProjectDiagram />, link: "/admin/projects" },
    { title: "Messages", number: unreadMessages, icon: <FaEnvelope />, link: "/admin/messages" },
    { title: "Skills", number: data.skills.length, icon: <FaCode />, link: "/admin/skills" },
    { title: "Services", number: data.services.length, icon: <FaBriefcase />, link: "/admin/services" },
  ];

  const recentMessages = [...data.messages]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <span className="dashboard-label">ADMIN DASHBOARD</span>
          <h1>Welcome Back <span>👋</span></h1>
          <p>Manage your portfolio content from one place.</p>
        </div>
        <div className="dashboard-actions">
          <Link to="/admin/projects" className="dashboard-action">Manage Projects <FaArrowRight /></Link>
        </div>
      </div>

      {hasError && (
        <div className="dashboard-notice">
          Some dashboard data could not be loaded. Check that the API is online and try again.
        </div>
      )}

      <div className="stats-grid">
        {stats.map((card) => (
          <Link className="stat-card" to={card.link} key={card.title}>
            <div className="stat-top"><div className="stat-icon">{card.icon}</div></div>
            <div className="stat-content">
              <h2>{loading ? "—" : card.number}</h2>
              <p>{card.title}</p>
            </div>
          </Link>
        ))}
      </div>

      <section className="dashboard-panel">
        <div className="dashboard-panel-header">
          <div>
            <span className="dashboard-panel-label">INBOX</span>
            <h2>Recent Messages</h2>
          </div>
          <Link to="/admin/messages">View all <FaArrowRight /></Link>
        </div>

        {loading ? (
          <div className="dashboard-empty">Loading messages...</div>
        ) : recentMessages.length === 0 ? (
          <div className="dashboard-empty">No messages yet.</div>
        ) : (
          <div className="recent-messages">
            {recentMessages.map((message) => (
              <div className="recent-message" key={message._id || message.id}>
                <div>
                  <strong>{message.name || "Visitor"}</strong>
                  <span>{message.subject || message.message || "New message"}</span>
                </div>
                <span className={`message-status ${String(message.status || "new").toLowerCase()}`}>
                  {message.status || "New"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
