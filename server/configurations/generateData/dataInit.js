const fs = require("fs");
const bcrypt = require("bcrypt");
const { faker, he } = require("@faker-js/faker");
const {
  Address,
  AdoptionRequest,
  Breed,
  AgeType,
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
const { AgeTypes } = require("../../constants/ageTypes");

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

const addAgeTypesToDatabase = async () => {
  const ageTypeEntries = Object.entries(AgeTypes).map(([key, value]) => ({
    type: value.TYPE,
    min: value.RANGE.MIN,
    max: value.RANGE.MAX,
  }));

  await AgeType.create(ageTypeEntries[0]);
  await AgeType.create(ageTypeEntries[1]);
  await AgeType.create(ageTypeEntries[2]);
  await AgeType.create(ageTypeEntries[3]);
};

const generateUsers = async (numUsers) => {
  const users = [];

  for (let i = 0; i < numUsers; i++) {
    const username = faker.internet.userName();
    const email = faker.internet.email();
    const password = await bcrypt.hash("password", 10);

    const user = await User.create({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      username: username,
      email: email,
      password: password,
      role: "user",
      status: "active",
    });

    await adminInit.generateAddress(user.id);
    const { birthday, description, hobbies, experienceLevel } =
      await helperData.generateRandomUserInfo();

    await UserInfo.create({
      userId: user.id,
      birthday: birthday,
      description: description,
      hobbies: hobbies,
      experienceLevel: experienceLevel,
    });
    await PasswordHistory.create({
      userId: user.id,
      password: password,
    });
    const file = await helperData.generateImages(i, "user_picture");
    const newImage = await fileHelper.uploadImage(file, "uploads");
    newImage.userId = user.id;
    await newImage.save();

    users.push(user);
  }

  return users;
};

const generateCats = async (numCats, users) => {
  for (let i = 0; i < numCats; i++) {
    let catData = {};
    catData = await helperData.generateCatData(catData);

    const numImages = helperData.randomInt(1, 4);
    const files = await helperData.generateImages(numImages, "cat_image");

    const uploadedImages = [];
    for (const file of files) {
      const newImage = await fileHelper.uploadImage(file, "uploads");
      uploadedImages.push(newImage);
    }

    const randomIndex = helperData.randomInt(0, users.length - 1);
    const randomUser = users[randomIndex];
    const newCat = await Cat.create(catData);

    for (const uploadedImage of uploadedImages) {
      uploadedImage.catId = newCat.id;
      await uploadedImage.save();
    }
    await CatUser.create({ catId: newCat.id, userId: randomUser.id });
  }
};

const generateFavorite = async (numFavorites, users) => {
  for (let i = 0; i < numFavorites; i++) {
    const randomIndex = helperData.randomInt(0, users.length - 1);
    const randomUser = users[randomIndex];

    let randomCat, user;
    do {
      randomCat = await Cat.findOne({ order: sequelize.random() });
      const catUser = await CatUser.findByPk(randomCat.id);
      user = catUser.userId;
    } while (user === randomUser.id);

    await Favorite.create({
      userId: randomUser.id,
      catId: randomCat.id,
    });
  }
};

const generateAdoptionRequests = async (numRequests, users) => {
  for (let i = 0; i < numRequests; i++) {
    const randomIndex = helperData.randomInt(0, users.length - 1);
    const randomUser = users[randomIndex];

    let randomCat, user;
    do {
      randomCat = await Cat.findOne({ order: sequelize.random() });
      const catUser = await CatUser.findByPk(randomCat.id);
      user = catUser.userId;
    } while (user === randomUser.id);

    const adoptionRequest = await AdoptionRequest.create({
      catId: randomCat.id,
      message: "I would like to adopt this cat.",
      status: "pending",
    });

    await UserRole.create({
      userId: randomUser.id,
      adoptionRequestId: adoptionRequest.id,
      role: "sender",
      isRead: true,
    });
    await UserRole.create({
      userId: user,
      adoptionRequestId: adoptionRequest.id,
      role: "receiver",
      isRead: false,
    });
  }
};

const processAdoptionRequests = async (numRequests) => {
  for (let i = 0; i < numRequests; i++) {
    const adoptionRequest = await AdoptionRequest.findOne({
      where: { status: "pending" },
    });

    adoptionRequest.status =
      helperData.randomInt(0, 1) === 0 ? "accepted" : "declined";
    await adoptionRequest.save();

    const sender = await UserRole.findOne({
      where: { adoptionRequestId: adoptionRequest.id, role: "sender" },
    });

    const receiverRole = await UserRole.findOne({
      where: { adoptionRequestId: adoptionRequest.id, role: "receiver" },
    });
    receiverRole.isRead = true;
    await receiverRole.save();
    const receiver = await User.findByPk(receiverRole.userId);

    if (adoptionRequest.status === "accepted") {
      const otherRequests = await AdoptionRequest.findAll({
        where: { catId: adoptionRequest.catId, status: "pending" },
      });
      if (otherRequests.length > 0) {
        for (const request of otherRequests) {
          request.status = "declined";
          await request.save();
        }
      }
      const user = await User.findByPk(sender.userId);
      const cat = await Cat.findByPk(adoptionRequest.catId);
      const catUser = await CatUser.findByPk(cat.id);
      const address = await Address.findOne({ where: { userId: receiver.id } });
      adoptionRequest.addressId = address.id;
      cat.status = "adopted";
      catUser.ownerId = user.id;
      await adoptionRequest.save();
      await catUser.save();
      await cat.save();
    }
  }
};

const emptyDatabase = () => {
  Token.destroy({ truncate: true });
  UserInfo.destroy({ truncate: true });
  UserRole.destroy({ truncate: true });
  AdoptionRequest.destroy({ truncate: true });
  Favorite.destroy({ truncate: true });
  CatUser.destroy({ truncate: true });
  Image.findAll().then((images) => {
    for (const image of images) {
      fileHelper.deleteImage(image, "uploads", null);
    }
  });
  Cat.destroy({ truncate: true });
  PasswordHistory.destroy({ truncate: true });
  RefreshToken.destroy({ truncate: true });
  Address.destroy({ truncate: true });
  User.destroy({ truncate: true });
  AgeType.destroy({ truncate: true });
  Breed.findAll().then((breeds) => {
    for (const breed of breeds) {
      fileHelper.deleteImage(breed, "breeds", null);
    }
  });

  logger("Database emptied");
};

const generateData = async () => {
  try {
    emptyDatabase();
    await addAgeTypesToDatabase();
    await breedInit.fetchCatBreeds();
    await adminInit.initializeAdmin();
    await breedInit.addBreedsToDatabase();
    const users = await generateUsers(25);
    await generateCats(300, users);
    await generateFavorite(150, users);
    await generateAdoptionRequests(200, users);
    await processAdoptionRequests(120);
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
