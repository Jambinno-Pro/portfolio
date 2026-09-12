import { useEffect, useState } from "react";

import {
  getServices,
  deleteService,
} from "../../services/serviceService";

import ServiceTable from "../components/ServiceTable";
import AddServiceModal from "../components/AddServiceModal";

import "../styles/Services.css";


function Services() {

  const [services, setServices] = useState([]);

  const [filteredServices, setFilteredServices] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingService, setEditingService] = useState(null);

  const [isEditing, setIsEditing] = useState(false);


  // ==========================
  // LOAD SERVICES
  // ==========================

  const loadServices = async () => {

    try {

      setLoading(true);

      const response = await getServices();

      const serviceList = response.services || [];

      setServices(serviceList);

      setFilteredServices(serviceList);

    } catch (error) {

      console.error(
        "Error loading services:",
        error
      );

      setServices([]);

      setFilteredServices([]);

    } finally {

      setLoading(false);

    }

  };


  // ==========================
  // DELETE SERVICE
  // ==========================

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmDelete) {
      return;
    }


    try {

      const token = localStorage.getItem("token");

      await deleteService(id, token);

      alert(
        "Service deleted successfully!"
      );

      await loadServices();

    } catch (error) {

      console.error(
        "Delete service error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Unable to delete service."
      );

    }

  };


  // ==========================
  // LOAD ONCE
  // ==========================

  useEffect(() => {

    loadServices();

  }, []);


  // ==========================
  // SEARCH SERVICES
  // ==========================

  useEffect(() => {

    const searchValue =
      search.toLowerCase().trim();


    if (!searchValue) {

      setFilteredServices(services);

      return;

    }


    const results = services.filter(
      (service) => {

        const title =
          service.title?.toLowerCase() || "";

        const description =
          service.description?.toLowerCase() || "";


        return (
          title.includes(searchValue) ||
          description.includes(searchValue)
        );

      }
    );


    setFilteredServices(results);

  }, [search, services]);


  // ==========================
  // OPEN ADD MODAL
  // ==========================

  const handleAddService = () => {

    setEditingService(null);

    setIsEditing(false);

    setShowModal(true);

  };


  // ==========================
  // OPEN EDIT MODAL
  // ==========================

  const handleEditService = (service) => {

    setEditingService(service);

    setIsEditing(true);

    setShowModal(true);

  };


  // ==========================
  // CLOSE MODAL
  // ==========================

  const handleCloseModal = () => {

    setShowModal(false);

    setEditingService(null);

    setIsEditing(false);

  };


  return (

    <div className="services-page">

      {/* ==========================
          PAGE HEADER
      ========================== */}

      <div className="projects-header">

        <div>

          <h1>
            Services
          </h1>

          <p>
            Manage all your services.
          </p>

        </div>


        <button
          className="add-project-btn"
          onClick={handleAddService}
        >
          + Add Service
        </button>

      </div>


      {/* ==========================
          SEARCH
      ========================== */}

      <div className="search-box">

        <input
          type="text"
          placeholder="Search Services..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>


      {/* ==========================
          SERVICES
      ========================== */}

      {loading ? (

        <div className="loading-projects">

          <h3>
            Loading Services...
          </h3>

        </div>

      ) : (

        <ServiceTable
          services={filteredServices}
          editService={handleEditService}
          deleteService={handleDelete}
        />

      )}


      {/* ==========================
          ADD / EDIT MODAL
      ========================== */}

      {showModal && (

        <AddServiceModal

          closeModal={handleCloseModal}

          refreshServices={loadServices}

          isEditing={isEditing}

          serviceData={editingService}

        />

      )}

    </div>

  );

}


export default Services;