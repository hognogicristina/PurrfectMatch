const { Address, Image, UserInfo } = require("../../models");

async function userToDTO(user) {
  const address = await Address.findOne({ where: { id: user.addressId } });
  const image = await Image.findOne({ where: { id: user.imageId } });
  const userInfo = await UserInfo.findOne({ where: { userId: user.id } });

  return {
    firstName: user.firstName ? user.firstName : null,
    lastName: user.lastName ? user.lastName : null,
    image: image ? image.url : null,
    username: user.username ? user.username : null,
    email: user.email ? user.email : null,
    birthday: userInfo ? userInfo.birthday : null,
    description: userInfo ? userInfo.description : null,
    hobbies: userInfo ? userInfo.hobbies : null,
    experienceLevel: userInfo ? userInfo.experienceLevel : null,
    address: address ? address.county : null,
    city: address ? address.city : null,
    street: address ? address.street : null,
    number: address ? address.number : null,
    floor: address ? address.floor : null,
    apartment: address ? address.apartment : null,
    postalCode: address ? address.postalCode : null,
  };
}

async function userListToDTO(user) {
  const address = await Address.findOne({ where: { id: user.addressId } });
  return {
    username: user.username ? user.username : null,
    displayName:
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : null,
    email: user.email ? user.email : null,
    address: address ? `${address.city} ${address.country}` : null,
  };
}

module.exports = { userToDTO, userListToDTO };
