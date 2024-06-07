const validator = require("validator");
const { User, Token, RefreshToken } = require("../../models");

const validateUser = async (req, res, type) => {
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
        if (user.status === "active" && type === "active") {
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
      if (user.status === "active" && type === "active") {
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

  if (
    !req.body.firstName ||
    validator.isEmpty(validator.trim(req.body.firstName))
  ) {
    error.push({ field: "firstName", message: "First name is required" });
  } else if (!validator.isLength(req.body.firstName, { max: 50 })) {
    error.push({
      field: "firstName",
      message: "First name must be at most 50 characters long",
    });
  } else if (!validator.isAlpha(req.body.firstName.replace(/\s/g, ""))) {
    error.push({
      field: "name",
      message: "First name can only contain letters and spaces",
    });

    if (
      !req.body.lastName ||
      validator.isEmpty(validator.trim(req.body.lastName))
    ) {
      error.push({ field: "lastName", message: "Last name is required" });
    } else if (!validator.isLength(req.body.lastName, { max: 50 })) {
      error.push({
        field: "lastName",
        message: "Last name must be at most 50 characters long",
      });
    } else if (!validator.isAlpha(req.body.lastName.replace(/\s/g, ""))) {
      error.push({
        field: "name",
        message: "Last name can only contain letters and spaces",
      });
    }
  }

  if (
    !req.body.username ||
    validator.isEmpty(validator.trim(req.body.username))
  ) {
    error.push({ field: "username", message: "Username is required" });
  } else if (!validator.isLength(req.body.username, { min: 3, max: 40 })) {
    error.push({
      field: "username",
      message: "Username must be between 3 and 40 characters long",
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

  if (!req.body.email || validator.isEmpty(req.body.email)) {
    error.push({ field: "email", message: "Email is required" });
  } else if (!validator.isEmail(req.body.email)) {
    error.push({
      field: "email",
      message: "Please use a valid email address",
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

  if (!req.body.password || validator.isEmpty(req.body.password)) {
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
    validator.isEmpty(req.body.confirmPassword)
  ) {
    error.push({
      field: "confirmPassword",
      message: "Confirm password is required",
    });
  } else if (req.body.password !== req.body.confirmPassword) {
    error.push({ field: "confirmPassword", message: "Passwords do not match" });
  }

  if (!req.body.birthday || validator.isEmpty(req.body.birthday)) {
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
    validator.isEmpty(req.body.usernameOrEmail)
  ) {
    error.push({
      field: "usernameOrEmail",
      message: "Username or email is required",
    });
  }

  if (!req.body.password || validator.isEmpty(req.body.password)) {
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
        return res.status(403).json({
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
      return res.status(403).json({
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

const resetValidationEmail = async (req, res, type) => {
  const error = [];
  const user = await User.findOne({ where: { email: req.body.email } });

  if (!req.body.email || validator.isEmpty(req.body.email)) {
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
          message: "Please use a valid email address",
        },
      ],
    });
  }

  if (user && type === "active") {
    if (user.status === "active") {
      return res.status(400).json({
        error: [
          {
            field: "account",
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
            field: "account",
            message: "A reset link has already been sent to this email",
          },
        ],
      });
    }
  }

  return error.length > 0 ? res.status(400).json({ error }) : null;
};

const validateRefreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!refreshToken) {
    return res.status(400).json({
      error: [{ field: "refreshToken", message: "Refresh token is required" }],
    });
  }

  const token = await RefreshToken.findOne({
    where: { token: refreshToken },
  });
  if (!token) {
    return res.status(400).json({
      error: [{ field: "refreshToken", message: "Invalid refresh token" }],
    });
  }

  const user = await User.findByPk(token.userId);
  if (!user) {
    return res
      .status(404)
      .json({ error: [{ field: "user", message: "Profile not found" }] });
  }

  return null;
};

module.exports = {
  validateUser,
  registerValidation,
  loginValidation,
  resetValidationEmail,
  validateRefreshToken,
};
