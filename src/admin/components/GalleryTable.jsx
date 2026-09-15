import { FaEdit, FaTrash } from "react-icons/fa";

import "../../styles/GalleryTable.css";

function GalleryTable({ gallery = [], editGallery, deleteGallery }) {
  return (
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
            gallery.map((item) => (
              <tr key={item._id}>
                {/* IMAGE */}

                <td>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="gallery-thumb"
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
                    className="edit-btn"
                    onClick={() => editGallery(item)}
                    title="Edit"
                  >
                    <FaEdit />
                  </button>

                  <button
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
  );
}

export default GalleryTable;
