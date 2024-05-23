const { Op } = require("sequelize");
const { User, Cat } = require("../../../models");
const adminValidator = require("../../validators/adminValidator");
const adminHelper = require("../../helpers/adminHelper");
const catValidator = require("../../validators/catValidator");
const userDTO = require("../../dto/userDTO");
const logger = require("../../../logger/logger");

const getAllUsers = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const pageSize = 9;
    if (await adminValidator.userExistValidator(req, res)) return;
    const users = await User.findAll({ where: { role: { [Op.ne]: "admin" } } });

    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    const totalItems = users.length;

    const usersForPage = users.slice(startIndex, endIndex);

    const usersDetails = [];
    for (let user of usersForPage) {
      const userDetails = await userDTO.userListToDTO(user);
      usersDetails.push(userDetails);
    }
    return res.status(200).json({
      page: page,
      pageSize: pageSize,
      totalPages: Math.ceil(totalItems / pageSize),
      totalItems: totalItems,
      data: usersDetails,
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const deleteUser = async (req, res) => {
  const transaction = await User.sequelize.transaction();
  try {
    if (await adminValidator.userExistValidator(req, res)) {
      await transaction.rollback();
      return;
    }
    const user = await User.findOne({
      where: { id: req.params.id },
      transaction,
    });
    await adminHelper.deleteUser(user, transaction);
    await transaction.commit();
    return res.status(200).json({ status: "Profile deleted successfully" });
  } catch (error) {
    await transaction.rollback();
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const deleteCat = async (req, res) => {
  const transaction = await Cat.sequelize.transaction();
  try {
    if (await catValidator.catExistValidator(req, res)) {
      await transaction.rollback();
      return;
    }
    const cat = await Cat.findOne({
      where: { id: req.params.id },
      transaction,
    });
    await adminHelper.deleteCat(cat, transaction);
    await transaction.commit();
    return res.status(200).json({ status: "Cat deleted successfully" });
  } catch (error) {
    await transaction.rollback();
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const blockUser = async (req, res) => {
  try {
    if (await adminValidator.userExistValidator(req, res)) return;
    const user = await User.findByPk(req.params.id);
    await adminHelper.blockUser(user);
    return res.status(200).json({ status: "Profile blocked successfully" });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

module.exports = { getAllUsers, deleteUser, deleteCat, blockUser };
