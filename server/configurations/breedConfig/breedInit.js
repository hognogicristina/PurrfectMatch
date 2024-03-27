const fs = require("fs");
const path = require("path");
const { Breed } = require("../../models");
const { sequelize } = require("../../models");
const logger = require("../../log/logger");

sequelize.options.logging = (message) => {
  logger.sql(message);
};

async function addBreedsToDatabase() {
  try {
    const count = await Breed.count();
    const breedData = fs.readFileSync(
      path.join(__dirname, "breeds.json"),
      "utf8",
    );
    const breeds = JSON.parse(breedData);

    if (count === 0) {
      for (const breed of breeds) {
        await Breed.create({
          name: breed,
        });
      }
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
  } catch (error) {
    logger.error(error);
  }
}

addBreedsToDatabase();
