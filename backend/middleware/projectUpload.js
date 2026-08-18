const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const imageTypes = /jpeg|jpg|png|webp/;

  if (imageTypes.test(file.mimetype)) {
    return cb(null, true);
  }

  cb(new Error("Only image files are allowed."));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

module.exports = upload;