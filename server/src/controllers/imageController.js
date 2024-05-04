const fileHelper = require("../helpers/fileHelper");
const imageValidator = require("../validators/imageValidator");
const imageDTO = require("../dto/imageDTO");
const logger = require("../../logger/logger");

const uploadImage = async (req, res) => {
  try {
    if (await imageValidator.imageValidator(req, res)) return;
    const image = await fileHelper.uploadImage(req.file, "temporary-uploads");
    const imageDetails = await imageDTO.imageToDTO(image);
    res.status(201).json({ data: imageDetails });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { uploadImage };
