import "../styles/Skills.css";

// Font Awesome Icons
import {
  FaHtml5,
  FaCss3Alt,
  FaReact,
  FaAngular,
  FaNodeJs,
  FaPhp,
  FaPython,
  FaWordpress,
  FaDatabase,
  FaGitAlt,
} from "react-icons/fa";

// Simple Icons
import {
  SiJavascript,
  SiMysql,
  SiMongodb,
} from "react-icons/si";

// Graphic Design Logos
import photoshop from "../assets/logos/photoshop.png";
import illustrator from "../assets/logos/illustrator.png";
import indesign from "../assets/logos/indesign.png";
import coreldraw from "../assets/logos/coreldraw.png";
import figma from "../assets/logos/figma.png";

function Skills() {

  const webSkills = [
    {
      icon: <FaHtml5 />,
      name: "HTML5",
    },
    {
      icon: <FaCss3Alt />,
      name: "CSS3",
    },
    {
      icon: <SiJavascript />,
      name: "JavaScript",
    },
    {
      icon: <FaReact />,
      name: "React.js",
    },
    {
      icon: <FaAngular />,
      name: "Angular",
    },
    {
      icon: <FaNodeJs />,
      name: "Node.js",
    },
    {
      icon: <FaPhp />,
      name: "PHP",
    },
    {
      icon: <FaPython />,
      name: "Python",
    },
    {
      icon: <FaWordpress />,
      name: "WordPress",
    },
    {
      icon: <FaDatabase />,
      name: "Database Development",
    },
    {
      icon: <SiMysql />,
      name: "MySQL",
    },
    {
      icon: <SiMongodb />,
      name: "MongoDB",
    },
    {
      icon: <FaGitAlt />,
      name: "Git & GitHub",
    },
  ];

  const graphicSkills = [
    {
      image: photoshop,
      title: "Adobe Photoshop",
      company: "Adobe",
    },
    {
      image: illustrator,
      title: "Adobe Illustrator",
      company: "Adobe",
    },
    {
      image: indesign,
      title: "Adobe InDesign",
      company: "Adobe",
    },
    {
      image: coreldraw,
      title: "CorelDRAW",
      company: "Corel",
    },
    {
      image: figma,
      title: "Figma",
      company: "Figma",
    },
  ];

  return (
    <section id="skills">

      <div className="container">

        <h2 className="title">
          My Skills
        </h2>

        <h3 className="category-title">
          Web Development
        </h3>

        <div className="skills-grid">

          {webSkills.map((skill, index) => (

            <div
              className="skill-card"
              key={index}
            >

              <div className="skill-icon">
                {skill.icon}
              </div>

              <h3>{skill.name}</h3>

            </div>

          ))}

        </div>

        <h3 className="category-title">
          Graphic Design
        </h3>

        <div className="graphic-grid">

          {graphicSkills.map((skill, index) => (

            <div
              className="graphic-card"
              key={index}
            >

              <img
                src={skill.image}
                alt={skill.title}
              />

              <h4>{skill.title}</h4>

              <p>{skill.company}</p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Skills;