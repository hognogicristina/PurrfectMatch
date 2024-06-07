const { ChatSession, User, Message } = require("../../models");
const validator = require("validator");
const { Op, Sequelize } = require("sequelize");
const chatHelper = require("../helpers/chatHelper");

const checkSessionExists = async (req, res) => {
  const userId = req.user.id;
  const messages = await Message.findAll({
    where: {
      userId: userId,
    },
    group: ["chatSessionId"],
  });
  const chatSessionIds = messages.map((message) => message.chatSessionId);

  const sessions = await ChatSession.findAll({
    where: {
      id: chatSessionIds,
    },
  });

  if (sessions.length === 0) {
    return res
      .status(404)
      .json({ error: [{ field: "chat", message: "No Chat Found" }] });
  }

  return null;
};

const checkChatSessionExists = async (req, res) => {
  const userId = req.user.id;
  const otherUserId = req.params.id;
  const currentUser = await User.findByPk(userId);
  const otherUser = await User.findByPk(otherUserId);

  if (!otherUser) {
    return res
      .status(404)
      .json({ error: [{ field: "otherUser", message: "User not found" }] });
  }

  if (req.method === "GET") {
    const session = await chatHelper.chatSessionExist(currentUser, otherUser);

    if (!session) {
      return res.status(404).json({
        error: [{ field: "chatSession", message: "Chat session not found" }],
      });
    } else {
      const userMessages = await Message.findAll({
        where: { userId: currentUser.id },
        order: [["createdAt", "DESC"]],
      });

      let chatSessionId = null;
      for (const message of userMessages) {
        const matchingMessages = await Message.findAll({
          where: {
            chatSessionId: message.chatSessionId,
            userId: otherUser.id,
          },
        });

        if (matchingMessages.length > 0) {
          chatSessionId = matchingMessages[0].chatSessionId;
        } else {
          chatSessionId = message.chatSessionId;
        }
      }
    }
  }

  if (req.method === "POST") {
    const message = req.body.message;

    if (!message || validator.isEmpty(message)) {
      return res.status(400).json({
        error: [{ field: "message", message: "Message is required" }],
      });
    }
  }

  return null;
};

const checkSearchUsersExist = async (req, res) => {
  const { user } = req.query;

  if (!user || validator.isEmpty(user)) {
    return res
      .status(400)
      .json({ error: [{ field: "query", message: "Query is required" }] });
  } else {
    const users = await User.findAll({
      where: {
        [Op.or]: [
          Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("firstName")),
            "LIKE",
            `%${user.toLowerCase()}%`,
          ),
          Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("lastName")),
            "LIKE",
            `%${user.toLowerCase()}%`,
          ),
        ],
      },
    });

    if (users.length === 0) {
      return res
        .status(404)
        .json({ error: [{ field: "users", message: "No Users Found" }] });
    }
  }

  return null;
};

const checkMessageExists = async (req, res) => {
  const messageId = req.params.id;
  const userId = req.user.id;
  const message = await Message.findByPk(messageId);

  if (!message) {
    return res
      .status(404)
      .json({ error: [{ field: "message", message: "Message not found" }] });
  }

  if (message.userId !== userId) {
    return res
      .status(403)
      .json({ error: [{ field: "message", message: "Unauthorized" }] });
  }

  return null;
};

module.exports = {
  checkSessionExists,
  checkChatSessionExists,
  checkSearchUsersExist,
  checkMessageExists,
};
