const { Image } = require("../../models");

async function catUserToDTO(cat) {
  const images = await Image.findAll({ where: { catId: cat.id } });
  const image = images[0];

  return {
    id: cat.id ? cat.id : null,
    image: image ? image.url : null,
    name: cat.name ? cat.name : null,
    breed: cat.breed ? cat.breed : null,
  };
}

module.exports = { catUserToDTO };
