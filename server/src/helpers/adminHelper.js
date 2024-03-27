const {
  Image,
  Address,
  Cat,
  CatUser,
  AdoptionRequest,
  UserRole,
  RefreshToken,
  PasswordHistory,
} = require("../../models");
const fileHelper = require("./fileHelper");

const deleteUser = async (user) => {
  await RefreshToken.destroy({ where: { userId: user.id } });
  await PasswordHistory.destroy({ where: { userId: user.id } });
  const userAdoptionRequests = await UserRole.findAll({
    where: { userId: user.id },
  });
  for (let userAdoptionRequest of userAdoptionRequests) {
    const adoptionRequest = await AdoptionRequest.findByPk(
      userAdoptionRequest.adoptionRequestId,
    );
    await userAdoptionRequest.destroy();
    await adoptionRequest.destroy();
  }
  await CatUser.destroy({ where: { userId: user.id } });
  await CatUser.destroy({ where: { ownerId: user.id } });
  await Cat.destroy({ where: { userId: user.id } });
  await Cat.destroy({ where: { ownerId: user.id } });
  const address = await Address.findByPk(user.addressId);
  const image = await Image.findByPk(user.imageId);
  await user.destroy();
  if (address) await address.destroy();
  await fileHelper.deleteImage(image);
};

const deleteCat = async (cat) => {
  const catUsers = await CatUser.findAll({ where: { catId: cat.id } });
  for (let catUser of catUsers) {
    await catUser.destroy();
  }
  const adoptionRequests = await AdoptionRequest.findAll({
    where: { catId: cat.id },
  });
  for (let adoptionRequest of adoptionRequests) {
    const userAdoptionRequests = await UserRole.findAll({
      where: { adoptionRequestId: adoptionRequest.id },
    });
    for (let userAdoptionRequest of userAdoptionRequests) {
      await userAdoptionRequest.destroy();
    }
    await adoptionRequest.destroy();
  }
  const image = await Image.findByPk(cat.imageId);
  await cat.destroy();
  await fileHelper.deleteImage(image);
};

module.exports = { deleteUser, deleteCat };
