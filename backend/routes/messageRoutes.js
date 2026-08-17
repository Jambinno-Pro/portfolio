const express = require("express");

const router = express.Router();

const {
  createMessage,
  getMessages,
  getMessage,
  updateMessageStatus,
  deleteMessage,
} = require("../controllers/messageController");

const protect = require("../middleware/authMiddleware");

// =======================================
// PUBLIC
// Visitor submits contact form
// =======================================

router.post("/", createMessage);

// =======================================
// ADMIN
// View all messages
// =======================================

router.get("/", protect, getMessages);

// =======================================
// ADMIN
// View one message
// =======================================

router.get("/:id", protect, getMessage);

// =======================================
// ADMIN
// Update status
// =======================================

router.put("/:id/status", protect, updateMessageStatus);

// =======================================
// ADMIN
// Delete message
// =======================================

router.delete("/:id", protect, deleteMessage);

module.exports = router;