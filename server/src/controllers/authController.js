const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  User,
  RefreshToken,
  PasswordHistory,
  UserInfo,
  Token,
} = require("../../models");
const emailServ = require("../services/emailService");
const authValidator = require("../validators/authValidator");
const passwordValidator = require("../validators/passwordValidator");
const authHelper = require("../helpers/authHelper");
const logger = require("../../logger/logger");

const register = async (req, res) => {
  try {
    if (await authValidator.registerValidation(req, res)) return;
    const { firstName, lastName, username, email, password, birthday } =
      req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      status: "active_pending",
    });
    await UserInfo.create({ userId: user.id, birthday });
    await PasswordHistory.create({ userId: user.id, password: hashedPassword });
    await emailServ.sendActivationEmail(user);
    res.status(201).json({ status: "Your account has been created" });
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const activate = async (req, res) => {
  try {
    if (await authValidator.validateUser(req, res, "active")) return;
    const user = await User.findByPk(req.params.id);
    const tokenUser = await Token.findOne({ where: { userId: user.id } });
    user.update({ status: "active" });
    tokenUser.destroy();
    await emailServ.sendConfirmationEmail(user);
    await user.save();
    await tokenUser.save();
    res.status(201).json({ status: "Your account has been activated" });
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const reactivate = async (req, res) => {
  try {
    if (await authValidator.resetValidationEmail(req, res, "active")) return;
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    await Token.destroy({
      where: { userId: user.id, type: "activation" },
    });
    await emailServ.sendActivationEmail(user);
    res
      .status(200)
      .json({ status: "If the email exists, a reset link will be sent" });
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const login = async (req, res) => {
  try {
    if (await authValidator.loginValidation(req, res)) return;
    const expiresIn = process.env.JWT_TTL;

    const token = jwt.sign(
      {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: expiresIn + "s",
      },
    );

    const refreshToken = authHelper.generateRefreshToken();
    await RefreshToken.create({ userId: req.user.id, token: refreshToken });

    res.cookie("refreshToken", refreshToken, {
      maxAge: expiresIn * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    res.status(200).json({ token, refreshToken });
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const resetPasswordRequest = async (req, res) => {
  try {
    if (await authValidator.resetValidationEmail(req, res, "pass")) return;
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    await emailServ.sendResetPassword(user);
    res.status(200).json({
      status: "If the email exists, a reset link will be sent to you",
    });
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const resetPassword = async (req, res) => {
  try {
    if (await authValidator.validateUser(req, res, "pass")) return;
    if (await passwordValidator.resetValidationPassword(req, res)) return;
    const user = await User.findByPk(req.params.id);
    const tokenUser = await Token.findOne({ where: { userId: user.id } });
    user.password = await bcrypt.hash(req.body.password, 10);
    await user.save();
    tokenUser.destroy();
    await tokenUser.save();
    await PasswordHistory.create({ userId: user.id, password: user.password });
    res.status(200).json({ status: "Your password has been reset" });
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const logout = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    const refreshToken = await RefreshToken.findAll({
      where: { userId: user.id },
    });
    for (const token1 of refreshToken) {
      await token1.destroy();
    }
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });
    res.status(200).json({ status: "Logged out" });
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const refresh = async (req, res) => {
  try {
    const newToken = jwt.sign(
      { id: req.user.id, username: req.user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_TTL,
      },
    );
    res.status(200).json({ newToken });
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

module.exports = {
  register,
  activate,
  reactivate,
  login,
  resetPasswordRequest,
  resetPassword,
  logout,
  refresh,
};
