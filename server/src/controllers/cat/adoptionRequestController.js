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

    websocket.notifyClients({
      type: "NEW_ADOPTION_REQUEST",
      userId: receiver.id,
      payload: {
        ...receiverDTO,
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
      const cat = await Cat.findByPk(req.params.catId);
      if (cat) {
        const adoptionRequest = await AdoptionRequest.findOne({
          where: { catId: cat.id },
        });
        if (adoptionRequest) {
          const userRole = await UserRole.findOne({
            where: {
              adoptionRequestId: adoptionRequest.id,
              userId: req.user.id,
            },
          });
          if (userRole) {
            return res.json({ exists: true });
          } else {
            return res.json({ exists: false });
          }
        } else {
          return res.json({ exists: false });
        }
      }
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
    senderUserRole.update({ isRead: true });
    const sender = await User.findByPk(senderUserRole.userId);
    const receiver = await User.findByPk(receiverUserRole.userId);
    const userAddress = await Address.findOne({
      where: { userId: req.user.id },
    });

    if (status === "accepted") {
      await adoptionRequestHelper.sendAdoptionRequest(
        status,
        adoptionRequest,
        sender,
        receiver,
        cat,
        userAddress,
      );
      adoptionRequest.update({ status });

      websocket.notifyClients({
        type: "ADOPTION_REQUEST_STATUS",
        userId: sender.id,
        payload: {
          status: "accepted",
          message: `${receiver.username} accepted your adoption request`,
        },
      });

      return res
        .status(200)
        .json({ status: "Adoption request was accepted", adoptionRequest });
    } else {
      await emailServ.sendDeclineAdoption(sender, receiver, cat);
      await adoptionRequest.update({ status });
      websocket.notifyClients({
        type: "ADOPTION_REQUEST_STATUS",
        userId: sender.id,
        payload: {
          status: "declined",
          message: `${receiver.username} declined your adoption request`,
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

const getAdoptionRequest = async (req, res) => {
  try {
    if (await adoptionRequestValidator.getAdoptionRequestsValidator(req, res))
      return;
    const adoptionRequest = await AdoptionRequest.findByPk(req.params.id);
    const adoptionRequestDetails =
      await adoptionRequestDTO.adoptionRequestToDTO(adoptionRequest, req.user);
    const userRole = await UserRole.findOne({
      where: { adoptionRequestId: req.params.id, userId: req.user.id },
    });
    if (userRole.isRead === false) {
      await userRole.update({ isRead: true });
    }
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
  getAdoptionRequest,
  deleteAdoptionRequest,
};
