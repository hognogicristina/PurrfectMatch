const validator = require("validator");
const { User, Token } = require("../../models");

const validateUser = async (req, res) => {
  const user = await User.findOne({ where: { id: req.params.id } });

  if (!user) {
    return res
      .status(400)
      .json({ error: [{ field: "user", message: "Profile not found" }] });
  } else if (user) {
    const tokenUser = await Token.findOne({ where: { userId: user.id } });

    if (tokenUser) {
      const { token, signature } = req.query;

      if (
        tokenUser.token !== token ||
        tokenUser.signature !== signature ||
        new Date() > new Date(tokenUser.expires)
      ) {
        if (user.status === "active") {
          return res.status(400).json({
            error: [
              {
                field: "token",
                message: "Sorry, this link is invalid",
              },
            ],
          });
        } else if (user.status === "active_pending") {
          return res.status(400).json({
            error: [
              {
                field: "email",
                message: "Sorry, this link has expired",
              },
            ],
          });
        }
      }
    } else {
      if (user.status === "active") {
        return res.status(400).json({
          error: [
            {
              field: "token",
              message: "Sorry, this link is invalid",
            },
          ],
        });
      }
    }
  }

  return null;
};

const registerValidation = async (req, res) => {
  const error = [];

  if (!req.body.firstName || validator.isEmpty(req.body.firstName || "")) {
    error.push({ field: "firstName", message: "First name is required" });
  }

  if (!req.body.lastName || validator.isEmpty(req.body.lastName || "")) {
    error.push({ field: "lastName", message: "Last name is required" });
  }

  if (!req.body.username || validator.isEmpty(req.body.username || "")) {
    error.push({ field: "username", message: "Username is required" });
  } else if (!validator.isLength(req.body.username, { min: 3 })) {
    error.push({
      field: "username",
      message: "Username must be at least 3 characters long",
    });
  } else if (!validator.isAlphanumeric(req.body.username)) {
    error.push({
      field: "username",
      message: "Username must contain only letters and numbers",
    });
  } else {
    const user = await User.findOne({ where: { username: req.body.username } });
    if (user) {
      error.push({
        field: "username",
        message: "This username is already in use",
      });
    }
  }

  if (!req.body.email || validator.isEmpty(req.body.email || "")) {
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
        message: "This email is already in use",
      });
    }
  }

  if (!req.body.password || validator.isEmpty(req.body.password || "")) {
    error.push({ field: "password", message: "Password is required" });
  } else if (!validator.isStrongPassword(req.body.password)) {
    error.push({
      field: "password",
      message:
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character",
    });
  }

  if (
    !req.body.confirmPassword ||
    validator.isEmpty(req.body.confirmPassword || "")
  ) {
    error.push({
      field: "confirmPassword",
      message: "Confirm password is required",
    });
  } else if (req.body.password !== req.body.confirmPassword) {
    error.push({ field: "confirmPassword", message: "Passwords do not match" });
  }

  if (!req.body.birthday || validator.isEmpty(req.body.birthday || "")) {
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

  if (
    !req.body.usernameOrEmail ||
    validator.isEmpty(req.body.usernameOrEmail || "")
  ) {
    error.push({
      field: "usernameOrEmail",
      message: "Username or email is required",
    });
  }

  if (!req.body.password || validator.isEmpty(req.body.password || "")) {
    error.push({ field: "password", message: "Password is required" });
  }

  let user;
  user = await User.findOne({ where: { username: req.body.usernameOrEmail } });
  if (!user) {
    user = await User.findOne({ where: { email: req.body.usernameOrEmail } });
  }

  if (user) {
    if (user.status === "active_pending") {
      const tokenUser = await Token.findOne({
        where: { userId: user.id, type: "activation" },
      });
      if (tokenUser && new Date() < new Date(tokenUser.expires)) {
        return res.status(401).json({
          error: [
            {
              field: "activate",
              message:
                "Please activate your account by clicking the link sent to your email",
            },
          ],
        });
      }
    } else if (user.status === "blocked") {
      return res.status(401).json({
        error: [
          {
            field: "block",
            message: "Your account has been blocked by the administrator",
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

  if (!req.body.email || validator.isEmpty(req.body.email || "")) {
    return res.status(400).json({
      error: [
        {
          field: "email",
          message: "Email is required",
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

  if (user) {
    if (user.status === "active") {
      return res.status(400).json({
        error: [
          {
            field: "email",
            message: "This account is already active",
          },
        ],
      });
    }
  }

  if (!user) {
    return res.status(400).json({
      status: "If the email exists, an email link will be sent to you",
    });
  } else if (user) {
    const tokenUser = await Token.findOne({ where: { userId: user.id } });
    if (
      tokenUser &&
      tokenUser.expires !== null &&
      new Date() < new Date(tokenUser.expires)
    ) {
      return res.status(400).json({
        error: [
          {
            field: "link",
            message: "A reset link has already been sent to this email",
          },
        ],
      });
    }
  }

  return error.length > 0 ? res.status(400).json({ error }) : null;
};

module.exports = {
  validateUser,
  registerValidation,
  loginValidation,
  resetValidationEmail,
};
