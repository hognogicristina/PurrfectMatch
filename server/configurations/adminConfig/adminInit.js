const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");
const {
  User,
  PasswordHistory,
  Address,
  Token,
  UserInfo,
} = require("../../models");
const logger = require("../../logger/logger");

const generateAddress = async () => {
  const country = faker.location.country();
  const county = faker.location.county();
  const city = faker.location.city();
  const street = faker.location.street();
  const number = faker.location.buildingNumber();
  const floor = faker.number.int({ max: 20 });
  const apartment = faker.number.int({ max: 50 });
  const postalCode = faker.location.zipCode();

  return await Address.create({
    country: country,
    county: county,
    city: city,
    street: street,
    number: number,
    floor: floor,
    apartment: apartment,
    postalCode: postalCode,
  });
};

const initializeAdmin = async () => {
  try {
    const count = await User.count();
    const adminData = fs.readFileSync(
      path.join(__dirname, "admin.json"),
      "utf8",
    );
    const adminUser = JSON.parse(adminData);
    const adminDetails = adminUser.admin;
    const address = await generateAddress();

    const hashedPassword = await bcrypt.hash(adminDetails.password, 10);
    const user = await User.create({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      username: adminDetails.username,
      password: hashedPassword,
      email: adminDetails.email,
      addressId: address.id,
      role: adminDetails.role,
      status: adminDetails.status,
    });
    await UserInfo.create({
      userId: user.id,
      birthday: faker.date.anytime(),
    });
    await PasswordHistory.create({
      userId: user.id,
      password: hashedPassword,
    });

    if (count === 0) {
      logger("Admin user created");
    } else {
      logger("Admin user already exists");
    }
  } catch (error) {
    logger.error(error);
  }
};

module.exports = { generateAddress, initializeAdmin };
