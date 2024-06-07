const { User, Message, Image } = require("../../models");
const moment = require("moment");
const { Op } = require("sequelize");

const transformChatSessionsToDTO = async (session, currentUser, otherUser) => {
  const lastMessage = await Message.findOne({
    where: { chatSessionId: session.id },
    order: [["createdAt", "DESC"]],
  });

  const unreadMessagesCount = await Message.count({
    where: {
      chatSessionId: session.id,
      userId: currentUser.id,
      isRead: false,
    },
  });

  let formattedDate = null;
  if (lastMessage) {
    const dateSent = moment(lastMessage.createdAt);
    const diffWeeks = moment().diff(dateSent, "weeks");

    formattedDate =
      diffWeeks <= 1 ? dateSent.fromNow() : dateSent.format("YYYY-MM-DD");
  }

  const isSender = lastMessage ? lastMessage.userId === otherUser.id : false;
  const image = await Image.findOne({ where: { userId: otherUser.id } });

  return {
    id: session ? session.id : null,
    currentUserId: currentUser ? currentUser.id : null,
    otherUserId: otherUser ? otherUser.id : null,
    otherUserFullName: otherUser
      ? `${otherUser.firstName} ${otherUser.lastName}`
      : null,
    otherUserName: otherUser ? otherUser.username : null,
    otherUserImage: image ? image.url : null,
    lastMessage: lastMessage ? lastMessage.textMsg : null,
    lastMessageDate: formattedDate ? formattedDate : null,
    lastMessageRole: lastMessage ? (isSender ? "sender" : "receiver") : null,
    isRead: lastMessage && !isSender ? lastMessage.isRead : true,
    unreadMessagesCount: unreadMessagesCount,
    createdAt: lastMessage ? lastMessage.createdAt : session.createdAt,
  };
};

const transformChatMessagesToDTO = async (message, currentUser, otherUser) => {
  const dateSent = moment(message.createdAt);
  const diffWeeks = moment().diff(dateSent, "weeks");
  const formattedDate =
    diffWeeks <= 1 ? dateSent.fromNow() : dateSent.format("YYYY-MM-DD");
  const image = await Image.findOne({ where: { userId: otherUser.id } });

  return {
    id: message ? message.id : null,
    userId: currentUser ? currentUser.id : null,
    otherUserId: otherUser ? otherUser.id : null,
    otherUserFullName: otherUser
      ? `${otherUser.firstName} ${otherUser.lastName}`
      : null,
    otherUserName: otherUser ? otherUser.username : null,
    otherUserImage: image ? image.url : null,
    messageText: message ? message.textMsg : null,
    messageDate: formattedDate,
    messageRole: message ? message.role : null,
    isRead: message ? message.isRead : true,
  };
};

module.exports = {
  transformChatSessionsToDTO,
  transformChatMessagesToDTO,
};
