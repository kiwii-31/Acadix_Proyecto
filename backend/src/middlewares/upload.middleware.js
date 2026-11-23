import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 20 * 1024 * 1024,
    files: 1,
  },

  fileFilter: (req, file, callback) => {
    if (file.mimetype !== "application/pdf") {
      return callback(new Error("Solo se permiten archivos PDF."));
    }

    callback(null, true);
  },
});

export default upload;
