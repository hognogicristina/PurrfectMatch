const validator = require("validator");
const { User, Token } = require("../../models");

const validateUser = async (req, res) => {
  const user = await User.findOne({ where: { id: req.params.id } });
  const tokenUser = await Token.findOne({ where: { userId: user.id } });

  if (!user) {
    return res
      .status(400)
      .json({ error: [{ field: "user", message: "User not found" }] });
  }

  const { token, signature, expires } = req.query;
  if (
    tokenUser.token !== token ||
    tokenUser.signature !== signature ||
    tokenUser.expires !== expires ||
    (tokenUser.expires === expires && new Date() > new Date(tokenUser.expires))
  ) {
    return res.status(400).json({
      error: [
        { field: "token", message: "The link is invalid or has expired" },
      ],
    });
  }

  return null;
};

const registerValidation = async (req, res) => {
  const error = [];

  if (validator.isEmpty(req.body.firstName || "")) {
    error.push({ field: "firstName", message: "First name is required" });
  } else if (!validator.isLength(req.body.firstName, { min: 3 })) {
    error.push({
      field: "firstName",
      message: "First name must be at least 3 characters long",
    });
  }

  if (validator.isEmpty(req.body.lastName || "")) {
    error.push({ field: "lastName", message: "Last name is required" });
  } else if (!validator.isLength(req.body.lastName, { min: 3 })) {
    error.push({
      field: "lastName",
      message: "Last name must be at least 3 characters long",
    });
  }

  if (validator.isEmpty(req.body.username || "")) {
    error.push({ field: "username", message: "Username is required" });
  } else if (!validator.isLength(req.body.username, { min: 3 })) {
    error.push({
      field: "username",
      message: "Username must be at least 3 characters long",
    });
  } else {
    const user = await User.findOne({ where: { username: req.body.username } });
    if (user) {
      error.push({ field: "username", message: "Username is already in use" });
    }
  }

  if (validator.isEmpty(req.body.email || "")) {
    error.push({ field: "email", message: "Email is required" });
  } else if (!validator.isEmail(req.body.email)) {
    error.push({
      field: "email",
      message: User.rawAttributes.email.validate.isEmail.msg,
    });
  } else {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (user) {
      error.push({
        field: "email",
        message: "Email is already in use by another user",
      });
    }
  }

  if (validator.isEmpty(req.body.password || "")) {
    error.push({ field: "password", message: "Password is required" });
  } else if (!validator.isStrongPassword(req.body.password)) {
    error.push({
      field: "password",
      message:
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character",
    });
  }

  if (validator.isEmpty(req.body.confirmPassword || "")) {
    error.push({
      field: "confirmPassword",
      message: "Confirm password is required",
    });
  } else if (req.body.password !== req.body.confirmPassword) {
    error.push({ field: "confirmPassword", message: "Passwords do not match" });
  }

  if (validator.isEmpty(req.body.birthday || "")) {
    error.push({ field: "birthday", message: "Birthday is required" });
  } else if (!validator.isDate(req.body.birthday)) {
    error.push({
      field: "birthday",
      message: "Invalid date format Please use YYYY-MM-DD",
    });
  }

  return error.length > 0 ? res.status(400).json({ error }) : null;
};

const loginValidation = async (req, res) => {
  const error = [];

  if (validator.isEmpty(req.body.usernameOrEmail || "")) {
    error.push({
      field: "usernameOrEmail",
      message: "Username or email is required",
    });
  }

  if (validator.isEmpty(req.body.password || "")) {
    error.push({ field: "password", message: "Password is required" });
  }

  const user = await User.findOne({
    where: { username: req.body.usernameOrEmail },
  });
  if (user) {
    if (user.status === "active_pending") {
      return res.status(401).json({
        error: [
          {
            field: "user",
            message:
              "Please activate your account by clicking the link sent to your email",
          },
        ],
      });
    } else if (user.status === "blocked") {
      return res.status(401).json({
        error: [
          {
            field: "user",
            message: "Admin has blocked your account until activation",
          },
        ],
      });
    }
  }

  return error.length > 0 ? res.status(400).json({ error }) : null;
};

const resetValidationEmail = async (req, res) => {
  const error = [];
  const user = await User.findOne({ where: { email: req.body.email } });
  const tokenUser = await Token.findOne({ where: { userId: user.id } });

  if (validator.isEmpty(req.body.email || "")) {
    return res.status(400).json({
      error: [
        {
          field: "email",
          message: "Email is required in order to reset your password",
        },
      ],
    });
  } else if (!validator.isEmail(req.body.email)) {
    return res.status(400).json({
      error: [
        {
          field: "email",
          message: User.rawAttributes.email.validate.isEmail.msg,
        },
      ],
    });
  }

  if (!user) {
    return res.status(400).json({
      status: "If the email exists, a reset link will be sent to you",
    });
  } else if (
    tokenUser.expires !== null &&
    new Date() < new Date(tokenUser.expires)
  ) {
    return res.status(400).json({
      error: [
        {
          field: "email",
          message: "A reset link has already been sent to this email",
        },
      ],
    });
  }

  return error.length > 0 ? res.status(400).json({ error }) : null;
};

module.exports = {
  validateUser,
  registerValidation,
  loginValidation,
  resetValidationEmail,
};
