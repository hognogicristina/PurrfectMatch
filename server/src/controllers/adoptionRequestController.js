const {
  Address,
  User,
  Cat,
  AdoptionRequest,
  UserRole,
  CatUser,
} = require("../../models");
const emailServ = require("../services/emailService");
const adoptionRequestValidator = require("../validators/adoptionRequestValidator");
const adoptionRequestHelper = require("../helpers/adoptionRequestHelper");
const adoptionRequestDTO = require("../dto/adoptionRequestDTO");
const logger = require("../../logger/logger");

const adoptCat = async (req, res) => {
  try {
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
    return res
      .status(200)
      .json({ status: "Your request has been sent to the guardian" });
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
      return res.status(200).json({ status: "Adoption request was accepted" });
    } else {
      await emailServ.sendDeclineAdoption(sender, receiver, cat);
      await adoptionRequest.update({ status });
      return res.status(200).json({ status: "Adoption request was declined" });
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

    const responseData = {
      sentRequests:
        sentRequests.length > 0 ? sentRequests : { message: "No Result Found" },
      receivedRequests:
        receivedRequests.length > 0
          ? receivedRequests
          : { message: "No Result Found" },
    };

    return res.status(200).json({ data: responseData });
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
    await adoptionRequestHelper.deleteAdoptionRequest(
      userAdoptionRequest,
      userAdoptionRequests,
      req.params.id,
      res,
    );
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
      logger.error("Response already sent:", error);
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
