const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

// Public Routes
router.get("/", getServices);
router.get("/:id", getService);

// Protected Routes
router.post("/", protect, createService);
router.put("/:id", protect, updateService);
router.delete("/:id", protect, deleteService);

module.exports = router;