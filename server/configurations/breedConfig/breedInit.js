const path = require("path");
const fs = require("fs");
const axios = require("axios");
const { Breed } = require("../../models");
const fileHelper = require("../../src/helpers/fileHelper");
const logger = require("../../logger/logger");

const fetchCatBreeds = async () => {
  try {
    const filePath = path.join(__dirname, "breeds.json");
    if (fs.existsSync(filePath)) {
      logger("Breeds.json already exists");
    } else {
      const response = await axios.get("https://api.thecatapi.com/v1/breeds");
      const breeds = response.data.map((breed) => breed.name);
      const jsonContent = JSON.stringify(breeds, null, 2);
      fs.writeFileSync(filePath, jsonContent);
      logger("Breeds written to breeds.json");
    }
  } catch (error) {
    logger.error(error);
  }
};

const getBreedImageFile = async (breed) => {
  const catBreedFilename = breed.replace(/ /g, "_") + ".jpg";
  const relativePath = path.join(
    __dirname,
    "..",
    "downloads",
    "cat_breeds",
    catBreedFilename,
  );
  return await fileHelper.getFile(relativePath, catBreedFilename);
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

      await Breed.create({
        name: breed,
        filename: newBreeds.filename,
        filetype: newBreeds.extension.replace(".", ""),
        filesize: newBreeds.filesize,
        url: newBreeds.url,
        uri: newBreeds.uri,
      });
    }
    if (count === 0) {
      logger("All breeds added to the database");
    } else {
      logger("Breeds already exist in the database");
    }
  } catch (error) {
    logger.error(error);
  }
};

module.exports = { fetchCatBreeds, addBreedsToDatabase };
