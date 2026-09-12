const express = require("express");

const router = express.Router();

const {
  getResume,
  saveResume,
  deleteResume,
} = require("../controllers/resumeController");

const protect = require("../middleware/authMiddleware");
const { buildPdf } = require("../utils/resumePdf");

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
  saveResume
);

// =======================================
// DOWNLOAD CV
// =======================================

router.get("/download", async (req, res) => {
  try {
    const Resume = require("../models/Resume");
    const resume = await Resume.findOne().lean();

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume data not found",
      });
    }

    const pdf = buildPdf(resume);
    const safeName = String(resume.fullName || "Resume")
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-+|-+$/g, "") || "Resume";

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safeName}-Resume.pdf"`,
      "Content-Length": pdf.length,
      "Cache-Control": "no-store",
    });

    return res.end(pdf);
  } catch (error) {
    console.error("GENERATE RESUME PDF ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to generate the resume PDF.",
    });
  }
});

// =======================================
// DELETE RESUME
// =======================================

router.delete("/:id", protect, deleteResume);

module.exports = router;