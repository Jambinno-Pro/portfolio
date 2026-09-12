const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
} = require("../controllers/skillController");

// Public
router.get("/", getSkills);
router.get("/:id", getSkill);

// Protected
router.post("/", protect, createSkill);
router.put("/:id", protect, updateSkill);
router.delete("/:id", protect, deleteSkill);

module.exports = router;