const {Mail, Cat, User, Address, CatUser, UserMail} = require('../../models')
const {Op} = require('sequelize')
const validator = require('../validators/mailValidator')
const emailServ = require('../services/emailService')
const {mailDTO} = require('../dto/mailDTO')

const adoptCat = async (req, res) => {
    try {
        const userId = req.user.id
        const {id} = req.params
        const {message} = req.body
        if (await validator.adoptValidator(req, res)) return

        const cat = await Cat.findByPk(id)
        const mail = await Mail.create({catId: cat.id, message})
        await UserMail.create({userId: userId, mailId: mail.id, role: 'sender'})
        await UserMail.create({userId: cat.userId, mailId: mail.id, role: 'receiver'})
        return res.status(200).json({status: 'Adoption request sent successfully'})
    } catch (error) {
        return res.status(500).json({error: 'Internal Server Error'})
    }
}

const handleAdoptionRequest = async (req, res) => {
    try {
        const {id} = req.params
        const {status} = req.body
        if (await validator.handleAdoptionRequestValidator(req, res)) return

        const mail = await Mail.findByPk(id)
        const cat = await Cat.findOne({where: {id: mail.catId}})
        const senderUserMail = await UserMail.findOne({where: {mailId: id, role: 'sender'}})
        const receiverUserMail = await UserMail.findOne({where: {mailId: id, role: 'receiver'}})
        const sender = await User.findByPk(senderUserMail.userId)
        const receiver = await User.findByPk(receiverUserMail.userId)
        const userAddress = await Address.findOne({where: {id: req.user.addressId}})

        if (status === 'accepted') {
            await User.sequelize.transaction(async (t) => {
                const otherMails = await Mail.findAll({
                    where: {
                        catId: mail.catId,
                        id: {[Op.ne]: id}
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
                await Mail.update({status, addressId: userAddress.id}, {where: {id}, transaction: t})
                await emailServ.sendAdoptionEmail(sender, receiver, cat, userAddress)
            })

            return res.status(200).json({status: 'Adoption request accepted successfully'})
        } else {
            await Mail.update({status}, {where: {id}})
            return res.status(200).json({status: 'Adoption request rejected successfully'})
        }
    } catch (error) {
        return res.status(500).json({error: 'Internal Server Error'})
    }
}

const getMails = async (req, res) => {
    try {
        const mails = await Mail.findAll()
        for (const mail of mails) {
            mail.address = await Address.findOne({where: {id: mail.addressId}})
        }
        return res.status(200).json({data: mails.map(mail => mailDTO(mail, mail.address))})
    } catch (error) {
        return res.status(500).json({error: 'Internal server error'})
    }
}

const deleteMail = async (req, res) => {
    try {
        if (await validator.deleteMailValidator(req, res)) return
        const mailId = req.params.id
        const userId = req.user.id
        const userMail = await UserMail.findOne({where: {userId, mailId}})
        const userMails = await UserMail.findAll({where: {mailId}})

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

    } catch (error) {
        console.error(error)
        return res.status(500).json({error: 'Internal server error'})
    }
}

module.exports = {
    adoptCat,
    handleAdoptionRequest,
    getMails,
    deleteMail
}