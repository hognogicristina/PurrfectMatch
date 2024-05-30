const validator = require("validator");
const { Cat, Breed, Image, AgeType } = require("../../models");

const catExistValidator = async (req, res) => {
  const cats = await Cat.findAll();
  const error = [];

  if (req.params.id) {
    const cat = await Cat.findByPk(req.params.id);
    if (!cat) {
      return res
        .status(404)
        .json({ error: [{ field: "cat", message: "Cat not found" }] });
    }
  } else {
    if (cats.length === 0) {
      return res.status(404).json({
        error: [{ field: "cats", message: "No Cats Available" }],
      });
    }

    if (req.query.sortBy) {
      const sortBy = ["breed", "age", "location", "createdAt"];
      if (!sortBy.includes(req.query.sortBy)) {
        error.push({ field: "sortBy", message: "Invalid Sort By" });
      }
    }

    if (req.query.selectedBreed) {
      const breeds = await Breed.findAll();
      const breedNames = breeds.map((breed) => breed.name);
      if (!breedNames.includes(req.query.selectedBreed)) {
        error.push({ field: "breed", message: "Please select a valid breed" });
      }
    }

    if (req.query.selectedLifeStage) {
      const ageTypes = await AgeType.findAll();
      const ageTypeNames = ageTypes.map((ageType) => ageType.type);
      if (!ageTypeNames.includes(req.query.selectedLifeStage)) {
        error.push({
          field: "ageType",
          message: "Please select a valid age type",
        });
      }
    }

    if (req.query.selectedGender) {
      if (
        !req.query.selectedGender === "Male" ||
        !req.query.selectedGender === "Female"
      ) {
        error.push({
          field: "gender",
          message: "Gender must be either Male or Female",
        });
      }
    }
  }

  return error.length > 0 ? res.status(400).json({ error }) : null;
};

const catsFilterValidator = async (catsFilter, res) => {
  if (catsFilter.length === 0) {
    return res
      .status(404)
      .json({ error: [{ field: "cats", message: "No Result Found" }] });
  }
};

const catValidator = async (req, res) => {
  const error = [];

  if (!req.body.name || validator.isEmpty(validator.trim(req.body.name))) {
    error.push({ field: "name", message: "Name is required" });
  } else if (!validator.isAlpha(req.body.name.replace(/\s/g, ""))) {
    error.push({
      field: "name",
      message: "Name can only contain letters and spaces",
    });
  } else if (!validator.isLength(req.body.name, { max: 50 })) {
    error.push({
      field: "name",
      message: "Name must be at most 50 characters long",
    });
  }

  if (!req.body.uris || !Array.isArray(req.body.uris)) {
    error.push({
      field: "uris",
      message: "You must upload at least one image",
    });
  } else if (req.body.uris) {
    if (req.body.uris.length === 0) {
      error.push({
        field: "uris",
        message: "You must upload at least one image",
      });
    }

    for (const uri of req.body.uris) {
      if (validator.isEmpty(uri)) {
        error.push({ field: "uris", message: "Image is required" });
      } else {
        const image = await Image.findOne({ where: { uri } });
        if (!image) {
          error.push({
            field: "uris",
            message: "Please select a valid image",
          });
        }
      }
    }
  }

  if (!req.body.breed || validator.isEmpty(req.body.breed)) {
    error.push({ field: "breed", message: "Breed is required" });
  } else if (req.body.breed) {
    const breeds = await Breed.findAll();
    const breedNames = breeds.map((breed) => breed.name);
    if (!breedNames.includes(req.body.breed)) {
      error.push({ field: "breed", message: "Please select a valid breed" });
    }
  }

  if (!req.body.color || validator.isEmpty(validator.trim(req.body.color))) {
    error.push({ field: "color", message: "Color is required" });
  }

  if (!req.body.gender || validator.isEmpty(req.body.gender)) {
    error.push({ field: "gender", message: "Gender is required" });
  } else if (req.body.gender && !["Male", "Female"].includes(req.body.gender)) {
    error.push({
      field: "gender",
      error: "Gender must be either Male or Female",
    });
  }

  if (!req.body.age || validator.isEmpty(req.body.age)) {
    error.push({ field: "age", message: "Age is required" });
  } else if (req.body.age && !validator.isInt(req.body.age)) {
    error.push({ field: "age", message: "Age must be an integer" });
  } else if (req.body.age && !validator.isInt(req.body.age, { min: 0 })) {
    error.push({ field: "age", message: "Age must be a positive integer" });
  } else if (req.body.age && !validator.isInt(req.body.age, { max: 40 })) {
    error.push({ field: "age", message: "A cat lives up to 40 years" });
  }

  if (
    !req.body.description ||
    validator.isEmpty(validator.trim(req.body.description))
  ) {
    error.push({ field: "description", message: "Description is required" });
  } else if (
    req.body.description &&
    !validator.isLength(req.body.description, { min: 5, max: 1000 })
  ) {
    error.push({
      field: "description",
      message: "Description must be between 5 and 1000 characters long",
    });
  }

  return error.length > 0 ? res.status(400).json({ error }) : null;
};

module.exports = {
  catExistValidator,
  catsFilterValidator,
  catValidator,
};
