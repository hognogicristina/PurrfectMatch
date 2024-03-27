const {
  Address,
  User,
  Cat,
  AdoptionRequest,
  UserRole,
} = require("../../models");
const emailServ = require("../services/emailService");
const adoptionRequestValidator = require("../validators/adoptionRequestValidator");
const adoptionRequestHelper = require("../helpers/adoptionRequestHelper");
const adoptionRequestDTO = require("../dto/adoptionRequestDTO");

const adoptCat = async (req, res) => {
  try {
    if (await adoptionRequestValidator.adoptValidator(req, res)) return;
    const cat = await Cat.findByPk(req.params.id);
    const { message } = req.body;
    const adoptionRequest = await AdoptionRequest.create({
      catId: cat.id,
      message,
    });
    await UserRole.create({
      userId: req.user.id,
      adoptionRequestId: adoptionRequest.id,
      role: "sender",
    });
    await UserRole.create({
      userId: cat.userId,
      adoptionRequestId: adoptionRequest.id,
      role: "receiver",
    });
    return res
      .status(200)
      .json({ status: "Adoption request sent successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
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
      where: { id: req.user.addressId },
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
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAdoptionRequests = async (req, res) => {
  try {
    if (await adoptionRequestValidator.getAdoptionRequestsValidator(req, res))
      return;
    const sortOrder = req.headers["sort-order"]
      ? req.headers["sort-order"].toUpperCase()
      : "DESC";
    const adoptionRequestDTOs =
      await adoptionRequestDTO.transformAdoptionRequestsToDTO(
        req.user,
        sortOrder,
      );
    return res.status(200).json({ data: adoptionRequestDTOs });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getAdoptionRequest = async (req, res) => {
  try {
    if (await adoptionRequestValidator.getAdoptionRequestsValidator(req, res))
      return;
    const adoptionRequest = await AdoptionRequest.findByPk(req.params.id);
    const adoptionRequestDetails =
      await adoptionRequestDTO.transformAdoptionRequestToDTO(
        adoptionRequest,
        req.user,
      );
    return res.status(200).json({ data: adoptionRequestDetails });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
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
    return res
      .status(200)
      .json({ status: "AdoptionRequest deleted successfully" });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  adoptCat,
  handleAdoptionRequest,
  getAdoptionRequests,
  getAdoptionRequest,
  deleteAdoptionRequest,
};
