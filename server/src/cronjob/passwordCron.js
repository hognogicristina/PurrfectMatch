const cron = require("node-cron");
const { Op } = require("sequelize");
const { User, PasswordHistory } = require("../../models");
const logger = require("../../log/logger");

const setupPasswordCronJob = () => {
  cron.schedule("0 0 * * 0", async () => {
    try {
      logger("Running a weekly check to delete old password records");
      const daysToKeep = 30;
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - daysToKeep);

      const oldPasswordRecords = await PasswordHistory.findAll({
        where: {
          createdAt: {
            [Op.lt]: dateThreshold,
          },
        },
      });

      if (oldPasswordRecords.length > 0) {
        for (const record of oldPasswordRecords) {
          const user = await User.findByPk(record.userId);
          if (record.password !== user.password) {
            await record.destroy();
          }
        }
        logger("Old password records deleted successfully");
      } else {
        logger("No old password records found");
      }
    } catch (error) {
      logger.error(error);
    }
  });
};

module.exports = setupPasswordCronJob;
