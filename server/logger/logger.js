const fs = require("fs");
const path = require("path");
const logsDirectory = path.join(__dirname, "logs");
const logFilePathSuccess = path.join(__dirname, "logs", "success.local.log");
const logFilePathError = path.join(__dirname, "logs", "error.local.log");
const logFilePathSql = path.join(__dirname, "logs", "sql.local.log");

const ensureLogsDirectoryExists = () => {
  if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory);
  }
};

const getCurrentTimestamp = () => {
  const now = new Date();
  const day = now.getDate().toString().padStart(2, "0");
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const year = now.getFullYear();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const logger = (message) => {
  ensureLogsDirectoryExists();
  const logMessage = `${getCurrentTimestamp()} - ${message}\n`;

  fs.appendFile(logFilePathSuccess, logMessage, (err) => {
    if (err) {
      console.error("Error writing to logger file:", err);
    }
  });
};

logger.error = (error) => {
  ensureLogsDirectoryExists();
  const errorMessage = `${getCurrentTimestamp()} - ${error}\n`;

  fs.appendFile(logFilePathError, errorMessage, (err) => {
    if (err) {
      console.error("Error writing to logger file:", err);
    }
  });
};

logger.sql = (message) => {
  ensureLogsDirectoryExists();
  const cleanedMessage = message.replace("Executing (default): ", "");

  if (/^\s*(SELECT|INSERT|UPDATE|DELETE)/i.test(cleanedMessage)) {
    const logMessage = `${getCurrentTimestamp()} - ${cleanedMessage}\n`;

    fs.appendFile(logFilePathSql, logMessage, (err) => {
      if (err) {
        console.error("Error writing to logger file:", err);
      }
    });
  }
};

module.exports = { logger };
