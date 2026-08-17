import { useState, useEffect } from "react";

import AddAboutModal from "../components/AddAboutModal";
import AboutCard from "../components/AboutCard";

import { getAbout } from "../../services/aboutService";

import "../styles/About.css";
import "../styles/AboutCard.css";


function About() {

  const [about, setAbout] = useState(null);

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);


  // ==========================
  // LOAD ABOUT
  // ==========================

  const loadAbout = async () => {

    try {

      setLoading(true);

      const response = await getAbout();


      /*
        API can return:

        {
          about: {}
        }

        OR:

        {
          about: []
        }
      */


      if (
        response?.about &&
        Array.isArray(response.about)
      ) {

        setAbout(
          response.about[0] || null
        );

      }

      else if (response?.about) {

        setAbout(response.about);

      }

      else {

        setAbout(null);

      }

    } catch (error) {

      console.error(
        "Failed to load About profile:",
        error
      );

      setAbout(null);

    } finally {

      setLoading(false);

    }

  };


  // ==========================
  // INITIAL LOAD
  // ==========================

  useEffect(() => {

    loadAbout();

  }, []);


  // ==========================
  // OPEN MODAL
  // ==========================

  const handleOpenModal = () => {

    setShowModal(true);

  };


  // ==========================
  // CLOSE MODAL
  // ==========================

  const handleCloseModal = () => {

    setShowModal(false);

  };


  return (

    <div className="about-page">


      {/* ==========================
          PAGE HEADER
      ========================== */}

      <div className="about-header">

        <div>

          <h1>
            About Me
          </h1>

          <p>
            Manage your portfolio profile.
          </p>

        </div>


        <button
          className="add-about-btn"
          onClick={handleOpenModal}
        >

          {about
            ? "Edit Profile"
            : "Create Profile"}

        </button>

      </div>


      {/* ==========================
          CONTENT
      ========================== */}

      {loading ? (

        <div className="no-profile">

          <h2>
            Loading...
          </h2>

        </div>

      ) : about ? (

        <AboutCard
          about={about}
        />

      ) : (

        <div className="no-profile">

          <h2>
            No About Profile Found
          </h2>

          <p>
            Click "Create Profile" to add your
            portfolio information.
          </p>

        </div>

      )}


      {/* ==========================
          ADD / EDIT MODAL
      ========================== */}

      {showModal && (

        <AddAboutModal

          closeModal={handleCloseModal}

          refreshAbout={loadAbout}

          isEditing={Boolean(about)}

          aboutData={about}

        />

      )}

    </div>

  );

}


export default About;