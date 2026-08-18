const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

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

router.post(
  "/",
  protect,
  upload.single("resume"),
  saveResume
);

// =======================================
// DELETE RESUME
// =======================================

router.delete(
  "/:id",
  protect,
  deleteResume
);

module.exports = router;