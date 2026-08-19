const express = require("express");

const router = express.Router();

const {
  getResume,
  saveResume,
  deleteResume,
} = require("../controllers/resumeController");

const upload = require("../middleware/resumeUpload");

// =======================================
// GET RESUME
// =======================================

router.get("/", getResume);

// =======================================
// CREATE / UPDATE RESUME
// =======================================

router.post(
  "/",
  upload.single("cv"),
  saveResume
);

// =======================================
// DOWNLOAD CV
// =======================================

router.get("/download", async (req, res) => {
  try {
    const Resume = require("../models/Resume");

    const resume = await Resume.findOne();

    if (!resume || !resume.cv) {
      return res.status(404).json({
        success: false,
        message: "CV not found",
      });
    }

    res.download(resume.cv, "Innocent-Jambaya-CV.pdf");

  } catch (error) {

    console.error("DOWNLOAD CV ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
});

// =======================================
// DELETE RESUME
// =======================================

router.delete("/:id", deleteResume);

module.exports = router;