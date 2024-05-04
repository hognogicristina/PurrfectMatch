const { Address, User, Image } = require("../../models");

async function catToDTO(cat) {
  const image = await Image.findOne({ where: { id: cat.imageId } });
  const guardian = await User.findByPk(cat.userId);
  const owner = await User.findByPk(cat.ownerId);
  const address = await Address.findOne({ where: { id: guardian.addressId } });

  return {
    name: cat.name,
    image: image ? image.url : null,
    breed: cat.breed,
    gender: cat.gender,
    adoptionRequest: cat.ageType,
    healthProblem: cat.healthProblem ? cat.healthProblem : null,
    description: cat.description,
    guardian: guardian ? `${guardian.firstName} ${guardian.lastName}` : null,
    owner: owner ? `${owner.firstName} ${owner.lastName}` : null,
    address: address ? `${address.city}, ${address.country}` : null,
  };
}

async function catsListToDTO(cat) {
  const image = await Image.findOne({ where: { id: cat.imageId } });
  return {
    image: image ? image.url : null,
    name: cat.name,
    breed: cat.breed,
    gender: cat.gender,
    lifeStage: cat.ageType,
  };
}

module.exports = { catToDTO, catsListToDTO };
