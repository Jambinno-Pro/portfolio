// ============================================================
// DYNAMIC PROJECT IMAGE HANDLING
// ============================================================
//
// Project images are NOT stored in the frontend.
//
// Image flow:
//
// Admin Dashboard
//       ↓
// Node.js / Express Backend
//       ↓
// GitHub portfolio-assets repository
//       ↓
// Image URL saved in MongoDB
//       ↓
// React receives project.image
//       ↓
// Project image displayed dynamically
//
// The frontend does not need to know:
// - Image file names
// - Project image locations
// - Project image aliases
// - Project image keys
// - Which local asset belongs to which project
//
// The backend/database controls the image URL.
// ============================================================

// ------------------------------------------------------------
// GET PROJECT IMAGE
// ------------------------------------------------------------
//
// Returns the image URL stored in the project document.
//
// MongoDB example:
//
// {
//   title: "Event Booking & Management Platform",
//   image: "https://raw.githubusercontent.com/..."
// }
//
// The frontend simply uses:
//
// project.image
//
// Returns an empty string when no image is available.
// ------------------------------------------------------------

export function getProjectImage(project = {}) {
  return project?.image || "";
}

// ------------------------------------------------------------
// GET PROJECT GALLERY
// ------------------------------------------------------------
//
// Gallery support is kept dynamic.
//
// If a project has a primary image, it is returned as the
// initial gallery image.
//
// Additional gallery images can later be added to the backend
// without introducing hard-coded frontend image files.
// ------------------------------------------------------------

export function getProjectGallery(project = {}) {
  const image = project?.image || "";

  return image ? [image] : [];
}

// ------------------------------------------------------------
// GET PROJECT VISUALS
// ------------------------------------------------------------
//
// Returns the project's dynamic image and gallery together.
//
// This provides a single helper for components that need both
// the project thumbnail and gallery images.
// ------------------------------------------------------------

export function getProjectVisuals(project = {}) {
  return {
    image: getProjectImage(project),
    gallery: getProjectGallery(project),
  };
}
