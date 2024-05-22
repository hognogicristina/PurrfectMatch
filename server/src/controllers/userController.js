const bcrypt = require("bcrypt");
const { Address, User, PasswordHistory } = require("../../models");
const userValidator = require("../validators/userValidator");
const passwordValidator = require("../validators/passwordValidator");
const catUserValidator = require("../validators/catUserValidator");
const fileHelper = require("../helpers/fileHelper");
const catUserHelper = require("../helpers/catUserHelper");
const userHelper = require("../helpers/userHelper");
const userDTO = require("../dto/userDTO");
const catUserDTO = require("../dto/catUserDTO");
const logger = require("../../logger/logger");

const getOneUser = async (req, res) => {
  try {
    if (await userValidator.userExistValidator(req, res)) return;
    const user = await User.findByPk(req.params.id);
    const userDetails = await userDTO.userToDTO(user);
    return res.json({ data: userDetails });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const getUser = async (req, res) => {
  try {
    if (await userValidator.userExistValidator(req, res)) return;
    const userDetails = await userDTO.userToDTO(req.user);
    return res.json({ data: userDetails });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const getOwnedCats = async (req, res) => {
  try {
    if (await catUserValidator.getCatsValidator(req, res, "owned")) return;
    const cats = await catUserHelper.getCats(req, "owned");
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

const getSentToAdoptionCats = async (req, res) => {
  try {
    if (await catUserValidator.getCatsValidator(req, res, "sentToAdoption"))
      return;
    const cats = await catUserHelper.getCats(req, "sentToAdoption");
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

const editUser = async (req, res) => {
  try {
    if (await userValidator.validateActiveAccount(req, res)) return;
    if (await userValidator.editUserValidation(req, res)) return;
    const fieldsToUpdate = [
      "firstName",
      "lastName",
      "email",
      "birthday",
      "description",
      "hobbies",
      "experienceLevel",
    ];
    const user = await User.findByPk(req.user.id);
    await userHelper.updateEmail(user, fieldsToUpdate, req.body);
    await user.save();
    if (req.body.uri && req.body.uri.length > 0) {
      for (let uri of req.body.uri) {
        const newImage = await fileHelper.moveImage(user, uri);
        if (newImage) {
          newImage.userId = user.id;
          await newImage.save();
        }
      }
    }
    return res.json({ status: "Your changes has been saved" });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const editUsername = async (req, res) => {
  try {
    if (await userValidator.validateActiveAccount(req, res)) return;
    if (await userValidator.editUsernameValidation(req, res)) return;
    req.user.username = req.body.username;
    await req.user.save();
    return res.json({ status: "Your username has been changed" });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const editAddressUser = async (req, res) => {
  try {
    if (await userValidator.validateActiveAccount(req, res)) return;
    if (await userValidator.editAddressValidation(req, res)) return;
    const addressFields = [
      "country",
      "county",
      "city",
      "street",
      "number",
      "floor",
      "apartment",
      "postalCode",
    ];
    const user = await User.findByPk(req.user.id);
    const address =
      (await Address.findOne({ where: { userId: user.id } })) || new Address();

    addressFields.forEach((field) => {
      address[field] =
        req.body[field] === "" || req.body[field] === undefined
          ? null
          : req.body[field];
    });

    address.userId = user.id;
    await address.save();
    return res.json({ status: "Your address has been modified" });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const editPassword = async (req, res) => {
  try {
    if (await userValidator.validateActiveAccount(req, res)) return;
    if (await passwordValidator.editPasswordValidation(req, res)) return;
    req.user.password = await bcrypt.hash(req.body.newPassword, 10);
    await req.user.save();
    await PasswordHistory.create({
      userId: req.user.id,
      password: req.user.password,
    });
    return res.json({ status: "Your password has been changed" });
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
    if (await userValidator.validateActiveAccount(req, res)) return;
    if (await userValidator.deleteUserValidation(req, res)) {
      await transaction.rollback();
      return;
    }
    await userHelper.deleteUser(req.user, transaction);
    await transaction.commit();
    return res.status(200).json({ status: "We are sorry to see you go" });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    if (!res.headersSent) {
      logger.error(error);
      return res.status(500).json({
        error: [{ field: "server", message: "Internal server error" }],
      });
    } else {
      logger.error("Response already sent:", error);
    }
  }
};

module.exports = {
  getOneUser,
  getUser,
  getOwnedCats,
  getSentToAdoptionCats,
  editUser,
  editUsername,
  editAddressUser,
  editPassword,
  deleteUser,
};
