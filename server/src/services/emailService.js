const nodemailer = require("nodemailer");
const pug = require("pug");
const path = require("path");
const { User } = require("../../models");
const emailHelper = require("../helpers/emailHelper");
const logger = require("../../log/logger");

const transporter = nodemailer.createTransport({
  host: "127.0.0.1",
  port: 1025,
  secure: false,
  ignoreTLS: true,
});

async function sendActivationEmail(user) {
  const { link, sender } = await emailHelper.generateTokenAndSignature(
    user,
    "activation",
  );
  const compiledFunction = pug.compileFile(
    path.join(__dirname, "..", "templates", "activationEmail.pug"),
    { filename: "activationEmail.pug" },
  );

  const mailOptions = {
    from: sender.email,
    to: user.email,
    subject: "Account Validation",
    html: compiledFunction({ link: link }),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger("Activation email sent: " + info.messageId);
  } catch (error) {
    logger.error(error);
  }
}

async function sendResetEmail(user) {
  const { link, sender } = await emailHelper.generateTokenAndSignature(
    user,
    "activation",
  );
  const compiledFunction = pug.compileFile(
    path.join(__dirname, "..", "templates", "resetEmail.pug"),
    { filename: "resetEmail.pug" },
  );

  const mailOptions = {
    from: sender.email,
    to: user.email,
    subject: "Account Reactivation",
    html: compiledFunction({ link: link }),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger("Reset email sent: " + info.messageId);
  } catch (error) {
    logger.error(error);
  }
}

async function sendConfirmationEmail(user) {
  const compiledFunction = pug.compileFile(
    path.join(__dirname, "..", "templates", "confirmationEmail.pug"),
    { filename: "confirmationEmail.pug" },
  );
  const sender = await User.findOne({ where: { role: "admin" } });
  const loginLink = `${process.env.SERVER_BASE_URL}/login`;

  const mailOptions = {
    from: sender.email,
    to: user.email,
    subject: "Account Activated",
    html: compiledFunction({
      firstName: user.firstName,
      lastName: user.lastName,
      loginLink: loginLink,
    }),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger("Confirmation email sent: " + info.messageId);
  } catch (error) {
    logger.error(error);
  }
}

async function sendAdoptionEmail(sender, receiver, cat, address) {
  const html = await emailHelper.sendAdoptionContent(
    sender,
    receiver,
    cat,
    address,
  );
  const mailOptions = {
    from: receiver.email,
    to: sender.email,
    subject: "Confirmation of Your Successful Cat Adoption",
    html: html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger("Message sent: " + info.messageId);
  } catch (error) {
    logger.error(error);
  }
}

async function sendDeclineAdoption(sender, receiver, cat) {
  const compiledFunction = pug.compileFile(
    path.join(__dirname, "..", "templates", "declineAdoption.pug"),
    { filename: "declineAdoption.pug" },
  );
  const mailOptions = {
    from: receiver.email,
    to: sender.email,
    subject: "Declined the Adoption",
    html: compiledFunction({
      sender: { firstName: sender.firstName, lastName: sender.lastName },
      cat: cat,
      receiver: { firstName: receiver.firstName, lastName: receiver.lastName },
    }),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger("Message sent: " + info.messageId);
  } catch (error) {
    logger.error(error);
  }
}

async function sendDeleteAccount(user) {
  const compiledFunction = pug.compileFile(
    path.join(__dirname, "..", "templates", "deleteAccount.pug"),
    { filename: "deleteAccount.pug" },
  );
  const sender = await User.findOne({ where: { role: "admin" } });
  const mailOptions = {
    from: sender.email,
    to: user.email,
    subject: "Account Deleted",
    html: compiledFunction({ firstName: user.firstName }),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger("Message sent: " + info.messageId);
  } catch (error) {
    logger.error(error);
  }
}

async function sendResetPassword(user) {
  const { link, sender } = await emailHelper.generateTokenAndSignature(
    user,
    "reset",
  );
  const compiledFunction = pug.compileFile(
    path.join(__dirname, "..", "templates", "resetPassword.pug"),
    { filename: "resetPassword.pug" },
  );
  const mailOptions = {
    from: sender.email,
    to: user.email,
    subject: "Reset Password",
    html: compiledFunction({
      firstName: user.firstName,
      lastName: user.lastName,
      link: link,
    }),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger("Reset email sent: " + info.messageId);
  } catch (error) {
    logger.error(error);
  }
}

module.exports = {
  sendActivationEmail,
  sendResetEmail,
  sendConfirmationEmail,
  sendAdoptionEmail,
  sendDeclineAdoption,
  sendDeleteAccount,
  sendResetPassword,
};
