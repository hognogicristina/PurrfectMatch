const { Favorite, Cat, AdoptionRequest, UserRole } = require("../../models");
const favoriteValidator = require("../validators/favoriteValidator");
const mailValidator = require("../validators/adoptionRequestValidator");
const catDTO = require("../dto/catDTO");
const logger = require("../../log/logger");

const getFavorites = async (req, res) => {
  try {
    if (await favoriteValidator.favoriteExistValidator(req, res)) return;
    const favorites = await Favorite.findAll({
      where: { userId: req.user.id },
    });
    const favoriteDetails = [];
    for (let favorite of favorites) {
      const cat = await Cat.findByPk(favorite.catId);
      const favoriteDetail = await catDTO.transformCatsToDTO(cat);
      favoriteDetails.push(favoriteDetail);
    }
    return res.json({ data: favoriteDetails });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const addCatToFavorites = async (req, res) => {
  try {
    if (await favoriteValidator.catExistValidator(req, res)) return;
    await Favorite.create({ userId: req.user.id, catId: req.params.id });
    return res.json({ status: "Cat added to favorites successfully" });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const adoptFavorite = async (req, res) => {
  try {
    if (await mailValidator.adoptValidator(req, res)) return;
    const favorite = await Favorite.findByPk(req.params.id);
    const cat = await Cat.findByPk(favorite.catId);
    const { message } = req.body;
    const mail = await AdoptionRequest.create({ catId: cat.id, message });
    await UserRole.create({
      userId: req.user.id,
      mailId: mail.id,
      role: "sender",
    });
    await UserRole.create({
      userId: cat.userId,
      mailId: mail.id,
      role: "receiver",
    });
    await favorite.destroy();
    return res
      .status(200)
      .json({ status: "Adoption request sent successfully" });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteFavorite = async (req, res) => {
  try {
    if (await favoriteValidator.favoriteExistValidator(req, res)) return;
    const favorite = await Favorite.findByPk(req.params.id);
    await favorite.destroy();
    return res.json({ status: "Cat removed from favorites successfully" });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getFavorites,
  addCatToFavorites,
  adoptFavorite,
  deleteFavorite,
};
