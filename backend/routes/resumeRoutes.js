const express = require("express");
const router = express.Router();

const {
  getResume,
  saveResume,
  deleteResume,
} = require("../controllers/resumeController");

const protect = require("../middleware/authMiddleware");
const { buildPdf } = require("../utils/resumePdf");

const Resume = require("../models/Resume");

/* =========================================================
   GET RESUME
   ========================================================= */

router.get("/", getResume);

/* =========================================================
   SAVE RESUME
   ========================================================= */

router.post("/", protect, saveResume);

/* =========================================================
   DOWNLOAD RESUME PDF
   ========================================================= */

router.get("/download", async (req, res) => {
  try {
    const resumeDocument =
      await Resume.findOne().lean();

    if (!resumeDocument) {
      return res.status(404).json({
        success: false,
        message:
          "Resume data not found",
      });
    }

    /*
     * -------------------------------------------------------
     * IMPORTANT
     *
     * Explicitly normalize the arrays before sending
     * the data to the PDF generator.
     * -------------------------------------------------------
     */

    const resume = {
      ...resumeDocument,

      skills: Array.isArray(
        resumeDocument.skills
      )
        ? resumeDocument.skills
        : [],

      experience: Array.isArray(
        resumeDocument.experience
      )
        ? resumeDocument.experience
        : [],

      education: Array.isArray(
        resumeDocument.education
      )
        ? resumeDocument.education
        : [],

      certificates: Array.isArray(
        resumeDocument.certificates
      )
        ? resumeDocument.certificates
        : [],

      languages: Array.isArray(
        resumeDocument.languages
      )
        ? resumeDocument.languages
        : [],
    };

    /*
     * -------------------------------------------------------
     * DEBUG INFORMATION
     *
     * This confirms exactly what the PDF endpoint receives.
     * It can be removed later.
     * -------------------------------------------------------
     */

    console.log(
      "========================================"
    );

    console.log(
      "GENERATING RESUME PDF"
    );

    console.log(
      "Resume ID:",
      resume._id
    );

    console.log(
      "Professional Skills:",
      JSON.stringify(
        resume.skills,
        null,
        2
      )
    );

    console.log(
      "Skills Count:",
      resume.skills.length
    );

    console.log(
      "========================================"
    );

    /*
     * -------------------------------------------------------
     * BUILD PDF
     * -------------------------------------------------------
     */

    const pdf =
      buildPdf(resume);

    const safeName =
      String(
        resume.fullName ||
          "Resume"
      )
        .replace(
          /[^a-z0-9]+/gi,
          "-"
        )
        .replace(
          /^-+|-+$/g,
          ""
        ) ||
      "Resume";

    /*
     * -------------------------------------------------------
     * SEND PDF
     * -------------------------------------------------------
     */

    res.set({
      "Content-Type":
        "application/pdf",

      "Content-Disposition":
        `attachment; filename="${safeName}-Resume.pdf"`,

      "Content-Length":
        pdf.length,

      "Cache-Control":
        "no-store, no-cache, must-revalidate, proxy-revalidate",

      Pragma: "no-cache",

      Expires: "0",
    });

    return res.end(pdf);
  } catch (error) {
    console.error(
      "========================================"
    );

    console.error(
      "GENERATE RESUME PDF ERROR:"
    );

    console.error(error);

    console.error(
      "========================================"
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to generate the resume PDF.",
    });
  }
});

/* =========================================================
   DELETE RESUME
   ========================================================= */

router.delete(
  "/:id",
  protect,
  deleteResume
);

module.exports = router;