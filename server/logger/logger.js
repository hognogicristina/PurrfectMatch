const fs = require("fs");
const path = require("path");
const logFilePathSuccess = path.join(__dirname, "logs", "success.local.log");
const logFilePathError = path.join(__dirname, "logs", "error.local.log");
const logFilePathSql = path.join(__dirname, "logs", "sql.local.log");

const logger = (message) => {
  const logMessage = `${message}\n`;

  fs.appendFile(logFilePathSuccess, logMessage, (err) => {
    if (err) {
      console.error("Error writing to logger file:", err);
    }
  });
};

logger.error = (error) => {
  const errorMessage = `${error}\n`;

  fs.appendFile(logFilePathError, errorMessage, (err) => {
    if (err) {
      console.error("Error writing to logger file:", err);
    }
  });
};

logger.sql = (message) => {
  const logMessage = `${message}\n`;

  fs.appendFile(logFilePathSql, logMessage, (err) => {
    if (err) {
      console.error("Error writing to logger file:", err);
    }
  });
};

module.exports = logger;
