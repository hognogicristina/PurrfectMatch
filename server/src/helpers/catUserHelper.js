const { Image, Cat, CatUser } = require("../../models");
const fileHelper = require("./fileHelper");

const getCats = async (req, listType) => {
  let cats = [];

  if (listType === "sentToAdoption") {
    const addedCatsUser = await CatUser.findAll({
      where: { userId: req.user.id },
    });
    for (let addedCat of addedCatsUser) {
      const cat = await Cat.findByPk(addedCat.catId);
      cats.push(cat);
    }
  } else if (listType === "owned") {
    const ownedCatsUser = await CatUser.findAll({
      where: { ownerId: req.user.id },
    });
    for (let ownedCat of ownedCatsUser) {
      const cat = await Cat.findByPk(ownedCat.catId);
      cats.push(cat);
    }
  }

  return cats.map((cat) => {
    return cat;
  });
};

const updateOwner = async (user) => {
  if (!user) return;
  const catUsers = await CatUser.findAll({ where: { userId: user.id } });

  if (catUsers.length > 0) {
    for (let catUser of catUsers) {
      if (catUser.ownerId !== null) {
        catUser.userId = null;
        await catUser.save();
      }
    }
  }
};

const deleteCat = async (user) => {
  if (!user) return;
  const catUsers = await CatUser.findAll({ where: { userId: user.id } });
  if (catUsers.length > 0) {
    for (let catUser of catUsers) {
      const cat = await Cat.findByPk(catUser.catId);
      const image = await Image.findOne({ where: { catId: cat.id } });
      await fileHelper.deleteImage(image, "uploads");
      await catUser.destroy();
      await cat.destroy();
    }
  } else {
    const catOwners = await CatUser.findAll({ where: { ownerId: user.id } });
    if (catOwners.length > 0) {
      for (let catOwner of catOwners) {
        const cat = await Cat.findByPk(catOwner.catId);
        const image = await Image.findOne({ where: { catId: cat.id } });
        await fileHelper.deleteImage(image, "uploads");
        await catOwner.destroy();
        await cat.destroy();
      }
    }
  }
};

module.exports = { getCats, updateOwner, deleteCat };
