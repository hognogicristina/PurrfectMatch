const validator = require("validator");
const { User, PasswordHistory } = require("../../models");
const bcrypt = require("bcrypt");

const userExistValidator = async (req, res) => {
  const user = await User.findByPk(req.user.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return null;
};

const editUserValidation = async (req, res) => {
  const errors = [];

  if (req.body.firstName && validator.isEmpty(req.body.firstName || "")) {
    errors.push({ field: "firstName", error: "First name is required" });
  } else if (
    req.body.firstName &&
    !validator.isLength(req.body.firstName, { min: 3 })
  ) {
    errors.push({
      field: "firstName",
      error: "First name must be at least 3 characters long",
    });
  }

  if (req.body.lastName && validator.isEmpty(req.body.lastName || "")) {
    errors.push({ field: "lastName", error: "Last name is required" });
  } else if (
    req.body.lastName &&
    !validator.isLength(req.body.lastName, { min: 3 })
  ) {
    errors.push({
      field: "lastName",
      error: "Last name must be at least 3 characters long",
    });
  }

  if (req.body.uri && validator.isEmpty(req.body.uri || "")) {
    errors.push({ field: "uri", error: "Image is required" });
  } else if (req.body.uri) {
    const image = await Image.findOne({ where: { uri: req.body.uri } });
    if (!image) {
      errors.push({ field: "uri", error: "Please select a valid image" });
    }
  }

  if (req.body.email && validator.isEmpty(req.body.email || "")) {
    errors.push({ field: "email", error: "Email is required" });
  } else if (req.body.email && !validator.isEmail(req.body.email)) {
    errors.push({
      field: "email",
      error: User.rawAttributes.email.validate.isEmail.msg,
    });
  } else if (req.body.email) {
    const domain = req.body.email.split("@")[1];
    if (domain.includes("meow") && req.user.role !== "admin") {
      errors.push({
        field: "email",
        error: "Only admins can use emails from @meow domain",
      });
    } else if (req.body.email) {
      const user = await User.findOne({ where: { email: req.body.email } });
      if (user && user.id !== req.user.id) {
        errors.push({ field: "email", error: "Email is already in use" });
      }
    }
  }

  if (req.body.birthday && validator.isEmpty(req.body.birthday || "")) {
    errors.push({ field: "birthday", error: "Birthday is required" });
  } else if (req.body.birthday && !validator.isDate(req.body.birthday)) {
    errors.push({
      field: "birthday",
      error: "Invalid date format! Please use YYYY-MM-DD",
    });
  }

  return errors.length > 0 ? res.status(400).json({ errors }) : null;
};

const editUsernameValidation = async (req, res) => {
  const errors = [];

  if (validator.isEmpty(req.body.currentUsername || "")) {
    errors.push({ field: "username", error: "Current username is required" });
  } else if (req.user.username !== req.body.currentUsername) {
    errors.push({
      field: "username",
      error: "Current username is incorrect",
    });
  }

  if (validator.isEmpty(req.body.newUsername || "")) {
    errors.push({ field: "username", error: "Username is required" });
  } else if (!validator.isLength(req.body.newUsername, { min: 3 })) {
    errors.push({
      field: "username",
      error: "Username must be at least 3 characters long",
    });
  } else if (req.body.currentUsername === req.body.newUsername) {
    errors.push({
      field: "username",
      error: "New username must be different from the current one",
    });
  } else {
    const user = await User.findOne({
      where: { username: req.body.newUsername },
    });
    if (user && user.id !== req.user.id) {
      errors.push({ field: "username", error: "Username is already in use" });
    }
  }

  if (req.body.password && validator.isEmpty(req.body.password || "")) {
    errors.push({ field: "password", error: "Password is required" });
  } else {
    const user = await User.findByPk(req.user.id);
    if (!(await bcrypt.compare(req.body.password, user.password))) {
      errors.push({ field: "password", error: "Invalid password" });
    }
  }

  return errors.length > 0 ? res.status(400).json({ errors }) : null;
};

const editAddressValidation = async (req, res) => {
  const errors = [];

  if (req.body.country && validator.isEmpty(req.body.country || "")) {
    errors.push({ field: "country", error: "Country is required" });
  }

  if (req.body.city && validator.isEmpty(req.body.city || "")) {
    errors.push({ field: "city", error: "City is required" });
  }

  if (req.body.street && validator.isEmpty(req.body.street || "")) {
    errors.push({ field: "street", error: "Street is required" });
  }

  if (req.body.number && validator.isEmpty(req.body.number || "")) {
    errors.push({ field: "number", error: "Number is required" });
  }

  if (req.body.postalCode && validator.isEmpty(req.body.postalCode || "")) {
    errors.push({ field: "postalCode", error: "Postal code is required" });
  } else if (
    req.body.postalCode &&
    !validator.isPostalCode(req.body.postalCode, "any")
  ) {
    errors.push({ field: "postalCode", error: "Invalid postal code" });
  }

  return errors.length > 0 ? res.status(400).json({ errors }) : null;
};

const deleteUserValidation = async (req, res) => {
  const errors = [];

  const user = await User.findByPk(req.user.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (validator.isEmpty(req.body.password || "")) {
    errors.push({ field: "password", error: "Password is required" });
  } else {
    const user = await User.findByPk(req.user.id);
    if (!(await bcrypt.compare(req.body.password, user.password))) {
      errors.push({ field: "password", error: "Invalid password" });
    }
  }

  return errors.length > 0 ? res.status(400).json({ errors }) : null;
};

module.exports = {
  userExistValidator,
  editUserValidation,
  editAddressValidation,
  editUsernameValidation,
  deleteUserValidation,
};
