async function transformCatUserToDTO(cat) {
  return {
    name: cat.name,
    breed: cat.breed,
  };
}

module.exports = { transformCatUserToDTO };
