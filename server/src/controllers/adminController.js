const { Op } = require("sequelize");
const { User, Cat } = require("../../models");
const adminValidator = require("../validators/adminValidator");
const adminHelper = require("../helpers/adminHelper");
const catValidator = require("../validators/catValidator");
const userDTO = require("../dto/userDTO");
const logger = require("../../logger/logger");

const getAllUsers = async (req, res) => {
  try {
    if (await adminValidator.userExistValidator(req, res)) return;
    const users = await User.findAll({ where: { role: { [Op.ne]: "admin" } } });
    const usersDetails = [];
    for (let user of users) {
      const userDetails = await userDTO.transformUserFromListToDTO(user);
      usersDetails.push(userDetails);
    }
    return res.status(200).json({ data: usersDetails });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (await adminValidator.userExistValidator(req, res)) return;
    const user = await User.findByPk(req.params.id);
    await adminHelper.deleteUser(user);
    return res.status(200).json({ status: "User deleted successfully" });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteCat = async (req, res) => {
  try {
    if (await catValidator.catExistValidator(req, res)) return;
    const cat = await Cat.findByPk(req.params.id);
    await adminHelper.deleteCat(cat);
    return res.status(200).json({ status: "Cat deleted successfully" });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getAllUsers, deleteUser, deleteCat };
