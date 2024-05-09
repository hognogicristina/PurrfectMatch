async function catUserToDTO(cat) {
  return {
    name: cat.name ? cat.name : null,
    breed: cat.breed ? cat.breed : null,
  };
}

module.exports = { catUserToDTO };
