const cron = require("node-cron");
const { Op } = require("sequelize");
const { User, PasswordHistory } = require("../../models");

const setupPasswordCronJob = () => {
  cron.schedule("0 0 * * 0", async () => {
    try {
      console.log("Running a weekly check to delete old password records");
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

      if (oldPasswordRecords.length === 0) {
        console.log("No old password records found");
        return;
      }

      for (const record of oldPasswordRecords) {
        const user = await User.findByPk(record.userId);
        if (record.password !== user.password) {
          await record.destroy();
        }
      }

      console.log("Old password records deleted successfully");
    } catch (error) {
      console.error(
        "Error occurred while deleting old password records: ",
        error,
      );
    }
  });
};

module.exports = setupPasswordCronJob;
