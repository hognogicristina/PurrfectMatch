const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");
const {
  Address,
  AdoptionRequest,
  Breed,
  Cat,
  CatUser,
  Favorite,
  Image,
  PasswordHistory,
  RefreshToken,
  User,
  UserRole,
  sequelize,
} = require("../../models");
const breedInit = require("../breedConfig/breedInit");
const adminInit = require("../adminConfig/adminInit");
const fileHelper = require("../../src/helpers/fileHelper");
const catHelper = require("../../src/helpers/catHelper");
const logger = require("../../logger/logger");

require("dotenv").config({ path: "./.env" });
// Comment the line below if you want to use the .env file and not the .env.local file
require("dotenv").config({ path: "./.env.local", override: true });

sequelize.options.logging = (message) => {
  logger.sql(message);
};

const generateUsers = async (numUsers) => {
  const users = [];

  for (let i = 0; i < numUsers; i++) {
    const username = faker.internet.userName();
    const email = faker.internet.email();
    const password = await bcrypt.hash("password", 10);
    const birthday = faker.date.anytime();

    const user = await User.create({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      username: username,
      email: email,
      password: password,
      birthday: birthday,
      role: "user",
    });

    users.push(user);
  }

  return users;
};

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

const generateImages = async (i) => {
  const catImageFilename = `cat_image_${i + 1}.jpg`;
  const relativePath = `../downloads/cat_images/${catImageFilename}`;
  const absolutePath = path.resolve(__dirname, relativePath);
  const fileBuffer = fs.readFileSync(absolutePath);

  return {
    fieldname: "file",
    originalname: catImageFilename,
    encoding: "7bit",
    mimetype: "multipart/form-data",
    buffer: fileBuffer,
    size: fileBuffer.length,
  };
};

const generateCatData = async (cat) => {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const ageInYears = randomInt(0, 20);
  const ageInSeconds = ageInYears * (60 * 60 * 24 * 365);

  cat.name = faker.person.firstName();
  cat.breed = generateRandomBreed();
  cat.gender = randomInt(0, 1) ? "Male" : "Female";
  cat.age = currentTimestamp - ageInSeconds;
  cat.ageType = catHelper.processAgeRange(1);
  cat.healthProblem = null;
  cat.description = `A lovely ${cat.gender.toLowerCase()} ${cat.breed.toLowerCase()} cat.`;

  return cat;
};

const generateCats = async (numCats, users) => {
  for (let i = 0; i < numCats; i++) {
    let catData = {};
    catData = await generateCatData(catData);
    const catImageFilePath = await generateImages(i);
    catData.imageId = await fileHelper.updateImage(catData, catImageFilePath);

    const randomIndex = randomInt(0, users.length - 1);
    const randomUser = users[randomIndex];
    catData.userId = randomUser.id;

    const newCat = await Cat.create(catData);
    await CatUser.create({ catId: newCat.id, userId: randomUser.id });
  }
};

const emptyDatabase = () => {
  UserRole.destroy({ truncate: true });
  AdoptionRequest.destroy({ truncate: true });
  Favorite.destroy({ truncate: true });
  CatUser.destroy({ truncate: true });
  Cat.destroy({ truncate: true });
  PasswordHistory.destroy({ truncate: true });
  RefreshToken.destroy({ truncate: true });
  User.destroy({ truncate: true });
  Address.destroy({ truncate: true });
  Breed.findAll().then((breeds) => {
    for (const breed of breeds) {
      fileHelper.deleteImage(breed, "breeds");
    }
  });

  Image.findAll().then((images) => {
    for (const image of images) {
      fileHelper.deleteImage(image, "files");
    }
  });
};

const generateData = async () => {
  try {
    await breedInit.fetchCatBreeds();
    await adminInit.initializeAdmin();
    await breedInit.addBreedsToDatabase();
    const users = await generateUsers(25);
    await generateCats(50, users);
    logger("Cat data generated and saved successfully.");
  } catch (error) {
    logger.error(error);
  }
};

const dir = path.join(__dirname, "../../public/files");
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const dir_temporary = path.join(__dirname, "../../public/breeds");
if (!fs.existsSync(dir_temporary)) {
  fs.mkdirSync(dir_temporary, { recursive: true });
}

emptyDatabase();
// breedInit.addBreedsToDatabase();
generateData();
