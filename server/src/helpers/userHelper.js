const {
  Image,
  Address,
  ChatSession,
  Message,
  Token,
  UserInfo,
  PasswordHistory,
} = require("../../models");
const emailService = require("../services/emailService");
const adoptionRequestHelper = require("./adoptionRequestHelper");
const catUserHelper = require("./catUserHelper");
const fileHelper = require("./fileHelper");
const emailServ = require("../services/emailService");

const deleteUser = async (user, transaction) => {
  await emailService.sendDeleteAccount(user);
  await adoptionRequestHelper.deleteAdoptionRequestUser(user, transaction);
  await catUserHelper.deleteCat(user, transaction);
  await Token.destroy({ where: { userId: user.id }, transaction });
  await UserInfo.destroy({ where: { userId: user.id }, transaction });
  await PasswordHistory.destroy({ where: { userId: user.id }, transaction });
  await deleteChatSession(user, transaction);
  const image = await Image.findOne({
    where: { userId: user.id },
    transaction,
  });
  await fileHelper.deleteImage(image, "uploads", transaction);
  const address = await Address.findOne({
    where: { userId: user.id },
    transaction,
  });
  if (address) {
    await address.destroy({ transaction });
  }

  await user.destroy({ transaction });
};

const updateEmail = async (user, fieldsToUpdate, body) => {
  let emailChanged = false;
  fieldsToUpdate.forEach((field) => {
    if (body[field] !== undefined) {
      if (field === "email" && body[field] !== user.email) {
        user[field] = body[field];
        emailChanged = true;
      } else if (field === "birthday") {
        const birthdayTimestamp = new Date(body[field]).getTime();
        user[field] = new Date(birthdayTimestamp);
      } else {
        if (field === "hobbies" && Array.isArray(body[field])) {
          user[field] = body[field].join(", ");
        } else {
          user[field] = body[field];
        }
      }
    }
  });

  if (emailChanged) {
    user.status = "active_pending";
    await emailServ.sendResetEmail(user);
  }

  if (user.description === "") {
    user.description = null;
  }

  if (user.hobbies === "") {
    user.hobbies = null;
  }

  if (user.experienceLevel === 0) {
    user.experienceLevel = null;
  }

  const userInfo = await UserInfo.findOne({ where: { userId: user.id } });
  userInfo.description = user.description;
  userInfo.hobbies = user.hobbies;
  userInfo.experienceLevel = user.experienceLevel;

  if (body.birthday !== undefined) {
    const birthdayTimestamp = new Date(body.birthday).getTime();
    userInfo.birthday = new Date(birthdayTimestamp);
  }

  await userInfo.save();
};

const deleteChatSession = async (user, transaction) => {
  const messages = await Message.findAll({
    where: { userId: user.id },
    transaction,
  });

  let chatSessionsId = [];
  for (let message of messages) {
    chatSessionsId.push(message.chatSessionId);
  }

  for (let chatSessionId of chatSessionsId) {
    const chatSession = await ChatSession.findByPk(chatSessionId, {
      transaction,
    });

    if (chatSession) {
      const messagesOfChatSession = await Message.findAll({
        where: { chatSessionId: chatSession.id },
        transaction,
      });

      if (messagesOfChatSession.length > 0) {
        for (let message of messagesOfChatSession) {
          await message.destroy({ transaction });
        }
      }

      await chatSession.destroy({ transaction });
    }
  }
};

module.exports = { deleteUser, updateEmail };
