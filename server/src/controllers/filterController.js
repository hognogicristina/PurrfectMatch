const { Breed, Cat, AgeType, CatUser } = require("../../models");
const logger = require("../../logger/logger");
const filterValidator = require("../validators/filterValidator");
const catDTO = require("../dto/catDTO");
const fs = require("fs");
const path = require("path");

const getAllBreeds = async (req, res) => {
  try {
    if (await filterValidator.breedsExistValidator(req, res)) return;
    const breeds = await Breed.findAll();
    const totalItems = breeds.length;

    return res.status(200).json({ data: breeds, totalItems: totalItems });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const getRecentCats = async (req, res) => {
  try {
    const cats = await Cat.findAll({
      limit: 4,
      order: [["createdAt", "DESC"]],
    });
    const catsDetails = [];
    for (let cat of cats) {
      const catsDetail = await catDTO.catsRecentListToDTO(cat);
      catsDetails.push(catsDetail);
    }
    return res.status(200).json({ data: catsDetails });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const getAgeType = async (req, res) => {
  try {
    if (await filterValidator.ageTypesExistValidator(req, res)) return;
    const ageTypes = await AgeType.findAll();
    const totalItems = ageTypes.length;

    return res.status(200).json({ data: ageTypes, totalItems: totalItems });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const getHealthProblems = async (req, res) => {
  try {
    let cats = await Cat.findAll();

    const healthProblemsList = [];
    for (let cat of cats) {
      if (cat.healthProblem === null) {
        healthProblemsList.push("Healthy");
      } else {
        healthProblemsList.push(cat.healthProblem);
      }
    }

    const healthProblemsSet = new Set(healthProblemsList);
    const uniqueHealthProblems = [...healthProblemsSet];
    return res.status(200).json({ data: uniqueHealthProblems });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const getCatsByBreed = async (req, res) => {
  try {
    if (await filterValidator.breedsExistValidator(req, res)) return;
    const { catId } = req.params;
    const cat = await Cat.findByPk(catId);
    const breed = cat.breed;
    const cats = await Cat.findAll({ where: { breed: breed } });

    const catsDetails = [];
    for (let cat of cats) {
      const catsDetail = await catDTO.catsListToDTO(cat);
      catsDetails.push(catsDetail);
    }

    return res.status(200).json({ data: catsDetails });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const getCatsOfGuardian = async (req, res) => {
  try {
    const { catId } = req.params;
    const cat = await Cat.findByPk(catId);
    const catUser = await CatUser.findByPk(cat.id);
    const userId = catUser.userId;
    const cats = await Cat.findAll({ where: { userId: userId } });

    const catsDetails = [];
    for (let cat of cats) {
      const catsDetail = await catDTO.catsListToDTO(cat);
      catsDetails.push(catsDetail);
    }

    return res.status(200).json({ data: catsDetails });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const getColors = async (req, res) => {
  try {
    const colorData = fs.readFileSync(
      path.join(__dirname, "../../constants/colors.json"),
      "utf8",
    );
    const colors = JSON.parse(colorData);
    return res.status(200).json({ data: colors });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

module.exports = {
  getAllBreeds,
  getRecentCats,
  getAgeType,
  getHealthProblems,
  getCatsByBreed,
  getCatsOfGuardian,
  getColors,
};
