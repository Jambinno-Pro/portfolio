const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

// =======================
// Public Routes
// =======================
router.get("/", getProjects);
router.get("/:id", getProject);

// =======================
// Protected Routes
// =======================
router.post(
  "/",
  protect,
  upload.single("image"),
  createProject
);

router.put(
  "/:id",
  protect,
  upload.single("image"),
  updateProject
);

router.delete(
  "/:id",
  protect,
  deleteProject
);

module.exports = router;