const express = require("express");

const router = express.Router();

const {
  getResume,
  saveResume,
  deleteResume,
} = require("../controllers/resumeController");

// =======================================
// GET RESUME
// =======================================
router.get("/", getResume);

// =======================================
// CREATE / UPDATE RESUME
// =======================================
router.post("/", saveResume);

// =======================================
// DELETE RESUME
// =======================================
router.delete("/:id", deleteResume);

module.exports = router;