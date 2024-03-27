const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const { User, PasswordHistory } = require("../../models");
const { sequelize } = require("../../models");
const logger = require("../../logger/logger");

sequelize.options.logging = (message) => {
  logger.sql(message);
};

const initializeAdmin = async () => {
  try {
    const count = await User.count();
    if (count === 0) {
      const adminData = fs.readFileSync(
        path.join(__dirname, "admin.json"),
        "utf8",
      );
      const adminUser = JSON.parse(adminData);
      const adminDetails = adminUser.admin;

      const hashedPassword = await bcrypt.hash(adminDetails.password, 10);
      const user = await User.create({
        firstName: adminDetails.firstName,
        lastName: adminDetails.lastName,
        username: adminDetails.username,
        password: hashedPassword,
        email: adminDetails.email,
        birthday: adminDetails.birthday,
        description: adminDetails.description,
        hobbies: adminDetails.hobbies,
        experienceLevel: adminDetails.experienceLevel,
        role: adminDetails.role,
        status: adminDetails.status,
      });
      await PasswordHistory.create({
        userId: user.id,
        password: hashedPassword,
      });
      logger("Admin user created");
    } else {
      logger("Admin user already exists");
    }
  } catch (error) {
    logger.error(error);
  }
};

initializeAdmin();
