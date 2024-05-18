const { Address, User, Image, CatUser } = require("../../models");

async function catToDTO(cat) {
  const images = await Image.findAll({ where: { catId: cat.id } });
  const catUser = await CatUser.findByPk(cat.id);
  const guardian = await User.findByPk(catUser.userId);
  const owner = await User.findByPk(catUser.ownerId);
  const address = await Address.findOne({ where: { userId: guardian.id } });

  return {
    id: cat.id ? cat.id : null,
    name: cat.name ? cat.name : null,
    images: images.map((image) => image.url) || [],
    breed: cat.breed ? cat.breed : null,
    gender: cat.gender ? cat.gender : null,
    lifeStage: cat.ageType ? cat.ageType : null,
    healthProblem: cat.healthProblem ? cat.healthProblem : null,
    description: cat.description ? cat.description : null,
    userId: catUser.userId ? catUser.userId : null,
    user: guardian ? guardian.username : null,
    guardian: guardian ? `${guardian.firstName} ${guardian.lastName}` : null,
    owner: owner ? `${owner.firstName} ${owner.lastName}` : null,
    address: address ? `${address.city}, ${address.country}` : null,
  };
}

async function catsListToDTO(cat) {
  const images = await Image.findAll({ where: { catId: cat.id } });
  const catUser = await CatUser.findByPk(cat.id);
  const guardian = await User.findByPk(catUser.userId);
  const image = images[0];

  return {
    id: cat.id ? cat.id : null,
    image: image ? image.url : null,
    name: cat.name ? cat.name : null,
    breed: cat.breed ? cat.breed : null,
    gender: cat.gender ? cat.gender : null,
    lifeStage: cat.ageType ? cat.ageType : null,
    guardian: guardian ? `${guardian.firstName} ${guardian.lastName}` : null,
  };
}

async function catsRecentListToDTO(cat) {
  const images = await Image.findAll({ where: { catId: cat.id } });
  const image = images[0];

  return {
    id: cat.id ? cat.id : null,
    image: image ? image.url : null,
    name: cat.name ? cat.name : null,
    lifeStage: cat.ageType ? cat.ageType : null,
    description: cat.description ? cat.description : null,
  };
}

module.exports = { catToDTO, catsListToDTO, catsRecentListToDTO };
