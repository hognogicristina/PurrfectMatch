const imageValidator = async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ error: [{ field: "file", message: "Image is required" }] });
  } else {
    const maxSize = 5 * 1024 * 1024;
    if (req.file.size > maxSize) {
      return res.status(400).json({
        error: [{ field: "file", message: "File size should not exceed 5MB" }],
      });
    }

    const extension = req.file.originalname.substring(
      req.file.originalname.lastIndexOf(".") + 1,
    );
    const allowedTypes = /jpeg|jpg|png|gif/i;
    if (!allowedTypes.test(extension)) {
      return res.status(400).json({
        error: [{ field: "file", message: "Only image files are allowed" }],
      });
    }
  }

  return null;
};

module.exports = { imageValidator };
