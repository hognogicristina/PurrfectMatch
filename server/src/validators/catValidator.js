const validator = require("validator");
const { Op } = require("sequelize");
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
      return res
        .status(404)
        .json({ error: [{ field: "cats", message: "No Cats Available" }] });
    }

    if (req.query.search) {
      const searchResults = await Cat.findAll({
        where: {
          [Op.or]: [
            { breed: { [Op.like]: `%${req.query.search}%` } },
            { healthProblem: { [Op.like]: `%${req.query.search}%` } },
          ],
        },
      });
      if (searchResults.length === 0) {
        return res
          .status(404)
          .json({ error: [{ field: "search", message: "No Result Found" }] });
      }
    }

    if (req.query.sortBy) {
      const sortBy = ["breed", "age"];
      if (!sortBy.includes(req.query.sortBy)) {
        error.push({ field: "sortBy", error: "Invalid Sort By" });
      }
    }

    if (req.query.selectedBreed) {
      const breeds = await Breed.findAll();
      const breedNames = breeds.map((breed) => breed.name);
      if (breedNames.includes(req.query.selectedBreed)) {
        const breedExists = cats.some(
          (cat) => cat.breed === req.query.selectedBreed,
        );
        if (!breedExists) {
          return res
            .status(404)
            .json({ error: [{ field: "breed", message: "No Result Found" }] });
        }
      } else {
        error.push({ field: "breed", error: "Please select a valid breed" });
      }
    }

    if (req.query.selectedAgeType) {
      const ageTypes = await AgeType.findAll();
      const ageTypeNames = ageTypes.map((ageType) => ageType.type);
      if (ageTypeNames.includes(req.query.selectedAgeType)) {
        const ageTypeExists = cats.some(
          (cat) => cat.ageType === req.query.selectedAgeType,
        );
        if (!ageTypeExists) {
          return res.status(404).json({
            error: [{ field: "ageType", message: "No Result Found" }],
          });
        }
      } else {
        error.push({
          field: "ageType",
          error: "Please select a valid age type",
        });
      }

      if (req.query.selectedGender) {
        if (
          req.query.selectedGender === "Male" ||
          req.query.selectedGender === "Female"
        ) {
          const genderExists = cats.some(
            (cat) => cat.gender === req.query.selectedGender,
          );
          if (!genderExists) {
            return res.status(404).json({
              error: [{ field: "gender", message: "No Result Found" }],
            });
          }
        } else {
          error.push({
            field: "gender",
            error: "Gender must be either Male or Female",
          });
        }
      }

      if (req.query.selectedNoHealthProblem !== undefined) {
        const noHealthProblemExists = cats.some(
          (cat) => cat.healthProblem === null,
        );
        if (!noHealthProblemExists) {
          return res.status(404).json({
            error: [{ field: "healthProblem", message: "No Result Found" }],
          });
        }
      }
    }
  }

  return error.length > 0 ? res.status(400).json({ error }) : null;
};

const catsFilterValidator = async (catsFilter, res) => {
  if (catsFilter.length === 0) {
    return res
      .status(404)
      .json({ error: [{ field: "cats", message: "No Cats Available" }] });
  }
};

const catValidator = async (req, res) => {
  const errors = [];

  if (!req.body.name || (req.body.name && validator.isEmpty(req.body.name))) {
    errors.push({ field: "name", error: "Name is required" });
  }

  if (req.method === "PATCH") {
    if ((req.body.uri && validator.isEmpty(req.body.uri)) || !req.body.uri) {
      errors.push({ field: "uri", error: "Image is required" });
    } else if (req.body.uri) {
      const image = await Image.findOne({ where: { uri: req.body.uri } });
      if (!image) {
        errors.push({ field: "uri", error: "Please select a valid image" });
      }
    }
  } else if (req.method === "POST") {
    if (!req.body.uris || !Array.isArray(req.body.uris)) {
      errors.push({
        field: "uris",
        error: "URIs must be provided as an array.",
      });
    } else if (req.body.uris) {
      if (req.body.uris.length === 0) {
        errors.push({
          field: "uris",
          error: "At least one image is required.",
        });
      }

      for (const uri of req.body.uris) {
        if (validator.isEmpty(uri)) {
          errors.push({ field: "uris", error: "Image is required" });
        } else {
          const image = await Image.findOne({ where: { uri } });
          if (!image) {
            errors.push({
              field: "uris",
              error: "Please select a valid image",
            });
          }
        }
      }
    }
  }

  if (
    !req.body.breed ||
    (req.body.breed && validator.isEmpty(req.body.breed))
  ) {
    errors.push({ field: "breed", error: "Breed is required" });
  } else if (req.body.breed) {
    const breeds = await Breed.findAll();
    const breedNames = breeds.map((breed) => breed.name);
    if (!breedNames.includes(req.body.breed)) {
      errors.push({ field: "breed", error: "Please select a valid breed" });
    }
  }

  if (
    !req.body.gender ||
    (req.body.gender && validator.isEmpty(req.body.gender))
  ) {
    errors.push({ field: "gender", error: "Gender is required" });
  } else if (req.body.gender && !["Male", "Female"].includes(req.body.gender)) {
    errors.push({
      field: "gender",
      error: "Gender must be either Male or Female",
    });
  }

  if (!req.body.age || (req.body.age && validator.isEmpty(req.body.age))) {
    errors.push({ field: "age", error: "Age is required" });
  } else if (req.body.age && !validator.isInt(req.body.age)) {
    errors.push({ field: "age", error: "Age must be an integer" });
  }

  if (
    !req.body.description ||
    (req.body.description && validator.isEmpty(req.body.description))
  ) {
    errors.push({ field: "description", error: "Description is required" });
  } else if (
    req.body.description &&
    !validator.isLength(req.body.description, { min: 5 })
  ) {
    errors.push({
      field: "description",
      error: "Description must be at least 5 characters long",
    });
  }

  return errors.length > 0 ? res.status(400).json({ errors }) : null;
};

module.exports = {
  catExistValidator,
  catsFilterValidator,
  catValidator,
};
