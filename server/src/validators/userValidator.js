const validator = require("validator");
const { User, Image } = require("../../models");
const bcrypt = require("bcrypt");

const userExistValidator = async (req, res) => {
  if (req.params.id) {
    const userParam = await User.findByPk(req.params.id);
    if (!userParam) {
      return res
        .status(404)
        .json({ error: [{ field: "id", message: "Profile not found" }] });
    }
  } else {
    if (req.user.id) {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res
          .status(404)
          .json({ error: [{ field: "id", message: "Profile not found" }] });
      }
    }
  }

  return null;
};

const editUserValidation = async (req, res) => {
  const error = [];

  if (!req.body.firstName || validator.isEmpty(req.body.firstName)) {
    error.push({ field: "firstName", message: "First name is required" });
  }

  if (!req.body.lastName || validator.isEmpty(req.body.lastName)) {
    error.push({ field: "lastName", message: "Last name is required" });
  }

  if (!req.body.email || validator.isEmpty(req.body.email)) {
    error.push({ field: "email", message: "Email is required" });
  } else if (req.body.email && !validator.isEmail(req.body.email)) {
    error.push({
      field: "email",
      message: "Please use a valid email address",
    });
  } else if (req.body.email) {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (user && user.id !== req.user.id) {
      error.push({ field: "email", message: "This email is already in use" });
    }
  }

  if (!req.body.birthday || validator.isEmpty(req.body.birthday)) {
    error.push({ field: "birthday", message: "Birthday is required" });
  } else if (req.body.birthday && !validator.isDate(req.body.birthday)) {
    error.push({
      field: "birthday",
      message: "Invalid date format! Please use YYYY-MM-DD",
    });
  }

  if (req.body.hobbies) {
    const hobbies = req.body.hobbies.split(",");
    for (let hobby of hobbies) {
      if (!validator.isAlpha(hobby.replace(/\s/g, ""))) {
        error.push({
          field: "hobbies",
          message: "Hobbies must contain only letters and spaces",
        });
        break;
      }
    }
  }

  if (!req.body.uri || req.body.uri.length === 0) {
    return res
      .status(400)
      .json({ error: [{ field: "uri", message: "Image is required" }] });
  } else {
    const uri = req.body.uri[0];
    const image = await Image.findOne({ where: { uri: uri } });
    if (!image) {
      return res.status(400).json({
        error: [{ field: "uri", message: "Please select a valid image" }],
      });
    }
  }

  return error.length > 0 ? res.status(400).json({ error }) : null;
};

const editUsernameValidation = async (req, res) => {
  const error = [];

  if (req.user) {
    const user = await User.findByPk(req.user.id);
    if (req.body.username && user.username === req.body.username) {
      return res.status(400).json({
        error: [{ field: "username", message: "Please enter a new username" }],
      });
    }
  }

  if (!req.body.username || validator.isEmpty(req.body.username)) {
    error.push({ field: "username", message: "Username is required" });
  } else if (!validator.isLength(req.body.username, { min: 3 })) {
    error.push({
      field: "username",
      message: "Username must be at least 3 characters long",
    });
  } else {
    const user = await User.findOne({
      where: { username: req.body.username },
    });
    if (user && user.id !== req.user.id) {
      error.push({
        field: "username",
        message: "This username is already in use",
      });
    }
  }

  if (!req.body.password || validator.isEmpty(req.body.password)) {
    error.push({ field: "password", message: "Password is required" });
  } else {
    const user = await User.findByPk(req.user.id);
    if (!(await bcrypt.compare(req.body.password, user.password))) {
      error.push({ field: "password", message: "Invalid password" });
    }
  }

  return error.length > 0 ? res.status(400).json({ error }) : null;
};

const editAddressValidation = async (req, res) => {
  const error = [];

  if (!req.body.country || validator.isEmpty(req.body.country)) {
    error.push({ field: "country", message: "Country is required" });
  }

  if (!req.body.city || validator.isEmpty(req.body.city)) {
    error.push({ field: "city", message: "City is required" });
  }

  if (!req.body.street || validator.isEmpty(req.body.street)) {
    error.push({ field: "street", message: "Street is required" });
  }

  if (!req.body.number || validator.isEmpty(req.body.number)) {
    error.push({ field: "number", message: "Number is required" });
  }

  if (req.body.floor && !validator.isNumeric(req.body.floor)) {
    error.push({ field: "floor", message: "Floor must be a number" });
  }

  if (!req.body.postalCode || validator.isEmpty(req.body.postalCode)) {
    error.push({ field: "postalCode", message: "Postal code is required" });
  } else if (!validator.isPostalCode(req.body.postalCode, "any")) {
    error.push({ field: "postalCode", message: "Invalid postal code" });
  }

  return error.length > 0 ? res.status(400).json({ error }) : null;
};

const deleteUserValidation = async (req, res) => {
  const error = [];
  const user = await User.findByPk(req.user.id);
  if (!user) {
    return res
      .status(404)
      .json({ error: [{ field: "id", message: "Profile not found" }] });
  }

  if (!req.body.username || validator.isEmpty(req.body.username)) {
    error.push({ field: "username", message: "Please enter your username" });
  } else {
    const user = await User.findByPk(req.user.id);
    if (user.username !== req.body.username) {
      error.push({ field: "invalid", message: "Invalid username! Try again" });
    }
  }

  if (
    !req.body.messageConfirm ||
    validator.isEmpty(req.body.messageConfirm || "")
  ) {
    error.push({
      field: "messageConfirm",
      message: "Please enter delete my account",
    });
  } else if (req.body.messageConfirm !== "delete my account") {
    error.push({
      field: "messageConfirm",
      message: "Invalid message! Try again",
    });
  }

  if (!req.body.password || validator.isEmpty(req.body.password || "")) {
    error.push({ field: "password", message: "Password is required" });
  } else {
    const user = await User.findByPk(req.user.id);
    if (!(await bcrypt.compare(req.body.password, user.password))) {
      error.push({ field: "password", message: "Invalid password" });
    }
  }

  return error.length > 0 ? res.status(400).json({ error }) : null;
};

const validateActiveAccount = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (user.status === "active_pending") {
    return res.status(403).json({
      error: [{ field: "server", message: "Profile not activated" }],
    });
  }
};

module.exports = {
  userExistValidator,
  editUserValidation,
  editAddressValidation,
  editUsernameValidation,
  deleteUserValidation,
  validateActiveAccount,
};
