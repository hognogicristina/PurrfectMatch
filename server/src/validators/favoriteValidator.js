const { Cat, Favorite, CatUser } = require("../../models");

const catExistValidator = async (req, res) => {
  const cat = await Cat.findByPk(req.params.id);

  if (!cat) {
    return res
      .status(404)
      .json({ error: [{ field: "cat", message: "Cat not found" }] });
  } else {
    const favorite = await Favorite.findOne({
      where: { userId: req.user.id, catId: req.params.id },
    });
    if (favorite) {
      return res.status(400).json({
        error: [{ field: "cat", message: "This cat is already in favorites" }],
      });
    }

    const catUser = await CatUser.findByPk(cat.id);
    if (catUser.userId === req.user.id) {
      return res.status(400).json({
        error: [
          {
            field: "cat",
            message: "You cannot favorite a cat you are guardian of",
          },
        ],
      });
    } else if (catUser.ownerId === req.user.id) {
      return res.status(400).json({
        error: [{ field: "cat", message: "You cannot favorite a cat you own" }],
      });
    } else if (catUser.ownerId !== null && catUser.ownerId !== req.user.id) {
      return res.status(400).json({
        error: [
          {
            field: "cat",
            message: "You cannot favorite a cat that is already adopted",
          },
        ],
      });
    }
  }

  return null;
};

const favoriteExistValidator = async (req, res) => {
  const cat = await Cat.findByPk(req.params.id);
  const favorites = await Favorite.findAll({ where: { userId: req.user.id } });

  if (req.params.id) {
    if (!cat) {
      return res.status(404).json({
        error: [{ field: "cat", message: "Cat not found" }],
      });
    }
  }

  if (favorites.length === 0) {
    return res.status(404).json({
      error: [{ field: "favorite", message: "No Favorites Available" }],
    });
  }

  return null;
};

module.exports = { catExistValidator, favoriteExistValidator };
