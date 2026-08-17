import { useEffect, useState } from "react";

import { getSkills } from "../../services/skillService";
import SkillCard from "./SkillCard";

import "../../styles/skills/Skills.css";

function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSkills = async () => {
    try {
      setLoading(true);

      const data = await getSkills();

      console.log("Skills:", data);

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

  return (
    <section className="skills-section" id="skills">

    <div className="container">

        <div className="skills-heading">

            <h2 className="section-title">
                My Skills
            </h2>

            <p className="section-description">
                Technologies and tools I use to build modern,
                responsive and professional digital experiences.
            </p>

        </div>

        <div className="skills-grid">

            {loading ? (

                <h3>Loading Skills...</h3>

            ) : skills.length > 0 ? (

                skills.map((skill) => (
                    <SkillCard
                        key={skill._id}
                        skill={skill}
                    />
                ))

            ) : (

                <h3>No Skills Found</h3>

            )}

        </div>

    </div>

</section>
  );
}

export default Skills;