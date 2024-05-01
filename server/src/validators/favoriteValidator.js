const { Cat, Favorite } = require("../../models");

const catExistValidator = async (req, res) => {
  const cat = await Cat.findByPk(req.params.id);
  const favorite = await Favorite.findOne({
    where: { userId: req.user.id, catId: req.params.id },
  });

  if (!cat) {
    return res
      .status(404)
      .json({ error: [{ field: "cat", message: "Cat not found" }] });
  }

  if (favorite) {
    return res
      .status(400)
      .json({ error: [{ field: "cat", message: "Cat already in favorites" }] });
  }

  if (cat.userId === req.user.id) {
    return res
      .status(400)
      .json({
        error: [
          {
            field: "cat",
            message: "You cannot favorite a cat you are guardian of",
          },
        ],
      });
  } else if (cat.ownerId === req.user.id) {
    return res
      .status(400)
      .json({
        error: [{ field: "cat", message: "You cannot favorite a cat you own" }],
      });
  } else if (cat.ownerId !== null && cat.ownerId !== req.user.id) {
    return res
      .status(400)
      .json({
        error: [
          {
            field: "cat",
            message: "You cannot favorite a cat that is already adopted",
          },
        ],
      });
  }

  return null;
};

const favoriteExistValidator = async (req, res) => {
  const favorite = await Favorite.findByPk(req.params.id);
  const favorites = await Favorite.findAll({ where: { userId: req.user.id } });

  if (req.params.id) {
    if (!favorite) {
      return res
        .status(404)
        .json({
          error: [{ field: "favorite", message: "Favorite not found" }],
        });
    }
  } else {
    if (favorites.length === 0) {
      return res
        .status(404)
        .json({
          error: [{ field: "favorite", message: "No Favorites Available" }],
        });
    }
  }

  return null;
};

module.exports = { catExistValidator, favoriteExistValidator };
