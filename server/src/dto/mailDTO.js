const {Op} = require('sequelize')
const moment = require("moment")
const {Cat, User, Mail, Image, UserMail, Address} = require('../../models')

async function transformMailToDTO(mail, user) {
    const senderUserMail = await UserMail.findOne({where: {mailId: mail.id, role: 'sender'}})
    const receiverUserMail = await UserMail.findOne({where: {mailId: mail.id, role: 'receiver'}})
    const sender = await User.findByPk(senderUserMail.userId)
    const receiver = await User.findByPk(receiverUserMail.userId)
    const cat = await Cat.findOne({where: {id: mail.catId}})
    const image = await Image.findOne({where: {id: cat.imageId}})
    const formattedDate = moment(mail.createdAt).format('YYYY-MM-DD HH:mm:ss')

    let address = null
    if (mail.addressId) {
        address = await Address.findOne({where: {id: user.addressId}})
    }

    return {
        subject: 'Adoption request',
        from: `${sender.firstName} ${sender.lastName}`,
        to: `${receiver.firstName} ${receiver.lastName}`,
        message: mail.message,
        cat: cat.name,
        image: image ? image.url : null,
        status: mail.status,
        address: address ? `${address.city}, ${address.country}` : null,
        date: formattedDate,
    }

}

async function transformMailsToDTO(user, sortOrder) {
    const userMails = await UserMail.findAll({ where: { userId: user.id, isVisible: true } })

    const mailDTOs = []
    for (let userMail of userMails) {
        const mail = await Mail.findOne({ where: { id: userMail.mailId } })

        let from, to
        if (userMail.role === 'sender') {
            from = `${user.firstName} ${user.lastName}`
            const otherUserMail = await UserMail.findOne({
                where: {
                    mailId: userMail.mailId,
                    userId: { [Op.ne]: user.id }
                }
            })
            const otherUser = await User.findByPk(otherUserMail.userId)
            to = `${otherUser.firstName} ${otherUser.lastName}`
        } else if (userMail.role === 'receiver') {
            const otherUserMail = await UserMail.findOne({
                where: {
                    mailId: userMail.mailId,
                    userId: { [Op.ne]: user.id }
                }
            })
            const otherUser = await User.findByPk(otherUserMail.userId)
            from = `${otherUser.firstName} ${otherUser.lastName}`
            to = `${user.firstName} ${user.lastName}`
        }

        const cat = await Cat.findOne({ where: { id: mail.catId } })

        const dateSent = moment(mail.createdAt)
        const now = moment()
        const diffWeeks = now.diff(dateSent, 'weeks')

        let formattedDate
        if (diffWeeks <= 1) {
            formattedDate = dateSent.fromNow()
        } else {
            formattedDate = moment(mail.createdAt).format('YYYY-MM-DD HH:mm:ss')
        }

        mailDTOs.push({
            from: from,
            to: to,
            subject: 'Adoption request',
            cat: cat.name,
            status: mail.status,
            date: formattedDate,
        })
    }

    if (sortOrder && (sortOrder.toUpperCase() === 'ASC' || sortOrder.toUpperCase() === 'DESC')) {
        mailDTOs.sort((a, b) => {
            return sortOrder.toUpperCase() === 'ASC' ? moment(a.date).diff(b.date) : moment(b.date).diff(a.date)
        })
    }

    return mailDTOs
}

module.exports = {transformMailToDTO, transformMailsToDTO}
