const path = require("path");
const fs = require("fs");
const axios = require("axios");
const { Breed, sequelize } = require("../../models");
const fileHelper = require("../../src/helpers/fileHelper");
const logger = require("../../logger/logger");

sequelize.options.logging = (message) => {
  logger.sql(message);
};

const fetchCatBreeds = async () => {
  try {
    const response = await axios.get("https://api.thecatapi.com/v1/breeds");

    if (response.status === 200) {
      const breeds = response.data.map((breed) => breed.name);
      const jsonContent = JSON.stringify(breeds, null, 2);

      const filePath = path.join(__dirname, "breeds.json");
      fs.writeFileSync(filePath, jsonContent);
      logger("Cat breeds written to breeds.json file successfully.");
    } else {
      logger.error("Failed to fetch cat breeds:", response.statusText);
    }
  } catch (error) {
    logger.error(error);
  }
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

module.exports = { fetchCatBreeds, addBreedsToDatabase };
