const { Op } = require("sequelize");
const {
  AdoptionRequest,
  UserRole,
  User,
  Cat,
  CatUser,
} = require("../../models");
const emailService = require("../services/emailService");
const emailServ = require("../services/emailService");

const sendAdoptionRequest = async (
  status,
  adoptionRequest,
  sender,
  receiver,
  cat,
  userAddress,
) => {
  await User.sequelize.transaction(async (t) => {
    const otherAdoptionRequests = await AdoptionRequest.findAll(
      {
        where: {
          catId: adoptionRequest.catId,
          id: { [Op.ne]: adoptionRequest.id },
        },
      },
      { transaction: t },
    );

    for (const otherAdoptionRequest of otherAdoptionRequests) {
      await AdoptionRequest.update(
        { status: "declined" },
        { where: { id: otherAdoptionRequest.id }, transaction: t },
      );
      const otherUserRole = await UserRole.findOne(
        {
          where: {
            adoptionRequestId: otherAdoptionRequest.id,
            role: "sender",
          },
        },
        { transaction: t },
      );
      const sender = await User.findOne({
        where: { id: otherUserRole.userId },
      });
      await emailServ.sendDeclineAdoption(sender, receiver, cat);
    }

    await Cat.update(
      { ownerId: sender.id },
      { where: { id: adoptionRequest.catId }, transaction: t },
    );
    const catUser = await CatUser.findOne(
      { where: { catId: adoptionRequest.catId } },
      { transaction: t },
    );
    if (catUser) {
      await CatUser.update(
        { ownerId: sender.id },
        { where: { id: catUser.id }, transaction: t },
      );
    }
    await AdoptionRequest.update(
      { status, addressId: userAddress.id },
      {
        where: { id: adoptionRequest.id },
        transaction: t,
      },
    );
    await emailServ.sendAdoptionEmail(sender, receiver, cat, userAddress);
  });
};

const deleteAdoptionRequestCat = async (cat, receiver) => {
  const adoptionRequests = await AdoptionRequest.findAll({
    where: { catId: cat.id },
  });

  for (const adoptionRequest of adoptionRequests) {
    if (adoptionRequest.status === "pending") {
      const userAdoptionRequests = await UserRole.findAll({
        where: { adoptionRequestId: adoptionRequest.id },
      });
      for (let userAdoptionRequest of userAdoptionRequests) {
        if (userAdoptionRequest.role === "sender") {
          const sender = await User.findOne({
            where: { id: userAdoptionRequest.userId },
          });
          await emailService.sendDeclineAdoption(sender, receiver, cat);
        }
      }
      await UserRole.destroy({
        where: { adoptionRequestId: adoptionRequest.id },
      });
      await adoptionRequest.destroy();
    } else {
      await UserRole.destroy({
        where: { adoptionRequestId: adoptionRequest.id },
      });
      await adoptionRequest.destroy();
    }
  }
};

const deleteAdoptionRequest = async (
  userAdoptionRequest,
  userAdoptionRequests,
  adoptionRequestId,
  res,
) => {
  let visibleCount = 0;
  for (const userAdoptionRequest of userAdoptionRequests) {
    if (userAdoptionRequest.isVisible) {
      visibleCount++;
    }
  }

  if (visibleCount === 1) {
    await UserRole.destroy({ where: { adoptionRequestId } });
    await AdoptionRequest.destroy({ where: { id: adoptionRequestId } });
    return res
      .status(200)
      .json({ status: "AdoptionRequest deleted successfully" });
  } else {
    await userAdoptionRequest.update({
      isVisible: !userAdoptionRequest.isVisible,
    });
    return res
      .status(200)
      .json({ status: "AdoptionRequest deleted successfully" });
  }
};

const deleteAdoptionRequestUser = async (user) => {
  const userAdoptionRequests = await UserRole.findAll({
    where: { userId: user.id },
  });
  for (let userAdoptionRequest of userAdoptionRequests) {
    if (userAdoptionRequest.role === "receiver") {
      const adoptionRequest = await AdoptionRequest.findOne({
        where: { id: userAdoptionRequest.adoptionRequestId },
      });
      if (adoptionRequest && adoptionRequest.status === "pending") {
        const cat = await Cat.findOne({ where: { id: adoptionRequest.catId } });
        const senderUserRoles = await UserRole.findAll({
          where: {
            adoptionRequestId: adoptionRequest.id,
            role: "sender",
          },
        });
        for (let senderUserRole of senderUserRoles) {
          const sender = await User.findOne({
            where: { id: senderUserRole.userId },
          });
          await emailService.sendDeclineAdoption(sender, user, cat);
        }
      }
    }

    const adoptionRequest = await AdoptionRequest.findOne({
      where: { id: userAdoptionRequest.adoptionRequestId },
    });
    const otherUserRoles = await UserRole.findAll({
      where: { adoptionRequestId: adoptionRequest.id },
    });
    for (let otherUserRole of otherUserRoles) {
      await otherUserRole.destroy();
    }
    await adoptionRequest.destroy();
  }
};

module.exports = {
  sendAdoptionRequest,
  deleteAdoptionRequestCat,
  deleteAdoptionRequest,
  deleteAdoptionRequestUser,
};
