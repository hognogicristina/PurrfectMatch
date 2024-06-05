const { Chat, User, Image } = require("../../../models");
const chatValidator = require("../../validators/chatValidator");
const chatDTO = require("../../dto/chatDTO");
const logger = require("../../../logger/logger");
const { Op } = require("sequelize");
const webSocket = require("../../../websocket");
const userDTO = require("../../dto/userDTO");

const getAllMessages = async (req, res) => {
  try {
    if (await chatValidator.allMessagesExistValidator(req, res)) return;
    const userId = req.user.id;
    const user = await User.findOne({ where: { id: userId } });
    const userDetails = await userDTO.userToDTO(user);

    const messages = await Chat.findAll({
      where: {
        [Op.or]: [{ receiverId: userId }, { senderId: userId }],
      },
      order: [["createdAt", "DESC"]],
    });

    const messageMap = new Map();
    for (const message of messages) {
      const pairKey = [message.senderId, message.receiverId].sort().join("-");
      if (!messageMap.has(pairKey)) {
        messageMap.set(pairKey, message);
      }
    }

    const lastMessages = Array.from(messageMap.values());
    const formattedMessages = await Promise.all(
      lastMessages.map((message) => chatDTO.chatToDTO(message, req.user)),
    );
    return res.status(200).json({ data: formattedMessages, userDetails });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const getMessagesWithUser = async (req, res) => {
  try {
    if (await chatValidator.messagesWithUserExistValidator(req, res)) return;

    const messages = await Chat.findAll({
      where: {
        [Op.or]: [
          {
            [Op.and]: [
              { senderId: req.user.id },
              { receiverId: req.params.id },
            ],
          },
          {
            [Op.and]: [
              { senderId: req.params.id },
              { receiverId: req.user.id },
            ],
          },
        ],
      },
      order: [["createdAt", "DESC"]],
    });

    const formattedMessages = [];
    for (const message of messages) {
      formattedMessages.push(await chatDTO.chatSessionToDTO(message, req.user));
    }

    return res.status(200).json({ data: formattedMessages });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const searchUsers = async (req, res) => {
  try {
    if (await chatValidator.searchUserValidator(req, res)) return;
    const { user } = req.query;
    const users = await User.findAll({
      where: {
        [Op.or]: [
          { firstName: { [Op.like]: `%${user}%` } },
          { lastName: { [Op.like]: `%${user}%` } },
          {
            [Op.and]: [
              { firstName: { [Op.like]: `%${user.split(" ")[0]}%` } },
              { lastName: { [Op.like]: `%${user.split(" ")[1]}%` } },
            ],
          },
        ],
      },
    });

    let formattedUsers = [];
    for (const user of users) {
      formattedUsers.push(await chatDTO.searchUserToDTO(user));
    }

    return res.status(200).json({ data: formattedUsers });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      error: [{ field: "server", message: "Internal Server Error" }],
    });
  }
};

const sendMessage = async (req, res) => {
  try {
    if (await chatValidator.messageValidator(req, res)) return;
    const { message } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user.id;

    const chatMessage = await Chat.create({
      message: message,
      senderId: senderId,
      receiverId: receiverId,
      isRead: false,
    });

    const sender = await User.findByPk(senderId);
    const receiver = await User.findByPk(receiverId);

    const senderDTO = await chatDTO.chatSessionToDTO(chatMessage, sender);
    const receiverDTO = await chatDTO.chatSessionToDTO(chatMessage, receiver);

    webSocket.notifyClients({
      type: "NEW_CHAT_MESSAGE",
      userId: receiver.id,
      payload: {
        ...receiverDTO,
        customMessage: `${sender.username} sent you a message`,
        role: "receiver",
        message: chatMessage.message,
      },
    });

    webSocket.notifyClients({
      type: "NEW_CHAT_MESSAGE",
      userId: sender.id,
      payload: {
        ...senderDTO,
        role: "sender",
        message: chatMessage.message,
      },
    });

    return res.status(201).json({
      status: "Message sent successfully",
      formattedDate: senderDTO.formattedDate,
    });
  } catch (error) {
    console.log(error);
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const deleteMessage = async (req, res) => {
  try {
    if (await chatValidator.messageExistValidator(req, res)) return;
    const { messageId } = req.params.id;

    const chat = await Chat.findOne({ where: { id: messageId } });
    if (chat.isVisible === true) {
      chat.update({ isVisible: false });
      return res.status(200).json({ status: "Message deleted successfully" });
    } else {
      await Chat.destroy({ where: { id: messageId } });
    }

    return res.status(200).json({ status: "Message deleted successfully" });
  } catch (error) {
    console.log(error);
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

module.exports = {
  getAllMessages,
  getMessagesWithUser,
  searchUsers,
  sendMessage,
  deleteMessage,
};
