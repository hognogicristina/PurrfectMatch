const { Server } = require("ws");
const logger = require("./logger/logger");

let wss;

const setupWebSocket = (server) => {
  wss = new Server({ server });

  wss.on("connection", (ws) => {
    logger("Client connected");
    ws.on("message", (message) => {
      logger("received: %s", message);
      ws.userId = JSON.parse(message).userId;
    });
    ws.on("close", () => {
      logger("Client disconnected");
    });
  });
};

const notifyClients = (message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === 1 && client.userId === message.userId) {
      client.send(JSON.stringify(message));
    }
  });
};

module.exports = { setupWebSocket, notifyClients };
