const { Chat, User } = require("../../models");
const validator = require("validator");
const { Op } = require("sequelize");

const messageExistValidator = async (req, res) => {
  const message = await Chat.findOne({
    where: { id: req.params.id, userId: req.user.id },
  });

  if (!message) {
    return res
      .status(404)
      .json({ error: [{ field: "inbox", message: "Message not found" }] });
  }

  const chat = await Chat.findOne({ where: { id: req.params.id } });
  if (chat.senderId !== req.user.id) {
    return res.status(403).json({
      error: [{ field: "inbox", message: "You are not authorized" }],
    });
  }

  return null;
};

const allMessagesExistValidator = async (req, res) => {
  const messages = await Chat.findAll({
    where: {
      [Op.or]: [{ receiverId: req.user.id }, { senderId: req.user.id }],
    },
    group: ["receiverId", "senderId"],
  });

  if (messages.length === 0) {
    return res.status(404).json({
      error: [{ field: "inbox", message: "No Messages Available" }],
    });
  }

  return null;
};

const messagesWithUserExistValidator = async (req, res) => {
  const messages = await Chat.findAll({
    where: {
      [Op.or]: [
        {
          [Op.and]: [{ senderId: req.user.id }, { receiverId: req.params.id }],
        },
        {
          [Op.and]: [{ senderId: req.params.id }, { receiverId: req.user.id }],
        },
      ],
    },
    order: [["createdAt", "ASC"]],
  });

  if (messages.length === 0) {
    return res.status(404).json({
      error: [{ field: "inbox", message: "No Messages Available" }],
    });
  }

  return null;
};

const searchUserValidator = async (req, res) => {
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

  if (users.length === 0) {
    return res.status(404).json({
      error: [{ field: "search", message: "No Users Found" }],
    });
  }

  return null;
};

const messageValidator = async (req, res) => {
  const receiverId = req.params.id;

  const receiver = await User.findOne({ where: { id: receiverId } });
  if (!receiver) {
    return res
      .status(404)
      .json({ error: [{ field: "receiver", message: "Receiver not found" }] });
  }

  if (!req.body.message || validator.isEmpty(req.body.message)) {
    return res
      .status(400)
      .json({ error: [{ field: "inbox", message: "Message is required" }] });
  } else if (!validator.isLength(req.body.message, { min: 1, max: 255 })) {
    return res.status(400).json({
      error: [
        { field: "inbox", message: "Message must be 1 to 255 characters" },
      ],
    });
  }

  return null;
};

module.exports = {
  messageExistValidator,
  allMessagesExistValidator,
  messagesWithUserExistValidator,
  searchUserValidator,
  messageValidator,
};
