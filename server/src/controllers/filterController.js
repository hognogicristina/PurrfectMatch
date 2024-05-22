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
    if (cats.length > 0) {
      for (let cat of cats) {
        if (cat.healthProblem === null) {
          healthProblemsList.push("Healthy");
        } else {
          healthProblemsList.push(cat.healthProblem);
        }
      }
    } else {
      return res.status(404).json({
        error: [{ field: "healthProblem", message: "No Results Found" }],
      });
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

const getRecentCats = async (req, res) => {
  try {
    const cats = await Cat.findAll({
      where: {
        status: "adopted",
      },
      limit: 4,
      order: [["createdAt", "DESC"]],
    });
    const catsDetails = [];
    if (cats.length > 0) {
      for (let cat of cats) {
        const catsDetail = await catDTO.catsRecentListToDTO(cat);
        catsDetails.push(catsDetail);
      }
    } else {
      return res.status(404).json({
        error: [{ field: "recent", message: "No Results Found" }],
      });
    }
    return res.status(200).json({ data: catsDetails });
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
    const cats = await Cat.findAll({
      where: { breed: breed, status: "active" },
    });

    const catsDetails = [];
    if (cats.length > 0) {
      for (let cat of cats) {
        const catsDetail = await catDTO.catsListToDTO(cat);
        catsDetails.push(catsDetail);
      }
    } else {
      return res.status(404).json({
        error: [{ field: "breed", message: "No Results Found" }],
      });
    }

    return res.status(200).json({ data: catsDetails });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const getCatsOfUser = async (req, res) => {
  try {
    const catUser = await CatUser.findOne({
      where: { catId: req.params.catId },
    });
    const catUsers = await CatUser.findAll({
      where: { userId: catUser.userId },
    });
    const catOwners = await CatUser.findAll({
      where: { userId: catUser.ownerId },
    });

    const catsUser = [];
    if (catUsers.length > 0) {
      for (let catUser of catUsers) {
        const cat = await Cat.findByPk(catUser.catId);
        catsUser.push(cat);
      }
    }

    const catsOwner = [];
    if (catOwners.length > 0) {
      for (let catOwner of catOwners) {
        const cat = await Cat.findByPk(catOwner.catId);
        catsOwner.push(cat);
      }
    }

    const catsUserList = [];
    for (let cat of catsUser) {
      const catsDetail = await catDTO.catsListToDTO(cat);
      catsUserList.push(catsDetail);
    }

    const catsOwnerList = [];
    for (let cat of catsOwner) {
      const catsDetail = await catDTO.catsListToDTO(cat);
      catsOwnerList.push(catsDetail);
    }

    return res.status(200).json({ data: { catsUserList, catsOwnerList } });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

module.exports = {
  getAllBreeds,
  getAgeType,
  getHealthProblems,
  getColors,
  getRecentCats,
  getCatsByBreed,
  getCatsOfUser,
};
