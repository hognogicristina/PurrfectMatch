const { Address, User, Image } = require("../../models");

async function catToDTO(cat) {
  const images = await Image.findAll({ where: { catId: cat.id } });
  const guardian = await User.findByPk(cat.userId);
  const owner = await User.findByPk(cat.ownerId);
  const address = await Address.findOne({ where: { userId: guardian.id } });

  return {
    name: cat.name ? cat.name : null,
    images: images ? images.map((image) => image.url) : null,
    breed: cat.breed ? cat.breed : null,
    gender: cat.gender ? cat.gender : null,
    lifeStage: cat.ageType ? cat.ageType : null,
    healthProblem: cat.healthProblem ? cat.healthProblem : null,
    description: cat.description ? cat.description : null,
    guardian: guardian ? `${guardian.firstName} ${guardian.lastName}` : null,
    owner: owner ? `${owner.firstName} ${owner.lastName}` : null,
    address: address ? `${address.city}, ${address.country}` : null,
  };
}

async function catsListToDTO(cat) {
  const images = await Image.findAll({ where: { catId: cat.id } });
  const image = images[0];

  return {
    id: cat.id ? cat.id : null,
    image: image ? image.url : null,
    name: cat.name ? cat.name : null,
    breed: cat.breed ? cat.breed : null,
    gender: cat.gender ? cat.gender : null,
    lifeStage: cat.ageType ? cat.ageType : null,
  };
}

async function catsRecentListToDTO(cat) {
  const images = await Image.findAll({ where: { catId: cat.id } });
  const image = images[0];

  return {
    image: image ? image.url : null,
    name: cat.name ? cat.name : null,
    lifeStage: cat.ageType ? cat.ageType : null,
    description: cat.description ? cat.description : null,
  };
}

module.exports = { catToDTO, catsListToDTO, catsRecentListToDTO };
