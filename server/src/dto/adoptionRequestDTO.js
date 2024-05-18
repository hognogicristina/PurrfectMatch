const { Op } = require("sequelize");
const moment = require("moment");
const {
  Image,
  Address,
  Cat,
  AdoptionRequest,
  UserRole,
  User,
} = require("../../models");

async function adoptionRequestToDTO(adoptionRequest, user) {
  const senderUserRole = await UserRole.findOne({
    where: { adoptionRequestId: adoptionRequest.id, role: "sender" },
  });
  const receiverUserRole = await UserRole.findOne({
    where: { adoptionRequestId: adoptionRequest.id, role: "receiver" },
  });
  const sender = await User.findByPk(senderUserRole.userId);
  const receiver = await User.findByPk(receiverUserRole.userId);
  const cat = await Cat.findOne({ where: { id: adoptionRequest.catId } });
  const image = await Image.findOne({ where: { catId: cat.id } });
  const imageFrom = await Image.findOne({ where: { userId: sender.id } });
  const formattedDate = moment(adoptionRequest.createdAt).format(
    "YYYY-MM-DD HH:mm:ss",
  );

  let address = null;
  if (adoptionRequest.addressId) {
    address = await Address.findOne({ where: { userId: receiver.id } });
  }

  let isReceived = false;
  if (user.id === receiver.id) {
    isReceived = true;
  }

  return {
    subject: "AdoptionProcess request",
    imageFrom: imageFrom ? imageFrom.url : null,
    from: `${sender.firstName} ${sender.lastName}`,
    to: `${receiver.firstName} ${receiver.lastName}`,
    message: adoptionRequest.message ? adoptionRequest.message : null,
    cat: cat.name ? cat.name : null,
    image: image ? image.url : null,
    status: adoptionRequest.status ? adoptionRequest.status : null,
    address: address ? `${address.city}, ${address.country}` : null,
    date: formattedDate ? formattedDate : null,
    isReceived: isReceived,
  };
}

async function transformAdoptionRequestsToDTO(user) {
  const userAdoptionRequests = await UserRole.findAll({
    where: { userId: user.id, isVisible: true },
  });

  const sentRequests = [];
  const receivedRequests = [];

  for (let userAdoptionRequest of userAdoptionRequests) {
    const adoptionRequest = await AdoptionRequest.findOne({
      where: { id: userAdoptionRequest.adoptionRequestId },
    });

    let from, to, fromId, toId;
    if (userAdoptionRequest.role === "sender") {
      from = `${user.firstName} ${user.lastName}`;
      fromId = user.id;
      const otherUserRole = await UserRole.findOne({
        where: {
          adoptionRequestId: userAdoptionRequest.adoptionRequestId,
          userId: { [Op.ne]: user.id },
        },
      });
      const otherUser = await User.findByPk(otherUserRole.userId);
      to = `${otherUser.firstName} ${otherUser.lastName}`;
      toId = otherUser.id;
    } else if (userAdoptionRequest.role === "receiver") {
      const otherUserRole = await UserRole.findOne({
        where: {
          adoptionRequestId: userAdoptionRequest.adoptionRequestId,
          userId: { [Op.ne]: user.id },
        },
      });
      const otherUser = await User.findByPk(otherUserRole.userId);
      from = `${otherUser.firstName} ${otherUser.lastName}`;
      fromId = otherUser.id;
      to = `${user.firstName} ${user.lastName}`;
      toId = user.id;
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

    const requestDTO = {
      id: adoptionRequest.id,
      from: { id: fromId, name: from },
      to: { id: toId, name: to },
      subject: "AdoptionProcess request",
      cat: cat.name ? cat.name : null,
      status: adoptionRequest.status ? adoptionRequest.status : null,
      date: formattedDate ? formattedDate : null,
      dateTime: adoptionRequest.createdAt,
      isRead: userAdoptionRequest.isRead,
    };

    if (user.id === fromId) {
      sentRequests.push(requestDTO);
    } else if (user.id === toId) {
      receivedRequests.push(requestDTO);
    }
  }

  sentRequests.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
  receivedRequests.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

  return { sentRequests, receivedRequests };
}

module.exports = {
  adoptionRequestToDTO,
  transformAdoptionRequestsToDTO,
};
