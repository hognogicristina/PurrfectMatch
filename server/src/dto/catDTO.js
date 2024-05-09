const { Address, User, Image } = require("../../models");

async function catToDTO(cat) {
  const image = await Image.findOne({ where: { id: cat.imageId } });
  const guardian = await User.findByPk(cat.userId);
  const owner = await User.findByPk(cat.ownerId);
  const address = await Address.findOne({ where: { id: guardian.addressId } });

  return {
    name: cat.name ? cat.name : null,
    image: image ? image.url : null,
    breed: cat.breed ? cat.breed : null,
    gender: cat.gender ? cat.gender : null,
    adoptionRequest: cat.ageType ? cat.ageType : null,
    healthProblem: cat.healthProblem ? cat.healthProblem : null,
    description: cat.description ? cat.description : null,
    guardian: guardian ? `${guardian.firstName} ${guardian.lastName}` : null,
    owner: owner ? `${owner.firstName} ${owner.lastName}` : null,
    address: address ? `${address.city}, ${address.country}` : null,
  };
}

async function catsListToDTO(cat) {
  const image = await Image.findOne({ where: { id: cat.imageId } });
  return {
    image: image ? image.url : null,
    name: cat.name ? cat.name : null,
    breed: cat.breed ? cat.breed : null,
    gender: cat.gender ? cat.gender : null,
    lifeStage: cat.ageType ? cat.ageType : null,
  };
}

async function catsRecentListToDTO(cat) {
  const image = await Image.findOne({ where: { id: cat.imageId } });
  return {
    image: image ? image.url : null,
    name: cat.name ? cat.name : null,
    lifeStage: cat.ageType ? cat.ageType : null,
    description: cat.description ? cat.description : null,
  };
}

module.exports = { catToDTO, catsListToDTO, catsRecentListToDTO };
