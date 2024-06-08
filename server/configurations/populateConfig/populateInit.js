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
    return [];
  }
};

const fetchCountryPositions = async () => {
  try {
    const response = await axios.get(
      "https://countriesnow.space/api/v0.1/countries/positions",
    );
    return response.data.data;
  } catch (error) {
    logger.error(error);
    return [];
  }
};

const findPosition = (countryName, countryPositionMap) => {
  if (countryPositionMap.has(countryName)) {
    return countryPositionMap.get(countryName);
  }

  for (const [key, value] of countryPositionMap.entries()) {
    if (key.startsWith(countryName)) {
      return value;
    }
  }

  return null;
};

const populateDatabase = async () => {
  const countriesAndCities = await fetchCountriesAndCities();
  const countryPositions = await fetchCountryPositions();

  const countryPositionMap = new Map();
  for (const country of countryPositions) {
    countryPositionMap.set(country.name, {
      lat: country.lat,
      long: country.long,
    });
  }

  countryPositionMap.set("Kosovo", { lat: 42.6026, long: 20.903 });
  countriesAndCities.sort((a, b) => a.country.localeCompare(b.country));
  for (const countryData of countriesAndCities) {
    countryData.cities.sort((a, b) => a.localeCompare(b));
  }

  for (const countryData of countriesAndCities) {
    const position =
      findPosition(countryData.country, countryPositionMap) || {};
    const country = await Country.create({
      name: countryData.country,
      lat: position.lat || null,
      long: position.long || null,
    });

    for (const cityName of countryData.cities) {
      await City.create({ name: cityName, countryId: country.id });
    }
  }
};

module.exports = { populateDatabase };
