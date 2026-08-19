const multer = require("multer");

// =======================================
// MEMORY STORAGE
// =======================================

const storage = multer.memoryStorage();

// =======================================
// FILE FILTER
// =======================================

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(
      new Error("Only PDF files are allowed.")
    );
  }
};

// =======================================
// MULTER
// =======================================

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

module.exports = upload;