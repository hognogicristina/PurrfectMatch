const {
  Favorite,
  Cat,
  AdoptionRequest,
  UserRole,
  CatUser,
} = require("../../models");
const favoriteValidator = require("../validators/favoriteValidator");
const mailValidator = require("../validators/adoptionRequestValidator");
const catDTO = require("../dto/catDTO");
const logger = require("../../logger/logger");

const getFavorites = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const pageSize = 10;
    if (await favoriteValidator.favoriteExistValidator(req, res)) return;
    const favorites = await Favorite.findAll({
      where: { userId: req.user.id },
    });

    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    const totalItems = favorites.length;

    const favoritesForPage = favorites.slice(startIndex, endIndex);

    const favoriteDetails = [];
    for (let favorite of favoritesForPage) {
      const cat = await Cat.findByPk(favorite.catId);
      const favoriteDetail = await catDTO.catsListToDTO(cat);
      favoriteDetails.push(favoriteDetail);
    }
    return res.json({
      page: page,
      pageSize: pageSize,
      totalPages: Math.ceil(totalItems / pageSize),
      totalItems: totalItems,
      data: favoriteDetails,
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const getOneFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      where: { userId: req.user.id, catId: req.params.id },
    });

    if (favorite) {
      return res.status(200).json({ isFavorite: true });
    } else {
      return res.status(200).json({ isFavorite: false });
    }
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const addCatToFavorites = async (req, res) => {
  try {
    if (await favoriteValidator.catExistValidator(req, res)) return;
    await Favorite.create({ userId: req.user.id, catId: req.params.id });
    return res.json({ status: "Cat added to favorites" });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const adoptFavorite = async (req, res) => {
  try {
    if (await mailValidator.adoptValidator(req, res)) return;
    const favorite = await Favorite.findByPk(req.params.id);
    const cat = await Cat.findByPk(favorite.catId);
    const catUser = await CatUser.findByPk(cat.id);
    const { message } = req.body;
    const adoptionRequest = await AdoptionRequest.create({
      catId: cat.id,
      message,
    });
    await UserRole.create({
      userId: req.user.id,
      adoptionRequestId: adoptionRequest.id,
      role: "sender",
    });
    await UserRole.create({
      userId: catUser.userId,
      adoptionRequestId: adoptionRequest.id,
      role: "receiver",
    });
    await favorite.destroy();
    return res
      .status(200)
      .json({ status: "AdoptionProcess request sent successfully" });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const deleteFavorite = async (req, res) => {
  try {
    if (await favoriteValidator.favoriteExistValidator(req, res)) return;
    const catID = req.params.id;
    const favorite = await Favorite.findOne({
      where: { userId: req.user.id, catId: catID },
    });
    await favorite.destroy();
    return res.json({ status: "Cat removed from favorites" });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

module.exports = {
  getFavorites,
  getOneFavorite,
  addCatToFavorites,
  adoptFavorite,
  deleteFavorite,
};
