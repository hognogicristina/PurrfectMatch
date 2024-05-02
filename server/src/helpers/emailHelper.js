const crypto = require("crypto");
const pug = require("pug");
const path = require("path");
const { Image, User, Token } = require("../../models");

const generateTokenAndSignature = async (user, linkType) => {
  const token = crypto.randomBytes(16).toString("hex");
  const signature = crypto
    .createHmac("sha256", process.env.JWT_SECRET)
    .update(token)
    .digest("hex");
  const sender = await User.findOne({ where: { role: "admin" } });

  const expires = new Date();
  expires.setHours(expires.getHours() + 24);

  const tokenUser = await Token.findOne({ where: { userId: user.id } });

  tokenUser.token = token;
  tokenUser.signature = signature;
  tokenUser.expires = expires;
  await tokenUser.save();

  let link;
  if (linkType === "activation") {
    link = `${process.env.FRONTEND_BASE_URL}/activate/${user.id}?token=${token}&signature=${signature}&expires=${expires.getTime()}`;
  } else if (linkType === "reset") {
    link = `${process.env.FRONTEND_BASE_URL}/reset/${user.id}?token=${token}&signature=${signature}&expires=${expires.getTime()}`;
  }

  return { link, sender };
};

const sendAdoptionContent = async (sender, receiver, cat, address) => {
  const image = await Image.findOne({ where: { id: cat.imageId } });
  const imageUrl = `${process.env.SERVER_BASE_URL}/uploads/${image.filename}`;
  const compiledFunction = pug.compileFile(
    path.join(__dirname, "..", "templates", "adoptionEmail.pug"),
    { filename: "adoptionEmail.pug" },
  );

  return compiledFunction({
    sender: { firstName: sender.firstName, lastName: sender.lastName },
    imageUrl: imageUrl,
    cat: {
      name: cat.name,
      age: cat.age,
      breed: cat.breed,
      gender: cat.gender,
      healthProblem: cat.healthProblem,
      description: cat.description,
    },
    address: {
      county: address.county,
      city: address.city,
      street: address.street,
      number: address.number,
      floor: address.floor,
      apartment: address.apartment,
      postalCode: address.postalCode,
    },
    receiver: { firstName: receiver.firstName, lastName: receiver.lastName },
  });
};

module.exports = { generateTokenAndSignature, sendAdoptionContent };
