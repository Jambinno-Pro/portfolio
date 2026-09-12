const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

// Upload Middleware
const upload = require("../middleware/upload");

const {
  getAbout,
  getAboutById,
  createAbout,
  updateAbout,
  deleteAbout,
} = require("../controllers/aboutController");

// ===========================
// PUBLIC ROUTES
// ===========================

router.get("/", getAbout);

router.get("/:id", getAboutById);

// ===========================
// PROTECTED ROUTES
// ===========================

router.post(
  "/",
  protect,
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "resume",
      maxCount: 1,
    },
  ]),
  createAbout
);

router.put(
  "/:id",
  protect,
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "resume",
      maxCount: 1,
    },
  ]),
  updateAbout
);

router.delete(
  "/:id",
  protect,
  deleteAbout
);

module.exports = router;