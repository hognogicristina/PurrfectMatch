const { Address, User, Image, CatUser } = require("../../models");

const calculateAgeInYears = (timestamp) => {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const ageInSeconds = currentTimestamp - timestamp;
  return Math.floor(ageInSeconds / (60 * 60 * 24 * 365));
};

async function catToDTO(cat) {
  const images = await Image.findAll({ where: { catId: cat.id } });
  const catUser = await CatUser.findOne({ where: { catId: cat.id } });
  const guardian = await User.findOne({ where: { id: catUser.userId } });
  const owner = await User.findOne({ where: { id: catUser.ownerId } });
  let imageUser, address;
  if (guardian) {
    imageUser = await Image.findAll({ where: { userId: guardian.id } });
    address = await Address.findOne({ where: { userId: guardian.id } });
  }
  const ageInYears = cat.age ? calculateAgeInYears(cat.age) : null;

  return {
    id: cat.id ? cat.id : null,
    name: cat.name ? cat.name : null,
    images: images ? images.map((image) => image.url) : null,
    uris: images ? images.map((image) => image.uri) : null,
    breed: cat.breed ? cat.breed : null,
    gender: cat.gender ? cat.gender : null,
    lifeStage: cat.ageType ? cat.ageType : null,
    age: ageInYears,
    color: cat.color ? cat.color : null,
    healthProblem: cat.healthProblem ? cat.healthProblem : null,
    description: cat.description ? cat.description : null,
    user: guardian ? guardian.username : null,
    guardian: guardian ? `${guardian.firstName} ${guardian.lastName}` : null,
    owner: owner ? `${owner.firstName} ${owner.lastName}` : null,
    ownerUsername: owner ? owner.username : null,
    imageUser: imageUser && imageUser.length > 0 ? imageUser[0].url : null,
    address: address ? `${address.city}, ${address.country}` : null,
    lat: address ? address.lat : null,
    long: address ? address.long : null,
  };
}

async function catsListToDTO(cat) {
  const images = await Image.findAll({ where: { catId: cat.id } });
  const catUser = await CatUser.findByPk(cat.id);
  const guardian = await User.findByPk(catUser.userId);
  const address = await Address.findOne({ where: { userId: guardian.id } });
  const owner = await User.findByPk(catUser.ownerId);
  const image = images[0];

  return {
    id: cat.id ? cat.id : null,
    image: image ? image.url : null,
    name: cat.name ? cat.name : null,
    breed: cat.breed ? cat.breed : null,
    gender: cat.gender ? cat.gender : null,
    lifeStage: cat.ageType ? cat.ageType : null,
    guardian: guardian ? `${guardian.firstName} ${guardian.lastName}` : null,
    owner: owner ? `${owner.firstName} ${owner.lastName}` : null,
    location: address ? `${address.city}, ${address.country}` : null,
    lat: address ? address.lat : null,
    long: address ? address.long : null,
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

module.exports = {
  calculateAgeInYears,
  catToDTO,
  catsListToDTO,
  catsRecentListToDTO,
};
