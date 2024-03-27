const { Op } = require("sequelize");
const moment = require("moment");
const {
  Image,
  Address,
  Cat,
  AdoptionRequest,
  UserRole,
} = require("../../models");

async function transformAdoptionRequestToDTO(adoptionRequest, user) {
  const senderUserRole = await UserRole.findOne({
    where: { adoptionRequestId: adoptionRequest.id, role: "sender" },
  });
  const receiverUserRole = await UserRole.findOne({
    where: { adoptionRequestId: adoptionRequest.id, role: "receiver" },
  });
  const sender = await User.findByPk(senderUserRole.userId);
  const receiver = await User.findByPk(receiverUserRole.userId);
  const cat = await Cat.findOne({ where: { id: adoptionRequest.catId } });
  const image = await Image.findOne({ where: { id: cat.imageId } });
  const formattedDate = moment(adoptionRequest.createdAt).format(
    "YYYY-MM-DD HH:mm:ss",
  );

  let address = null;
  if (adoptionRequest.addressId) {
    address = await Address.findOne({ where: { id: user.addressId } });
  }

  return {
    subject: "Adoption request",
    from: `${sender.firstName} ${sender.lastName}`,
    to: `${receiver.firstName} ${receiver.lastName}`,
    message: adoptionRequest.message,
    cat: cat.name,
    image: image ? image.url : null,
    status: adoptionRequest.status,
    address: address ? `${address.city}, ${address.country}` : null,
    date: formattedDate,
  };
}

async function transformAdoptionRequestsToDTO(user, sortOrder) {
  const userAdoptionRequests = await UserRole.findAll({
    where: { userId: user.id, isVisible: true },
  });

  const adoptionRequestDTOs = [];
  for (let userAdoptionRequest of userAdoptionRequests) {
    const adoptionRequest = await AdoptionRequest.findOne({
      where: { id: userAdoptionRequest.adoptionRequestId },
    });

    let from, to;
    if (userAdoptionRequest.role === "sender") {
      from = `${user.firstName} ${user.lastName}`;
      const otherUserRole = await UserRole.findOne({
        where: {
          adoptionRequestId: userAdoptionRequest.adoptionRequestId,
          userId: { [Op.ne]: user.id },
        },
      });
      const otherUser = await User.findByPk(otherUserRole.userId);
      to = `${otherUser.firstName} ${otherUser.lastName}`;
    } else if (userAdoptionRequest.role === "receiver") {
      const otherUserRole = await UserRole.findOne({
        where: {
          adoptionRequestId: userAdoptionRequest.adoptionRequestId,
          userId: { [Op.ne]: user.id },
        },
      });
      const otherUser = await User.findByPk(otherUserRole.userId);
      from = `${otherUser.firstName} ${otherUser.lastName}`;
      to = `${user.firstName} ${user.lastName}`;
    }

    const cat = await Cat.findOne({ where: { id: adoptionRequest.catId } });

    const dateSent = moment(adoptionRequest.createdAt);
    const now = moment();
    const diffWeeks = now.diff(dateSent, "weeks");

    let formattedDate;
    if (diffWeeks <= 1) {
      formattedDate = dateSent.fromNow();
    } else {
      formattedDate = moment(adoptionRequest.createdAt).format(
        "YYYY-MM-DD HH:mm:ss",
      );
    }

    adoptionRequestDTOs.push({
      from: from,
      to: to,
      subject: "Adoption request",
      cat: cat.name,
      status: adoptionRequest.status,
      date: formattedDate,
    });
  }

  if (
    sortOrder &&
    (sortOrder.toUpperCase() === "ASC" || sortOrder.toUpperCase() === "DESC")
  ) {
    adoptionRequestDTOs.sort((a, b) => {
      return sortOrder.toUpperCase() === "ASC"
        ? moment(a.date).diff(b.date)
        : moment(b.date).diff(a.date);
    });
  }

  return adoptionRequestDTOs;
}

module.exports = {
  transformAdoptionRequestToDTO,
  transformAdoptionRequestsToDTO,
};
