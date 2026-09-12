const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ===============================
// Storage
// ===============================

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    let folder = "uploads/projects";

    // Resume PDF
    if (file.fieldname === "resume") {

      folder = "uploads/resume";

    }

    // About profile image
    else if (file.fieldname === "image") {

      if (req.originalUrl.includes("about")) {

        folder = "uploads/about";

      } else {

        folder = "uploads/projects";

      }

    }

    // Create folder if it doesn't exist
    fs.mkdirSync(folder, { recursive: true });

    cb(null, folder);

  },

  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9);

    cb(

      null,

      uniqueName + path.extname(file.originalname)

    );

  },

});

// ===============================
// File Filter
// ===============================

const fileFilter = (req, file, cb) => {

  const imageTypes =

    /jpeg|jpg|png|webp/;

  const pdfTypes =

    /pdf/;

  if (

    file.fieldname === "resume"

  ) {

    if (

      pdfTypes.test(file.mimetype)

    ) {

      return cb(null, true);

    }

    return cb(

      new Error(

        "Only PDF files are allowed."

      )

    );

  }

  if (

    imageTypes.test(file.mimetype)

  ) {

    return cb(null, true);

  }

  cb(

    new Error(

      "Only image files are allowed."

    )

  );

};

// ===============================
// Upload
// ===============================

const upload = multer({

  storage,

  fileFilter,

  limits: {

    fileSize: 10 * 1024 * 1024,

  },

});

module.exports = upload;