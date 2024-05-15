const {
  Image,
  Address,
  RefreshToken,
  Token,
  UserInfo,
  PasswordHistory,
} = require("../../models");
const emailService = require("../services/emailService");
const adoptionRequestHelper = require("./adoptionRequestHelper");
const catUserHelper = require("./catUserHelper");
const fileHelper = require("./fileHelper");
const emailServ = require("../services/emailService");

const deleteUser = async (user) => {
  await emailService.sendDeleteAccount(user);
  await adoptionRequestHelper.deleteAdoptionRequestUser(user);
  await catUserHelper.updateOwner(user);
  await catUserHelper.deleteCat(user);
  await Token.destroy({ where: { userId: user.id } });
  await UserInfo.destroy({ where: { userId: user.id } });
  await PasswordHistory.destroy({ where: { userId: user.id } });
  await RefreshToken.destroy({ where: { userId: user.id } });
  const image = await Image.findOne({ where: { userId: user.id } });
  await fileHelper.deleteImage(image, "uploads");
  const address = await Address.findOne({ where: { userId: user.id } });
  if (address) {
    await address.destroy();
  }
  await user.destroy();
};

const updateEmail = async (user, fieldsToUpdate, body) => {
  let emailChanged = false;
  fieldsToUpdate.forEach((field) => {
    if (body[field] !== undefined) {
      if (field === "email" && body[field] !== user.email) {
        user[field] = body[field];
        emailChanged = true;
      } else {
        if (field === "hobbies" && Array.isArray(body[field])) {
          user[field] = body[field].join(", ");
        } else {
          user[field] = body[field];
        }
      }
    }
  });

  if (emailChanged) {
    user.status = "active_pending";
    await emailServ.sendResetEmail(user);
  }

  if (user.description === "") {
    user.description = null;
  }

  if (user.hobbies === "") {
    user.hobbies = null;
  }

  if (user.experienceLevel === 0) {
    user.experienceLevel = null;
  }

  const userInfo = await UserInfo.findOne({ where: { userId: user.id } });
  userInfo.description = user.description;
  userInfo.hobbies = user.hobbies;
  userInfo.experienceLevel = user.experienceLevel;
  await userInfo.save();
};

module.exports = { deleteUser, updateEmail };
