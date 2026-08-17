import "../../styles/skills/SkillCard.css";

import {
  FaReact,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaNodeJs,
  FaGithub,
  FaGitAlt,
  FaDatabase,
  FaPhp,
  FaWordpress,
  FaFigma,
  FaPalette,
} from "react-icons/fa";

import {
  SiMongodb,
  SiExpress,
  SiMysql,
} from "react-icons/si";


// ==========================================
// ICON MAPPING
// ==========================================

const iconMap = {
  FaReact,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaNodeJs,
  FaGithub,
  FaGitAlt,
  FaDatabase,
  FaPhp,
  FaWordpress,
  FaFigma,
  FaPalette,

  SiMongodb,
  SiExpress,
  SiMysql,
};


// ==========================================
// NAME BASED ICONS
// ==========================================

const skillIcons = {
  React: FaReact,

  HTML: FaHtml5,
  HTML5: FaHtml5,

  CSS: FaCss3Alt,
  CSS3: FaCss3Alt,

  JavaScript: FaJs,
  Javascript: FaJs,

  "Node JS": FaNodeJs,
  NodeJS: FaNodeJs,
  "Node.js": FaNodeJs,

  PHP: FaPhp,

  WordPress: FaWordpress,

  MongoDB: SiMongodb,

  Express: SiExpress,

  MySQL: SiMysql,

  Git: FaGitAlt,

  GitHub: FaGithub,

  Figma: FaFigma,

  "Graphic Design": FaPalette,

  Database: FaDatabase,
};


// ==========================================
// COMPONENT
// ==========================================

function SkillCard({ skill }) {

  const Icon =
    iconMap[skill?.icon] ||
    skillIcons[skill?.name] ||
    FaDatabase;


  const level = Math.min(
    Math.max(Number(skill?.level) || 0, 0),
    100
  );


  return (
    <article className="skill-card">


      {/* ==========================
          TOP
      ========================== */}

      <div className="skill-top">

        <div className="skill-icon">

          <Icon />

        </div>


        <span className="skill-level">

          {level}%

        </span>

      </div>


      {/* ==========================
          NAME
      ========================== */}

      <h3 className="skill-name">

        {skill?.name}

      </h3>


      {/* ==========================
          PROGRESS
      ========================== */}

      <div className="progress-bar">

        <div
          className="progress-fill"
          style={{
            width: `${level}%`,
          }}
        />

      </div>


      {/* ==========================
          FOOTER
      ========================== */}

      <div className="skill-footer">

        <span className="skill-category">

          {skill?.category || "Development"}

        </span>


        {skill?.featured && (

          <span className="featured">

            ★ Featured

          </span>

        )}

      </div>


    </article>
  );
}

export default SkillCard;