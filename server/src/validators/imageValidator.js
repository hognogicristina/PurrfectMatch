const imageValidator = async (req, res, file) => {
  let fileToValidate;

  if (file) {
    fileToValidate = file;
  } else {
    fileToValidate = req.file;
  }

  if (!fileToValidate) {
    return res
      .status(400)
      .json({ error: [{ field: "file", message: "Image is required" }] });
  } else {
    const maxSize = 5 * 1024 * 1024;
    if (fileToValidate.size > maxSize) {
      return res.status(400).json({
        error: [{ field: "file", message: "File size should not exceed 5MB" }],
      });
    }

    const extension = fileToValidate.originalname.substring(
      fileToValidate.originalname.lastIndexOf(".") + 1,
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

const imagesValidator = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res
      .status(400)
      .json({ error: [{ field: "file", message: "Images are required" }] });
  }

  return null;
};

module.exports = { imageValidator, imagesValidator };
