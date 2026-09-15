import { useEffect, useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import "../../styles/GalleryTable.css";

function GalleryTable({ gallery = [], editGallery, deleteGallery }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const selectedItem = selectedIndex !== null ? gallery[selectedIndex] : null;

  // ============================================
  // OPEN IMAGE
  // ============================================

  const openImage = (index) => {
    setSelectedIndex(index);
  };

  // ============================================
  // CLOSE IMAGE
  // ============================================

  const closeImage = () => {
    setSelectedIndex(null);
  };

  // ============================================
  // PREVIOUS IMAGE
  // ============================================

  const previousImage = () => {
    if (!gallery.length) return;

    setSelectedIndex((current) =>
      current === 0 ? gallery.length - 1 : current - 1,
    );
  };

  // ============================================
  // NEXT IMAGE
  // ============================================

  const nextImage = () => {
    if (!gallery.length) return;

    setSelectedIndex((current) =>
      current === gallery.length - 1 ? 0 : current + 1,
    );
  };

  // ============================================
  // ESCAPE KEY
  // ============================================

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (selectedIndex === null) return;

      if (event.key === "Escape") {
        closeImage();
      }

      if (event.key === "ArrowLeft") {
        previousImage();
      }

      if (event.key === "ArrowRight") {
        nextImage();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex]);

  return (
    <>
      {/* ============================================
          GALLERY TABLE
      ============================================ */}

      <div className="table-container">
        <table className="gallery-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {gallery.length > 0 ? (
              gallery.map((item, index) => (
                <tr key={item._id}>
                  {/* IMAGE */}

                  <td>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="gallery-thumb"
                      onClick={() => openImage(index)}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </td>

                  {/* TITLE */}

                  <td>
                    <div className="gallery-info">
                      <h4>{item.title}</h4>

                      {item.description && <small>{item.description}</small>}
                    </div>
                  </td>

                  {/* CATEGORY */}

                  <td>{item.category}</td>

                  {/* STATUS */}

                  <td>
                    <span
                      className={
                        item.status === "Active"
                          ? "status active"
                          : "status inactive"
                      }
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* ACTIONS */}

                  <td className="action-buttons">
                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() => editGallery(item)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>

                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => deleteGallery(item._id)}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                  }}
                >
                  No Gallery Items Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ============================================
          FULL-SCREEN IMAGE VIEWER
      ============================================ */}

      {selectedItem && (
        <div className="gallery-lightbox" onClick={closeImage}>
          {/* CLOSE */}

          <button
            type="button"
            className="gallery-lightbox-close"
            onClick={closeImage}
            aria-label="Close image"
          >
            <FaTimes />
          </button>

          {/* PREVIOUS */}

          {gallery.length > 1 && (
            <button
              type="button"
              className="gallery-lightbox-prev"
              onClick={(e) => {
                e.stopPropagation();
                previousImage();
              }}
              aria-label="Previous image"
            >
              <FaChevronLeft />
            </button>
          )}

          {/* CONTENT */}

          <div
            className="gallery-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* IMAGE */}

            <div className="gallery-lightbox-image-wrapper">
              <img
                src={selectedItem.image}
                alt=""
                className="gallery-lightbox-image"
              />
            </div>

            {/* DESCRIPTION ONLY */}

            <div className="gallery-lightbox-description">
              <p>
                {selectedItem.description ||
                  "No description available for this screenshot."}
              </p>
            </div>
          </div>

          {/* NEXT */}

          {gallery.length > 1 && (
            <button
              type="button"
              className="gallery-lightbox-next"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              aria-label="Next image"
            >
              <FaChevronRight />
            </button>
          )}
        </div>
      )}
    </>
  );
}

export default GalleryTable;
