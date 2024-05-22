const fileHelper = require("../helpers/fileHelper");
const imageValidator = require("../validators/imageValidator");
const userValidator = require("../validators/userValidator");
const imageDTO = require("../dto/imageDTO");
const logger = require("../../logger/logger");

const uploadImages = async (req, res) => {
  try {
    if (await userValidator.validateActiveAccount(req, res)) return;
    if (await imageValidator.imagesValidator(req, res)) return;
    const imagesDetails = [];
    for (const file of req.files) {
      if (await imageValidator.imageValidator(req, res, file)) continue;
      const image = await fileHelper.uploadImage(file, "temporary-uploads");
      const imageDetails = await imageDTO.imageToDTO(image);
      imagesDetails.push(imageDetails);
    }

    res.status(201).json({ data: imagesDetails });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

module.exports = { uploadImages };
