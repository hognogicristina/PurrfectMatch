const validator = require("validator");
const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");
const { Cat, Breed, Image } = require("../../models");

const catExistValidator = async (req, res) => {
  const cats = await Cat.findAll();
  const errors = [];

  if (req.params.id) {
    const cat = await Cat.findByPk(req.params.id);
    if (!cat) {
      return res.status(404).json({ error: "Cat not found" });
    }
  } else {
    if (cats.length === 0) {
      return res.status(404).json({ error: "No Cats Available" });
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
        return res.status(404).json({ error: "No Result Found" });
      }
    }

    if (req.query.selectedBreed) {
      const breeds = JSON.parse(
        fs.readFileSync(path.join("./data", "breeds.json"), "utf-8"),
      );
      if (breeds.includes(req.query.selectedBreed)) {
        const breedExists = cats.some(
          (cat) => cat.breed === req.query.selectedBreed,
        );
        if (!breedExists) {
          return res.status(404).json({ error: "No Result Found" });
        }
      } else {
        errors.push({ field: "breed", error: "Please select a valid breed" });
      }
    }

    if (req.query.selectedAgeType) {
      const ageRanges = JSON.parse(
        fs.readFileSync(path.join("./data", "ageRanges.json"), "utf-8"),
      );
      if (Object.keys(ageRanges).includes(req.query.selectedAgeType)) {
        const ageExists = cats.some((cat) => {
          const catAge = cat.age.split(" ")[0];
          return catAge === req.query.selectedAgeType;
        });
        if (!ageExists) {
          return res.status(404).json({ error: "No Result Found" });
        }
      } else {
        errors.push({
          field: "age",
          error: "Please select a valid life stage",
        });
      }
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
          return res.status(404).json({ error: "No Result Found" });
        }
      } else {
        errors.push({
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
        return res.status(404).json({ error: "No Result Found" });
      }
    }
  }

  return errors.length > 0 ? res.status(400).json({ errors }) : null;
};

const catsFilterValidator = async (catsFilter, res) => {
  if (catsFilter.length === 0) {
    return res.status(404).json({ error: "No Result Found" });
  }
};

const catValidator = async (req, res) => {
  const errors = [];

  if (validator.isEmpty(req.body.name || "")) {
    errors.push({ field: "name", error: "Name is required" });
  }

  if (validator.isEmpty(req.body.uri || "")) {
    errors.push({ field: "uri", error: "Image is required" });
  } else {
    const image = await Image.findOne({ where: { uri: req.body.uri } });
    if (!image) {
      errors.push({ field: "uri", error: "Please select a valid image" });
    }
  }

  if (validator.isEmpty(req.body.breed || "")) {
    errors.push({ field: "breed", error: "Breed is required" });
  } else {
    const breeds = await Breed.findAll();
    const breedNames = breeds.map((breed) => breed.name);
    if (!breedNames.includes(req.body.breed)) {
      errors.push({ field: "breed", error: "Please select a valid breed" });
    }
  }

  if (validator.isEmpty(req.body.gender || "")) {
    errors.push({ field: "gender", error: "Gender is required" });
  } else if (!["Male", "Female"].includes(req.body.gender)) {
    errors.push({
      field: "gender",
      error: "Gender must be either Male or Female",
    });
  }

  if (validator.isEmpty(req.body.age || "")) {
    errors.push({ field: "age", error: "Age is required" });
  } else if (!validator.isInt(req.body.age)) {
    errors.push({ field: "age", error: "Age must be an integer" });
  }

  if (validator.isEmpty(req.body.description || "")) {
    errors.push({ field: "description", error: "Description is required" });
  } else if (!validator.isLength(req.body.description, { min: 5 })) {
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
