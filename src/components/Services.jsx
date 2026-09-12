import { useState, useEffect } from "react";

import { getServices } from "../../services/serviceService";
import ServiceCard from "./ServiceCard";

import "../../styles/services/Services.css";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await getServices();

      setServices(response.services || []);
    } catch (error) {
      console.error("Failed to load services:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="services-section"
      id="services"
    >
      <div className="container">

        <div className="services-heading">

          <h2 className="section-title">
            My Services
          </h2>

          <p className="section-description">
            I provide professional digital solutions that help
            businesses establish a strong online presence using
            modern technologies.
          </p>

        </div>

        {loading ? (

          <div className="loading-services">

            Loading Services...

          </div>

        ) : (

          <div className="services-grid">

            {services.length > 0 ? (

              services.map((service) => (

                <ServiceCard
                  key={service._id}
                  service={service}
                />

              ))

            ) : (

              <h3>No Services Found.</h3>

            )}

          </div>

        )}

      </div>
    </section>
  );
}

export default Services;