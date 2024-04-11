const { Cat, CatUser } = require("../../models");

const userValidator = async (req, res) => {
  if (req.method !== "POST") {
    const cat = await Cat.findByPk(req.params.id);
    if (!cat) {
      return res.status(404).json({ error: "Cat not found" });
    }

    const user = req.user;
    if (cat.ownerId === null) {
      if (cat.userId !== user.id) {
        return res
          .status(403)
          .json({ error: "You are not authorized to perform this action" });
      }
    } else {
      if (cat.ownerId !== user.id) {
        return res
          .status(403)
          .json({ error: "You are not authorized to perform this action" });
      }
    }
  }

  if (req.method === "POST") {
    const user = req.user;
    if (!user.addressId) {
      return res
        .status(403)
        .json({ error: "Address is required in order for you to add a cat" });
    }
  }

  return null;
};

const getCatsValidator = async (req, res, listType) => {
  const user = req.user;
  if (listType === "sentToAdoption") {
    const cats = await CatUser.findAll({ where: { userId: user.id } });
    if (cats.length === 0) {
      return res.status(404).json({ error: "No cats found" });
    }
  } else if (listType === "owned") {
    const cats = await CatUser.findAll({ where: { ownerId: user.id } });
    if (cats.length === 0) {
      return res.status(404).json({ error: "No cats found" });
    }
  }

  return null;
};

module.exports = { userValidator, getCatsValidator };
