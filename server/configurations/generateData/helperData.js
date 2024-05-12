const path = require("path");
const fs = require("fs");
const { faker } = require("@faker-js/faker");
const axios = require("axios");
const catHelper = require("../../src/helpers/catHelper");
const fileHelper = require("../../src/helpers/fileHelper");
const logger = require("../../logger/logger");

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateRandomBreed = () => {
  try {
    const breedData = fs.readFileSync(
      path.join(__dirname, "../breedConfig/breeds.json"),
      "utf8",
    );

    const breeds = JSON.parse(breedData);
    const randomIndex = randomInt(0, breeds.length - 1);
    return breeds[randomIndex];
  } catch (error) {
    logger.error(error);
    return null;
  }
};

const generateImages = async (i, folder) => {
  const catImageFilename = `${folder}_${i + 1}.jpg`;
  const relativePath = path.join(
    __dirname,
    "..",
    "downloads",
    `${folder}s`,
    catImageFilename,
  );
  return await fileHelper.getFile(relativePath, catImageFilename);
};

const generateRandomHealthProblem = async () => {
  try {
    const response = await axios.get(
      "https://clinicaltables.nlm.nih.gov/api/conditions/v3/search?terms=gastroenteri&df=term_icd9_code,maxList,primary_name",
    );
    const conditions = response.data[3].map((condition) => {
      return {
        term_icd9_code: condition[0],
        maxList: condition[1],
        primary_name: condition[2],
      };
    });

    const randomIndex = randomInt(0, conditions.length - 1);
    return conditions[randomIndex].primary_name;
  } catch (error) {
    logger.error(error);
    return null;
  }
};

const generateCatData = async (cat) => {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const ageInYears = randomInt(0, 20).toString();
  const ageInSeconds = ageInYears * (60 * 60 * 24 * 365);

  cat.name = faker.person.firstName();
  cat.breed = generateRandomBreed();
  cat.gender = randomInt(0, 1) ? "Male" : "Female";
  cat.age = currentTimestamp - ageInSeconds;
  cat.ageType = catHelper.processAgeRange(ageInYears);
  cat.healthProblem = await generateRandomHealthProblem();
  cat.description = `A lovely ${cat.gender.toLowerCase()} ${cat.breed.toLowerCase()} cat.`;

  return cat;
};

const generateRandomUserInfo = async () => {
  const birthday = faker.date.past({ years: 20 });
  const description = "I love cats!";
  const experienceLevel = randomInt(1, 5);

  const hobbiesList = ["playing with cats", "games", "reading"];
  const hobbies = hobbiesList.join(",");

  return {
    birthday: birthday,
    description: description,
    hobbies: hobbies,
    experienceLevel: experienceLevel,
  };
};

module.exports = {
  randomInt,
  generateRandomBreed,
  generateImages,
  generateCatData,
  generateRandomUserInfo,
};
