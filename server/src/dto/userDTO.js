const { Address, Image } = require('../../models')

async function transformUserToDTO(user) {
    const address = await Address.findOne({ where: { id: user.addressId } })
    const image = await Image.findOne({ where: { id: user.imageId } })

    return {
        firstName: user.firstName,
        lastName: user.lastName,
        image: image ? image.url : null,
        username: user.username,
        email: user.email,
        birthday: user.birthday,
        description: user.description ? user.description : null,
        hobbies: user.hobbies ? user.hobbies : null,
        experienceLevel: user.experienceLevel ? user.experienceLevel : null,
        address: address ? address.county : null,
        city: address ? address.city : null,
        street: address ? address.street : null,
        number: address ? address.number : null,
        floor: address ? address.floor : null,
        apartment: address ? address.apartment : null,
        postalCode: address ? address.postalCode : null
    }
}

module.exports = { transformUserToDTO }