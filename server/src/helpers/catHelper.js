const { Cat } = require("../../models");
const { Op } = require("sequelize");
const { AgeTypes, CatUser } = require("../../constants/ageTypes");

const processAgeRange = (age) => {
  if (!age) return null;
  for (const type in AgeTypes) {
    const range = AgeTypes[type].RANGE;
    if (age >= range.MIN && (range.MAX === null || age <= range.MAX)) {
      return AgeTypes[type].TYPE;
    }
  }
};

const updateCatData = async (cat, body) => {
  if (!body) return;
  const fields = [
    "name",
    "breed",
    "color",
    "gender",
    "age",
    "healthProblem",
    "description",
  ];
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const ageInYears = body.age;
  const ageInSeconds = ageInYears * (60 * 60 * 24 * 365);
  const ageTimestamp = currentTimestamp - ageInSeconds;

  for (const field of fields) {
    if (field in body) {
      cat[field] = body[field];
    }
  }

  cat.uris = Array.isArray(body.uris) ? body.uris : [];

  if (body.age) {
    cat.age = ageTimestamp;
    cat.ageType = processAgeRange(ageInYears);
  }

  return cat;
};

const filterCats = async (req) => {
  const searchQuery = req.query.search ? req.query.search.toLowerCase() : null;
  const selectedBreed = req.query.selectedBreed
    ? req.query.selectedBreed
    : null;
  const selectedAgeType = req.query.selectedAgeType
    ? req.query.selectedAgeType
    : null;
  const selectedGender = req.query.selectedGender
    ? req.query.selectedGender
    : null;
  const selectedHealthProblem = req.query.selectedHealthProblem
    ? req.query.selectedHealthProblem
    : null;
  const selectedUserId = req.query.selectedUserId
    ? req.query.selectedUserId
    : null;
  const selectedColor = req.query.selectedColor
    ? req.query.selectedColor
    : null;
  const sortBy = req.query.sortBy ? req.query.sortBy : "breed";
  const sortOrder = req.query.sortOrder ? req.query.sortOrder : "asc";
  let cats;
  let queryOptions = {
    where: {
      status: "active",
    },
  };

  if (searchQuery) {
    queryOptions.where = {
      ...queryOptions.where,
      [Op.or]: [
        { breed: { [Op.like]: `%${searchQuery}%` } },
        { healthProblem: { [Op.like]: `%${searchQuery}%` } },
      ],
    };
  }
  if (selectedBreed) {
    queryOptions.where = { ...queryOptions.where, breed: selectedBreed };
  }
  if (selectedAgeType) {
    queryOptions.where = {
      ...queryOptions.where,
      ageType: { [Op.like]: `%${selectedAgeType}%` },
    };
  }
  if (selectedGender) {
    queryOptions.where = { ...queryOptions.where, gender: selectedGender };
  }
  if (selectedHealthProblem) {
    if (selectedHealthProblem === "Healthy") {
      queryOptions.where = {
        ...queryOptions.where,
        healthProblem: null,
      };
    } else {
      queryOptions.where = {
        ...queryOptions.where,
        healthProblem: selectedHealthProblem,
      };
    }
  }
  if (selectedUserId) {
    const catUser = await CatUser.findAll({
      where: { userId: selectedUserId },
    });
    const catIds = catUser.map((cat) => cat.catId);
    queryOptions.where = { ...queryOptions.where, id: catIds };
  }
  if (selectedColor) {
    queryOptions.where = { ...queryOptions.where, color: selectedColor };
  }

  cats = await Cat.findAll(queryOptions);
  cats.sort((cat1, cat2) => {
    let comparison = 0;
    if (sortBy === "breed") {
      comparison = cat1.breed.localeCompare(cat2.breed);
    } else if (sortBy === "age") {
      comparison = String(cat1.age).localeCompare(String(cat2.age));
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  return cats;
};

module.exports = { processAgeRange, updateCatData, filterCats };
