const { Country, City } = require("../../../models");
const logger = require("../../../logger/logger");

const getAllCountries = async (req, res) => {
  try {
    const countries = await Country.findAll();
    res.status(200).json({ data: countries });
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const getCitiesByCountry = async (req, res) => {
  try {
    const cities = await City.findAll({
      where: { countryId: req.params.countryId },
    });
    res.status(200).json({ data: cities });
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

module.exports = { getAllCountries, getCitiesByCountry };
