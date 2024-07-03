const {
  Address,
  User,
  Cat,
  AdoptionRequest,
  UserRole,
  CatUser,
} = require("../../../models");
const emailServ = require("../../services/emailService");
const adoptionRequestValidator = require("../../validators/adoptionRequestValidator");
const userValidator = require("../../validators/userValidator");
const adoptionRequestHelper = require("../../helpers/adoptionRequestHelper");
const adoptionRequestDTO = require("../../dto/adoptionRequestDTO");
const userDTO = require("../../dto/userDTO");
const logger = require("../../../logger/logger");
const websocket = require("../../../websocket");

const adoptCat = async (req, res) => {
  try {
    if (await userValidator.validateActiveAccount(req, res)) return;
    if (await adoptionRequestValidator.adoptValidator(req, res)) return;
    const cat = await Cat.findByPk(req.params.id);
    const catUser = await CatUser.findByPk(cat.id);
    const { message } = req.body;
    const adoptionRequest = await AdoptionRequest.create({
      catId: cat.id,
      message,
    });
    await UserRole.create({
      userId: req.user.id,
      adoptionRequestId: adoptionRequest.id,
      role: "sender",
      isRead: true,
    });
    await UserRole.create({
      userId: catUser.userId,
      adoptionRequestId: adoptionRequest.id,
      role: "receiver",
      isRead: false,
    });

    const sender = await User.findByPk(req.user.id);
    const receiver = await User.findByPk(catUser.userId);

    const senderDTO =
      await adoptionRequestDTO.transformAdoptionRequestsToDTO(sender);
    const receiverDTO =
      await adoptionRequestDTO.transformAdoptionRequestsToDTO(receiver);

    const receivedUnreadCount = await UserRole.count({
      where: {
        userId: receiver.id,
        isRead: false,
      },
    });

    websocket.notifyClients({
      type: "NEW_ADOPTION_REQUEST",
      userId: receiver.id,
      payload: {
        ...receiverDTO,
        unreadCount: receivedUnreadCount,
        customMessage: `${sender.username} sent an adoption request`,
        role: "receiver",
      },
    });

    websocket.notifyClients({
      type: "NEW_ADOPTION_REQUEST",
      userId: sender.id,
      payload: {
        ...senderDTO,
        customMessage: "Your request was sent",
        role: "sender",
      },
    });

    return res.status(200).json({ status: "Your request has been sent" });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal server error" }] });
  }
};

const validateAdoptionRequest = async (req, res) => {
  try {
    if (req.user) {
      const exists = await adoptionRequestHelper.checkAdoptionRequestExists(
        req.user.id,
        req.params.catId,
      );
      return res.json({ exists });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal server error" }] });
  }
};

const handleAdoptionRequest = async (req, res) => {
  try {
    if (await userValidator.validateActiveAccount(req, res)) return;
    if (await adoptionRequestValidator.handleAdoptionRequestValidator(req, res))
      return;

    const { status } = req.body;
    const adoptionRequest = await AdoptionRequest.findByPk(req.params.id);
    const cat = await Cat.findOne({ where: { id: adoptionRequest.catId } });
    const senderUserRole = await UserRole.findOne({
      where: { adoptionRequestId: adoptionRequest.id, role: "sender" },
    });
    const receiverUserRole = await UserRole.findOne({
      where: {
        adoptionRequestId: adoptionRequest.id,
        role: "receiver",
      },
    });
    await senderUserRole.update({ isRead: false });
    const sender = await User.findByPk(senderUserRole.userId);
    const receiver = await User.findByPk(receiverUserRole.userId);
    const userAddress = await Address.findOne({
      where: { userId: req.user.id },
    });

    if (status === "accepted") {
      const otherUsers = await adoptionRequestHelper.sendAdoptionRequest(
        status,
        adoptionRequest,
        sender,
        receiver,
        cat,
        userAddress,
      );
      await adoptionRequest.update({ status });

      for (let otherUser of otherUsers) {
        const otherUserDTO =
          await adoptionRequestDTO.transformAdoptionRequestsToDTO(otherUser);

        const receivedUnreadCount = await UserRole.count({
          where: {
            userId: otherUser.id,
            isRead: false,
          },
        });

        websocket.notifyClients({
          type: "ADOPTION_REQUEST_RESPONSE",
          userId: otherUser.id,
          payload: {
            ...otherUserDTO,
            unreadCount: receivedUnreadCount,
            customMessage: `${receiver.username} declined the request`,
            role: "sender",
            status: "declined",
          },
        });
      }

      const senderDTO =
        await adoptionRequestDTO.transformAdoptionRequestsToDTO(sender);
      const receiverDTO =
        await adoptionRequestDTO.transformAdoptionRequestsToDTO(receiver);

      const receivedUnreadCount = await UserRole.count({
        where: {
          userId: sender.id,
          isRead: false,
        },
      });

      websocket.notifyClients({
        type: "ADOPTION_REQUEST_RESPONSE",
        userId: sender.id,
        payload: {
          ...senderDTO,
          unreadCount: receivedUnreadCount,
          customMessage: `${receiver.username} accepted your request`,
          role: "sender",
          status: "accepted",
        },
      });

      websocket.notifyClients({
        type: "ADOPTION_REQUEST_RESPONSE",
        userId: receiver.id,
        payload: {
          ...receiverDTO,
          role: "receiver",
          status: "accepted",
        },
      });

      return res
        .status(200)
        .json({ status: "Adoption request was accepted", adoptionRequest });
    } else {
      await emailServ.sendDeclineAdoption(sender, receiver, cat);
      await adoptionRequest.update({ status });

      const senderDTO =
        await adoptionRequestDTO.transformAdoptionRequestsToDTO(sender);
      const receiverDTO =
        await adoptionRequestDTO.transformAdoptionRequestsToDTO(receiver);

      const receivedUnreadCount = await UserRole.count({
        where: {
          userId: sender.id,
          isRead: false,
        },
      });

      websocket.notifyClients({
        type: "ADOPTION_REQUEST_RESPONSE",
        userId: sender.id,
        payload: {
          ...senderDTO,
          unreadCount: receivedUnreadCount,
          customMessage: `${receiver.username} declined your request`,
          role: "sender",
          status: "declined",
        },
      });

      websocket.notifyClients({
        type: "ADOPTION_REQUEST_RESPONSE",
        userId: receiver.id,
        payload: {
          ...receiverDTO,
          role: "receiver",
          status: "declined",
        },
      });

      return res
        .status(200)
        .json({ status: "Adoption request was declined", adoptionRequest });
    }
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal server error" }] });
  }
};

const getAdoptionRequests = async (req, res) => {
  try {
    if (await adoptionRequestValidator.getAdoptionRequestsValidator(req, res))
      return;
    const { sentRequests, receivedRequests } =
      await adoptionRequestDTO.transformAdoptionRequestsToDTO(req.user);

    const user = await User.findByPk(req.user.id);
    const userDetails = await userDTO.userToDTO(user);

    const responseData = {
      sentRequests:
        sentRequests.length > 0 ? sentRequests : { message: "No Mail" },
      receivedRequests:
        receivedRequests.length > 0 ? receivedRequests : { message: "No Mail" },
    };

    return res
      .status(200)
      .json({ data: responseData, userDetails: userDetails });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal server error" }] });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const receivedUnreadCount = await UserRole.count({
      where: {
        userId: userId,
        isRead: false,
      },
    });

    return res.status(200).json({ unreadCount: receivedUnreadCount });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal server error" }] });
  }
};

const getAdoptionRequest = async (req, res) => {
  try {
    if (await adoptionRequestValidator.getAdoptionRequestsValidator(req, res))
      return;
    const adoptionRequest = await AdoptionRequest.findByPk(req.params.id);
    const userRole = await UserRole.findOne({
      where: { adoptionRequestId: req.params.id, userId: req.user.id },
    });
    if (userRole.isRead === false) {
      await userRole.update({ isRead: true });
    }
    const adoptionRequestDetails =
      await adoptionRequestDTO.adoptionRequestToDTO(adoptionRequest, req.user);
    return res.status(200).json({ data: adoptionRequestDetails });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal server error" }] });
  }
};

const deleteAdoptionRequest = async (req, res) => {
  const transaction = await AdoptionRequest.sequelize.transaction();
  try {
    if (await userValidator.validateActiveAccount(req, res)) return;
    if (
      await adoptionRequestValidator.deleteAdoptionRequestValidator(req, res)
    ) {
      await transaction.rollback();
      return;
    }

    const userAdoptionRequest = await UserRole.findOne({
      where: {
        adoptionRequestId: req.params.id,
        userId: req.user.id,
      },
    });
    const userAdoptionRequests = await UserRole.findAll({
      where: { adoptionRequestId: req.params.id },
    });

    const adoptionRequest = await AdoptionRequest.findOne({
      where: { id: req.params.id },
    });

    await adoptionRequestHelper.deleteAdoptionRequest(
      userAdoptionRequest,
      userAdoptionRequests,
      req.params.id,
      res,
    );

    if (
      userAdoptionRequest.role === "sender" &&
      adoptionRequest.status === "pending"
    ) {
      const senderId = userAdoptionRequest.userId;
      const receiverId = userAdoptionRequests.find(
        (request) => request.role === "receiver",
      ).userId;

      const sender = await User.findByPk(senderId);
      const receiver = await User.findByPk(receiverId);

      const senderDTO =
        await adoptionRequestDTO.transformAdoptionRequestsToDTO(sender);
      const receiverDTO =
        await adoptionRequestDTO.transformAdoptionRequestsToDTO(receiver);

      const receivedUnreadCount = await UserRole.count({
        where: {
          userId: receiver.id,
          isRead: false,
        },
      });

      websocket.notifyClients({
        type: "DELETE_ADOPTION_REQUEST",
        userId: sender.id,
        payload: {
          ...senderDTO,
          role: "sender",
        },
      });

      websocket.notifyClients({
        type: "DELETE_ADOPTION_REQUEST",
        userId: receiver.id,
        payload: {
          ...receiverDTO,
          unreadCount: receivedUnreadCount,
          role: "receiver",
        },
      });
    }

    await transaction.commit();
    return res.status(200).json({ status: "Mail deleted successfully" });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    if (!res.headersSent) {
      logger.error(error);
      return res.status(500).json({
        error: [{ field: "server", message: "Internal server error" }],
      });
    } else {
      logger.error(error);
    }
  }
};

module.exports = {
  adoptCat,
  validateAdoptionRequest,
  handleAdoptionRequest,
  getAdoptionRequests,
  getUnreadCount,
  getAdoptionRequest,
  deleteAdoptionRequest,
};
