const fs = require("fs");
const path = require("path");
const logFilePath = path.join(__dirname, "app.local.log");

const logger = (message) => {
  const logMessage = `SUCCESS: ${message}\n`;

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });
};

logger.error = (error) => {
  const errorMessage = `ERROR: ${error}\n`;

  fs.appendFile(logFilePath, errorMessage, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });
};

logger.sql = (message) => {
  const logMessage = `SQL: ${message}\n`;

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });
};

module.exports = logger;
