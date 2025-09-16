const multer = require("multer");
const path = require("path");

// Set up storage configuration for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // This is where uploaded files will be temporarily stored
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Create a unique filename to prevent overwriting
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Create the Multer instance with the storage configuration
const upload = multer({ storage: storage });

module.exports = upload;