const { Image } = require("../../models");
const { calculateAgeInYears } = require("./catDTO");

async function catUserToDTO(cat) {
  const images = await Image.findAll({ where: { catId: cat.id } });
  const ageInYears = cat.age ? calculateAgeInYears(cat.age) : null;
  const image = images[0];

  return {
    id: cat.id ? cat.id : null,
    image: image ? image.url : null,
    breed: cat.breed ? cat.breed : null,
    name: cat.name ? cat.name : null,
    images: images ? images.map((image) => image.url) : null,
    uris: images ? images.map((image) => image.uri) : null,
    gender: cat.gender ? cat.gender : null,
    age: ageInYears,
    color: cat.color ? cat.color : null,
    healthProblem: cat.healthProblem ? cat.healthProblem : null,
    description: cat.description ? cat.description : null,
    status: cat.status ? cat.status : null,
  };
}

module.exports = { catUserToDTO };
