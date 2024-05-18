const {
  Image,
  Address,
  Cat,
  CatUser,
  AdoptionRequest,
  UserRole,
  RefreshToken,
  PasswordHistory,
  Token,
  UserInfo,
} = require("../../models");
const fileHelper = require("./fileHelper");
const catUserHelper = require("./catUserHelper");

const deleteUser = async (user, transaction) => {
  await Token.destroy({ where: { userId: user.id }, transaction });
  await Favorites.destroy({ where: { userId: user.id }, transaction });
  await UserInfo.destroy({ where: { userId: user.id }, transaction });
  await RefreshToken.destroy({ where: { userId: user.id }, transaction });
  await PasswordHistory.destroy({ where: { userId: user.id }, transaction });
  const userAdoptionRequests = await UserRole.findAll({
    where: { userId: user.id },
    transaction,
  });
  for (let userAdoptionRequest of userAdoptionRequests) {
    const adoptionRequest = await AdoptionRequest.findByPk(
      userAdoptionRequest.adoptionRequestId,
    );
    await userAdoptionRequest.destroy({ transaction });
    await adoptionRequest.destroy({ transaction });
  }
  await catUserHelper.deleteCat(user, transaction);
  const address = await Address.findOne({
    where: { userId: user.id },
    transaction,
  });
  const image = await Image.findOne({
    where: { userId: user.id },
    transaction,
  });
  if (address) await address.destroy({ transaction });
  await fileHelper.deleteImage(image, "uploads", transaction);
  await user.destroy({ transaction });
};

const deleteCat = async (cat, transaction) => {
  const catUsers = await CatUser.findAll({
    where: { catId: cat.id },
    transaction,
  });
  for (let catUser of catUsers) {
    await catUser.destroy({ transaction });
  }
  const adoptionRequests = await AdoptionRequest.findAll({
    where: { catId: cat.id },
    transaction,
  });
  for (let adoptionRequest of adoptionRequests) {
    const userAdoptionRequests = await UserRole.findAll({
      where: { adoptionRequestId: adoptionRequest.id },
      transaction,
    });
    for (let userAdoptionRequest of userAdoptionRequests) {
      await userAdoptionRequest.destroy({ transaction });
    }
    await adoptionRequest.destroy({ transaction });
  }
  const image = await Image.findOne({ where: { catId: cat.id }, transaction });
  await fileHelper.deleteImage(image, "uploads", transaction);
  await cat.destroy({ transaction });
};

const blockUser = async (user) => {
  user.update({ status: "blocked" });
  await user.save();
};

module.exports = { deleteUser, deleteCat, blockUser };
