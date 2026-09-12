const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

// ===============================
// Database
// ===============================
const connectDB = require("./config/db");

// ===============================
// Routes
// ===============================
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const skillRoutes = require("./routes/skillRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const messageRoutes = require("./routes/messageRoutes");

// ===============================
// Middleware
// ===============================
const protect = require("./middleware/authMiddleware");

// ===============================
// Initialize App
// ===============================
const app = express();

// ===============================
// Connect Database
// ===============================
connectDB();

// ===============================
// Global Middleware
// ===============================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ===============================
// Home Route
// ===============================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Portfolio Backend API is Running Successfully!",
  });
});

// ===============================
// Authentication Routes
// ===============================
app.use("/api/auth", authRoutes);

// ===============================
// Project Routes
// ===============================
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/messages", messageRoutes);

// ===============================
// Protected Admin Route (JWT Test)
// ===============================
app.get("/api/admin", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "🎉 Welcome Admin! Authentication Successful.",
    user: req.user,
  });
});

// ===============================
// 404 Route
// ===============================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "❌ Route Not Found",
  });
});

// ===============================
// Start Server
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});