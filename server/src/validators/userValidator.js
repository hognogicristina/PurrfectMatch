const validator = require("validator");
const { User, Image } = require("../../models");
const bcrypt = require("bcrypt");

const userExistValidator = async (req, res) => {
  if (req.params.id) {
    const userParam = await User.findByPk(req.params.id);
    if (!userParam) {
      return res
        .status(404)
        .json({ error: [{ field: "id", message: "User not found" }] });
    }
  } else {
    if (req.user.id) {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res
          .status(404)
          .json({ error: [{ field: "id", message: "User not found" }] });
      }
    }
  }

  return null;
};

const editUserValidation = async (req, res) => {
  const error = [];

  if (req.body.firstName && validator.isEmpty(req.body.firstName || "")) {
    error.push({ field: "firstName", message: "First name is required" });
  } else if (
    req.body.firstName &&
    !validator.isLength(req.body.firstName, { min: 3 })
  ) {
    error.push({
      field: "firstName",
      message: "First name must be at least 3 characters long",
    });
  }

  if (req.body.lastName && validator.isEmpty(req.body.lastName || "")) {
    error.push({ field: "lastName", message: "Last name is required" });
  } else if (
    req.body.lastName &&
    !validator.isLength(req.body.lastName, { min: 3 })
  ) {
    error.push({
      field: "lastName",
      message: "Last name must be at least 3 characters long",
    });
  }

  if (req.body.uri && validator.isEmpty(req.body.uri || "")) {
    error.push({ field: "uri", message: "Image is required" });
  } else if (req.body.uri) {
    const image = await Image.findOne({ where: { uri: req.body.uri } });
    if (!image) {
      error.push({ field: "uri", message: "Please select a valid image" });
    }
  }

  if (req.body.email && validator.isEmpty(req.body.email || "")) {
    error.push({ field: "email", message: "Email is required" });
  } else if (req.body.email && !validator.isEmail(req.body.email)) {
    error.push({
      field: "email",
      message: User.rawAttributes.email.validate.isEmail.msg,
    });
  } else if (req.body.email) {
    const domain = req.body.email.split("@")[1];
    if (domain.includes("meow") && req.user.role !== "admin") {
      error.push({
        field: "email",
        error: "Only admins can use emails from @meow domain",
      });
    } else if (req.body.email) {
      const user = await User.findOne({ where: { email: req.body.email } });
      if (user && user.id !== req.user.id) {
        error.push({ field: "email", message: "Email is already in use" });
      }
    }
  }

  if (req.body.birthday && validator.isEmpty(req.body.birthday || "")) {
    error.push({ field: "birthday", message: "Birthday is required" });
  } else if (req.body.birthday && !validator.isDate(req.body.birthday)) {
    error.push({
      field: "birthday",
      message: "Invalid date format! Please use YYYY-MM-DD",
    });
  }

  return error.length > 0 ? res.status(400).json({ error }) : null;
};

const editUsernameValidation = async (req, res) => {
  const error = [];

  if (validator.isEmpty(req.body.username || "")) {
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
      error.push({ field: "username", message: "Username is already in use" });
    }
  }

  if (req.body.password && validator.isEmpty(req.body.password || "")) {
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

  if (req.body.country && validator.isEmpty(req.body.country || "")) {
    error.push({ field: "country", message: "Country is required" });
  }

  if (req.body.city && validator.isEmpty(req.body.city || "")) {
    error.push({ field: "city", message: "City is required" });
  }

  if (req.body.street && validator.isEmpty(req.body.street || "")) {
    error.push({ field: "street", message: "Street is required" });
  }

  if (req.body.number && validator.isEmpty(req.body.number || "")) {
    error.push({ field: "number", message: "Number is required" });
  }

  if (req.body.postalCode && validator.isEmpty(req.body.postalCode || "")) {
    error.push({ field: "postalCode", message: "Postal code is required" });
  } else if (
    req.body.postalCode &&
    !validator.isPostalCode(req.body.postalCode, "any")
  ) {
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
      .json({ error: [{ field: "id", message: "User not found" }] });
  }

  if (validator.isEmpty(req.body.password || "")) {
    error.push({ field: "password", message: "Password is required" });
  } else {
    const user = await User.findByPk(req.user.id);
    if (!(await bcrypt.compare(req.body.password, user.password))) {
      error.push({ field: "password", message: "Invalid password" });
    }
  }

  return error.length > 0 ? res.status(400).json({ error }) : null;
};

module.exports = {
  userExistValidator,
  editUserValidation,
  editAddressValidation,
  editUsernameValidation,
  deleteUserValidation,
};
