import { useEffect, useMemo, useState } from "react";

import { FaArrowDown, FaArrowUp } from "react-icons/fa";

import { getSkills } from "../../services/skillService";
import SkillCard from "./SkillCard";

import "../../styles/skills/Skills.css";

const fallbackSkills = [
  "React",
  "JavaScript",
  "Node.js",
  "PHP",
  "WordPress",
  "MongoDB",
  "Angular",
  "Express.js",
  "TypeScript",
  "HTML",
  "CSS",
  "Photoshop",
  "Illustrator",
  "Corel Draw",
  "Figma",
  "AI Tools",
];

function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllSkills, setShowAllSkills] = useState(false);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const data = await getSkills();
      setSkills(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load skills:", error);
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const skillNames = useMemo(() => {
    if (skills.length > 0) {
      return skills
        .map((skill) => String(skill?.name || "").trim())
        .filter(Boolean);
    }

    return fallbackSkills;
  }, [skills]);

  return (
    <section className="skills-section" id="skills">
      <div className="container">
        <div className="skills-heading">
          <h2 className="section-title">My Skills</h2>

          <p className="section-description">
            Technologies and tools I use to build modern, responsive and professional digital experiences.
          </p>
        </div>

        {/* Compact technology cloud — intentionally styled like the Hero stack. */}
        <div className="skills-stack" aria-label="Skills and technologies">
          {skillNames.map((name) => (
            <span key={name}>{name}</span>
          ))}
        </div>

        <div className="skills-view-action">
          <button
            type="button"
            className="skills-view-button"
            onClick={() => setShowAllSkills((current) => !current)}
            aria-expanded={showAllSkills}
            aria-controls="skills-details"
          >
            {showAllSkills ? "Hide Skills" : "View Skills"}
            {showAllSkills ? <FaArrowUp /> : <FaArrowDown />}
          </button>
        </div>

        {showAllSkills && (
          <div className="skills-details" id="skills-details">
            <div className="skills-grid">
              {loading ? (
                <h3>Loading Skills...</h3>
              ) : skills.length > 0 ? (
                skills.map((skill) => (
                  <SkillCard key={skill._id || skill.name} skill={skill} />
                ))
              ) : (
                <h3>No Skills Found</h3>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Skills;
