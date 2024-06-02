const { Address, Image, UserInfo } = require("../../models");

async function userToDTO(user) {
  const address = await Address.findOne({ where: { userId: user.id } });
  const images = await Image.findAll({ where: { userId: user.id } });
  const userInfo = await UserInfo.findOne({ where: { userId: user.id } });
  const birthdayTimestamp = userInfo.birthday;
  const birthday = new Date(birthdayTimestamp).toISOString().split("T")[0];

  return {
    id: user.id ? user.id : null,
    firstName: user.firstName ? user.firstName : null,
    lastName: user.lastName ? user.lastName : null,
    image: images.length > 0 ? images[0].url : null,
    uri: images.map((image) => image.uri),
    username: user.username ? user.username : null,
    email: user.email ? user.email : null,
    birthday: userInfo ? birthday : null,
    description: userInfo ? userInfo.description : null,
    hobbies: userInfo ? userInfo.hobbies : null,
    experienceLevel: userInfo ? userInfo.experienceLevel : null,
    country: address ? address.country : null,
    county: address ? address.county : null,
    city: address ? address.city : null,
    street: address ? address.street : null,
    number: address ? address.number : null,
    floor: address ? address.floor : null,
    apartment: address ? address.apartment : null,
    postalCode: address ? address.postalCode : null,
    role: user.role ? user.role : null,
    status: user.status ? user.status : null,
  };
}

async function userListToDTO(user) {
  const address = await Address.findOne({ where: { userId: user.id } });
  const images = await Image.findAll({ where: { userId: user.id } });

  return {
    id: user.id ? user.id : null,
    image: images.length > 0 ? images[0].url : null,
    username: user.username ? user.username : null,
    displayName:
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : null,
    email: user.email ? user.email : null,
    address: address ? `${address.city}, ${address.country}` : null,
  };
}

module.exports = { userToDTO, userListToDTO };
