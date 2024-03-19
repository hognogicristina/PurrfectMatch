function transformMailToDTO(message, address = null) {
    return {
        id: message.id,
        senderId: message.senderId,
        receiverId: message.receiverId,
        message: message.message,
        createdAt: message.createdAt,
        status: message.status,
        country: address ? address.country : null,
        city: address ? address.city : null,
    }
}

module.exports = {transformMailToDTO}