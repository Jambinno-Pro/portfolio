import { useState, useEffect } from "react";

import { getServices } from "../../services/serviceService";
import ServiceCard from "./ServiceCard";

import "../../styles/services/Services.css";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD SERVICES
  // ==========================================

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);

      const response = await getServices();

      console.log("Services API response:", response);

      setServices(response?.services || []);
    } catch (error) {
      console.error("Failed to load services:", error);

      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="services-section" id="services">

      <div className="services-container">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="services-heading">

          <h2 className="section-title">
            My Services
          </h2>

          <p className="section-description">
            I provide professional digital solutions that
            help businesses establish a strong online
            presence using modern technologies.
          </p>

        </div>


        {/* ==========================================
            LOADING
        ========================================== */}

        {loading && (
          <div className="loading-services">
            Loading Services...
          </div>
        )}


        {/* ==========================================
            SERVICES GRID
        ========================================== */}

        {!loading && services.length > 0 && (

          <div className="services-grid">

            {services.map((service) => (

              <ServiceCard
                key={service._id}
                service={service}
              />

            ))}

          </div>

        )}


        {/* ==========================================
            NO SERVICES
        ========================================== */}

        {!loading && services.length === 0 && (

          <div className="services-empty">

            <h3>No Services Found.</h3>

            <p>
              Services will appear here once they have
              been added.
            </p>

          </div>

        )}

      </div>

    </section>
  );
}

export default Services;