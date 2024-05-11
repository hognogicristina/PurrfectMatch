const { Breed, AgeType } = require("../../models");

const breedsExistValidator = async (req, res) => {
  const breeds = await Breed.findAll();
  if (breeds.length === 0) {
    return res.status(404).json({
      error: [{ field: "breeds", message: "No breeds found" }],
    });
  }

  return null;
};

const ageTypesExistValidator = async (req, res) => {
  const ageTypes = await AgeType.findAll();
  if (ageTypes.length === 0) {
    return res.status(404).json({
      error: [{ field: "ageTypes", message: "No age types found" }],
    });
  }

  return null;
};

module.exports = { breedsExistValidator, ageTypesExistValidator };
