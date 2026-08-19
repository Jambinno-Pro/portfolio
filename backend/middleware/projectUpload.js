const multer = require("multer");
const path = require("path");
const fs = require("fs");

// =======================================
// STORAGE
// =======================================

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    const folder = "uploads/projects";

    fs.mkdirSync(folder, {
      recursive: true,
    });

    cb(null, folder);

  },

  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);

  },

});

// =======================================
// FILE FILTER
// =======================================

const fileFilter = (req, file, cb) => {

  if (file.mimetype.startsWith("image/")) {

    cb(null, true);

  } else {

    cb(
      new Error("Only image files are allowed.")
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