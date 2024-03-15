const nodemailer = require('nodemailer')
const crypto = require('crypto')

const transporter = nodemailer.createTransport({
    host: '127.0.0.1',
    port: 1025,
    secure: false,
    ignoreTLS: true,
})

function generateTokenAndSignature() {
    const token = crypto.randomBytes(16).toString('hex')
    const signature = crypto.createHmac('sha256', process.env.JWT_SECRET).update(token).digest('hex')
    return {token, signature}
}

async function sendActivationEmail(user) {
    const {token, signature} = generateTokenAndSignature();
    const expires = new Date();
    expires.setHours(expires.getHours() + 24);

    user.token = token;
    user.signature = signature;
    user.expires = expires;
    await user.save();

    const activationLink = `${process.env.SERVER_BASE_URL}/activate/${user.id}?token=${token}&signature=${signature}&expires=${expires.getTime()}`;

    const mailOptions = {
        from: 'admin@meow.com',
        to: user.email,
        subject: 'Account Validation',
        html: `
            <h>Welcome ${user.firstName},</h>
            <p>Please validate your account by clicking the link below.</p>
            <p>Click here: <a href="${activationLink}">Activate Account</a></p>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Activation email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending activation email: ', error);
    }
}

async function sendResetEmail(user) {
    const {token, signature} = generateTokenAndSignature();
    const expires = new Date();
    expires.setHours(expires.getHours() + 24);

    user.token = token;
    user.signature = signature;
    user.expires = expires;
    await user.save();

    const resetLink = `${process.env.SERVER_BASE_URL}/reset/${user.id}?token=${token}&signature=${signature}&expires=${expires.getTime()}`;

    const mailOptions = {
        from: 'admin@meow.com',
        to: user.email,
        subject: 'Account Reactivation',
        html: `
            <h>Hello ${user.firstName},</h>
            <p>Please reactivate your account by clicking the link below.</p>
            <p>Click here: <a href="${resetLink}">Reactivate Account</a></p>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Reset email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending reset email: ', error);
    }
}

async function sendConfirmationEmail(user) {
    const mailOptions = {
        from: 'admin@meow.com',
        to: user.email,
        subject: 'Account Activation Confirmation',
        html: `
            <h>Hello ${user.firstName},</h>
            <p>Your account has been successfully activated. You can now log in and enjoy our services.</p>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Confirmation email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending confirmation email: ', error);
    }
}

async function sendAdoptionEmail(sender, receiver, cat, address) {
    const emailContent = `
        <body>
            <div class="container">
                <p class="header">Confirmation of Your Successful Cat Adoption</p>
                <div class="content">
                    <p>Dear ${sender.firstName},</p>
                    <p>I am thrilled to inform you that your cat adoption process has been successfully completed. Congratulations on welcoming a new feline friend into your home! Below are the details of the cat you have adopted:</p>
                    <ul>
                        <li>${cat.image}</li>
                        <li>Name: ${cat.name}</li>
                        <li>Age: ${cat.age}</li>
                        <li>Breed: ${cat.breed}</li>
                        <li>Gender: ${cat.gender}</li>
                        <li>Health Problems: ${cat.healthProblem}</li>
                        <li>Description: ${cat.description}</li>
                    </ul></div>
                    <p>Also, here is the address of where you can pick up your new friend:</p>
                    <ul>
                        <li>County: ${address.county}</li>
                        <li>City: ${address.city}</li>
                        <li>Street: ${address.street}</li>
                        <li>Number: ${address.number}</li>
                        <li>Floor: ${address.floor}</li>
                        <li>Apartment: ${address.apartment}</li>
                        <li>Postal Code: ${address.postalCode}</li>
                    </ul>
                <div class="footer">
                    Best regards,<br>
                    ${receiver.firstName} ${receiver.lastName}<br>
                </div>
            </div>
        </body>
        </html>
    `

    const mailOptions = {
        from: receiver.email,
        to: sender.email,
        subject: 'Confirmation of Your Successful Cat Adoption',
        html: emailContent,
    }

    try {
        const info = await transporter.sendMail(mailOptions)
        console.log('Message sent: %s', info.messageId)
    } catch (error) {
        console.error('Error sending email: ', error)
    }
}

async function sendDeclineAdoption(sender, receiver, cat) {
    const emailContent = `
        <h>Hello ${sender.firstName},</h>
        <p>I regret to inform you that your adoption request for the cat ${cat.name} has been declined.</p>
        <p>Thank you for your interest in adopting a cat.</p>
        <div class="footer">
            Best regards,<br>
            ${receiver.firstName} ${receiver.lastName}<br>
        </div>
    `

    const mailOptions = {
        from: receiver.email,
        to: sender.email,
        subject: 'Declined the Adoption',
        html: emailContent,
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