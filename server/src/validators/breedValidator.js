const { Breed } = require("../../models");

const breedsExistValidator = async (req, res) => {
  const breeds = await Breed.findAll();
  if (breeds.length === 0) {
    return res.status(404).json({
      error: [{ field: "breeds", message: "No breeds found" }],
    });
  }

  return null;
};

module.exports = { breedsExistValidator };
