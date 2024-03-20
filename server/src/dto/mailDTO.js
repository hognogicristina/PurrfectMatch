const {Op} = require('sequelize')
const moment = require("moment")
const {Cat, User, Mail, Image, UserMail, Address} = require('../../models')

async function transformMailToDTO(user, sortOrder) {
    const userMails = await UserMail.findAll({where: {userId: user.id, isVisible: true}})

    const mailDTOs = []
    for (let userMail of userMails) {
        const mail = await Mail.findOne({where: {id: userMail.mailId}})

        let mailType = null
        if (userMail.role === 'sender') {
            mailType = 'sent'
        } else if (userMail.role === 'receiver') {
            mailType = 'received'
        }

        const otherUserMail = await UserMail.findOne({where: {mailId: userMail.mailId, userId: {[Op.ne]: user.id}}})
        const otherUser = await User.findByPk(otherUserMail.userId)

        const address = await Address.findOne({where: {id: mail.addressId}})
        const cat = await Cat.findOne({where: {id: mail.catId}})
        const image = await Image.findOne({where: {id: cat.imageId}})
        const formattedCreatedAt = moment(mail.createdAt).format('YYYY-MM-DD hh:mm:ss A')

        mailDTOs.push({
            mailType: mailType,
            user: `${otherUser.firstName} ${otherUser.lastName}`,
            cat: cat.name,
            image: image ? image.url : null,
            mail: mail.message,
            status: mail.status,
            address: address ? `${address.city}, ${address.country}` : null,
            date: formattedCreatedAt,
        })
    }

    if (sortOrder && (sortOrder.toUpperCase() === 'ASC' || sortOrder.toUpperCase() === 'DESC')) {
        mailDTOs.sort((a, b) => {
            return sortOrder.toUpperCase() === 'ASC' ? moment(a.date).diff(b.date) : moment(b.date).diff(a.date)
        })
    }

    return mailDTOs
}

module.exports = {transformMailToDTO}
