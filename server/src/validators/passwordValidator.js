const bcrypt = require("bcrypt");
const validator = require("validator");
const { PasswordHistory, User } = require("../../models");

const doNotUsePreviousPassword = async (password, user) => {
  const passwordHistories = await PasswordHistory.findAll({
    where: { userId: user.id },
    order: [["createdAt", "DESC"]],
    limit: 5,
  });

  return passwordHistories.some((history) =>
    bcrypt.compareSync(password, history.password),
  );
};

const resetValidationPassword = async (req, res) => {
  if (validator.isEmpty(req.body.password || "")) {
    return res.status(400).json({
      error: [{ field: "password", message: "Password is required" }],
    });
  } else if (!validator.isStrongPassword(req.body.password)) {
    return res.status(400).json({
      error: [
        {
          field: "password",
          message:
            "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character",
        },
      ],
    });
  } else if (req.body.password !== req.body.confirmPassword) {
    return res
      .status(400)
      .json({
        error: [
          { field: "confirmPassword", message: "Passwords do not match" },
        ],
      });
  }
  if (await doNotUsePreviousPassword(req.body.password, req.user)) {
    return res
      .status(400)
      .json({
        error: [
          {
            field: "password",
            message: "You cannot reuse one of your last three passwords",
          },
        ],
      });
  }
  return null;
};

const editPasswordValidation = async (req, res) => {
  const error = [];

  if (validator.isEmpty(req.body.currentPassword || "")) {
    error.push({
      field: "currentPassword",
      message: "Current password is required",
    });
  } else {
    const user = await User.findByPk(req.user.id);
    if (!(await bcrypt.compare(req.body.currentPassword, user.password))) {
      return res
        .status(400)
        .json({
          error: [
            {
              field: "currentPassword",
              message: "Current password is incorrect",
            },
          ],
        });
    }
  }

  if (validator.isEmpty(req.body.newPassword || "")) {
    error.push({ field: "newPassword", message: "New password is required" });
  } else if (!validator.isStrongPassword(req.body.newPassword)) {
    error.push({
      field: "newPassword",
      message:
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character",
    });
  }

  if (validator.isEmpty(req.body.confirmPassword || "")) {
    error.push({
      field: "confirmPassword",
      message: "Confirm password is required",
    });
  } else if (req.body.newPassword !== req.body.confirmPassword) {
    error.push({ field: "confirmPassword", message: "Passwords do not match" });
  }

  if (await doNotUsePreviousPassword(req.body.newPassword, req.user)) {
    return res
      .status(400)
      .json({
        error: [
          {
            field: "newPassword",
            message: "You cannot reuse one of your last three passwords",
          },
        ],
      });
  }

  return error.length > 0 ? res.status(400).json({ error }) : null;
};

module.exports = {
  resetValidationPassword,
  editPasswordValidation,
};
