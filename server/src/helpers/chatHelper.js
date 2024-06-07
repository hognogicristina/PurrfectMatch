const { ChatSession, User, Message } = require("../../models");
const crypto = require("crypto");
const { Op } = require("sequelize");
const chatDTO = require("../dto/chatDTO");
const { el } = require("@faker-js/faker");

const generateUniqueChatSessionCode = async () => {
  let unique = false;
  let code;
  while (!unique) {
    code = crypto.randomBytes(4).toString("hex");
    const existingSession = await ChatSession.findOne({ where: { code } });
    if (!existingSession) {
      unique = true;
    }
  }
  return code;
};

const chatSessionExist = async (currentUser, otherUser) => {
  const userMessages = await Message.findAll({
    where: { userId: currentUser.id },
    order: [["createdAt", "DESC"]],
  });

  if (userMessages.length === 0) {
    return null;
  }

  let chatSessionId = null;
  for (const message of userMessages) {
    const matchingMessages = await Message.findAll({
      where: {
        chatSessionId: message.chatSessionId,
        userId: otherUser.id,
      },
    });

    if (matchingMessages.length > 0) {
      return await ChatSession.findByPk(message.chatSessionId);
    } else {
      chatSessionId = message.chatSessionId;
    }
  }

  return null;
};

const chatSessionsForUser = async (currentUser) => {
  const messages = await Message.findAll({
    where: {
      userId: currentUser.id,
    },
    group: ["chatSessionId"],
  });
  const chatSessionIds = messages.map((message) => message.chatSessionId);

  const sessions = await ChatSession.findAll({
    where: {
      id: chatSessionIds,
    },
  });

  const chatSessions = [];
  for (const session of sessions) {
    const otherUserMessage = await Message.findOne({
      where: {
        chatSessionId: session.id,
        userId: {
          [Op.ne]: currentUser.id,
        },
      },
    });

    const otherUserId = otherUserMessage ? otherUserMessage.userId : null;
    const otherUser = await User.findByPk(otherUserId);

    const chatSessionDTO = await chatDTO.transformChatSessionsToDTO(
      session,
      currentUser,
      otherUser,
    );

    chatSessions.push(chatSessionDTO);
  }
  chatSessions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return chatSessions;
};

module.exports = {
  generateUniqueChatSessionCode,
  chatSessionExist,
  chatSessionsForUser,
};
