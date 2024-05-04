const { Breed } = require("../../models");
const logger = require("../../logger/logger");
const breedValidator = require("../validators/breedValidator");

const getAllBreeds = async (req, res) => {
  try {
    if (await breedValidator.breedsExistValidator(req, res)) return;
    const breeds = await Breed.findAll();
    const totalItems = breeds.length;

    return res.status(200).json({
      totalPages: totalItems,
      data: breeds,
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

module.exports = { getAllBreeds };
