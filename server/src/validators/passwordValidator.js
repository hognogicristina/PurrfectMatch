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
    return res.status(400).json({ error: "Password is required" });
  } else if (!validator.isStrongPassword(req.body.password)) {
    return res.status(400).json({
      error:
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character",
    });
  } else if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }
  if (await doNotUsePreviousPassword(req.body.password, req.user)) {
    return res
      .status(400)
      .json({ error: "You cannot reuse one of your last three passwords" });
  }
  return null;
};

const editPasswordValidation = async (req, res) => {
  const errors = [];

  if (validator.isEmpty(req.body.currentPassword || "")) {
    errors.push({
      field: "currentPassword",
      error: "Current password is required",
    });
  } else {
    const user = await User.findByPk(req.user.id);
    if (!(await bcrypt.compare(req.body.currentPassword, user.password))) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }
  }

  if (validator.isEmpty(req.body.newPassword || "")) {
    errors.push({ field: "newPassword", error: "New password is required" });
  } else if (!validator.isStrongPassword(req.body.newPassword)) {
    errors.push({
      field: "newPassword",
      error:
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character",
    });
  }

  if (validator.isEmpty(req.body.confirmPassword || "")) {
    errors.push({
      field: "confirmPassword",
      error: "Confirm password is required",
    });
  } else if (req.body.newPassword !== req.body.confirmPassword) {
    errors.push({ field: "confirmPassword", error: "Passwords do not match" });
  }

  if (await doNotUsePreviousPassword(req.body.newPassword, req.user)) {
    return res
      .status(400)
      .json({ error: "You cannot reuse one of your last three passwords" });
  }

  return errors.length > 0 ? res.status(400).json({ errors }) : null;
};

module.exports = {
  resetValidationPassword,
  editPasswordValidation,
};
