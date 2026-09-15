import { useEffect, useState } from "react";

import { getGallery, deleteGallery } from "../../services/galleryService";

import GalleryTable from "../components/GalleryTable";
import AddGalleryModal from "../components/AddGalleryModal";

import "../../styles/Gallery.css";

function Gallery() {
  const [gallery, setGallery] = useState([]);

  const [filteredGallery, setFilteredGallery] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingGallery, setEditingGallery] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  // =====================================
  // LOAD GALLERY
  // =====================================

  const loadGallery = async () => {
    try {
      setLoading(true);

      const data = await getGallery();

      const galleryList = Array.isArray(data) ? data : data?.gallery || [];

      setGallery(galleryList);

      setFilteredGallery(galleryList);
    } catch (error) {
      console.error("Failed to load gallery:", error);

      setGallery([]);

      setFilteredGallery([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // INITIAL LOAD
  // =====================================

  useEffect(() => {
    loadGallery();
  }, []);

  // =====================================
  // SEARCH GALLERY
  // =====================================

  useEffect(() => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      setFilteredGallery(gallery);
      return;
    }

    const results = gallery.filter((item) => {
      const title = item.title?.toLowerCase() || "";

      const category = item.category?.toLowerCase() || "";

      const description = item.description?.toLowerCase() || "";

      return (
        title.includes(searchValue) ||
        category.includes(searchValue) ||
        description.includes(searchValue)
      );
    });

    setFilteredGallery(results);
  }, [search, gallery]);

  // =====================================
  // DELETE GALLERY ITEM
  // =====================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this gallery item?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await deleteGallery(id, token);

      alert("Gallery item deleted successfully!");

      await loadGallery();
    } catch (error) {
      console.error("Delete gallery error:", error);

      alert(error.response?.data?.message || "Unable to delete gallery item.");
    }
  };

  // =====================================
  // ADD GALLERY
  // =====================================

  const handleAddGallery = () => {
    setEditingGallery(null);

    setIsEditing(false);

    setShowModal(true);
  };

  // =====================================
  // EDIT GALLERY
  // =====================================

  const handleEditGallery = (item) => {
    setEditingGallery(item);

    setIsEditing(true);

    setShowModal(true);
  };

  // =====================================
  // CLOSE MODAL
  // =====================================

  const handleCloseModal = () => {
    setShowModal(false);

    setEditingGallery(null);

    setIsEditing(false);
  };

  // =====================================
  // RENDER
  // =====================================

  return (
    <div className="gallery-page">
      {/* =====================================
          HEADER
      ===================================== */}

      <div className="gallery-header">
        <div>
          <h1>Gallery</h1>

          <p>Manage portfolio gallery images.</p>
        </div>

        <button className="add-gallery-btn" onClick={handleAddGallery}>
          + Add Gallery
        </button>
      </div>

      {/* =====================================
          SEARCH
      ===================================== */}

      <div className="search-box">
        <input
          type="text"
          placeholder="Search Gallery..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* =====================================
          GALLERY TABLE
      ===================================== */}

      {loading ? (
        <div className="loading-gallery">
          <h3>Loading Gallery...</h3>
        </div>
      ) : (
        <GalleryTable
          gallery={filteredGallery}
          editGallery={handleEditGallery}
          deleteGallery={handleDelete}
        />
      )}

      {/* =====================================
          ADD / EDIT MODAL
      ===================================== */}

      {showModal && (
        <AddGalleryModal
          closeModal={handleCloseModal}
          refreshGallery={loadGallery}
          isEditing={isEditing}
          galleryData={editingGallery}
        />
      )}
    </div>
  );
}

export default Gallery;
