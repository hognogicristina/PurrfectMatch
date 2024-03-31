const fs = require("fs");
const path = require("path");
const { Breed, sequelize } = require("../../models");
const fileHelper = require("../../src/helpers/fileHelper");
const logger = require("../../logger/logger");

sequelize.options.logging = (message) => {
  logger.sql(message);
};

const getBreedImageFile = async (breed) => {
  const catBreedFilename = breed.replace(/ /g, "_") + ".jpg";
  const relativePath = `../downloads/cat_breeds/${catBreedFilename}`;
  const absolutePath = path.resolve(__dirname, relativePath);

  if (!fs.existsSync(absolutePath)) {
    logger.error(`Image file not found for breed: ${breed}`);
    return null;
  }
  const fileBuffer = fs.readFileSync(absolutePath);

  return {
    fieldname: "file",
    originalname: catBreedFilename,
    encoding: "7bit",
    mimetype: "multipart/form-data",
    buffer: fileBuffer,
    size: fileBuffer.length,
  };
};

const addBreedsToDatabase = async () => {
  try {
    const count = await Breed.count();
    const breedData = fs.readFileSync(
      path.join(__dirname, "breeds.json"),
      "utf8",
    );
    const breeds = JSON.parse(breedData);
    for (const breed of breeds) {
      // Get image file for the current breed
      const file = await getBreedImageFile(breed);

      const newBreeds = await fileHelper.saveImageFile(file, "breeds");

      if (count === 0) {
        await Breed.create({
          name: breed,
          filename: newBreeds.filename,
          filetype: newBreeds.extension.replace(".", ""),
          filesize: newBreeds.filesize,
          url: newBreeds.url,
        });

        logger("All breeds added successfully!");
      } else {
        const existingBreeds = await Breed.findAll({ attributes: ["name"] });
        const existingBreedNames = existingBreeds.map((b) => b.name);

        const newBreeds = breeds.filter(
          (breed) => !existingBreedNames.includes(breed),
        );

        if (newBreeds.length > 0) {
          for (const breed of newBreeds) {
            await Breed.create({ name: breed });
            logger(`Added ${breed} to the database.`);
          }
          logger("New breeds added successfully!");
        } else {
          logger("No new breeds to add.");
        }
      }
    }
  } catch (error) {
    logger.error(error);
  }
};

module.exports = { addBreedsToDatabase };
