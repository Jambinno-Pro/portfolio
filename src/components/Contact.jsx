import { useState } from "react";

import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa";

import { sendMessage } from "../services/messageService";

import "../styles/Contact.css";

function Contact() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ==========================
  // HANDLE INPUT
  // ==========================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

  };

  // ==========================
  // SEND MESSAGE
  // ==========================

  const handleSubmit = async (e) => {

    // VERY IMPORTANT
    e.preventDefault();

    e.stopPropagation();

    setLoading(true);
    setSuccess("");
    setError("");

    console.log("Submitting contact form...");
    console.log("Form data:", formData);

    try {

      const response = await sendMessage(formData);

      console.log("Message API response:", response);

      setSuccess(
        response.message ||
        "Your message has been sent successfully!"
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

    } catch (err) {

      console.error("MESSAGE ERROR:", err);

      console.error(
        "Server response:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
        "Unable to send your message. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <section
      className="contact-section"
      id="contact"
    >

      <div className="container">

        <div className="contact-header">

          <h2 className="section-title">
            Contact Me
          </h2>

          <p className="section-description">
            Have a project in mind or want to work together?
            Send me a message and I'll get back to you.
          </p>

        </div>


        <div className="contact-wrapper">

          {/* ==========================
              CONTACT INFORMATION
          ========================== */}

          <div className="contact-info">

            <h3>
              Let's Work Together
            </h3>

            <p>
              Whether you need a website, web application,
              WordPress solution or a complete digital
              solution, I'd love to hear about your project.
            </p>


            <div className="contact-details">

              <div className="contact-item">

                <div className="contact-icon">
                  <FaEnvelope />
                </div>

                <div>

                  <span>Email</span>

                  <a href="mailto:jambinnocreations@gmail.com">
                    jambinnocreations@gmail.com
                  </a>

                </div>

              </div>


              <div className="contact-item">

                <div className="contact-icon">
                  <FaPhone />
                </div>

                <div>

                  <span>Phone</span>

                  <a href="tel:0614217057">
                    0614217057
                  </a>

                </div>

              </div>


              <div className="contact-item">

                <div className="contact-icon">
                  <FaMapMarkerAlt />
                </div>

                <div>

                  <span>Location</span>

                  <p>
                    Cape Town, South Africa
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* ==========================
              FORM
          ========================== */}

          <div className="contact-form-container">

            <form
              className="contact-form"
              onSubmit={handleSubmit}
              noValidate
            >

              <div className="form-row">

                <div className="form-group">

                  <label htmlFor="name">
                    Name
                  </label>

                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="form-group">

                  <label htmlFor="email">
                    Email
                  </label>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              <div className="form-row">

                <div className="form-group">

                  <label htmlFor="phone">
                    Phone
                  </label>

                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Optional"
                    value={formData.phone}
                    onChange={handleChange}
                  />

                </div>


                <div className="form-group">

                  <label htmlFor="subject">
                    Subject
                  </label>

                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder="What can I help you with?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              <div className="form-group">

                <label htmlFor="message">
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows="7"
                  placeholder="Tell me about your project..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* SUCCESS */}

              {success && (

                <div className="form-success">
                  {success}
                </div>

              )}


              {/* ERROR */}

              {error && (

                <div className="form-error">
                  {error}
                </div>

              )}


              <button
                type="submit"
                className="send-message-btn"
                disabled={loading}
              >

                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    <FaPaperPlane />
                    Send Message
                  </>
                )}

              </button>

            </form>

          </div>

        </div>

      </div>

    </section>

  );

}

export default Contact;