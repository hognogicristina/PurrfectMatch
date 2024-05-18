const {
  AdoptionRequest,
  Cat,
  Address,
  UserRole,
  Favorite,
  CatUser,
} = require("../../models");
const validator = require("validator");

const adoptValidator = async (req, res) => {
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
      return res
        .status(400)
        .json({ error: [{ field: "cat", message: "Cat not found" }] });
    } else {
      const catUser = await CatUser.findByPk(cat.id);
      if (catUser.userId === userId) {
        return res.status(403).json({
          error: [
            {
              field: "guardian",
              message:
                "You cannot send adoption request for a cat you are guardian of",
            },
          ],
        });
      }

      if (catUser.ownerId !== null) {
        return res.status(403).json({
          error: [{ field: "adopted", message: "Cat already adopted" }],
        });
      }
    }
  }

  const pendingAdoptionRequests = await AdoptionRequest.findAll({
    where: { catId: req.params.id, status: "pending" },
    attributes: ["id"],
  });

  if (pendingAdoptionRequests.length > 0) {
    for (const adoptionRequest of pendingAdoptionRequests) {
      const existingRequest = await UserRole.findOne({
        where: {
          adoptionRequestId: adoptionRequest.id,
          userId: userId,
          role: "sender",
        },
      });

      if (existingRequest) {
        return res.status(400).json({
          error: [
            {
              field: "request",
              message: "You already sent a request for this cat",
            },
          ],
        });
      }
    }
  }

  if (!req.body.message || validator.isEmpty(req.body.message) || "") {
    return res
      .status(400)
      .json({ error: [{ field: "message", message: "Message is required" }] });
  } else if (!validator.isLength(req.body.message, { min: 10, max: 100 })) {
    return res.status(400).json({
      error: [
        {
          field: "message",
          message: "Message must be between 10 and 100 characters",
        },
      ],
    });
  }

  return null;
};

const handleAdoptionRequestValidator = async (req, res) => {
  const error = [];
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user.id;

  if (req.params.id) {
    const mail = await AdoptionRequest.findByPk(id);
    if (!mail) {
      return res.status(404).json({
        error: [
          { field: "adoption", message: "AdoptionProcess request not found" },
        ],
      });
    }

    const cat = await Cat.findByPk(mail.catId);
    const catUser = await CatUser.findByPk(cat.id);
    if (catUser.userId !== userId) {
      return res.status(403).json({
        error: [
          {
            field: "user",
            message: "You are not allowed to handle this request",
          },
        ],
      });
    }

    if (mail.status !== "pending") {
      return res.status(403).json({
        error: [{ field: "status", message: "Status already updated" }],
      });
    }
  }

  const userAddress = await Address.findOne({
    where: { userId: req.user.id },
  });
  if (!userAddress) {
    return res.status(404).json({
      error: [
        {
          field: "address",
          message: "Address not found for the sender user",
        },
      ],
    });
  }

  if (!status || validator.isEmpty(status) || "") {
    error.push({ field: "status", message: "Status is required" });
  } else if (status !== "accepted" && status !== "declined") {
    error.push({ field: "statusInvalid", message: "Invalid status" });
  }

  return error.length > 0 ? res.status(400).json({ error }) : null;
};

const deleteAdoptionRequestValidator = async (req, res) => {
  const error = [];
  const userId = req.user.id;
  const mailId = req.params.id;

  const mail = await AdoptionRequest.findByPk(mailId);
  if (!mail) {
    return res.status(404).json({
      error: [
        { field: "adoption", message: "AdoptionProcess request not found" },
      ],
    });
  }

  if (mail.status === "pending") {
    error.push({ field: "mails", message: "Cannot delete pending mails" });
  }

  const userAdoptionRequest = await UserRole.findOne({
    where: { userId, mailId },
  });
  if (!userAdoptionRequest) {
    return res.status(403).json({
      error: [
        {
          field: "user",
          message: "You are not allowed to delete this mail",
        },
      ],
    });
  }

  if (!userAdoptionRequest.isVisible) {
    return res.status(400).json({
      error: [
        {
          field: "request",
          message: "AdoptionProcess request already deleted",
        },
      ],
    });
  }

  return error.length > 0 ? res.status(400).json({ error }) : null;
};

const getAdoptionRequestsValidator = async (req, res) => {
  if (req.params.id) {
    const mail = await AdoptionRequest.findByPk(req.params.id);
    if (!mail) {
      return res.status(404).json({
        error: [
          { field: "adoption", message: "AdoptionProcess request not found" },
        ],
      });
    }

    const userAdoptionRequest = await UserRole.findOne({
      where: { adoptionRequestId: req.params.id, userId: req.user.id },
    });
    if (!userAdoptionRequest) {
      return res.status(403).json({
        error: [
          {
            field: "user",
            message: "You are not allowed to view this mail",
          },
        ],
      });
    }

    if (!userAdoptionRequest.isVisible) {
      return res.status(400).json({
        error: [
          {
            field: "mailDeleted",
            message: "AdoptionProcess request already deleted",
          },
        ],
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
