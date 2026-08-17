import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";

import Skills from "../components/skills/Skills";
import Services from "../components/services/Services";
import Projects from "../components/projects/Projects";

import Contact from "../components/Contact";
import Footer from "../components/Footer";

import innoImage from "../assets/inno.jpg";

function Home() {
  return (
    <main className="home-page">

      {/* ==========================
          NAVBAR
      ========================== */}

      <Navbar />


      {/* ==========================
          HERO
      ========================== */}

      <Hero />


      {/* ==========================
          PROFILE IMAGE
          BETWEEN HERO & ABOUT
      ========================== */}

      <div className="profile-photo-divider">

        <div className="profile-photo-ring">

          <img
            src={innoImage}
            alt="Innocent Jambaya"
          />

        </div>

      </div>


      {/* ==========================
          ABOUT
      ========================== */}

      <About />


      {/* ==========================
          SKILLS
      ========================== */}

      <Skills />


      {/* ==========================
          SERVICES
      ========================== */}

      <Services />


      {/* ==========================
          PROJECTS
      ========================== */}

      <Projects />


      {/* ==========================
          CONTACT
      ========================== */}

      <Contact />


      {/* ==========================
          FOOTER
      ========================== */}

      <Footer />

    </main>
  );
}

export default Home;