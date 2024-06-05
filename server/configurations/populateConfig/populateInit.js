const axios = require("axios");
const { City, Country } = require("../../models");
const logger = require("../../logger/logger");

const fetchCountriesAndCities = async () => {
  try {
    const response = await axios.get(
      "https://countriesnow.space/api/v0.1/countries",
    );
    return response.data.data;
  } catch (error) {
    logger.error(error);
  }
};

const populateDatabase = async () => {
  const countriesAndCities = await fetchCountriesAndCities();

  countriesAndCities.sort((a, b) => a.country.localeCompare(b.country));
  for (const countryData of countriesAndCities) {
    countryData.cities.sort((a, b) => a.localeCompare(b));
  }

  for (const countryData of countriesAndCities) {
    const country = await Country.create({ name: countryData.country });

    for (const cityName of countryData.cities) {
      await City.create({ name: cityName, countryId: country.id });
    }
  }
};

module.exports = { populateDatabase };
