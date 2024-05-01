const imageValidator = async (req, res) => {
  const error = [];
  if (!req.file) {
    error.push({ field: "file", message: "Image is required" });
  } else {
    const maxSize = 5 * 1024 * 1024;
    if (req.file.size > maxSize) {
      error.push({ field: "file", message: "File size should not exceed 5MB" });
    }

    const extension = req.file.originalname.substring(
      req.file.originalname.lastIndexOf(".") + 1,
    );
    const allowedTypes = /jpeg|jpg|png|gif/i;
    if (!allowedTypes.test(extension)) {
      error.push({ field: "file", message: "Only image files are allowed" });
    }
  }

  return error.length > 0 ? res.status(400).json({ error }) : null;
};

module.exports = { imageValidator };
