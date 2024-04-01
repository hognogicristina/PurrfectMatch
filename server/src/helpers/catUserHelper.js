const { Image, Cat, CatUser } = require("../../models");
const fileHelper = require("./fileHelper");

const getCats = async (req) => {
  const addedByMe = req.query.addedByMe !== undefined;
  const ownedByMe = req.query.ownedByMe !== undefined;
  let cats = [];

  if (addedByMe) {
    const addedCats = await Cat.findAll({ where: { userId: req.user.id } });
    cats = cats.concat(addedCats);
  } else if (ownedByMe) {
    const ownedCats = await Cat.findAll({ where: { ownerId: req.user.id } });
    cats = cats.concat(ownedCats);
  }

  return cats.map((cat) => {
    return cat;
  });
};

const updateOwner = async (user) => {
  if (!user) return;
  const cats = await Cat.findAll({ where: { userId: user.id } });

  if (cats.length > 0) {
    for (let cat of cats) {
      const catUsers = await CatUser.findAll({ where: { catId: cat.id } });
      for (let catUser of catUsers) {
        if (catUser.ownerId !== null) {
          catUser.userId = null;
          await catUser.save();
        }
      }

      if (cat.ownerId !== null) {
        cat.userId = null;
        await cat.save();
      }
    }
  }
};

const deleteCat = async (user) => {
  if (!user) return;
  const cats = await Cat.findAll({ where: { userId: user.id } });

  if (cats.length > 0) {
    for (let cat of cats) {
      const catUsers = await CatUser.findAll({ where: { catId: cat.id } });
      for (let catUser of catUsers) {
        await catUser.destroy();
      }

      const image = await Image.findOne({ where: { id: cat.imageId } });
      await cat.destroy();
      await fileHelper.deleteImage(image, "uploads");
    }
  } else {
    const catOwners = await Cat.findAll({ where: { ownerId: user.id } });

    if (catOwners.length > 0) {
      for (let catOwner of catOwners) {
        const catUserOwners = await CatUser.findAll({
          where: { catId: catOwner.id },
        });
        for (let catUserOwner of catUserOwners) {
          await catUserOwner.destroy();
        }

        const image = await Image.findOne({ where: { id: catOwner.imageId } });
        await catOwner.destroy();
        await fileHelper.deleteImage(image, "uploads");
      }
    }
  }
};

module.exports = { getCats, updateOwner, deleteCat };
