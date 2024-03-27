const cron = require("node-cron");
const { Op } = require("sequelize");
const { AdoptionRequest, UserRole } = require("../../models");

const setupAdoptionRequestCronJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      console.log("Running a weekly check to delete old adoption requests");
      const daysToKeep = 30;
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - daysToKeep);

      const adoptionRequests = await AdoptionRequest.findAll({
        where: {
          updatedAt: {
            [Op.lt]: dateThreshold,
          },
        },
      });

      if (adoptionRequests.length === 0) {
        console.log("No old adoption requests found");
        return;
      }

      for (const record of adoptionRequests) {
        const userRoles = await UserRole.findAll({
          where: { mailId: record.id },
        });

        if (userRoles.length > 0) {
          await userRoles.destroy();
        }

        await record.destroy();
      }

      console.log("Old adoption requests deleted successfully");
    } catch (error) {
      console.error(
        "Error occurred while deleting old adoption requests: ",
        error,
      );
    }
  });
};

module.exports = setupAdoptionRequestCronJob;
