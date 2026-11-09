const express = require("express");
const router = express.Router();

const {
  getResume,
  saveResume,
  deleteResume,
} = require("../controllers/resumeController");

const protect = require("../middleware/authMiddleware");

const pdfGeneratorPath = require.resolve("../utils/resumePdf");
const { buildPdf } = require(pdfGeneratorPath);

// Confirm which PDF generator is loaded when the backend starts.
console.log("========================================");
console.log("[RESUME] PDF GENERATOR LOADED");
console.log("[RESUME] Generator path:", pdfGeneratorPath);
console.log("[RESUME] buildPdf available:", typeof buildPdf === "function");
console.log("========================================");

// GET RESUME
router.get("/", getResume);

// SAVE RESUME
router.post("/", protect, saveResume);

// DOWNLOAD RESUME PDF
router.get("/download", async (req, res) => {
  console.log("\n========================================");
  console.log("[RESUME PDF] DOWNLOAD REQUEST RECEIVED");
  console.log("[RESUME PDF] Time:", new Date().toISOString());
  console.log("[RESUME PDF] Generator:", pdfGeneratorPath);
  console.log("========================================");

  try {
    const Resume = require("../models/Resume");

    // Retrieve resume data.
    const resume = await Resume.findOne().lean();

    if (!resume) {
      console.error("[RESUME PDF] No resume data found.");

      return res.status(404).json({
        success: false,
        message: "Resume data not found.",
      });
    }

    console.log("[RESUME PDF] Resume ID:", resume._id);
    console.log("[RESUME PDF] Name:", resume.fullName || "Resume");
    console.log(
      "[RESUME PDF] Skills count:",
      Array.isArray(resume.skills) ? resume.skills.length : 0,
    );

    // Generate PDF.
    console.log("[RESUME PDF] Starting PDF generation...");

    const pdf = buildPdf(resume);

    // Validate generated PDF.
    if (!Buffer.isBuffer(pdf)) {
      throw new Error("PDF generator did not return a Buffer.");
    }

    if (pdf.length === 0) {
      throw new Error("Generated PDF is empty.");
    }

    const pdfHeader = pdf.subarray(0, 5).toString("ascii");

    if (pdfHeader !== "%PDF-") {
      throw new Error(
        `Invalid PDF header. Received: ${JSON.stringify(pdfHeader)}`,
      );
    }

    console.log("[RESUME PDF] PDF generated successfully.");
    console.log("[RESUME PDF] File size:", pdf.length, "bytes");
    console.log("[RESUME PDF] PDF header:", pdfHeader);

    // Prepare download filename.
    const safeName =
      String(resume.fullName || "Resume")
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-+|-+$/g, "") || "Resume";

    // Send PDF.
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safeName}-Resume.pdf"`,
      "Content-Length": pdf.length,
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });

    console.log("[RESUME PDF] Sending PDF to browser...");
    console.log("========================================\n");

    return res.end(pdf);
  } catch (error) {
    console.error("========================================");
    console.error("[RESUME PDF] GENERATION FAILED");
    console.error("[RESUME PDF] Generator:", pdfGeneratorPath);
    console.error("[RESUME PDF] Error:", error.message);
    console.error(error.stack);
    console.error("========================================");

    return res.status(500).json({
      success: false,
      message: "Unable to generate the resume PDF.",
    });
  }
});

// DELETE RESUME
router.delete("/:id", protect, deleteResume);

module.exports = router;
