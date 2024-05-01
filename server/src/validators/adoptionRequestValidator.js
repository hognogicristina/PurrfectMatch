const {
  AdoptionRequest,
  Cat,
  Address,
  UserRole,
  Favorite,
} = require("../../models");
const validator = require("validator");
const e = require("express");

const adoptValidator = async (req, res) => {
  const error = [];
  const userId = req.user.id;

  if (req.params.id) {
    let cat = null;
    if (req.path.includes("favorites")) {
      const favorite = await Favorite.findByPk(req.params.id);
      if (!favorite) {
        return res.status(404).json({
          error: [{ field: "favorite", message: "Favorite not found" }],
        });
      }

      cat = await Cat.findByPk(favorite.catId);
    } else {
      cat = await Cat.findByPk(req.params.id);
    }

    if (!cat) {
      error.push({ field: "cat", message: "Cat not found" });
      return res.status(400).json({ error });
    }

    if (cat.userId === userId) {
      error.push({
        field: "cat",
        error: "You cannot send adoption request for a cat you are guardian of",
      });
    }

    if (cat.ownerId !== null) {
      error.push({ field: "cat", message: "Cat already adopted" });
    }
  }

  const pendingAdoptionRequests = await AdoptionRequest.findAll({
    where: { catId: req.params.id, status: "pending" },
    attributes: ["id"],
  });

  for (const adoptionRequest of pendingAdoptionRequests) {
    const existingRequest = await UserRole.findOne({
      where: {
        adoptionRequestId: adoptionRequest.id,
        userId: userId,
        role: "sender",
      },
    });

    if (existingRequest) {
      error.push({ field: "cat", message: "Adoption request already sent" });
    }
  }

  if (validator.isEmpty(req.body.message)) {
    error.push({ field: "message", message: "Message is required" });
  } else if (!validator.isLength(req.body.message, { min: 10, max: 100 })) {
    error.push({
      field: "message",
      message: "Message must be between 10 and 100 characters",
    });
  }

  return error.length > 0 ? res.status(400).json({ error }) : null;
};

const handleAdoptionRequestValidator = async (req, res) => {
  const error = [];
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user.id;

  if (req.params.id) {
    const mail = await AdoptionRequest.findByPk(id);
    if (!mail) {
      return res
        .status(404)
        .json({
          error: [{ field: "adoption", message: "AdoptionRequest not found" }],
        });
    }

    const cat = await Cat.findByPk(mail.catId);
    if (cat.userId !== userId) {
      return res
        .status(403)
        .json({
          error: [
            {
              field: "adoption",
              message: "You are not allowed to handle this request",
            },
          ],
        });
    }

    if (mail.status !== "pending") {
      error.push({ field: "status", message: "Status already updated" });
    }
  }

  const userAddress = await Address.findOne({
    where: { id: req.user.addressId },
  });
  if (!userAddress) {
    return res
      .status(404)
      .json({
        error: [
          {
            field: "address",
            message: "Address not found for the sender user",
          },
        ],
      });
  }

  if (status !== "accepted" && status !== "declined") {
    error.push({ field: "status", message: "Invalid status" });
  }

  return error.length > 0 ? res.status(400).json({ error }) : null;
};

const deleteAdoptionRequestValidator = async (req, res) => {
  const error = [];
  const userId = req.user.id;
  const mailId = req.params.id;

  const mail = await AdoptionRequest.findByPk(mailId);
  if (!mail) {
    return res
      .status(404)
      .json({
        error: [{ field: "adoption", message: "AdoptionRequest not found" }],
      });
  }

  if (mail.status === "pending") {
    error.push({ field: "status", message: "Cannot delete pending mails" });
  }

  const userAdoptionRequest = await UserRole.findOne({
    where: { userId, mailId },
  });
  if (!userAdoptionRequest) {
    return res
      .status(403)
      .json({
        error: [
          {
            field: "adoption",
            message: "You are not allowed to delete this mail",
          },
        ],
      });
  }

  if (!userAdoptionRequest.isVisible) {
    return res
      .status(400)
      .json({
        error: [
          { field: "adoption", message: "AdoptionRequest already deleted" },
        ],
      });
  }

  return error.length > 0 ? res.status(400).json({ error }) : null;
};

const getAdoptionRequestsValidator = async (req, res) => {
  const sortOrder = req.headers["sort-order"] || "DESC";

  if (req.params.id) {
    const mail = await AdoptionRequest.findByPk(req.params.id);
    if (!mail) {
      return res
        .status(404)
        .json({
          error: [{ field: "adoption", message: "AdoptionRequest not found" }],
        });
    }

    const userAdoptionRequest = await UserRole.findOne({
      where: { mailId: req.params.id, userId: req.user.id },
    });
    if (!userAdoptionRequest) {
      return res
        .status(403)
        .json({
          error: [
            {
              field: "adoption",
              message: "You are not allowed to view this mail",
            },
          ],
        });
    }

    if (!userAdoptionRequest.isVisible) {
      return res
        .status(400)
        .json({
          error: [
            { field: "adoption", message: "AdoptionRequest already deleted" },
          ],
        });
    }
  } else {
    const userAdoptionRequests = await UserRole.findAll({
      where: { userId: req.user.id },
    });
    if (userAdoptionRequests.length === 0) {
      return res
        .status(404)
        .json({ error: [{ field: "adoption", message: "No mails found" }] });
    }

    if (sortOrder !== "ASC" && sortOrder !== "DESC") {
      return res
        .status(400)
        .json({
          error: [{ field: "sort-order", message: "Invalid sort order" }],
        });
    }
  }

  return null;
};

module.exports = {
  adoptValidator,
  handleAdoptionRequestValidator,
  deleteAdoptionRequestValidator,
  getAdoptionRequestsValidator,
};
