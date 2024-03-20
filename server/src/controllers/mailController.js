const {Mail, Cat, User, Address, UserMail} = require('../../models')
const emailServ = require("../services/emailService")
const validator = require('../validators/mailValidator')
const mailHelper = require('../helpers/mailHelper')
const mailDTO = require('../dto/mailDTO')

const adoptCat = async (req, res) => {
    try {
        if (await validator.adoptValidator(req, res)) return
        const cat = await Cat.findByPk(req.params.id)
        const {message} = req.body

        const mail = await Mail.create({catId: cat.id, message})
        await UserMail.create({userId: req.user.id, mailId: mail.id, role: 'sender'})
        await UserMail.create({userId: cat.userId, mailId: mail.id, role: 'receiver'})

        return res.status(200).json({status: 'Adoption request sent successfully'})
    } catch (error) {
        return res.status(500).json({error: 'Internal Server Error'})
    }
}

const handleAdoptionRequest = async (req, res) => {
    try {
        if (await validator.handleAdoptionRequestValidator(req, res)) return

        const {status} = req.body
        const mail = await Mail.findByPk(req.params.id)
        const cat = await Cat.findOne({where: {id: mail.catId}})
        const senderUserMail = await UserMail.findOne({where: {mailId: mail.id, role: 'sender'}})
        const receiverUserMail = await UserMail.findOne({where: {mailId: mail.id, role: 'receiver'}})
        const sender = await User.findByPk(senderUserMail.userId)
        const receiver = await User.findByPk(receiverUserMail.userId)
        const userAddress = await Address.findOne({where: {id: req.user.addressId}})

        if (status === 'accepted') {
            await mailHelper.sendMail(status, mail, sender, receiver, cat, userAddress)
            return res.status(200).json({status: 'Adoption request accepted successfully'})
        } else {
            await emailServ.sendDeclineAdoption(sender, receiver, cat)
            await mail.update({status})
            return res.status(200).json({status: 'Adoption request rejected successfully'})
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({error: 'Internal Server Error'})
    }
}

const getMails = async (req, res) => {
    try {
        const sortOrder = req.headers['sort-order'] || 'DESC'
        const sortBy = 'createdAt'
        const userMails = await UserMail.findAll({where: {userId: req.user.id, isVisible: true}})
        const mailIds = userMails.map(userMail => userMail.mailId)
        const mails = await Mail.findAll({where: {id: mailIds}, order: [[sortBy, sortOrder]]})

        for (const mail of mails) {
            mail.address = await Address.findOne({where: {id: mail.addressId}})
        }

        const mailDTOs = mails.map(mail => mailDTO.transformMailToDTO(mail, mail.address, req.user.id, userMails.find(userMail => userMail.mailId === mail.id)))
        return res.status(200).json({data: mailDTOs})
    } catch (error) {
        return res.status(500).json({error: 'Internal server error'})
    }
}

const deleteMail = async (req, res) => {
    const transaction = await Mail.sequelize.transaction()
    try {
        if (await validator.deleteMailValidator(req, res)) {
            await transaction.rollback()
            return
        }
        const userMail = await UserMail.findOne({where: {mailId: req.params.id, userId: req.user.id}})
        const userMails = await UserMail.findAll({where: {mailId: req.params.id}})
        await mailHelper.deleteMail(userMail, userMails, req.params.id, res)
        await transaction.commit()
        return res.status(200).json({status: 'Mail deleted successfully'})
    } catch (error) {
        await transaction.rollback()
        return res.status(500).json({error: 'Internal server error'})
    }
}

module.exports = {adoptCat, handleAdoptionRequest, getMails, deleteMail}