const { User, Message, Image } = require("../../models");
const moment = require("moment");

const transformChatSessionsToDTO = async (session, userId) => {
  const user1 = await User.findByPk(session.userId1);
  const user2 = await User.findByPk(session.userId2);

  const otherUser = session.userId1 !== userId ? user1 : user2;
  const lastMessage = await Message.findOne({
    where: { chatSessionId: session.id },
    order: [["createdAt", "DESC"]],
  });

  const unreadMessagesCount = await Message.count({
    where: {
      chatSessionId: session.id,
      userId: userId,
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
    currentUserId: userId ? userId : null,
    otherUserId: otherUser ? otherUser.id : null,
    otherUserName: otherUser
      ? `${otherUser.firstName} ${otherUser.lastName}`
      : null,
    otherUserImage: image ? image.url : null,
    lastMessage: lastMessage ? lastMessage.message : null,
    lastMessageDate: formattedDate ? formattedDate : null,
    lastMessageRole: lastMessage ? (isSender ? "sender" : "receiver") : null,
    isRead: lastMessage && !isSender ? lastMessage.isRead : true,
    unreadMessagesCount: unreadMessagesCount,
    createdAt: lastMessage ? lastMessage.createdAt : session.createdAt,
  };
};

const transformChatMessagesToDTO = async (session, message, userId) => {
  const otherUser =
    session.userId1 !== userId
      ? await User.findByPk(session.userId1)
      : await User.findByPk(session.userId2);

  const dateSent = moment(message.createdAt);
  const diffWeeks = moment().diff(dateSent, "weeks");
  const formattedDate =
    diffWeeks <= 1 ? dateSent.fromNow() : dateSent.format("YYYY-MM-DD");
  const image = await Image.findOne({ where: { userId: otherUser.id } });

  return {
    id: message.id,
    userId: userId,
    otherUserId: otherUser.id,
    otherUserFullName: `${otherUser.firstName} ${otherUser.lastName}`,
    otherUserImage: image ? image.url : null,
    messageText: message.message,
    messageDate: formattedDate,
    messageRole: message.role,
    isRead: message.isRead,
  };
};

module.exports = {
  transformChatSessionsToDTO,
  transformChatMessagesToDTO,
};
