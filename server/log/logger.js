const fs = require("fs");
const path = require("path");
const logFilePath = path.join(__dirname, "app.local.log");

const logger = (message) => {
  const logMessage = `${message}\n`;

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });
};

logger.error = (message, error) => {
  const errorMessage = `${message}: ${error}\n`;

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
