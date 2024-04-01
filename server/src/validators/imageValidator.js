const imageValidator = async (req, res) => {
  const errors = [];
  if (!req.file) {
    errors.push({ field: "file", error: "Image is required" });
  } else {
    const maxSize = 5 * 1024 * 1024;
    if (req.file.size > maxSize) {
      errors.push({ field: "file", error: "File size should not exceed 5MB" });
    }

    const extension = req.file.originalname.substring(
      req.file.originalname.lastIndexOf(".") + 1,
    );
    const allowedTypes = /jpeg|jpg|png|gif/i;
    if (!allowedTypes.test(extension)) {
      errors.push({ field: "file", error: "Only image files are allowed" });
    }
  }

  return errors.length > 0 ? res.status(400).json({ errors }) : null;
};

module.exports = { imageValidator };
