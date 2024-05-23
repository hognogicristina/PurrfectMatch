const {
  Image,
  Cat,
  CatUser,
  Favorite,
  AdoptionRequest,
  UserRole,
} = require("../../models");
const fileHelper = require("./fileHelper");

const getCats = async (user, listType) => {
  let cats = [];

  if (listType === "sentToAdoption") {
    const addedCatsUser = await CatUser.findAll({
      where: { userId: user.id },
    });
    if (addedCatsUser.length > 0) {
      for (let addedCat of addedCatsUser) {
        const cat = await Cat.findByPk(addedCat.catId);
        cats.push(cat);
      }
    }
  } else if (listType === "owned") {
    const ownedCatsUser = await CatUser.findAll({
      where: { ownerId: user.id },
    });
    if (ownedCatsUser.length > 0) {
      for (let ownedCat of ownedCatsUser) {
        const cat = await Cat.findByPk(ownedCat.catId);
        cats.push(cat);
      }
    }
  }

  return cats.map((cat) => {
    return cat;
  });
};

const getCatsLimit = async (user, listType) => {
  let cats = [];

  if (listType === "sentToAdoption") {
    const addedCatsUser = await CatUser.findAll({
      where: { userId: user.id },
      limit: 4,
    });
    for (let addedCat of addedCatsUser) {
      const cat = await Cat.findByPk(addedCat.catId);
      cats.push(cat);
    }
  } else if (listType === "owned") {
    const ownedCatsUser = await CatUser.findAll({
      where: { ownerId: user.id },
      limit: 4,
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

const deleteCat = async (user, transaction) => {
  if (!user) return;
  const catUsers = await CatUser.findAll({
    where: { userId: user.id },
    transaction,
  });

  const userFavorites = await Favorite.findAll({
    where: { userId: user.id },
    transaction,
  });

  for (let fav of userFavorites) {
    await fav.destroy({ transaction });
  }

  if (catUsers.length > 0) {
    for (let catUser of catUsers) {
      if (catUser.ownerId !== null && catUser.ownerId !== user.id) {
        catUser.userId = null;
        await catUser.save({ transaction });
      } else {
        const cat = await Cat.findByPk(catUser.catId, { transaction });
        const images = await Image.findAll({
          where: { catId: cat.id },
          transaction,
        });

        if (images.length > 0) {
          for (let img of images) {
            await fileHelper.deleteImage(img, "uploads", transaction);
          }
        }

        await catUser.destroy({ transaction });
        const favorite = await Favorite.findAll({
          where: { catId: cat.id },
          transaction,
        });
        for (let fav of favorite) {
          await fav.destroy({ transaction });
        }
        const adoptionRequests = await AdoptionRequest.findAll({
          where: { catId: cat.id },
          transaction,
        });

        if (adoptionRequests.length > 0) {
          for (let adoptionRequest of adoptionRequests) {
            const userAdoptionRequests = await UserRole.findAll({
              where: { adoptionRequestId: adoptionRequest.id },
              transaction,
            });

            if (userAdoptionRequests.length > 0) {
              for (let userAdoptionRequest of userAdoptionRequests) {
                await userAdoptionRequest.destroy({ transaction });
              }
            }
            await adoptionRequest.destroy({ transaction });
          }
        }
        await cat.destroy({ transaction });
      }
    }
  }

  const catOwners = await CatUser.findAll({
    where: { ownerId: user.id },
    transaction,
  });
  if (catOwners.length > 0) {
    for (let catOwner of catOwners) {
      const cat = await Cat.findByPk(catOwner.catId, { transaction });
      const images = await Image.findAll({
        where: { catId: cat.id },
        transaction,
      });

      if (images.length > 0) {
        for (let img of images) {
          await fileHelper.deleteImage(img, "uploads", transaction);
        }
      }

      const favorite = await Favorite.findAll({
        where: { catId: cat.id },
        transaction,
      });

      if (favorite.length > 0) {
        for (let fav of favorite) {
          await fav.destroy({ transaction });
        }
      }

      const adoptionRequests = await AdoptionRequest.findAll({
        where: { catId: cat.id },
        transaction,
      });

      if (adoptionRequests.length > 0) {
        for (let adoptionRequest of adoptionRequests) {
          const userAdoptionRequests = await UserRole.findAll({
            where: { adoptionRequestId: adoptionRequest.id },
            transaction,
          });

          if (userAdoptionRequests.length > 0) {
            for (let userAdoptionRequest of userAdoptionRequests) {
              await userAdoptionRequest.destroy({ transaction });
            }
          }

          await adoptionRequest.destroy({ transaction });
        }
      }

      await catOwner.destroy({ transaction });
      await cat.destroy({ transaction });
    }
  }
};

module.exports = { getCats, getCatsLimit, deleteCat };
