const nodemailer = require('nodemailer')
const {User} = require('../../models')
const emailHelper = require('../helpers/emailHelper')
const pug = require('pug')
const path = require('path')

const transporter = nodemailer.createTransport({
    host: '127.0.0.1',
    port: 1025,
    secure: false,
    ignoreTLS: true,
})

async function sendActivationEmail(user) {
    const {activationLink, sender} = await emailHelper.generateTokenAndSignature(user)
    const compiledFunction = pug.compileFile(path.join(__dirname, '..', 'templates', 'activationEmail.pug'))

    const imageUrls = {
        doneIconUrl: 'emailIcons/happy.png',
        emailIconUrl: 'emailIcons/email.png',
        happyIconUrl: 'emailIcons/happy.png'
    };

    const mailOptions = {
        from: sender.email,
        to: user.email,
        subject: 'Account Validation',
        html: compiledFunction({
            firstName: user.firstName,
            lastName: user.lastName,
            activationLink: activationLink,
            doneIconUrl: imageUrls.doneIconUrl,
            emailIconUrl: imageUrls.emailIconUrl,
            happyIconUrl: imageUrls.happyIconUrl
        }),
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Activation email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending activation email: ', error);
    }
}

async function sendResetEmail(user) {
    const {resetLink, sender} = await emailHelper.generateTokenAndSignature(user);
    const compiledFunction = pug.compileFile(path.join(__dirname, '..', 'templates', 'resetEmail.pug'));

    const mailOptions = {
        from: sender.email,
        to: user.email,
        subject: 'Account Reactivation',
        html: compiledFunction({firstName: user.firstName, lastName: user.lastName, resetLink: resetLink}),
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Reset email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending reset email: ', error);
    }
}

async function sendConfirmationEmail(user) {
    const compiledFunction = pug.compileFile(path.join(__dirname, '..', 'templates', 'confirmationEmail.pug'))
    const sender = await User.findOne({where: {role: 'admin'}})

    const mailOptions = {
        from: sender.email,
        to: user.email,
        subject: 'Account Activation Confirmation',
        html: compiledFunction({firstName: user.firstName, sender: sender.firstName}),
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Confirmation email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending confirmation email: ', error);
    }
}

async function sendAdoptionEmail(sender, receiver, cat, address) {
    const html = await emailHelper.sendAdoptionContent(sender, receiver, cat, address)
    const mailOptions = {
        from: receiver.email,
        to: sender.email,
        subject: 'Confirmation of Your Successful Cat Adoption',
        html: html,
    }

    try {
        const info = await transporter.sendMail(mailOptions)
        console.log('Message sent: %s', info.messageId)
    } catch (error) {
        console.error('Error sending email: ', error)
    }
}

async function sendDeclineAdoption(sender, receiver, cat) {
    const compiledFunction = pug.compileFile(path.join(__dirname, '..', 'templates', 'declineAdoption.pug'))
    const mailOptions = {
        from: receiver.email,
        to: sender.email,
        subject: 'Declined the Adoption',
        html: compiledFunction({firstName: sender.firstName, lastName: sender.lastName, catName: cat.name}),
    }

    try {
        const info = await transporter.sendMail(mailOptions)
        console.log('Message sent: %s', info.messageId)
    } catch (error) {
        console.error('Error sending email: ', error)
    }
}

module.exports = {
    sendActivationEmail,
    sendResetEmail,
    sendConfirmationEmail,
    sendAdoptionEmail,
    sendDeclineAdoption
}