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
  const image = await Image.findOne({ where: { id: user.imageId } });
  await user.destroy();
  await fileHelper.deleteImage(image, "uploads");
  const address = await Address.findByPk(user.addressId);
  if (address) {
    await address.destroy();
  }
};

const updateEmail = async (user, fieldsToUpdate, body) => {
  let emailChanged = false;
  fieldsToUpdate.forEach((field) => {
    if (
      body[field] !== undefined &&
      field === "email" &&
      body[field] !== user.email
    ) {
      user[field] = body[field];
      emailChanged = true;
    } else if (body[field] !== undefined) {
      user[field] = body[field];
    }
  });

  if (emailChanged) {
    user.status = "active_pending";
    await emailServ.sendResetEmail(user);
  }

  await user.save();
};

module.exports = { deleteUser, updateEmail };
