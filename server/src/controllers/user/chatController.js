const { ChatSession, Message, User, Image } = require("../../../models");
const chatValidator = require("../../validators/chatValidator");
const chatDTO = require("../../dto/chatDTO");
const userDTO = require("../../dto/userDTO");
const chatHelper = require("../../helpers/chatHelper");
const logger = require("../../../logger/logger");
const { Op, Sequelize } = require("sequelize");
const websocket = require("../../../websocket");

const getInbox = async (req, res) => {
  try {
    if (await chatValidator.checkSessionExists(req, res)) return;
    const userId = req.user.id;
    const currentUser = await User.findByPk(userId);
    const chatSessions = await chatHelper.chatSessionsForUser(currentUser);
    const userDetails = await userDTO.userToDTO(currentUser);
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
    const otherUserId = req.params.id;

    const currentUser = await User.findByPk(userId);
    const otherUser = await User.findByPk(otherUserId);
    const session = await chatHelper.chatSessionExist(currentUser, otherUser);

    const messages = await Message.findAll({
      where: { chatSessionId: session.id, userId: userId },
      order: [["createdAt", "DESC"]],
    });

    for (const message of messages) {
      if (message.userId === currentUser.id) {
        message.isRead = true;
        await message.save();
      }
    }

    const chatMessages = [];
    for (const message of messages) {
      const chatMessageDTO = await chatDTO.transformChatMessagesToDTO(
        message,
        currentUser,
        otherUser,
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
          Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("username")),
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

    const sender = await User.findByPk(userId);
    const receiver = await User.findByPk(receiverId);
    const session = await chatHelper.chatSessionExist(sender, receiver);

    if (session) {
      const chatMessageSender = await Message.create({
        chatSessionId: session.id,
        userId: sender.id,
        textMsg: message,
        role: "sender",
        isRead: true,
      });

      const chatSessionSender = await chatDTO.transformChatSessionsToDTO(
        session,
        sender,
        receiver,
      );

      const chatMessageSenderDTO = await chatDTO.transformChatMessagesToDTO(
        chatMessageSender,
        sender,
        receiver,
      );

      const chaSessionsForSender = await chatHelper.chatSessionsForUser(sender);

      websocket.notifyClients({
        type: "NEW_CHAT_MESSAGE",
        userId: sender.id,
        payload: {
          session: chatSessionSender,
          message: chatMessageSenderDTO,
          allSession: chaSessionsForSender,
          role: "sender",
          customMessage: "Message sent",
        },
      });

      const chatMessageReceiver = await Message.create({
        chatSessionId: session.id,
        userId: receiver.id,
        textMsg: message,
        role: "receiver",
        isRead: false,
      });

      const chatSessionReceiver = await chatDTO.transformChatSessionsToDTO(
        session,
        receiver,
        sender,
      );

      const chatMessageReceiverDTO = await chatDTO.transformChatMessagesToDTO(
        chatMessageReceiver,
        receiver,
        sender,
      );

      const chaSessionsForReceiver =
        await chatHelper.chatSessionsForUser(receiver);

      websocket.notifyClients({
        type: "NEW_CHAT_MESSAGE",
        userId: receiver.id,
        payload: {
          session: chatSessionReceiver,
          message: chatMessageReceiverDTO,
          allSession: chaSessionsForReceiver,
          role: "receiver",
          customMessage: `${sender.username} sent you a message`,
        },
      });

      return res.status(201).json({
        message: chatMessageSenderDTO,
        session: chatSessionSender,
        updatedSessions: chaSessionsForSender,
      });
    } else {
      const uniqueCode = await chatHelper.generateUniqueChatSessionCode();
      const newSession = await ChatSession.create({ code: uniqueCode });

      const chatMessageSender = await Message.create({
        chatSessionId: newSession.id,
        userId: userId,
        textMsg: message,
        role: "sender",
        isRead: true,
      });

      const chatMessageReceiver = await Message.create({
        chatSessionId: newSession.id,
        userId: receiver.id,
        textMsg: message,
        role: "receiver",
        isRead: false,
      });

      const chatSessionSender = await chatDTO.transformChatSessionsToDTO(
        newSession,
        sender,
        receiver,
      );

      const chatSessionReceiver = await chatDTO.transformChatSessionsToDTO(
        newSession,
        receiver,
        sender,
      );

      const chatMessageSenderDTO = await chatDTO.transformChatMessagesToDTO(
        chatMessageSender,
        sender,
        receiver,
      );

      const chatMessageReceiverDTO = await chatDTO.transformChatMessagesToDTO(
        chatMessageReceiver,
        receiver,
        sender,
      );

      const chaSessionsForSender = await chatHelper.chatSessionsForUser(sender);
      const chaSessionsForReceiver =
        await chatHelper.chatSessionsForUser(receiver);

      websocket.notifyClients({
        type: "NEW_CHAT_MESSAGE",
        userId: sender.id,
        payload: {
          session: chatSessionSender,
          message: chatMessageSenderDTO,
          allSession: chaSessionsForSender,
          role: "sender",
          customMessage: "Message sent",
        },
      });

      websocket.notifyClients({
        type: "NEW_CHAT_MESSAGE",
        userId: receiver.id,
        payload: {
          session: chatSessionReceiver,
          message: chatMessageReceiverDTO,
          allSession: chaSessionsForReceiver,
          role: "receiver",
          customMessage: `${sender.username} sent you a message`,
        },
      });

      return res.status(201).json({
        message: chatMessageSenderDTO,
        session: chatSessionSender,
        updatedSessions: chaSessionsForSender,
      });
    }
  } catch (error) {
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
