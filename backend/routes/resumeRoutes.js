const express = require("express");
const router = express.Router();

const {
  getResume,
  saveResume,
  deleteResume,
} = require("../controllers/resumeController");

const protect = require("../middleware/authMiddleware");
const { buildPdf } = require("../utils/resumePdf");

router.get("/", getResume);

router.post("/", protect, saveResume);

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

    console.log("========================================");
    console.log("GENERATING RESUME PDF");
    console.log("Resume ID:", resume._id);
    console.log(
      "Professional Skills:",
      JSON.stringify(resume.skills, null, 2)
    );
    console.log(
      "Skills Count:",
      Array.isArray(resume.skills) ? resume.skills.length : 0
    );
    console.log("========================================");

    const pdf = buildPdf(resume);

    const safeName =
      String(resume.fullName || "Resume")
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-+|-+$/g, "") || "Resume";

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safeName}-Resume.pdf"`,
      "Content-Length": pdf.length,
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
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

router.delete("/:id", protect, deleteResume);

module.exports = router;