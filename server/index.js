const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const websocket = require("./websocket");

dotenv.config({
  path: path.resolve(__dirname, "./.env"),
  override: true,
});

dotenv.config({
  path: path.resolve(__dirname, "./.env.local"),
  override: true,
});

const { sequelize } = require("./models");
const routes = require("./src/routes/routes");
const setupAdoptionRequestCronJob = require("./src/cronjob/adoptionRequestCron");
const setupPasswordCronJob = require("./src/cronjob/passwordcron");
const setupImageCronJob = require("./src/cronjob/imageCron");

const logger = require("./logger/logger");
const app = express();

sequelize.options.logging = (message) => {
  logger.sql(message);
};

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/", routes);
app.use("/uploads", express.static("public/uploads"));
app.use("/breeds", express.static("public/breeds"));

setupAdoptionRequestCronJob();
setupPasswordCronJob();
setupImageCronJob();

const PORT = 3000;

const startApp = () => {
  try {
    sequelize.sync();
    logger("Database connected and models synced!");

    const server = app.listen(PORT, () => {
      logger(`Server is running at http://localhost:${PORT}`);
    });

    websocket.setupWebSocket(server);
  } catch (error) {
    logger.error(error);
  }
};

startApp();
