const {Op} = require("sequelize")
const {Mail, UserMail, User, Cat, CatUser} = require("../../models")
const emailService = require("../services/emailService")
const emailServ = require("../services/emailService")

const deleteMailCat = async (cat, receiver) => {
    const mails = await Mail.findAll({where: {catId: cat.id}})

    for (const mail of mails) {
        if (mail.status === 'pending') {
            const userMails = await UserMail.findAll({where: {mailId: mail.id}})
            for (let userMail of userMails) {
                if (userMail.role === 'sender') {
                    const sender = await User.findOne({where: {id: userMail.userId}})
                    await emailService.sendDeclineAdoption(sender, receiver, cat)
                }
            }
            await UserMail.destroy({where: {mailId: mail.id}})
            await mail.destroy()
        } else {
            await UserMail.destroy({where: {mailId: mail.id}})
            await mail.destroy()
        }
    }
}

const deleteMail = async (userMail, userMails, mailId, res) => {
    let visibleCount = 0
    for (const userMail of userMails) {
        if (userMail.isVisible) {
            visibleCount++
        }
    }

    if (visibleCount === 1) {
        await UserMail.destroy({where: {mailId}})
        await Mail.destroy({where: {id: mailId}})
        return res.status(200).json({status: 'Mail deleted successfully'})
    } else {
        await userMail.update({isVisible: !userMail.isVisible})
        return res.status(200).json({status: 'Mail deleted successfully'})
    }
}

const sendMail = async (status, mail, sender, receiver, cat, userAddress) => {
    await User.sequelize.transaction(async (t) => {
        const otherMails = await Mail.findAll({
            where: {
                catId: mail.catId,
                id: {[Op.ne]: mail.id}
            },
        }, {transaction: t})

        for (const otherMail of otherMails) {
            await Mail.update({status: 'declined'}, {where: {id: otherMail.id}, transaction: t})
            const otherUserMail = await UserMail.findOne({
                where: {
                    mailId: otherMail.id,
                    role: 'sender'
                }
            }, {transaction: t})
            const sender = await User.findOne({where: {id: otherUserMail.userId}})
            await emailServ.sendDeclineAdoption(sender, receiver, cat)
        }

        await Cat.update({ownerId: sender.id}, {where: {id: mail.catId}, transaction: t})
        const catUser = await CatUser.findOne({where: {catId: mail.catId}}, {transaction: t})
        if (catUser) {
            await CatUser.update({ownerId: sender.id}, {where: {id: catUser.id}, transaction: t})
        }
        await Mail.update({status, addressId: userAddress.id}, {where: {id: mail.id}, transaction: t})
        await emailServ.sendAdoptionEmail(sender, receiver, cat, userAddress)
    })
}

const deleteMailUser = async (user) => {
    const userMails = await UserMail.findAll({where: {userId: user.id}})
    for (let userMail of userMails) {
        if (userMail.role === 'receiver') {
            const mail = await Mail.findOne({where: {id: userMail.mailId}})
            if (mail && mail.status === 'pending') {
                const cat = await Cat.findOne({where: {id: mail.catId}})
                const senderUserMails = await UserMail.findAll({where: {mailId: mail.id, role: 'sender'}})
                for (let senderUserMail of senderUserMails) {
                    const sender = await User.findOne({where: {id: senderUserMail.userId}})
                    await emailService.sendDeclineAdoption(sender, user, cat)
                }
            }
        }

        const mail = await Mail.findOne({where: {id: userMail.mailId}})
        const otherUserMails = await UserMail.findAll({where: {mailId: mail.id}})
        for (let otherUserMail of otherUserMails) {
            await otherUserMail.destroy()
        }
        await mail.destroy()
    }
}

const updateEmail = async (user, fieldsToUpdate, body) => {
    let emailChanged = false
    fieldsToUpdate.forEach(field => {
        if (body[field] !== undefined && field === 'email' && body[field] !== user.email) {
            user[field] = body[field]
            emailChanged = true
        } else if (body[field] !== undefined) {
            user[field] = body[field]
        }
    })

    if (emailChanged) {
        user.status = 'active_pending'
        await emailServ.sendResetEmail(user)
    }

    await user.save()
}

module.exports = {deleteMailCat, deleteMail, sendMail, deleteMailUser, updateEmail}