const cron = require("node-cron");
const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");
const { Image } = require("../../models");
const logger = require("../../logger/logger");

const TEMP_UPLOADS_FOLDER = "public/temporary-uploads";
const IMAGE_MOVE_THRESHOLD = 12 * 60 * 60 * 1000;

const setupImageCronJob = () => {
  cron.schedule("0 */3 * * *", async () => {
    try {
      logger("Running a cron job to cleanup temporary images.");
      const images = await Image.findAll({
        where: {
          uri: {
            [Op.startsWith]: "public://temporary-uploads/",
          },
          createdAt: {
            [Op.lt]: new Date(new Date() - IMAGE_MOVE_THRESHOLD),
          },
        },
      });

      if (images.length > 0) {
        for (const image of images) {
          const imagePath = path.join(TEMP_UPLOADS_FOLDER, image.filename);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
          await image.destroy();
        }
        logger("Temporary images cleanup completed.");
      } else {
        logger("No temporary images to cleanup.");
      }
    } catch (error) {
      logger.error(error);
    }
  });
};

module.exports = setupImageCronJob;
