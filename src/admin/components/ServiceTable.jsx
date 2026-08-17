import {
  FaEdit,
  FaTrash,
  FaExternalLinkAlt,
} from "react-icons/fa";

import "../styles/ServiceTable.css";

function ServiceTable({
  services = [],
  editService,
  deleteService,
}) {
  return (
    <div className="table-container">

      <table className="projects-table">

        {/* ==========================
            TABLE HEADER
        ========================== */}

        <thead>
          <tr>

            <th>Icon</th>

            <th>Service</th>

            <th>Category</th>

            <th>Status</th>

            <th>Preview</th>

            <th>Actions</th>

          </tr>
        </thead>


        {/* ==========================
            TABLE BODY
        ========================== */}

        <tbody>

          {services.length > 0 ? (

            services.map((service) => (

              <tr key={service._id}>

                {/* ==========================
                    ICON
                ========================== */}

                <td>

                  <div className="service-icon">

                    {service.icon || "—"}

                  </div>

                </td>


                {/* ==========================
                    SERVICE
                ========================== */}

                <td>

                  <div className="project-info">

                    <h4>
                      {service.title || service.name}
                    </h4>

                    <small>
                      {service.description}
                    </small>

                  </div>

                </td>


                {/* ==========================
                    CATEGORY
                ========================== */}

                <td>

                  {service.category || "Service"}

                </td>


                {/* ==========================
                    STATUS
                ========================== */}

                <td>

                  <span
                    className={
                      service.status === "Active"
                        ? "status active"
                        : "status inactive"
                    }
                  >

                    {service.status || "Inactive"}

                  </span>

                </td>


                {/* ==========================
                    PREVIEW
                ========================== */}

                <td>

                  {service.link && (

                    <a
                      href={service.link}
                      target="_blank"
                      rel="noreferrer"
                      title="View service"
                    >

                      <FaExternalLinkAlt />

                    </a>

                  )}

                </td>


                {/* ==========================
                    ACTIONS
                ========================== */}

                <td className="action-buttons">

                  {/* EDIT */}

                  <button
                    type="button"
                    className="edit-btn"
                    onClick={() =>
                      editService(service)
                    }
                    title="Edit service"
                  >

                    <FaEdit />

                  </button>


                  {/* DELETE */}

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() =>
                      deleteService(service._id)
                    }
                    title="Delete service"
                  >

                    <FaTrash />

                  </button>

                </td>

              </tr>

            ))

          ) : (

            <tr>

              <td
                colSpan="6"
                style={{
                  textAlign: "center",
                  padding: "30px",
                }}
              >

                No Services Found

              </td>

            </tr>

          )}

        </tbody>

      </table>

    </div>
  );
}

export default ServiceTable;