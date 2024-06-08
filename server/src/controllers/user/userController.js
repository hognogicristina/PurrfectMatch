const bcrypt = require("bcrypt");
const {
  Address,
  User,
  PasswordHistory,
  RefreshToken,
  Country,
} = require("../../../models");
const userValidator = require("../../validators/userValidator");
const passwordValidator = require("../../validators/passwordValidator");
const catUserValidator = require("../../validators/catUserValidator");
const fileHelper = require("../../helpers/fileHelper");
const catUserHelper = require("../../helpers/catUserHelper");
const userHelper = require("../../helpers/userHelper");
const userDTO = require("../../dto/userDTO");
const catUserDTO = require("../../dto/catUserDTO");
const logger = require("../../../logger/logger");
const jwt = require("jsonwebtoken");

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
    const page = req.query.page || 1;
    const pageSize = 12;
    if (await catUserValidator.getCatsValidator(req, res, "owned")) return;
    const user = await User.findByPk(req.user.id);
    const cats = await catUserHelper.getCats(user, "owned");

    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    const totalItems = cats.length;

    const catsForPage = cats.slice(startIndex, endIndex);

    const catsDetails = [];
    for (let cat of catsForPage) {
      const catsDetail = await catUserDTO.catUserToDTO(cat);
      catsDetails.push(catsDetail);
    }
    return res.status(200).json({
      page: page,
      pageSize: pageSize,
      totalPages: Math.ceil(totalItems / pageSize),
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
    const page = req.query.page || 1;
    const pageSize = 12;
    if (await catUserValidator.getCatsValidator(req, res, "sentToAdoption"))
      return;
    const user = await User.findByPk(req.user.id);
    const cats = await catUserHelper.getCats(user, "sentToAdoption");

    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    const totalItems = cats.length;

    const catsForPage = cats.slice(startIndex, endIndex);

    const catsDetails = [];
    for (let cat of catsForPage) {
      const catsDetail = await catUserDTO.catUserToDTO(cat);
      catsDetails.push(catsDetail);
    }

    return res.status(200).json({
      page: page,
      pageSize: pageSize,
      totalPages: Math.ceil(totalItems / pageSize),
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
        await fileHelper.eliminateImageUser(user, uri);
        const newImage = await fileHelper.moveImage(uri);
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
    let address = await Address.findOne({ where: { userId: user.id } });

    if (!address) {
      address = new Address({ userId: user.id });
    }

    addressFields.forEach((field) => {
      address[field] =
        req.body[field] === "" || req.body[field] === undefined
          ? null
          : req.body[field];
    });

    if (req.body.country) {
      const country = await Country.findOne({
        where: { name: req.body.country },
      });
      if (country) {
        address.lat = country.lat;
        address.long = country.long;
      } else {
        address.lat = null;
        address.long = null;
      }
    }

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
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const transaction = await User.sequelize.transaction();
  try {
    if (await userValidator.validateActiveAccount(req, res)) return;
    if (await userValidator.deleteUserValidation(req, res)) {
      await transaction.rollback();
      return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    const refreshToken = await RefreshToken.findAll({
      where: { userId: user.id },
      transaction,
    });
    for (const token1 of refreshToken) {
      await token1.destroy({ transaction });
    }
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });
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
      logger.error(error);
    }
  }
};

module.exports = {
  getUser,
  getOwnedCats,
  getSentToAdoptionCats,
  editUser,
  editUsername,
  editAddressUser,
  editPassword,
  deleteUser,
};
