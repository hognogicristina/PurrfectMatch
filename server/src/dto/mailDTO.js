function transformMailToDTO(message, address = null, userId, userMail) {
    let mailType = null

    if (userId === userMail.userId && userMail.role === 'sender') {
        mailType = 'sent'
    } else if (userId === userMail.userId && userMail.role === 'receiver') {
        mailType = 'received'
    }

    const dto = {
        id: message.id,
        userId: userMail.userId,
        catId: message.catId,
        message: message.message,
        status: message.status,
        mailType: mailType,
        createdAt: message.createdAt,
    }

    if (mailType === 'sent') {
        if (address) {
            dto.country = address.country || null
            dto.city = address.city || null
        }
    }

    return dto
}

module.exports = {transformMailToDTO}