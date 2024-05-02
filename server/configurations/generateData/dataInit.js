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
  UserInfo,
  Token,
  sequelize,
} = require("../../models");
const breedInit = require("../breedConfig/breedInit");
const adminInit = require("../adminConfig/adminInit");
const fileHelper = require("../../src/helpers/fileHelper");
const helperData = require("./helperData");
const logger = require("../../logger/logger");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
  override: true,
});

// Comment the lines below if you want to use the .env file and not the .env.local file
dotenv.config({
  path: path.resolve(__dirname, "../../.env.local"),
  override: true,
});

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
    const address = await adminInit.generateAddress();

    const user = await User.create({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      username: username,
      email: email,
      password: password,
      addressId: address.id,
      role: "user",
      status: "active",
    });
    await UserInfo.create({
      userId: user.id,
      birthday: birthday,
    });
    await PasswordHistory.create({
      userId: user.id,
      password: password,
    });
    await Token.create({
      userId: user.id,
    });

    users.push(user);
  }

  return users;
};

const generateCats = async (numCats, users) => {
  for (let i = 0; i < numCats; i++) {
    let catData = {};
    catData = await helperData.generateCatData(catData);
    const file = await helperData.generateImages(i);
    const newImage = await fileHelper.uploadImage(file, "uploads");
    catData.imageId = newImage.id;

    const randomIndex = helperData.randomInt(0, users.length - 1);
    const randomUser = users[randomIndex];
    catData.userId = randomUser.id;

    const newCat = await Cat.create(catData);
    await CatUser.create({ catId: newCat.id, userId: randomUser.id });
  }
};

const generateFavorite = async (numFavorites, users) => {
  for (let i = 0; i < numFavorites; i++) {
    const randomIndex = helperData.randomInt(0, users.length - 1);
    const randomUser = users[randomIndex];

    let randomCat, catUser;
    do {
      randomCat = await Cat.findOne({ order: sequelize.random() });
      catUser = randomCat.userId;
    } while (catUser === randomUser.id);

    await Favorite.create({
      userId: randomUser.id,
      catId: randomCat.id,
    });
  }
};

const emptyDatabase = () => {
  Token.destroy({ truncate: true });
  UserInfo.destroy({ truncate: true });
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
      fileHelper.deleteImage(image, "uploads");
    }
  });

  logger("Database emptied");
};

const generateData = async () => {
  try {
    emptyDatabase();
    await breedInit.fetchCatBreeds();
    await adminInit.initializeAdmin();
    await breedInit.addBreedsToDatabase();
    const users = await generateUsers(25);
    await generateCats(50, users);
    await generateFavorite(15, users);
    await logger("Data was configured");
  } catch (error) {
    logger.error(error);
  }
};

const dir = path.join(__dirname, "../../public/uploads");
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const dir_breeds = path.join(__dirname, "../../public/breeds");
if (!fs.existsSync(dir_breeds)) {
  fs.mkdirSync(dir_breeds, { recursive: true });
}

const dir_temporary = path.join(__dirname, "../../public/temporary-uploads");
if (!fs.existsSync(dir_temporary)) {
  fs.mkdirSync(dir_temporary, { recursive: true });
}

generateData();
