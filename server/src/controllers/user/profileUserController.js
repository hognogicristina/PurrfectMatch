const userValidator = require("../../validators/userValidator");
const { User } = require("../../../models");
const userDTO = require("../../dto/userDTO");
const logger = require("../../../logger/logger");
const catUserValidator = require("../../validators/catUserValidator");
const catUserHelper = require("../../helpers/catUserHelper");
const catUserDTO = require("../../dto/catUserDTO");

const getOneUser = async (req, res) => {
  try {
    if (await userValidator.userExistValidator(req, res)) return;
    const user = await User.findOne({
      where: { username: req.params.username },
    });
    const userDetails = await userDTO.userToDTO(user);
    return res.json({ data: userDetails });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const getUserOwnedCats = async (req, res) => {
  try {
    if (await catUserValidator.getCatsValidator(req, res, "owned")) return;
    const user = await User.findOne({
      where: { username: req.params.username },
    });
    const cats = await catUserHelper.getCatsLimit(user, "owned");
    const totalItems = cats.length;

    const catsDetails = [];
    for (let cat of cats) {
      const catsDetail = await catUserDTO.catUserToDTO(cat);
      catsDetails.push(catsDetail);
    }

    return res.status(200).json({
      totalItems: totalItems,
      data: catsDetails,
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const getUserSentToAdoptionCats = async (req, res) => {
  try {
    if (await catUserValidator.getCatsValidator(req, res, "sentToAdoption"))
      return;
    const user = await User.findOne({
      where: { username: req.params.username },
    });
    const cats = await catUserHelper.getCatsLimit(user, "sentToAdoption");
    const totalItems = cats.length;

    const catsDetails = [];
    for (let cat of cats) {
      const catsDetail = await catUserDTO.catUserToDTO(cat);
      catsDetails.push(catsDetail);
    }

    return res.status(200).json({
      totalItems: totalItems,
      data: catsDetails,
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

module.exports = {
  getOneUser,
  getUserOwnedCats,
  getUserSentToAdoptionCats,
};
