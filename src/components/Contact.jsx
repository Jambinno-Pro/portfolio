import "../styles/Contact.css";

import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaGithub,
  FaLinkedin,
  FaFacebookF,
  FaWhatsapp,
} from "react-icons/fa";

function Contact() {
  return (
    <section id="contact" className="contact-section">

      <div className="container">

        <h2 className="section-title">
          Let's Work Together
        </h2>

        <p className="section-description">
          Have a project in mind? Whether it's a modern website,
          React application, graphic design, database solution or
          WordPress website, I'd love to hear from you.
        </p>

        <div className="contact-wrapper">

          {/* LEFT */}

          <div className="contact-info">

            <div className="info-card">

              <div className="icon">
                <FaEnvelope />
              </div>

              <div>
                <h3>Email</h3>
                <p>hello@inno.com</p>
              </div>

            </div>

            <div className="info-card">

              <div className="icon">
                <FaPhoneAlt />
              </div>

              <div>
                <h3>Phone</h3>
                <p>+27 61 421 7057</p>
              </div>

            </div>

            <div className="info-card">

              <div className="icon">
                <FaMapMarkerAlt />
              </div>

              <div>
                <h3>Location</h3>
                <p>Cape Town, South Africa</p>
              </div>

            </div>

            <div className="social-icons">

              <a href="https://www.linkedin.com/in/innocent-jambaya-93a64b189/">
                <FaLinkedin />
              </a>

              <a href="https://github.com/Jambinno-Pro">
                <FaGithub />
              </a>

              <a href="https://www.facebook.com/inno.jambaya/">
                <FaFacebookF />
              </a>

              <a href="#">
                <FaWhatsapp />
              </a>

            </div>

          </div>

          {/* RIGHT */}

          <div className="contact-form">

            <form>

              <input
                type="text"
                placeholder="Full Name"
              />

              <input
                type="email"
                placeholder="Email Address"
              />

              <input
                type="text"
                placeholder="Subject"
              />

              <textarea
                rows="6"
                placeholder="Your Message"
              ></textarea>

              <button type="submit">
                Send Message
              </button>

            </form>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Contact;