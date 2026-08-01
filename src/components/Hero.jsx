import { TypeAnimation } from "react-type-animation";
import "../styles/Hero.css";
import profile from "../assets/inno.jpg";

function Hero() {
  return (
    <section id="hero" className="hero">

      {/* Animated Background */}
      <div className="hero-bg">

        <span className="diamond d1"></span>
        <span className="diamond d2"></span>
        <span className="diamond d3"></span>
        <span className="diamond d4"></span>
        <span className="diamond d5"></span>

        <span className="glow glow1"></span>
        <span className="glow glow2"></span>

      </div>

      <div className="hero-content">

        <div className="hero-text">

          <h4>Hello, my name is</h4>

         <h1 className="hero-name">
      INNOCENT JAMBAYA,
</h1>

          <h2>
  <TypeAnimation
    sequence={[
      "Frontend Developer", 2000,
      "React Developer", 2000,
      "WordPress Developer", 2000,
      "Graphic Designer", 2000,
      "UI/UX Designer", 2000,
      "AI Enthusiast", 2000,
    ]}
    wrapper="span"
    speed={50}
    repeat={Infinity}
  />
</h2>

          <p>
            I build modern, responsive and user-friendly websites using
            React, WordPress, JavaScript and modern web technologies.
            I also specialize in Graphic Design, UI/UX Design and AI-powered solutions.
          </p>

          <div className="hero-buttons">

            <a href="#projects" className="btn">
              View Projects
            </a>

            <a href="#contact" className="btn secondary">
              Hire Me
            </a>

          </div>

        </div>

        <div className="hero-image">
          <img src={profile} alt="Innocent Jambaya" />
        </div>

      </div>

    </section>
  );
}

export default Hero;