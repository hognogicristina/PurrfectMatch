const { Cat, CatUser, Address } = require("../../models");

const userValidator = async (req, res) => {
  const user = req.user;

  if (req.method !== "POST") {
    const cat = await Cat.findByPk(req.params.id);
    if (!cat) {
      return res
        .status(404)
        .json({ error: [{ field: "cat", message: "Cat not found" }] });
    } else {
      const catUser = await CatUser.findByPk(cat.id);
      if (catUser.ownerId === null) {
        if (catUser.userId !== user.id) {
          return res.status(403).json({
            error: [
              {
                field: "cat",
                message: "You are not authorized to perform this action",
              },
            ],
          });
        }
      } else {
        if (catUser.ownerId !== user.id) {
          return res.status(403).json({
            error: [
              {
                field: "cat",
                message: "You are not authorized to perform this action",
              },
            ],
          });
        }
      }
    }
  }

  if (req.method === "POST") {
    const user = req.user;
    const userAddress = await Address.findOne({ where: { userId: user.id } });
    if (!userAddress) {
      return res.status(403).json({
        error: [
          {
            field: "address",
            message: "Address is required in order for you to add a cat",
          },
        ],
      });
    }
  }

  return null;
};

const getCatsValidator = async (req, res, listType) => {
  const user = req.user;
  if (listType === "sentToAdoption") {
    const cats = await CatUser.findAll({ where: { userId: user.id } });
    if (cats.length === 0) {
      return res.status(404).json({
        error: [{ field: "cats", message: "No Cats Found" }],
      });
    }
  } else if (listType === "owned") {
    const cats = await CatUser.findAll({ where: { ownerId: user.id } });
    if (cats.length === 0) {
      return res.status(404).json({
        error: [{ field: "cats", message: "No Cats Found" }],
      });
    }
  }

  return null;
};

module.exports = { userValidator, getCatsValidator };
