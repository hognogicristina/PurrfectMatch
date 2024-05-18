const { Image, Cat, CatUser } = require("../../models");
const catValidator = require("../validators/catValidator");
const catUserValidator = require("../validators/catUserValidator");
const catHelper = require("../helpers/catHelper");
const fileHelper = require("../helpers/fileHelper");
const mailHelper = require("../helpers/adoptionRequestHelper");
const catDTO = require("../dto/catDTO");
const logger = require("../../logger/logger");

const getAllCats = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const pageSize = 24;
    if (await catValidator.catExistValidator(req, res)) return;
    const cats = await catHelper.filterCats(req);
    if (await catValidator.catsFilterValidator(cats, res)) return;

    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    const totalItems = cats.length;

    const catsForPage = cats.slice(startIndex, endIndex);

    const catsDetails = [];
    for (let cat of catsForPage) {
      const catsDetail = await catDTO.catsListToDTO(cat);
      catsDetails.push(catsDetail);
    }

    return res.status(200).json({
      page: page,
      pageSize: pageSize,
      totalPages: Math.ceil(totalItems / pageSize),
      totalItems: totalItems,
      data: catsDetails,
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const getOneCat = async (req, res) => {
  try {
    if (await catValidator.catExistValidator(req, res)) return;
    const cat = await Cat.findByPk(req.params.id);
    const catDetails = await catDTO.catToDTO(cat);
    return res.status(200).json({ data: catDetails });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const addCat = async (req, res) => {
  try {
    if (await catValidator.catValidator(req, res)) return;
    if (await catUserValidator.userValidator(req, res)) return;

    let catData = {};
    catData = await catHelper.updateCatData(catData, req.body);
    const newCat = await Cat.create(catData);

    for (const uri of catData.uris) {
      const newImage = await fileHelper.moveImage(null, uri);
      newImage.catId = newCat.id;
      await newImage.save();
    }

    await CatUser.create({ catId: newCat.id, userId: req.user.id });
    res.status(201).json({ status: "Cat added successfully" });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const editCat = async (req, res) => {
  try {
    if (await catValidator.catValidator(req, res)) return;
    if (await catUserValidator.userValidator(req, res)) return;

    let cat = await Cat.findByPk(req.params.id);
    cat = await catHelper.updateCatData(cat, req.body);
    await cat.save();

    let newImage = await Image.findOne({ where: { catId: cat.id } });
    for (const uri of cat.uris) {
      newImage = await fileHelper.moveImage(newImage, uri);
      newImage.catId = cat.id;
      await newImage.save();
    }

    return res.json({ status: "Cat updated successfully" });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const deleteCat = async (req, res) => {
  const transaction = await Cat.sequelize.transaction();
  try {
    if (await catUserValidator.userValidator(req, res)) {
      await transaction.rollback();
      return;
    }

    const cat = await Cat.findOne({
      where: { id: req.params.id },
      transaction,
    });
    const image = await Image.findOne({
      where: { catId: cat.id },
      transaction,
    });

    await mailHelper.deleteAdoptionRequestCat(cat, req.user, transaction);
    await CatUser.destroy({ where: { catId: cat.id }, transaction });
    await fileHelper.deleteImage(image, "uploads", transaction);
    await cat.destroy({ transaction });
    await transaction.commit();
    return res.status(200).json({ status: "Cat deleted successfully" });
  } catch (error) {
    await transaction.rollback();
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

module.exports = {
  getAllCats,
  getOneCat,
  addCat,
  editCat,
  deleteCat,
};
