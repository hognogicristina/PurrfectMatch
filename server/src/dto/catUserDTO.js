async function catUserToDTO(cat) {
  return {
    name: cat.name,
    breed: cat.breed,
  };
}

module.exports = { catUserToDTO };
