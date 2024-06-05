const { User, Image, Chat } = require("../../models");
const moment = require("moment/moment");
const { Op } = require("sequelize");

const chatToDTO = async (chat, currentUser) => {
  let dateSent = moment(chat.createdAt);
  let diffWeeks = moment().diff(dateSent, "weeks");

  let formattedDate;
  if (diffWeeks <= 1) {
    formattedDate = dateSent.fromNow();
  } else {
    formattedDate = dateSent.format("YYYY-MM-DD");
  }

  const otherUserId =
    chat.senderId === currentUser.id ? chat.receiverId : chat.senderId;
  const otherUser = await User.findOne({ where: { id: otherUserId } });
  const image = await Image.findOne({ where: { userId: otherUser.id } });

  return {
    id: chat ? chat.id : null,
    fullName: otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : null,
    currentUserId: currentUser ? currentUser.id : null,
    otherUserId: otherUser ? otherUser.id : null,
    image: image ? image.url : null,
    message: chat ? chat.message : null,
    formattedDate: formattedDate ? formattedDate : null,
  };
};

async function chatSessionToDTO(chat, currentUser) {
  let dateSent = moment(chat.createdAt);
  let diffWeeks = moment().diff(dateSent, "weeks");

  let formattedDate;
  if (diffWeeks <= 1) {
    formattedDate = dateSent.fromNow();
  } else {
    formattedDate = dateSent.format("YYYY-MM-DD");
  }

  const isSender = chat.senderId === currentUser.id;
  const otherUserId = isSender ? chat.receiverId : chat.senderId;
  const otherUser = await User.findOne({ where: { id: otherUserId } });
  const image = await Image.findOne({ where: { userId: otherUser.id } });

  const currentUserDTO = {
    id: currentUser.id,
    username: currentUser.username,
    sender: isSender,
  };

  const otherUserDTO = {
    id: otherUser.id,
    username: otherUser.username,
    firstName: otherUser.firstName,
    lastName: otherUser.lastName,
    imageUrl: image ? image.url : null,
    sender: !isSender,
  };

  return {
    id: chat ? chat.id : null,
    message: chat ? chat.message : null,
    formattedDate: formattedDate ? formattedDate : null,
    currentUser: currentUserDTO,
    otherUser: otherUserDTO,
  };
}

async function searchUserToDTO(user) {
  const image = await Image.findOne({ where: { userId: user.id } });

  return {
    id: user ? user.id : null,
    username: user ? user.username : null,
    image: image ? image.url : null,
    firstName: user ? user.firstName : null,
    lastName: user ? user.lastName : null,
  };
}

module.exports = {
  chatToDTO,
  chatSessionToDTO,
  searchUserToDTO,
};
