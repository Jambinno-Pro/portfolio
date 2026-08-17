import "../styles/Dashboard.css";

import {
  FaProjectDiagram,
  FaEnvelope,
  FaCode,
  FaEye,
} from "react-icons/fa";

function Dashboard() {

  const stats = [
    {
      title: "Projects",
      number: 18,
      icon: <FaProjectDiagram />,
    },

    {
      title: "Messages",
      number: 52,
      icon: <FaEnvelope />,
    },

    {
      title: "Skills",
      number: 26,
      icon: <FaCode />,
    },

    {
      title: "Visitors",
      number: "5,431",
      icon: <FaEye />,
    },
  ];

  return (
    <div className="dashboard">

      {/* ==========================
          DASHBOARD HEADER
      ========================== */}

      <div className="dashboard-header">

        <div>
          <span className="dashboard-label">
            ADMIN DASHBOARD
          </span>

          <h1>
            Welcome Back <span>👋</span>
          </h1>

          <p>
            Here's an overview of your portfolio.
          </p>
        </div>

      </div>


      {/* ==========================
          STATISTICS
      ========================== */}

      <div className="stats-grid">

        {stats.map((card, index) => (

          <div
            className="stat-card"
            key={index}
          >

            <div className="stat-top">

              <div className="stat-icon">
                {card.icon}
              </div>

            </div>


            <div className="stat-content">

              <h2>
                {card.number}
              </h2>

              <p>
                {card.title}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Dashboard;