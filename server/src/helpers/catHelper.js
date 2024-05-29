const { Cat, CatUser, User, Address } = require("../../models");
const { Op } = require("sequelize");
const { AgeTypes } = require("../../constants/ageTypes");

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
  cat.status = "active";

  if (body.age) {
    cat.age = ageTimestamp;
    cat.ageType = processAgeRange(ageInYears);
  }

  return cat;
};

const getDistance = (address1, address2) => {
  const lat1 = address1.latitude;
  const lon1 = address1.longitude;
  const lat2 = address2.latitude;
  const lon2 = address2.longitude;

  return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2));
};

const calculateDistance = (address1, address2) => {
  return getDistance(address1, address2);
};

const filterCats = async (req) => {
  const searchQuery = req.query.search ? req.query.search.toLowerCase() : null;
  const selectedBreed = req.query.selectedBreed
    ? req.query.selectedBreed
    : null;
  const selectedLifeStage = req.query.selectedLifeStage
    ? req.query.selectedLifeStage
    : null;
  const selectedGender = req.query.selectedGender
    ? req.query.selectedGender
    : null;
  const selectedHealthProblem = req.query.selectedHealthProblem
    ? req.query.selectedHealthProblem
    : null;
  const selectedUser = req.query.selectedUser ? req.query.selectedUser : null;
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
        { name: { [Op.like]: `%${searchQuery}%` } },
      ],
    };
  }
  if (selectedBreed) {
    queryOptions.where = { ...queryOptions.where, breed: selectedBreed };
  }
  if (selectedLifeStage) {
    queryOptions.where = {
      ...queryOptions.where,
      ageType: { [Op.like]: `%${selectedLifeStage}%` },
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
  if (selectedUser) {
    const user = await User.findOne({ where: { username: selectedUser } });
    const catUser = await CatUser.findAll({
      where: { userId: user.id },
    });
    const catIds = catUser.map((cat) => cat.catId);
    queryOptions.where = { ...queryOptions.where, id: catIds };
  }
  if (selectedColor) {
    queryOptions.where = { ...queryOptions.where, color: selectedColor };
  }

  cats = await Cat.findAll(queryOptions);

  if (sortBy === "location") {
    const loggedUserAddress = await Address.findOne({
      where: { userId: req.user.id },
    });

    cats = await Promise.all(
      cats.map(async (cat) => {
        const catUser = await CatUser.findByPk(cat.id);
        const guardian = await User.findByPk(catUser.userId);
        const address = await Address.findOne({
          where: { userId: guardian.id },
        });
        const distance = calculateDistance(loggedUserAddress, address);
        return { ...cat, distance };
      }),
    );

    cats.sort((cat1, cat2) => {
      return sortOrder === "asc"
        ? cat1.distance - cat2.distance
        : cat2.distance - cat1.distance;
    });
  } else {
    cats.sort((cat1, cat2) => {
      let comparison = 0;
      if (sortBy === "breed") {
        comparison = cat1.breed.localeCompare(cat2.breed);
      } else if (sortBy === "age") {
        comparison = String(cat1.age).localeCompare(String(cat2.age));
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }

  return cats;
};

module.exports = { processAgeRange, updateCatData, filterCats };
