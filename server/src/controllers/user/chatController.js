const { ChatSession, Message, User, Image } = require("../../../models");
const chatValidator = require("../../validators/chatValidator");
const chatDTO = require("../../dto/chatDTO");
const userDTO = require("../../dto/userDTO");
const logger = require("../../../logger/logger");
const { Op, Sequelize } = require("sequelize");

const getInbox = async (req, res) => {
  try {
    if (await chatValidator.checkSessionExists(req, res)) return;
    const userId = req.user.id;
    const sessions = await ChatSession.findAll({
      where: {
        [Op.or]: [{ userId1: userId }, { userId2: userId }],
      },
    });

    const chatSessions = [];
    for (const session of sessions) {
      const chatSessionDTO = await chatDTO.transformChatSessionsToDTO(
        session,
        userId,
      );

      chatSessions.push(chatSessionDTO);
    }
    chatSessions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const user = await User.findByPk(req.user.id);
    const userDetails = await userDTO.userToDTO(user);
    return res
      .status(200)
      .json({ data: chatSessions, userDetails: userDetails });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal server error" }] });
  }
};

const getChatSession = async (req, res) => {
  try {
    if (await chatValidator.checkChatSessionExists(req, res)) return;
    const userId = req.user.id;
    const receiverId = req.params.id;

    const session = await ChatSession.findOne({
      where: {
        [Op.or]: [
          { userId1: userId, userId2: receiverId },
          { userId1: receiverId, userId2: userId },
        ],
      },
    });

    const messages = await Message.findAll({
      where: { chatSessionId: session.id, userId: userId },
      order: [["createdAt", "DESC"]],
    });

    for (const message of messages) {
      message.isRead = true;
      await message.save();
    }

    const chatMessages = [];
    for (const message of messages) {
      const chatMessageDTO = await chatDTO.transformChatMessagesToDTO(
        session,
        message,
        userId,
      );
      chatMessages.push(chatMessageDTO);
    }
    return res.status(200).json({ data: chatMessages });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal server error" }] });
  }
};

const searchUser = async (req, res) => {
  try {
    if (await chatValidator.checkSearchUsersExist(req, res)) return;
    const { user } = req.query;
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

    const usersDTO = [];
    for (const user of users) {
      usersDTO.push(await userDTO.userListToDTO(user));
    }

    return res.status(200).json({ data: usersDTO });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal server error" }] });
  }
};

const sendMessage = async (req, res) => {
  try {
    if (await chatValidator.checkChatSessionExists(req, res)) return;
    const message = req.body.message;
    const userId = req.user.id;
    const receiverId = req.params.id;

    const session = await ChatSession.findOne({
      where: {
        [Op.or]: [
          { userId1: userId, userId2: receiverId },
          { userId1: receiverId, userId2: userId },
        ],
      },
    });

    let chatSession, chatMessage, newMessage;
    if (!session) {
      const newSession = await ChatSession.create({
        userId1: userId,
        userId2: receiverId,
      });
      chatSession = await chatDTO.transformChatSessionsToDTO(
        newSession,
        userId,
      );
      newMessage = await Message.create({
        chatSessionId: newSession.id,
        userId: userId,
        message: message,
        role: "sender",
        isRead: true,
      });
      await Message.create({
        chatSessionId: newSession.id,
        userId: receiverId,
        message: message,
        role: "receiver",
        isRead: false,
      });

      chatMessage = await chatDTO.transformChatMessagesToDTO(
        newSession,
        newMessage,
        userId,
      );

      return res
        .status(201)
        .json({ message: chatMessage, session: chatSession });
    } else {
      newMessage = await Message.create({
        chatSessionId: session.id,
        userId: userId,
        message: message,
        role: "sender",
        isRead: true,
      });
      await Message.create({
        chatSessionId: session.id,
        userId: receiverId,
        message: message,
        role: "receiver",
        isRead: false,
      });

      const newSession = await ChatSession.findOne({
        where: {
          [Op.or]: [
            { userId1: userId, userId2: receiverId },
            { userId1: receiverId, userId2: userId },
          ],
        },
      });
      chatSession = await chatDTO.transformChatSessionsToDTO(
        newSession,
        userId,
      );

      return res
        .status(201)
        .json({ message: newMessage, session: chatSession });
    }
  } catch (error) {
    console.log(error);
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal server error" }] });
  }
};

module.exports = {
  getInbox,
  getChatSession,
  searchUser,
  sendMessage,
};
