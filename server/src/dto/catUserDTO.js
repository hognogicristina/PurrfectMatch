const { Image } = require("../../models");

async function catUserToDTO(cat) {
  const images = await Image.findAll({ where: { catId: cat.id } });
  const image = images[0];

  return {
    id: cat.id ? cat.id : null,
    image: image ? image.url : null,
    name: cat.name ? cat.name : null,
    breed: cat.breed ? cat.breed : null,
    gender: cat.gender ? cat.gender : null,
    lifeStage: cat.ageType ? cat.ageType : null,
    color: cat.color ? cat.color : null,
    healthProblem: cat.healthProblem ? cat.healthProblem : null,
    description: cat.description ? cat.description : null,
    status: cat.status ? cat.status : null,
  };
}

module.exports = { catUserToDTO };
