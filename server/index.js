const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

require("dotenv").config({ path: "./.env" });
// Comment the line below if you want to use the .env file and not the .env.local file
require("dotenv").config({ path: "./.env.local", override: true });

const { sequelize } = require("./models");
const routes = require("./src/routes/routes");
const setupAdoptionRequestCronJob = require("./src/cronjob/adoptionRequestCron");
const setupPasswordCronJob = require("./src/cronjob/passwordcron");

const logger = require("./logger/logger");
const app = express();

sequelize.options.logging = (message) => {
  logger.sql(message);
};

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/", routes);
app.use("/uploads", express.static("public/uploads"));
app.use("/breeds", express.static("public/breeds"));

setupAdoptionRequestCronJob();
setupPasswordCronJob();

const PORT = process.env.PORT || 3000;

const startApp = () => {
  try {
    sequelize.sync();
    logger("Database connected and models synced!");

    app.listen(PORT, () => {
      logger(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error(error);
  }
};

startApp();
