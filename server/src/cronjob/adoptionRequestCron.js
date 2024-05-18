const cron = require("node-cron");
const { Op } = require("sequelize");
const { AdoptionRequest, UserRole } = require("../../models");
const logger = require("../../logger/logger");

const setupAdoptionRequestCronJob = () => {
  cron.schedule("0 0 * * 0", async () => {
    try {
      logger("Running a weekly check to delete old adoption requests");
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

      if (adoptionRequests.length > 0) {
        for (const record of adoptionRequests) {
          const userRoles = await UserRole.findAll({
            where: { adoptionRequestId: record.id },
          });

          if (userRoles.length > 0) {
            await userRoles.destroy();
          }

          await record.destroy();
        }
        logger("Old adoption requests deleted successfully");
      } else {
        logger("No old adoption requests found");
      }
    } catch (error) {
      logger.error(error);
    }
  });
};

module.exports = setupAdoptionRequestCronJob;
