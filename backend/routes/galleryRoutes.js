const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/galleryUpload");

const {
  createGallery,
  getGallery,
  getGalleryItem,
  getProjectGallery,
  updateGallery,
  deleteGallery,
} = require("../controllers/galleryController");

// Public
router.get("/", getGallery);

router.get("/project/:projectId", getProjectGallery);

router.get("/:id", getGalleryItem);

// Protected
router.post("/", protect, upload.single("image"), createGallery);

router.put("/:id", protect, upload.single("image"), updateGallery);

router.delete("/:id", protect, deleteGallery);

module.exports = router;
